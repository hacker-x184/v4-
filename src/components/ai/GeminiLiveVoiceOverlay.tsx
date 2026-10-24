import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  RefreshCw,
  ArrowRight,
  Globe,
  Radio,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../api/client';

interface GeminiLiveVoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName?: string;
  voiceLanguage: 'auto' | 'en' | 'hi';
  onLanguageChange: (lang: 'auto' | 'en' | 'hi') => void;
  onAddChatMessage: (userText: string, assistantText: string, audioBase64?: string) => void;
}

type LiveState = 'idle' | 'listening' | 'thinking' | 'speaking';

export const GeminiLiveVoiceOverlay: React.FC<GeminiLiveVoiceOverlayProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName = 'Current Project',
  voiceLanguage,
  onLanguageChange,
  onAddChatMessage
}) => {
  const [liveState, setLiveState] = useState<LiveState>('idle');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [continuousMode, setContinuousMode] = useState<boolean>(true);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [liveResponseText, setLiveResponseText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const activeRequestRef = useRef<boolean>(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanupAudio();
    };
  }, []);

  // Cleanup all audio streams, contexts and timers
  const cleanupAudio = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
      } catch {}
      mediaRecorderRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    audioChunksRef.current = [];
  }, []);

  // When overlay opens, automatically start listening for seamless voice interaction
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setLiveTranscript('');
      setLiveResponseText('');
      setLiveState('idle');
      // Gentle delayed auto-start
      const timer = setTimeout(() => {
        startListeningSession();
      }, 400);
      return () => clearTimeout(timer);
    } else {
      cleanupAudio();
      setLiveState('idle');
    }
  }, [isOpen]);

  // Clean text for speech synthesis
  const cleanForSpeech = (raw: string): string => {
    if (!raw) return '';
    return raw
      .replace(/```[\s\S]*?```/g, ' Code snippet omitted. ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^#+\s+/gm, '')
      .replace(/[*_~>-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Start real-time audio visualization using Web Audio API
  const setupAudioVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.6;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVisualizer = () => {
        if (!isMountedRef.current || !analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();
    } catch (e) {
      console.warn('Audio visualizer fallback:', e);
    }
  };

  // Stop active speech playback immediately (interruption)
  const interruptPlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    if (liveState === 'speaking') {
      setLiveState('idle');
      if (continuousMode) {
        startListeningSession();
      }
    }
  };

  // Start Recording Session
  const startListeningSession = async () => {
    if (activeRequestRef.current) return;
    setErrorMsg(null);
    cleanupAudio();
    setLiveState('listening');
    setRecordingSeconds(0);
    setAudioLevel(0);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setupAudioVisualizer(stream);

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(250);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Live voice mic error:', err);
      setLiveState('idle');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Microphone permission denied. Please allow microphone access to talk.');
      } else {
        setErrorMsg(err.message || 'Could not connect to microphone.');
      }
    }
  };

  // Stop recording and process through STT -> Groq -> TTS
  const stopAndProcessVoice = async () => {
    if (liveState !== 'listening') return;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      setLiveState('idle');
      return;
    }

    const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';

    const recordedBlobPromise = new Promise<Blob>((resolve) => {
      if (!mediaRecorderRef.current) return resolve(new Blob());
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        mediaRecorderRef.current?.stream?.getTracks().forEach(t => t.stop());
        resolve(blob);
      };
      try {
        mediaRecorderRef.current.stop();
      } catch {
        resolve(new Blob());
      }
    });

    setLiveState('thinking');
    activeRequestRef.current = true;

    try {
      const audioBlob = await recordedBlobPromise;
      if (!audioBlob || audioBlob.size < 500) {
        throw new Error('No speech detected. Please speak clearly into your microphone.');
      }

      // Step 1: ElevenLabs STT (Scribe v1)
      const base64Audio = await blobToBase64(audioBlob);
      const sttRes = await api.transcribeAudio({
        audio_base64: base64Audio,
        mime_type: mimeType,
        language_code: voiceLanguage !== 'auto' ? voiceLanguage : undefined
      });

      const userText = (sttRes.text || '').trim();
      if (!userText) {
        throw new Error('No speech recognized. Please try speaking again in English or Hindi.');
      }

      setLiveTranscript(userText);

      // Step 2: PULSE Assistant Query (LangGraph + RAG + SQLite)
      const aiRes = await api.queryAI({
        prompt: userText,
        project_id: projectId
      });

      const assistantText = aiRes.response || 'No response returned from project assistant.';
      setLiveResponseText(assistantText);

      // Step 3: ElevenLabs TTS (Multilingual v2)
      let speechBase64: string | undefined;
      if (!isMuted) {
        try {
          const cleanedText = cleanForSpeech(assistantText) || assistantText.slice(0, 400);
          const ttsRes = await api.synthesizeSpeech({ text: cleanedText });
          speechBase64 = ttsRes.audio_base64;
        } catch (ttsErr: any) {
          console.warn('Live voice TTS notice:', ttsErr);
          setErrorMsg(ttsErr.message || 'ElevenLabs voice synthesis unavailable.');
        }
      }

      // Sync conversation turn to the main chat messages list
      onAddChatMessage(userText, assistantText, speechBase64);

      // Step 4: Play Spoken Audio
      if (speechBase64 && !isMuted && isMountedRef.current) {
        setLiveState('speaking');
        const audioUrl = `data:audio/mpeg;base64,${speechBase64}`;
        const audio = new Audio(audioUrl);
        audioElementRef.current = audio;

        audio.onended = () => {
          if (!isMountedRef.current) return;
          setLiveState('idle');
          if (continuousMode) {
            // Automatically listen for next turn in continuous mode
            setTimeout(() => {
              if (isMountedRef.current && continuousMode) {
                startListeningSession();
              }
            }, 600);
          }
        };

        audio.onerror = () => {
          setLiveState('idle');
        };

        await audio.play();
      } else {
        setLiveState('idle');
        if (continuousMode) {
          setTimeout(() => {
            if (isMountedRef.current && continuousMode) {
              startListeningSession();
            }
          }, 1500);
        }
      }
    } catch (err: any) {
      console.warn('Live conversation error:', err);
      setErrorMsg(err.message || 'Voice communication error.');
      setLiveState('idle');
    } finally {
      activeRequestRef.current = false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in p-4 sm:p-6">
      {/* Light-Themed Glass Card */}
      <div className="relative w-full max-w-xl h-[85vh] max-h-[760px] rounded-3xl bg-white dark:bg-[#191B22] border border-slate-200/80 dark:border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden text-slate-800 dark:text-white transition-colors">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  PULSE Live Voice
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-indigo-500" />
                  Live Dialogue
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-white/50">{projectName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1 text-xs shadow-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
              <select
                value={voiceLanguage}
                onChange={(e) => onLanguageChange(e.target.value as any)}
                className="bg-transparent text-slate-700 dark:text-white text-xs font-medium cursor-pointer focus:outline-none"
              >
                <option value="auto">Auto Detect</option>
                <option value="en">English</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            </div>

            {/* Close / Return Button */}
            <button
              type="button"
              onClick={() => {
                cleanupAudio();
                onClose();
              }}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 hover:text-slate-800 dark:text-white/70 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Live Voice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Luminous White-Theme Animated Audio Orb */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 relative overflow-hidden">
          
          {/* Subtle Ambient Radial Lighting for Light Theme */}
          <div
            className={`absolute w-80 h-80 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
              liveState === 'listening'
                ? 'bg-gradient-to-tr from-sky-300/30 via-indigo-300/25 to-teal-300/20 scale-125'
                : liveState === 'thinking'
                ? 'bg-gradient-to-tr from-purple-300/30 via-indigo-300/25 to-pink-300/20 scale-110 animate-spin-slow'
                : liveState === 'speaking'
                ? 'bg-gradient-to-tr from-violet-400/35 via-fuchsia-300/25 to-indigo-300/20 scale-130'
                : 'bg-indigo-100/40 dark:bg-indigo-900/20 scale-95'
            }`}
          />

          {/* Concentric Animated Soundwave Ripples */}
          <div className="relative flex items-center justify-center">
            {liveState === 'listening' && (
              <>
                <div
                  className="absolute rounded-full border-2 border-indigo-400/30 dark:border-cyan-400/40 animate-ping pointer-events-none"
                  style={{
                    width: `${170 + (audioLevel * 1.3)}px`,
                    height: `${170 + (audioLevel * 1.3)}px`,
                    animationDuration: '1.8s'
                  }}
                />
                <div
                  className="absolute rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 transition-all duration-75 pointer-events-none"
                  style={{
                    width: `${145 + (audioLevel * 0.9)}px`,
                    height: `${145 + (audioLevel * 0.9)}px`
                  }}
                />
              </>
            )}

            {liveState === 'speaking' && (
              <>
                <div
                  className="absolute rounded-full border-2 border-purple-400/40 animate-pulse pointer-events-none"
                  style={{
                    width: '185px',
                    height: '185px',
                    animationDuration: '1.2s'
                  }}
                />
                <div
                  className="absolute rounded-full bg-purple-500/10 animate-ping pointer-events-none"
                  style={{
                    width: '150px',
                    height: '150px',
                    animationDuration: '2.4s'
                  }}
                />
              </>
            )}

            {/* Central Interactive Voice Orb */}
            <button
              type="button"
              onClick={() => {
                if (liveState === 'listening') {
                  stopAndProcessVoice();
                } else if (liveState === 'speaking') {
                  interruptPlayback();
                } else if (liveState === 'idle') {
                  startListeningSession();
                }
              }}
              className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group focus:outline-none select-none ${
                liveState === 'listening'
                  ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 text-white shadow-indigo-500/30 ring-4 ring-indigo-400/30 hover:scale-105'
                  : liveState === 'thinking'
                  ? 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-purple-500/30 animate-pulse'
                  : liveState === 'speaking'
                  ? 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-violet-500/30 ring-4 ring-purple-400/40 hover:scale-105'
                  : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-white/10 hover:border-indigo-400 hover:scale-105 shadow-md'
              }`}
            >
              {liveState === 'listening' ? (
                <>
                  {/* Dynamic Equalizer Bars */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-12 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1.5 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                    <span className="w-1.5 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '250ms' }} />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-white/90">
                    Tap to Send
                  </span>
                </>
              ) : liveState === 'thinking' ? (
                <>
                  <RefreshCw className="w-8 h-8 text-white animate-spin mb-1.5" />
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-white/90">
                    Thinking
                  </span>
                </>
              ) : liveState === 'speaking' ? (
                <>
                  <Volume2 className="w-8 h-8 text-white animate-pulse mb-1.5" />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-white/90">
                    Interrupt
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">
                    Tap to Talk
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Status Label & Timer */}
          <div className="mt-6 text-center">
            <div className="text-base font-semibold tracking-tight text-slate-800 dark:text-white">
              {liveState === 'listening' && (
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                  Listening... बोलिए (English / Hindi)
                </span>
              )}
              {liveState === 'thinking' && (
                <span className="text-purple-600 dark:text-purple-400">
                  Processing project query...
                </span>
              )}
              {liveState === 'speaking' && (
                <span className="text-violet-600 dark:text-violet-400 flex items-center justify-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-violet-500" />
                  Speaking response... (Tap orb to interrupt)
                </span>
              )}
              {liveState === 'idle' && (
                <span className="text-slate-600 dark:text-white/70">
                  Ready. Tap orb or click button below to talk.
                </span>
              )}
            </div>

            {liveState === 'listening' && (
              <p className="font-mono text-xs text-slate-500 dark:text-white/50 mt-1">
                {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{(recordingSeconds % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mt-3 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2 max-w-md text-left shadow-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="flex-1">{errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="p-0.5 hover:text-amber-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Live Transcript & Spoken Subtitle Bubbles (Clean Light Theme) */}
          {(liveTranscript || liveResponseText) && (
            <div className="w-full mt-4 max-h-36 overflow-y-auto space-y-2 px-2">
              {liveTranscript && (
                <div className="p-3 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-800/40 text-xs text-slate-800 dark:text-sky-200 leading-relaxed text-left shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 block mb-0.5">
                    You Said:
                  </span>
                  "{liveTranscript}"
                </div>
              )}
              {liveResponseText && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-white/90 leading-relaxed text-left shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                    PULSE Assistant:
                  </span>
                  {liveResponseText.length > 250 ? liveResponseText.slice(0, 250) + '...' : liveResponseText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action Controls */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 backdrop-blur-md flex items-center justify-between shrink-0">
          {/* Continuous Conversational Mode Toggle */}
          <button
            type="button"
            onClick={() => setContinuousMode(!continuousMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              continuousMode
                ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900'
            }`}
            title="Auto-listen for your reply after assistant speaks (Continuous conversation)"
          >
            <Radio className={`w-3.5 h-3.5 ${continuousMode ? 'text-indigo-500 dark:text-indigo-400 animate-pulse' : ''}`} />
            <span>{continuousMode ? 'Live Dialogue: On' : 'One-shot Mode'}</span>
          </button>

          {/* Center Playback / Stop Controls */}
          <div className="flex items-center gap-2">
            {liveState === 'listening' ? (
              <button
                type="button"
                onClick={stopAndProcessVoice}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Done Speaking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : liveState === 'speaking' ? (
              <button
                type="button"
                onClick={interruptPlayback}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Speaking</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startListeningSession}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-white" />
                <span>Tap to Talk</span>
              </button>
            )}

            {/* Mute Spoken Answers */}
            <button
              type="button"
              onClick={() => {
                if (liveState === 'speaking') interruptPlayback();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/40 text-amber-600 dark:text-amber-300'
                  : 'bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900'
              }`}
              title={isMuted ? "Unmute spoken answers" : "Mute spoken answers"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* End Call / Back to Chat */}
          <button
            type="button"
            onClick={() => {
              cleanupAudio();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer shadow-xs"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
};
