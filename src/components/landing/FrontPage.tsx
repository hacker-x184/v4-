import React, { useState } from 'react';
import {
  ShieldCheck,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
  Layers,
  Terminal,
  Activity,
  Users,
  Check,
  Lock,
  Menu,
  X,
  Workflow,
  Sparkles,
  Search
} from 'lucide-react';

interface FrontPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onExploreDemo: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const FrontPage: React.FC<FrontPageProps> = ({
  onOpenAuth,
  onExploreDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroActiveTab, setHeroActiveTab] = useState<'tasks' | 'ai' | 'github'>('tasks');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 selection:bg-cyan-100 selection:text-cyan-900 font-sans antialiased">
      {/* =========================================================================
          NAVIGATION BAR
          Brand: PULSE
          Links: Features | How It Works | GitHub Intelligence
          Buttons: Sign In | Get Started
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element wordmark with icon) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold text-sm tracking-wider flex items-center justify-center shadow-xs">
              P
            </div>
            <a
              href="#"
              className="text-lg font-bold tracking-tight text-stone-950 hover:text-stone-800 transition-colors whitespace-nowrap shrink-0"
            >
              PULSE
            </a>
          </div>

          {/* Zone 2: Navigation Links (Single-line, quiet typography) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('github-intelligence')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              GitHub Intelligence
            </button>
          </nav>

          {/* Zone 3: Navigation Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors rounded-lg hover:bg-stone-200/50 cursor-pointer whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer whitespace-nowrap"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-stone-600 hover:text-stone-950 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 bg-[#F4F1EA] border-b border-[#E7E2D7] space-y-3">
            <nav className="flex flex-col space-y-2 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="text-left px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-lg"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="text-left px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-lg"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('github-intelligence')}
                className="text-left px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-lg"
              >
                GitHub Intelligence
              </button>
            </nav>
            <div className="pt-3 border-t border-[#E7E2D7] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full text-center py-2.5 text-sm font-medium text-stone-800 hover:text-stone-950 bg-white border border-[#E7E2D7] rounded-lg shadow-2xs"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          HERO SECTION
          Eyebrow: PROJECT MANAGEMENT, WITH CONTEXT
          Headline: Keep your projects moving. Know what’s happening.
          Description: Plan work, track progress, and understand your team's development activity in one place. PULSE connects project workflows with AI-assisted analysis and GitHub evidence.
          Primary CTA: Get Started
          Secondary CTA: Explore Features
          Three points:
          - Project planning and task tracking
          - AI-assisted project insights
          - GitHub activity and code evidence
          ========================================================================= */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 border-b border-[#E7E2D7] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Eyebrow */}
            <div className="text-xs font-semibold tracking-wider text-cyan-800 uppercase">
              PROJECT MANAGEMENT, WITH CONTEXT
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-[1.12]">
              Keep your projects moving. Know what’s happening.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Plan work, track progress, and understand your team's development activity in one place. PULSE connects project workflows with AI-assisted analysis and GitHub evidence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-stone-800 bg-white hover:bg-stone-100/60 border border-[#DCD6C9] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>Explore Features</span>
              </button>
            </div>

            {/* Three Short Points */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-stone-600">
              <span className="flex items-center gap-2 font-medium text-stone-700">
                <Check className="w-4 h-4 text-cyan-700 shrink-0" />
                Project planning and task tracking
              </span>
              <span className="hidden sm:inline text-stone-400" aria-hidden="true">·</span>
              <span className="flex items-center gap-2 font-medium text-stone-700">
                <Check className="w-4 h-4 text-cyan-700 shrink-0" />
                AI-assisted project insights
              </span>
              <span className="hidden sm:inline text-stone-400" aria-hidden="true">·</span>
              <span className="flex items-center gap-2 font-medium text-stone-700">
                <Check className="w-4 h-4 text-cyan-700 shrink-0" />
                GitHub activity and code evidence
              </span>
            </div>
          </div>

          {/* =========================================================================
              REAL PRODUCT UI PREVIEW (Workspaces, Tasks, AI Intelligence, GitHub)
              Refined studio frame with cream & white surfaces
              ========================================================================= */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-[#E2DDD2] bg-white shadow-xl shadow-stone-900/5 overflow-hidden">
            {/* Window Chrome Header */}
            <div className="px-5 py-3.5 bg-[#F5F2EB] border-b border-[#E7E2D7] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-stone-300" />
                <div className="w-3 h-3 rounded-full bg-stone-300" />
                <div className="w-3 h-3 rounded-full bg-stone-300" />
                <span className="ml-2 text-xs font-mono text-stone-600">
                  pulse // workspace: core-platform-sprint
                </span>
              </div>

              {/* Interactive View Switcher */}
              <div className="flex items-center p-1 bg-[#EAE5DA] border border-[#DDD7CB] rounded-lg">
                <button
                  type="button"
                  onClick={() => setHeroActiveTab('tasks')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    heroActiveTab === 'tasks'
                      ? 'bg-white text-stone-950 font-semibold shadow-2xs'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Task Tracking
                </button>
                <button
                  type="button"
                  onClick={() => setHeroActiveTab('ai')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    heroActiveTab === 'ai'
                      ? 'bg-white text-stone-950 font-semibold shadow-2xs'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  AI Project Assistant
                </button>
                <button
                  type="button"
                  onClick={() => setHeroActiveTab('github')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    heroActiveTab === 'github'
                      ? 'bg-white text-stone-950 font-semibold shadow-2xs'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  GitHub Evidence
                </button>
              </div>
            </div>

            {/* Tab Body: Realistic UI Screens */}
            <div className="p-5 sm:p-6 bg-[#FAF9F6]">
              {heroActiveTab === 'tasks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E7E2D7] pb-3 text-xs text-stone-500">
                    <span className="font-semibold text-stone-700">Active Sprint Tasks (4 of 12)</span>
                    <span className="text-stone-500">Sorted by Priority</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Task Row 1 */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E7E2D7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-cyan-800 font-semibold">TSK-104</span>
                          <span className="text-sm font-medium text-stone-900">Reconcile GitHub webhook commit verification</span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            In Progress
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          Milestone: Platform Security · Linked PR #42 · Acceptance: HMAC SHA-256 signature checked
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-xs text-stone-600">
                        <span className="text-rose-700 font-semibold">High</span>
                        <span>·</span>
                        <span>Assignee: Sarah C.</span>
                      </div>
                    </div>

                    {/* Task Row 2 */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E7E2D7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-cyan-800 font-semibold">TSK-105</span>
                          <span className="text-sm font-medium text-stone-900">LangGraph workflow supervisor integration</span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                            Review
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          Milestone: AI Engine · Linked PR #44 · Acceptance: Deterministic state routing verified
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-xs text-stone-600">
                        <span className="text-amber-700 font-semibold">Medium</span>
                        <span>·</span>
                        <span>Assignee: Marcus T.</span>
                      </div>
                    </div>

                    {/* Task Row 3 */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E7E2D7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-cyan-800 font-semibold">TSK-106</span>
                          <span className="text-sm font-medium text-stone-900">Dependency ripple & risk warning calculator</span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                            To Do
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          Milestone: Project Health · Blocked by: TSK-104 · Acceptance: Formula calculates delay cascading
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-xs text-stone-600">
                        <span className="text-amber-700 font-semibold">Medium</span>
                        <span>·</span>
                        <span>Assignee: Elena R.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {heroActiveTab === 'ai' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-[#F5F2EB] border border-[#E2DDD2] flex items-center gap-2 text-xs text-stone-700">
                    <Search className="w-3.5 h-3.5 text-cyan-800 shrink-0" />
                    <span>Query: "What is currently blocking TSK-106 and what commits were pushed today?"</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-cyan-900 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                        <span>PULSE AI Assistant</span>
                      </div>
                      <span className="text-stone-500 font-mono text-[11px]">Context: Authorized Team Access</span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      TSK-106 (<span className="text-stone-900 font-medium">Dependency ripple calculator</span>) has a defined dependency on <span className="text-cyan-800 font-semibold">TSK-104</span>. Sarah pushed commit <code className="px-1.5 py-0.5 rounded bg-[#F4F1EA] text-cyan-900 font-mono text-xs border border-[#E2DDD2]">7f3a9e1</code> 2 hours ago containing HMAC validation. PR #42 is open and waiting for review approval before unblocking.
                    </p>

                    <div className="p-3 rounded-lg bg-[#FAF8F5] border border-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="text-xs text-stone-700">
                        <span className="font-semibold text-stone-950">Proposed Action:</span> Notify reviewer Marcus T. to expedite PR #42 review.
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenAuth('login')}
                          className="px-3 py-1 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded shadow-2xs cursor-pointer"
                        >
                          Approve Action
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {heroActiveTab === 'github' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E7E2D7] pb-3 text-xs text-stone-500">
                    <span className="font-semibold text-stone-700">GitHub Verified Activity Evidence</span>
                    <span className="font-mono text-cyan-800">repo: organization/pulse-core</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        <GitCommit className="w-4 h-4 text-cyan-700" />
                        <span className="text-cyan-900 font-bold">7f3a9e1</span>
                        <span className="text-stone-800 font-sans font-medium">feat(auth): add cryptographic webhook signature validation</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified GPG
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                      <span>Author: <strong className="text-stone-900">Sarah Chen</strong></span>
                      <span>·</span>
                      <span>Branch: <code className="font-mono text-stone-800">feat/webhook-audit</code></span>
                      <span>·</span>
                      <span className="text-emerald-700 font-mono font-medium">+142</span>
                      <span className="text-rose-700 font-mono font-medium">-18</span>
                      <span>·</span>
                      <span>Linked Task: <strong className="text-cyan-800">TSK-104</strong></span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#22242D] border border-stone-800 font-mono text-[11px] text-stone-300 space-y-1">
                      <div className="text-stone-400"># Evidence Diff Summary</div>
                      <div className="text-emerald-300">+ crypto.createHmac('sha256', secret).update(rawBody).digest('hex')</div>
                      <div className="text-emerald-300">+ if (!timingSafeEqual(headerSignature, calculatedSignature)) throw SecurityException</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE SECTION
          Heading: Everything your team needs to stay on track.
          Description: From planning the work to understanding what changed, keep project information connected and accessible.
          6 Features:
          1. Project Planning
          2. AI Project Assistant
          3. GitHub Intelligence
          4. Team Contribution Insights
          5. Workflow Automation
          6. Project Health
          ========================================================================= */}
      <section id="features" className="py-24 border-b border-[#E7E2D7] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950">
              Everything your team needs to stay on track.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              From planning the work to understanding what changed, keep project information connected and accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] hover:border-stone-400/80 transition-all flex flex-col justify-between space-y-5 shadow-2xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-stone-950">Project Planning</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Turn project requirements into structured tasks, milestones, dependencies, and acceptance criteria.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0EBE1] text-xs text-stone-500 flex items-center justify-between font-mono">
                <span>Milestone breakdown</span>
                <span className="text-cyan-800 font-medium">Dependencies linked</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] hover:border-stone-400/80 transition-all flex flex-col justify-between space-y-5 shadow-2xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-stone-950">AI Project Assistant</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Ask questions about your projects, tasks, blockers, and progress using the information you are authorized to access.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0EBE1] text-xs text-stone-500 flex items-center justify-between font-mono">
                <span>RAG groundings</span>
                <span className="text-cyan-800 font-medium">Role-scoped context</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] hover:border-stone-400/80 transition-all flex flex-col justify-between space-y-5 shadow-2xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                  <GitCommit className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-stone-950">GitHub Intelligence</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Investigate commits, pull requests, changed files, and available reviews with links to supporting evidence.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0EBE1] text-xs text-stone-500 flex items-center justify-between font-mono">
                <span>Audit trail</span>
                <span className="text-cyan-800 font-medium">Cryptographic SHAs</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] hover:border-stone-400/80 transition-all flex flex-col justify-between space-y-5 shadow-2xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-stone-950">Team Contribution Insights</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Understand recorded activity and task progress without treating commit counts alone as a measure of someone's performance.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0EBE1] text-xs text-stone-500 flex items-center justify-between font-mono">
                <span>Balanced recognition</span>
                <span className="text-cyan-800 font-medium">Contextual impact</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] hover:border-stone-400/80 transition-all flex flex-col justify-between space-y-5 shadow-2xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-stone-950">Workflow Automation</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Let AI prepare plans and recommendations, review proposed actions, and approve changes before they are applied.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0EBE1] text-xs text-stone-500 flex items-center justify-between font-mono">
                <span>Autonomous proposals</span>
                <span className="text-cyan-800 font-medium">Human-in-the-loop</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] hover:border-stone-400/80 transition-all flex flex-col justify-between space-y-5 shadow-2xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-stone-950">Project Health</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Identify overdue work, dependencies, risks, and potential blockers using available project data.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0EBE1] text-xs text-stone-500 flex items-center justify-between font-mono">
                <span>Deterministic rules</span>
                <span className="text-cyan-800 font-medium">Blocker detection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS SECTION
          Heading: From project idea to verified progress.
          1. Define the work: Start with a project description, requirements document, or existing project.
          2. Plan with context: Review suggested tasks, dependencies, milestones, and relevant team information.
          3. Approve and execute: Approve proposed changes before PULSE creates or updates project records.
          4. Track and investigate: Monitor progress and ask questions using project records and available GitHub evidence.
          ========================================================================= */}
      <section id="how-it-works" className="py-24 border-b border-[#E7E2D7] bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950">
              From project idea to verified progress.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              A transparent, accountable cycle that keeps engineering momentum aligned with actual deliverable code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] relative flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-800 tracking-wider">
                  01. DEFINE
                </div>
                <h3 className="text-lg font-semibold text-stone-950">Define the work</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Start with a project description, requirements document, or existing project.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D7] text-xs text-stone-600 font-mono">
                requirements.md / specification
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] relative flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-800 tracking-wider">
                  02. PLAN
                </div>
                <h3 className="text-lg font-semibold text-stone-950">Plan with context</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Review suggested tasks, dependencies, milestones, and relevant team information.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D7] text-xs text-stone-600 font-mono">
                Milestones · Priorities · Roles
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] relative flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-800 tracking-wider">
                  03. APPROVE
                </div>
                <h3 className="text-lg font-semibold text-stone-950">Approve and execute</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Approve proposed changes before PULSE creates or updates project records.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D7] text-xs text-stone-600 font-mono">
                Human confirmation required
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] relative flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-800 tracking-wider">
                  04. INVESTIGATE
                </div>
                <h3 className="text-lg font-semibold text-stone-950">Track and investigate</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Monitor progress and ask questions using project records and available GitHub evidence.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D7] text-xs text-stone-600 font-mono">
                Verified commits · Audit logs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GITHUB INTELLIGENCE SECTION
          Heading: Understand the code behind the progress.
          Description & CTA: Explore GitHub Intelligence
          ========================================================================= */}
      <section id="github-intelligence" className="py-24 border-b border-[#E7E2D7] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Copy Side */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-semibold tracking-wider text-cyan-800 uppercase">
                CODE EVIDENCE & RECONCILIATION
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 leading-tight">
                Understand the code behind the progress.
              </h2>
              <p className="text-base text-stone-600 leading-relaxed">
                Connect authorized repositories to explore commits, pull requests, changed files, and development activity. Ask questions and trace answers back to available GitHub evidence.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-3 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore GitHub Intelligence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Evidence Console Side */}
            <div className="lg:col-span-7 rounded-2xl bg-white border border-[#E2DDD2] shadow-xl overflow-hidden">
              <div className="px-5 py-3.5 bg-[#F5F2EB] border-b border-[#E7E2D7] flex items-center justify-between text-xs text-stone-600 font-mono">
                <span>git-evidence // audit-stream</span>
                <span className="text-cyan-800 font-semibold">cryptographic validation active</span>
              </div>

              <div className="p-5 sm:p-6 space-y-4 bg-[#FAF9F6]">
                <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <GitPullRequest className="w-4 h-4 text-cyan-700" />
                      <span className="text-stone-950 font-semibold">PR #42 · Webhook signature validation</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Approved by 2 Reviewers
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Linked to task <span className="text-cyan-800 font-mono font-semibold">TSK-104</span>. Implements constant-time HMAC comparison to prevent timing attacks on incoming GitHub webhook calls.
                  </p>

                  <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D7] font-mono text-xs text-stone-700 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-3.5 h-3.5 text-cyan-700" />
                      <span className="text-cyan-900 font-bold">7f3a9e14c</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-600">3 files changed</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-emerald-700 font-semibold">+142 additions</span>
                      <span className="text-rose-700 font-semibold">-18 deletions</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E7E2D7] text-xs text-stone-600 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <span>
                    Attribution is verified through repository commit signatures and issue cross-references, eliminating guesswork and recognizing code reviews alongside merged commits.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TRUST & GOVERNANCE SECTION
          Heading: Useful insights. Human-controlled actions.
          Description: PULSE combines project data, source evidence, and AI-generated recommendations. Review proposed changes before execution, and keep important actions traceable.
          ========================================================================= */}
      <section className="py-24 border-b border-[#E7E2D7] bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950">
              Useful insights. Human-controlled actions.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              PULSE combines project data, source evidence, and AI-generated recommendations. Review proposed changes before execution, and keep important actions traceable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] space-y-3 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-950">Explicit Approval Required</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                No autonomous mutations to tasks, milestones, or team settings occur without human sign-off.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] space-y-3 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-950">Role-Scoped Boundaries</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                AI queries only index records and repositories that your specific user role is authorized to see.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7E2D7] space-y-3 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-950">Auditable Traceability</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every suggested action cites exact commit SHAs, file paths, or task identifiers for independent verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION SECTION
          Heading: Bring your project into focus.
          Description: Plan clearly, understand progress, and make informed decisions with PULSE.
          Button: Get Started
          ========================================================================= */}
      <section className="py-24 border-b border-[#E7E2D7] bg-gradient-to-b from-[#FAF8F5] to-[#F2EFE8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950">
            Bring your project into focus.
          </h2>
          <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            Plan clearly, understand progress, and make informed decisions with PULSE.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-[#DCD6C9] rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <span>Explore Live Workspace Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          PULSE
          Project management, team collaboration, and evidence-based insights.
          Links: Features | GitHub Intelligence | Sign In
          ========================================================================= */}
      <footer className="py-12 bg-[#EDE9E1] text-stone-600 text-xs border-t border-[#DCD6C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-bold text-stone-950 tracking-wider text-sm">PULSE</span>
            <span className="hidden sm:inline text-stone-400" aria-hidden="true">·</span>
            <span>Project management, team collaboration, and evidence-based insights.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('github-intelligence')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              GitHub Intelligence
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
