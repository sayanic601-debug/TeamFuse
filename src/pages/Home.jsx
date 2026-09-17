import {
  ArrowRight,
  Search,
  Users,
  Sparkles,
  Zap,
  Star,
  UserRoundPlus,
  Target,
} from "lucide-react"
import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FFF9EF] text-[#17142B]">

      {/* ==================== TOP STRIP ==================== */}
      <div className="border-b-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 text-center text-xs font-black uppercase tracking-[0.18em] sm:text-sm">
        ⚡ Assemble smarter. Build louder. ⚡
      </div>


      {/* ==================== NAVBAR ==================== */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-6">

        {/* Logo */}
        <Link to="/" className="group relative">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 rotate-[-8deg] items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#7046D9] text-white shadow-[3px_3px_0px_#17142B] transition group-hover:rotate-0">
              <Zap size={21} fill="currentColor" />
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Team<span className="text-[#7046D9]">Fuse</span>
            </h1>
          </div>

          <span className="absolute -right-5 -top-3 text-lg">
            ✦
          </span>
        </Link>


        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm font-black md:flex">

          <Link
            to="/"
            className="relative pb-1"
          >
            Home
            <span className="absolute -bottom-1 left-0 h-1 w-full rotate-[-2deg] rounded-full bg-[#7046D9]" />
          </Link>

          <Link
            to="/create-profile"
            className="transition hover:-translate-y-0.5 hover:text-[#7046D9]"
          >
            Create Profile
          </Link>

          <Link
            to="/find-teammates"
            className="transition hover:-translate-y-0.5 hover:text-[#7046D9]"
          >
            Find Teammates
          </Link>

        </div>


        {/* Get Started */}
        <Link
          to="/create-profile"
          className="flex items-center gap-2 rounded-lg border-2 border-[#17142B] bg-[#F05A47] px-4 py-2.5 text-sm font-black text-white shadow-[4px_4px_0px_#17142B] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:px-5"
        >
          Start Fusing
          <ArrowRight size={17} />
        </Link>

      </nav>


      {/* ==================== HERO ==================== */}
      <main className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:pt-14">


        {/* ==================== LEFT PANEL ==================== */}
        <section className="relative">

          {/* Small comic sticker */}
          <div className="absolute -right-2 -top-8 hidden rotate-6 rounded-full border-2 border-[#17142B] bg-[#BDE7D6] px-4 py-3 text-xs font-black shadow-[4px_4px_0px_#17142B] sm:block">
            NO RANDOM TEAMS!
          </div>


          {/* Eyebrow */}
          <div className="mb-7 inline-flex -rotate-2 items-center gap-2 rounded-md border-2 border-[#17142B] bg-[#7046D9] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[5px_5px_0px_#17142B]">
            <Target size={16} />
            Smart Team Building
          </div>


          {/* Main Heading */}
          <h2 className="text-5xl font-black leading-[0.88] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.3rem]">

            Your next
            <br />

            <span className="text-[#7046D9]">

              teammate


            </span>

            <br />

            is out there.

          </h2>


          {/* Comic punchline */}
          <div className="mt-6 inline-block rotate-[1deg] rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0px_#17142B]">
            FIND → FUSE → BUILD
          </div>


          {/* Description */}
          <p className="mt-7 max-w-xl text-base font-semibold leading-7 text-[#514D62] sm:text-lg">
            Stop searching through random people.
            TeamFuse connects you with teammates whose
            skills, roles and experience actually fit your project.
          </p>


          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/create-profile"
              className="group flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-6 py-4 font-black text-white shadow-[6px_6px_0px_#17142B] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Create My Profile

              <ArrowRight
                size={19}
                className="transition group-hover:translate-x-1"
              />
            </Link>


            <Link
              to="/find-teammates"
              className="group flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-white px-6 py-4 font-black shadow-[6px_6px_0px_#17142B] transition hover:-translate-y-1"
            >
              <Search size={19} />
              Explore Teammates
            </Link>

          </div>


          {/* Handwritten note */}
          <div className="mt-9 flex items-start gap-2 -rotate-3 font-bold text-[#514D62]">
            <span className="text-xl">↗</span>

            <span>
              Different skills.
              <br />
              One unstoppable team.
            </span>
          </div>

        </section>


        {/* ==================== RIGHT COMIC ==================== */}
        <section className="relative mx-auto w-full max-w-2xl">

          {/* Decorative dots */}
          <div className="absolute -left-8 top-12 hidden text-4xl leading-3 tracking-[0.25em] text-[#7046D9] sm:block">
            · · ·
            <br />
            · · ·
            <br />
            · · ·
          </div>


          {/* POW sticker */}
          <div className="absolute -right-1 -top-7 z-20 flex h-24 w-24 rotate-12 items-center justify-center rounded-full border-4 border-[#17142B] bg-[#F05A47] text-center text-sm font-black text-white shadow-[6px_6px_0px_#17142B]">
            POW!
            <br />
            MATCH!
          </div>


          {/* Yellow decoration */}
          <div className="absolute -bottom-7 -left-4 h-20 w-20 rotate-12 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] shadow-[4px_4px_0px_#17142B]" />


          {/* Main comic frame */}
          <div className="relative rotate-[1.5deg] rounded-[2rem] border-4 border-[#17142B] bg-[#DCCFFF] p-3 shadow-[12px_12px_0px_#17142B] sm:p-5">

            {/* Inner frame */}
            <div className="rounded-[1.5rem] border-4 border-[#17142B] bg-[#FFF9EF] p-4 sm:p-6">


              {/* Header */}
              <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-3 py-2 text-xs font-black shadow-[3px_3px_0px_#17142B] sm:text-sm">
                    TEAM INCOMING!
                  </div>

                  <Sparkles
                    size={21}
                    className="text-[#7046D9]"
                  />

                </div>

                <span className="hidden rotate-3 text-xs font-black text-[#514D62] sm:block">
                  ISSUE #01
                </span>

              </div>


              {/* ==================== CHARACTER ROW ==================== */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">

                {/* Character 1 */}
                <div className="group text-center">

                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#17142B] bg-[#F7A6C7] text-4xl shadow-[4px_4px_0px_#17142B] transition group-hover:-translate-y-2 sm:h-28 sm:w-28 sm:text-5xl">

                    👩🏻‍💻

                    <span className="absolute -right-2 -top-2 rounded-full border-2 border-[#17142B] bg-white px-1.5 py-0.5 text-[9px] font-black">
                      UI
                    </span>

                  </div>

                  <div className="mx-auto mt-3 w-fit rounded-md bg-[#17142B] px-2 py-1 text-[9px] font-black text-white sm:text-xs">
                    FRONTEND
                  </div>

                </div>


                {/* Character 2 */}
                <div className="group text-center">

                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#17142B] bg-[#BDE7D6] text-5xl shadow-[4px_4px_0px_#17142B] transition group-hover:-translate-y-2 sm:h-32 sm:w-32 sm:text-6xl">

                    👨🏻‍💻

                    <span className="absolute -right-2 -top-2 rounded-full border-2 border-[#17142B] bg-[#7046D9] px-1.5 py-0.5 text-[9px] font-black text-white">
                      API
                    </span>

                  </div>

                  <div className="mx-auto mt-3 w-fit rounded-md bg-[#7046D9] px-2 py-1 text-[9px] font-black text-white sm:text-xs">
                    BACKEND
                  </div>

                </div>


                {/* Character 3 */}
                <div className="group text-center">

                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#17142B] bg-[#FFD86B] text-4xl shadow-[4px_4px_0px_#17142B] transition group-hover:-translate-y-2 sm:h-28 sm:w-28 sm:text-5xl">

                    👩🏻‍🎨

                    <span className="absolute -right-2 -top-2 rounded-full border-2 border-[#17142B] bg-white px-1.5 py-0.5 text-[9px] font-black">
                      UX
                    </span>

                  </div>

                  <div className="mx-auto mt-3 w-fit rounded-md bg-[#17142B] px-2 py-1 text-[9px] font-black text-white sm:text-xs">
                    DESIGN
                  </div>

                </div>

              </div>


              {/* ==================== FUSION LINE ==================== */}
              <div className="my-6 flex items-center justify-center gap-2">

                <div className="h-0.5 flex-1 bg-[#17142B]" />

                <div className="flex items-center gap-1 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-3 py-1 text-[10px] font-black shadow-[2px_2px_0px_#17142B]">
                  <Zap size={12} />
                  FUSION
                </div>

                <div className="h-0.5 flex-1 bg-[#17142B]" />

              </div>


              {/* ==================== MATCH CARD ==================== */}
              <div className="relative overflow-hidden rounded-2xl border-4 border-[#17142B] bg-[#7046D9] p-4 text-white shadow-[5px_5px_0px_#17142B]">

                {/* Decorative burst */}
                <div className="absolute -right-8 -top-10 text-8xl font-black text-white/10">
                  ★
                </div>

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                      Compatibility
                    </p>

                    <p className="mt-1 text-4xl font-black">
                      92%
                    </p>

                    <p className="mt-1 text-xs font-bold text-white/80">
                      Skills that click!
                    </p>

                  </div>


                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-3 border-white bg-[#F05A47] shadow-[3px_3px_0px_#17142B]">
                    <Users size={25} />
                  </div>

                </div>


                {/* Progress */}
                <div className="mt-4 h-4 overflow-hidden rounded-full border-2 border-white bg-white/20">

                  <div className="h-full w-[92%] rounded-full bg-[#FFD86B]" />

                </div>

              </div>


              {/* Bottom caption */}
              <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-black sm:text-sm">

                <Star
                  size={15}
                  fill="currentColor"
                  className="text-[#F05A47]"
                />

                Find the skill. Fuse the team.

                <Star
                  size={15}
                  fill="currentColor"
                  className="text-[#F05A47]"
                />

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ==================== HOW IT WORKS ==================== */}
      <section className="border-y-4 border-[#17142B] bg-[#FFD86B] px-5 py-14 sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <div className="mb-3 inline-block -rotate-2 rounded-md border-2 border-[#17142B] bg-white px-3 py-1 text-xs font-black shadow-[3px_3px_0px_#17142B]">
                THE PLAYBOOK
              </div>

              <h3 className="text-4xl font-black tracking-tight sm:text-5xl">
                How the fuse works.
              </h3>

            </div>

            <p className="max-w-sm text-sm font-bold text-[#514D62]">
              Three simple moves from solo coder to project-ready team.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-3">

            {/* Step 1 */}
            <div className="group relative rounded-2xl border-4 border-[#17142B] bg-[#FFF9EF] p-6 shadow-[6px_6px_0px_#17142B] transition hover:-translate-y-2">

              <div className="absolute -right-3 -top-5 flex h-11 w-11 rotate-6 items-center justify-center rounded-full border-2 border-[#17142B] bg-[#F7A6C7] font-black shadow-[3px_3px_0px_#17142B]">
                01
              </div>

              <UserRoundPlus
                size={32}
                className="mb-5 text-[#7046D9]"
              />

              <h4 className="text-xl font-black">
                Create Your Profile
              </h4>

              <p className="mt-2 text-sm font-medium leading-6 text-[#514D62]">
                Tell TeamFuse what you can build and what kind of teammate you need.
              </p>

            </div>


            {/* Step 2 */}
            <div className="group relative rounded-2xl border-4 border-[#17142B] bg-[#BDE7D6] p-6 shadow-[6px_6px_0px_#17142B] transition hover:-translate-y-2">

              <div className="absolute -right-3 -top-5 flex h-11 w-11 -rotate-6 items-center justify-center rounded-full border-2 border-[#17142B] bg-[#FFD86B] font-black shadow-[3px_3px_0px_#17142B]">
                02
              </div>

              <Search
                size={32}
                className="mb-5"
              />

              <h4 className="text-xl font-black">
                Find Your Match
              </h4>

              <p className="mt-2 text-sm font-medium leading-6 text-[#514D62]">
                Search, filter and discover people whose skills complement yours.
              </p>

            </div>


            {/* Step 3 */}
            <div className="group relative rounded-2xl border-4 border-[#17142B] bg-[#DCCFFF] p-6 shadow-[6px_6px_0px_#17142B] transition hover:-translate-y-2">

              <div className="absolute -right-3 -top-5 flex h-11 w-11 rotate-6 items-center justify-center rounded-full border-2 border-[#17142B] bg-[#F05A47] font-black text-white shadow-[3px_3px_0px_#17142B]">
                03
              </div>

              <Sparkles
                size={32}
                className="mb-5 text-[#7046D9]"
              />

              <h4 className="text-xl font-black">
                Build Together
              </h4>

              <p className="mt-2 text-sm font-medium leading-6 text-[#514D62]">
                Fuse your team and instantly see which skills are covered or missing.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================== FINAL CTA ==================== */}
      <section className="bg-[#17142B] px-5 py-16 text-white sm:px-6">

        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl border-4 border-white/20 bg-[#7046D9] p-7 shadow-[8px_8px_0px_#F05A47] sm:p-10 lg:flex-row lg:items-center">

          <div>

            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#FFD86B]">
              READY TO FUSE?
            </div>

            <h3 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
              Your project needs more than just you.
            </h3>

            <p className="mt-3 max-w-xl text-sm font-medium text-white/75 sm:text-base">
              Find people who bring the skills your team is missing.
            </p>

          </div>


          <Link
            to="/create-profile"
            className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-6 py-4 font-black text-[#17142B] shadow-[5px_5px_0px_#17142B] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Start Building
            <ArrowRight size={19} />
          </Link>

        </div>

      </section>


      {/* ==================== FOOTER ==================== */}
      <footer className="border-t-2 border-[#17142B] bg-[#17142B] px-5 py-6 text-center text-xs font-bold text-white/50">
        TeamFuse © 2026 · Find. Fuse. Build.
      </footer>

    </div>
  )
}

export default Home