import { useState } from "react"
import {
  ArrowRight,
  Search,
  Users,
  Sparkles,
  Zap,
  Star,
  UserRoundPlus,
  Target,
  Menu,
  X,
  Flame,
} from "lucide-react"
import { Link } from "react-router-dom"

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#17142B] selection:bg-[#FFD86B] selection:text-[#17142B]">
      {/* ==================== TOP STRIP ==================== */}
      <div className="border-b-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-[#17142B] sm:text-sm">
        ⚡ ISSUE #01: ASSEMBLE SMARTER. BUILD LOUDER. ⚡
      </div>

      {/* ==================== NAVBAR ==================== */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b-2 border-[#17142B]/10 px-5 py-4 sm:px-6">
        {/* Comic Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#7046D9] text-white shadow-[3px_3px_0_#17142B] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_#17142B]">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#17142B]">
            Team<span className="text-[#7046D9]">Fuse</span>
            <span className="ml-1 text-xs text-[#7046D9]">✦</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 text-sm font-black uppercase tracking-wider md:flex">
          <Link
            to="/"
            className="border-b-2 border-[#7046D9] text-[#7046D9] pb-0.5"
          >
            Home
          </Link>

          <Link
            to="/create-profile"
            className="text-slate-700 transition hover:text-[#7046D9]"
          >
            Create Profile
          </Link>

          <Link
            to="/find-teammates"
            className="text-slate-700 transition hover:text-[#7046D9]"
          >
            Find Teammates
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/create-profile"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[3px_3px_0_#17142B] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Start Fusing
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-slate-800 shadow-[2px_2px_0_#17142B] md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b-2 border-[#17142B] bg-white px-5 py-4 shadow-md md:hidden">
          <div className="flex flex-col gap-3 font-black text-sm uppercase">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg bg-purple-50 px-3 py-2 text-[#7046D9]"
            >
              Home
            </Link>
            <Link
              to="/create-profile"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
            >
              Create Profile
            </Link>
            <Link
              to="/find-teammates"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
            >
              Find Teammates
            </Link>
            <Link
              to="/create-profile"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-4 py-2.5 text-xs font-black text-white shadow-[3px_3px_0_#17142B]"
            >
              Start Fusing
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}

      {/* ==================== HERO / COVER PAGE ==================== */}
      <main className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-14">
        {/* Left Comic Panel */}
        <section className="relative">
          {/* Halftone Texture Overlay */}
          <div className="pointer-events-none absolute -left-6 -top-10 h-40 w-40 bg-halftone-subtle opacity-70" />

          {/* Eyebrow Comic Badge */}
          <div className="relative mb-5 inline-flex items-center gap-2 rounded-lg border-2 border-[#17142B] bg-[#DCCFFF] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B]">
            <Target size={14} />
            NO RANDOM TEAMS. ONLY PERFECT FUSIONS.
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#17142B] sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.98]">
            Your next
            <br />
            <span className="relative inline-block text-[#7046D9]">
              teammate
              <span className="absolute -right-6 -top-3 text-2xl text-[#FFD86B]">✦</span>
            </span>
            <br />
            is out there.
          </h1>

          {/* Comic Sticker Badge */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-3 py-1 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Sparkles size={13} />
              FIND → FUSE → BUILD
            </span>

            <span className="inline-flex items-center gap-1 rounded-md border-2 border-[#17142B] bg-[#BDE7D6] px-3 py-1 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Flame size={13} className="text-amber-600" />
              TEAM UP!
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base font-bold leading-relaxed text-slate-700 sm:text-lg">
            Stop rolling the dice with random group chats. TeamFuse matches you with
            compatible builders whose skills, mission goals, and superpower stack genuinely
            complement yours.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/create-profile"
              className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-7 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Create My Profile
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/find-teammates"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-white px-6 py-3.5 text-sm font-black uppercase tracking-wider text-[#17142B] shadow-[4px_4px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Search size={17} />
              Explore Teammates
            </Link>
          </div>

          {/* Comic Caption Tag */}
          <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase text-slate-600">
            <span className="text-base text-[#7046D9]">↗</span>
            <span>Different skills. One unstoppable squad.</span>
          </div>
        </section>

        {/* Right Central "Team Formation" Comic Panel */}
        <section className="relative mx-auto w-full max-w-lg lg:max-w-none">
          {/* Subtle Halftone Corner Accent */}
          <div className="pointer-events-none absolute -right-4 -top-6 h-32 w-32 bg-halftone-purple opacity-60" />

          {/* Main Comic Panel Frame */}
          <div className="relative rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[6px_6px_0_#17142B] sm:p-7">
            {/* Comic Panel Header */}
            <div className="mb-6 flex items-center justify-between border-b-2 border-[#17142B] pb-3.5">
              <div className="inline-flex items-center gap-2 rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#17142B]">
                <Zap size={13} fill="currentColor" />
                TEAM INCOMING!
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                COLLECTIBLE ROSTER
              </span>
            </div>

            {/* Character Cards Showcase Grid */}
            <div className="grid grid-cols-3 gap-3 text-center sm:gap-3.5">
              {/* Frontend Character */}
              <div className="group rounded-xl border-2 border-[#17142B] bg-[#F7A6C7]/30 p-3 shadow-[2px_2px_0_#17142B] transition hover:-translate-y-1">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#F7A6C7] text-3xl shadow-[2px_2px_0_#17142B] sm:h-20 sm:w-20 sm:text-4xl">
                  👩🏻‍💻
                  <span className="absolute -right-2 -top-2 rounded-md border-2 border-[#17142B] bg-white px-1.5 py-0.2 text-[9px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                    UI
                  </span>
                </div>
                <p className="mt-2 text-xs font-black uppercase text-[#17142B]">Frontend</p>
                <p className="text-[10px] font-bold text-slate-500">React · UI/UX</p>
              </div>

              {/* Backend Character */}
              <div className="group rounded-xl border-2 border-[#17142B] bg-[#BDE7D6]/40 p-3 shadow-[2px_2px_0_#17142B] transition hover:-translate-y-1">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] text-3xl shadow-[2px_2px_0_#17142B] sm:h-20 sm:w-20 sm:text-4xl">
                  👨🏻‍💻
                  <span className="absolute -right-2 -top-2 rounded-md border-2 border-[#17142B] bg-[#7046D9] px-1.5 py-0.2 text-[9px] font-black uppercase text-white shadow-[1px_1px_0_#17142B]">
                    API
                  </span>
                </div>
                <p className="mt-2 text-xs font-black uppercase text-[#7046D9]">Backend</p>
                <p className="text-[10px] font-bold text-slate-500">Node · Mongo</p>
              </div>

              {/* ML / Design Character */}
              <div className="group rounded-xl border-2 border-[#17142B] bg-[#FFD86B]/30 p-3 shadow-[2px_2px_0_#17142B] transition hover:-translate-y-1">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFD86B] text-3xl shadow-[2px_2px_0_#17142B] sm:h-20 sm:w-20 sm:text-4xl">
                  👩🏻‍🔬
                  <span className="absolute -right-2 -top-2 rounded-md border-2 border-[#17142B] bg-white px-1.5 py-0.2 text-[9px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                    ML
                  </span>
                </div>
                <p className="mt-2 text-xs font-black uppercase text-[#17142B]">Intelligence</p>
                <p className="text-[10px] font-bold text-slate-500">Python · ML</p>
              </div>
            </div>

            {/* Fusion Divider */}
            <div className="my-5 flex items-center justify-center gap-2">
              <div className="h-0.5 flex-1 bg-[#17142B]" />
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0_#17142B]">
                <Zap size={12} fill="currentColor" />
                FUSION SYNERGY
              </div>
              <div className="h-0.5 flex-1 bg-[#17142B]" />
            </div>

            {/* Compatibility Insight Panel */}
            <div className="rounded-xl border-2 border-[#17142B] bg-[#7046D9] p-4 text-white shadow-[4px_4px_0_#17142B]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#FFD86B]">
                    COMPATIBILITY SCORE
                  </p>
                  <p className="text-3xl font-black text-white">92%</p>
                  <p className="text-xs font-bold text-purple-200">
                    High synergy: zero missing core skills!
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-white/15 text-white shadow-[2px_2px_0_#17142B]">
                  <Users size={22} />
                </div>
              </div>

              {/* Inked Progress Bar */}
              <div className="mt-3.5 h-3 w-full overflow-hidden rounded-full border-2 border-white bg-white/20">
                <div className="h-full w-[92%] rounded-full bg-[#FFD86B]" />
              </div>
            </div>

            {/* Caption */}
            <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-black uppercase text-slate-600">
              <Star size={13} fill="currentColor" className="text-[#7046D9]" />
              Find the skill. Fuse the team.
              <Star size={13} fill="currentColor" className="text-[#7046D9]" />
            </div>
          </div>
        </section>
      </main>

      {/* ==================== HOW THE FUSE WORKS (PLAYBOOK) ==================== */}
      <section className="border-y-2 border-[#17142B] bg-white px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2.5 inline-block rounded-md border-2 border-[#17142B] bg-[#BDE7D6] px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#17142B]">
                THE PLAYBOOK
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#17142B] sm:text-4xl">
                How the fuse works.
              </h2>
            </div>

            <p className="max-w-sm text-sm font-bold text-slate-600">
              Three comic-simple steps from solo builder to project-ready superhero squad.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group rounded-2xl border-2 border-[#17142B] bg-[#FFF8E8] p-6 shadow-[4px_4px_0_#17142B] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#17142B]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#7046D9] shadow-[2px_2px_0_#17142B]">
                  <UserRoundPlus size={22} />
                </div>
                <span className="rounded-full border-2 border-[#17142B] bg-[#F7A6C7] px-2.5 py-0.5 text-xs font-black text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  01
                </span>
              </div>

              <h3 className="text-lg font-black uppercase text-[#17142B]">
                Create Your Profile
              </h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
                Declare your role, skill loadout, and what special powers you need in
                your teammates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group rounded-2xl border-2 border-[#17142B] bg-[#FFF8E8] p-6 shadow-[4px_4px_0_#17142B] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#17142B]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-emerald-700 shadow-[2px_2px_0_#17142B]">
                  <Search size={22} />
                </div>
                <span className="rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-2.5 py-0.5 text-xs font-black text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  02
                </span>
              </div>

              <h3 className="text-lg font-black uppercase text-[#17142B]">
                Find Your Match
              </h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
                Scout the recruitment wall, filter by tech stacks, and review compatibility
                percentages.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group rounded-2xl border-2 border-[#17142B] bg-[#FFF8E8] p-6 shadow-[4px_4px_0_#17142B] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#17142B]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#7046D9] shadow-[2px_2px_0_#17142B]">
                  <Sparkles size={22} />
                </div>
                <span className="rounded-full border-2 border-[#17142B] bg-[#DCCFFF] px-2.5 py-0.5 text-xs font-black text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  03
                </span>
              </div>

              <h3 className="text-lg font-black uppercase text-[#17142B]">
                Build Together
              </h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
                Fuse your squad and inspect your full team power, coverage gaps, and ready
                check verdict.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA PANEL ==================== */}
      <section className="px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-2xl border-2 border-[#17142B] bg-[#7046D9] p-8 text-white shadow-[6px_6px_0_#17142B] sm:p-12 lg:flex lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-block rounded-md border-2 border-white bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#FFD86B]">
              READY TO FUSE?
            </div>
            <h2 className="max-w-2xl text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Your project needs more than just you.
            </h2>
            <p className="mt-2.5 max-w-xl text-sm font-bold text-white/80 sm:text-base">
              Find builders who bring the exact superpowers and passion your team is missing.
            </p>
          </div>

          <div className="mt-8 shrink-0 lg:mt-0">
            <Link
              to="/create-profile"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-7 py-3.5 text-sm font-black uppercase tracking-wider text-[#17142B] shadow-[4px_4px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Start Building
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t-2 border-[#17142B] bg-[#17142B] px-5 py-6 text-center text-xs font-bold text-white/60">
        TeamFuse © 2026 · Find. Fuse. Build. The Digital Comic Team Builder.
      </footer>
    </div>
  )
}

export default Home