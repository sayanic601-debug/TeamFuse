import {
  ArrowRight,
  Search,
  Users,
  Sparkles,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FFF9EF] text-[#17142B]">

      {/* ==================== NAVBAR ==================== */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

        {/* Logo */}
        <Link to="/" className="relative">
          <h1 className="text-3xl font-black tracking-tight">
            Team<span className="text-[#7046D9]">Fuse</span>
          </h1>

          <span className="absolute -right-5 -top-2 text-xl">
            ✦
          </span>
        </Link>


        {/* Navigation */}
        <div className="hidden items-center gap-8 font-semibold md:flex">

          <Link
            to="/"
            className="border-b-2 border-[#7046D9] pb-1"
          >
            Home
          </Link>

          <Link
            to="/create-profile"
            className="transition hover:text-[#7046D9]"
          >
            Create Profile
          </Link>

          <Link
            to="/find-teammates"
            className="transition hover:text-[#7046D9]"
          >
            Find Teammates
          </Link>

        </div>


        {/* Get Started */}
        <Link
          to="/create-profile"
          className="flex items-center gap-2 rounded-full border-2 border-[#17142B] bg-[#7046D9] px-5 py-2.5 font-bold text-white shadow-[4px_4px_0px_#17142B] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          Get Started
          <ArrowRight size={18} />
        </Link>

      </nav>


      {/* ==================== HERO ==================== */}
      <main className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-2">


        {/* ==================== LEFT SIDE ==================== */}
        <section>

          {/* Badge */}
          <div className="mb-6 inline-block rotate-[-2deg] rounded-lg border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0px_#17142B]">
            ✦ SMART TEAM BUILDING
          </div>


          {/* Heading */}
          <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">

            Find the
            <br />

            <span className="relative inline-block text-[#7046D9]">
              right people.

              <span className="absolute -bottom-2 left-0 h-2 w-full rotate-[-2deg] rounded-full bg-[#17142B]" />
            </span>

            <br />

            Fuse the
            <br />

            <span className="text-[#F05A47]">
              perfect team.
            </span>

          </h2>


          {/* Description */}
          <p className="mt-8 max-w-xl text-lg font-medium leading-8 text-[#514D62]">
            TeamFuse helps students discover teammates based on
            skills, roles and project requirements.
          </p>


          {/* ==================== CTA BUTTONS ==================== */}
          <div className="mt-8 flex flex-wrap gap-4">

            {/* Create Profile */}
            <Link
              to="/create-profile"
              className="flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-6 py-3.5 font-bold text-white shadow-[5px_5px_0px_#17142B] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Create Profile
              <ArrowRight size={19} />
            </Link>


            {/* Find Teammates */}
            <Link
              to="/find-teammates"
              className="flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-white px-6 py-3.5 font-bold shadow-[5px_5px_0px_#17142B] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Search size={19} />
              Find Teammates
            </Link>

          </div>


          {/* Handwritten Note */}
          <div className="mt-10 rotate-[-3deg] font-bold text-[#514D62]">
            Different skills.
            <br />
            Same goal. →
          </div>

        </section>


        {/* ==================== RIGHT SIDE ==================== */}
        <section className="relative">

          {/* Decorative Circle */}
          <div className="absolute -left-5 top-8 h-24 w-24 rounded-full bg-[#BDE7D6]" />

          {/* Decorative Star */}
          <div className="absolute right-4 top-0 text-5xl text-[#F05A47]">
            ✦
          </div>

          {/* Decorative Square */}
          <div className="absolute bottom-10 right-0 h-20 w-20 rotate-12 rounded-2xl bg-[#FFD86B]" />


          {/* ==================== COMIC PANEL ==================== */}
          <div className="relative rotate-[1deg] rounded-[2rem] border-4 border-[#17142B] bg-[#DCCFFF] p-5 shadow-[10px_10px_0px_#17142B]">

            <div className="rounded-[1.5rem] border-4 border-[#17142B] bg-[#FFF9EF] p-6">


              {/* Panel Heading */}
              <div className="mb-5 flex items-center justify-between">

                <div className="rounded-lg border-2 border-[#17142B] bg-[#FFD86B] px-3 py-1.5 font-black">
                  TEAM INCOMING!
                </div>

                <Sparkles className="text-[#7046D9]" />

              </div>


              {/* ==================== PEOPLE ==================== */}
              <div className="flex items-end justify-center gap-3">


                {/* Frontend */}
                <div className="text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#17142B] bg-[#F7A6C7] text-4xl">
                    👩🏻‍💻
                  </div>

                  <div className="mt-2 rounded-md bg-[#17142B] px-2 py-1 text-xs font-bold text-white">
                    FRONTEND
                  </div>

                </div>


                {/* Backend */}
                <div className="text-center">

                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#17142B] bg-[#BDE7D6] text-5xl">
                    👨🏻‍💻
                  </div>

                  <div className="mt-2 rounded-md bg-[#7046D9] px-2 py-1 text-xs font-bold text-white">
                    BACKEND
                  </div>

                </div>


                {/* UI/UX */}
                <div className="text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#17142B] bg-[#FFD86B] text-4xl">
                    👩🏻‍🎨
                  </div>

                  <div className="mt-2 rounded-md bg-[#17142B] px-2 py-1 text-xs font-bold text-white">
                    UI/UX
                  </div>

                </div>

              </div>


              {/* ==================== MATCH CARD ==================== */}
              <div className="mt-7 rounded-2xl border-4 border-[#17142B] bg-[#7046D9] p-4 text-white">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase opacity-80">
                      Compatibility
                    </p>

                    <p className="text-3xl font-black">
                      92%
                    </p>

                  </div>


                  <div className="rounded-full border-2 border-white p-3">
                    <Users size={24} />
                  </div>

                </div>


                {/* Progress Bar */}
                <div className="mt-3 h-3 rounded-full border-2 border-white bg-white/20">

                  <div className="h-full w-[92%] rounded-full bg-[#FFD86B]" />

                </div>

              </div>


              {/* Bottom Text */}
              <div className="mt-5 flex items-center justify-center gap-2 font-black">

                <Zap
                  size={18}
                  className="text-[#F05A47]"
                />

                Skills that click. Teams that work.

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ==================== FEATURES ==================== */}
      <section className="border-t-2 border-[#17142B] bg-[#17142B] px-6 py-10 text-white">

        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">


          {/* Feature 1 */}
          <div className="rounded-2xl border-2 border-white/20 p-5 transition hover:-translate-y-1">

            <Users
              className="mb-4 text-[#FFD86B]"
              size={28}
            />

            <h3 className="text-xl font-black">
              Create Your Profile
            </h3>

            <p className="mt-2 text-sm text-white/60">
              Showcase your skills, role and experience.
            </p>

          </div>


          {/* Feature 2 */}
          <div className="rounded-2xl border-2 border-white/20 p-5 transition hover:-translate-y-1">

            <Search
              className="mb-4 text-[#BDE7D6]"
              size={28}
            />

            <h3 className="text-xl font-black">
              Find Your Match
            </h3>

            <p className="mt-2 text-sm text-white/60">
              Discover people whose skills complete yours.
            </p>

          </div>


          {/* Feature 3 */}
          <div className="rounded-2xl border-2 border-white/20 p-5 transition hover:-translate-y-1">

            <Sparkles
              className="mb-4 text-[#F7A6C7]"
              size={28}
            />

            <h3 className="text-xl font-black">
              Build Together
            </h3>

            <p className="mt-2 text-sm text-white/60">
              Combine different skills and create something awesome.
            </p>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Home