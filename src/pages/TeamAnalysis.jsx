import {
  ArrowLeft,
  Check,
  Users,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

function TeamAnalysis() {
  const navigate = useNavigate()

  const team = JSON.parse(
    localStorage.getItem("teamfuseTeam") || "[]"
  )

  const allSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "Machine Learning",
    "UI/UX",
    "Figma",
  ]

  const coveredSkills = [
    ...new Set(
      team.flatMap((member) => member.skills)
    ),
  ]

  const missingSkills = allSkills.filter(
    (skill) => !coveredSkills.includes(skill)
  )

  const skillCoverage = Math.round(
    (coveredSkills.length / allSkills.length) * 100
  )

  const uniqueRoles = [
    ...new Set(team.map((member) => member.role)),
  ]

  if (team.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9EF] px-5 py-10 text-[#17142B]">
        <div className="mx-auto max-w-3xl">

          <button
            onClick={() => navigate("/find-teammates")}
            className="mb-8 flex items-center gap-2 font-black transition hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
            Find Teammates
          </button>

          <div className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-10 text-center shadow-[9px_9px_0_#17142B]">

            <div className="text-6xl">
              💥
            </div>

            <h1 className="mt-5 text-4xl font-black">
              WHOOPS!
            </h1>

            <p className="mt-3 text-lg font-bold">
              Your team is empty.
              <br />
              Go recruit some teammates first!
            </p>

            <button
              onClick={() => navigate("/find-teammates")}
              className="mt-7 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-6 py-3 font-black text-white shadow-[5px_5px_0_#17142B] transition hover:-translate-y-1"
            >
              Find Teammates →
            </button>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9EF] px-5 py-8 pb-14 text-[#17142B]">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <button
            onClick={() => navigate("/find-teammates")}
            className="flex items-center gap-2 font-black transition hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-2 rounded-full border-2 border-[#17142B] bg-[#BDE7D6] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            <Zap size={17} />
            STEP 03
          </div>

        </div>

        {/* Hero */}
        <div className="relative mb-10">

          <div className="mb-4 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            <Sparkles size={17} />
            TEAM ANALYSIS
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Your Dream Team
            <span className="ml-2">
              💥
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-lg font-bold text-[#17142B]/70">
            Let's see what happens when your skills come together.
          </p>

        </div>

        {/* Stats */}
        <section className="mb-10 grid gap-5 md:grid-cols-3">

          {/* Members */}
          <div className="rotate-[-1deg] rounded-3xl border-4 border-[#17142B] bg-[#FFD86B] p-5 shadow-[7px_7px_0_#17142B]">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-black uppercase tracking-wider">
                  Squad Size
                </p>

                <p className="mt-1 text-4xl font-black">
                  {team.length}
                </p>

                <p className="font-bold">
                  Team Members
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white">
                <Users size={26} />
              </div>

            </div>

          </div>

          {/* Skills */}
          <div className="rotate-[1deg] rounded-3xl border-4 border-[#17142B] bg-[#BDE7D6] p-5 shadow-[7px_7px_0_#17142B]">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-black uppercase tracking-wider">
                  Skill Power
                </p>

                <p className="mt-1 text-4xl font-black">
                  {skillCoverage}%
                </p>

                <p className="font-bold">
                  Coverage
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white">
                <Target size={26} />
              </div>

            </div>

          </div>

          {/* Roles */}
          <div className="rotate-[-1deg] rounded-3xl border-4 border-[#17142B] bg-[#DCCFFF] p-5 shadow-[7px_7px_0_#17142B]">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-black uppercase tracking-wider">
                  Role Mix
                </p>

                <p className="mt-1 text-4xl font-black">
                  {uniqueRoles.length}
                </p>

                <p className="font-bold">
                  Different Roles
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white">
                <Sparkles size={26} />
              </div>

            </div>

          </div>

        </section>

        {/* Team Members */}
        <section className="mb-10">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#F7A6C7] shadow-[3px_3px_0_#17142B]">
              <Users size={21} />
            </div>

            <div>
              <h2 className="text-3xl font-black">
                Team Members
              </h2>

              <p className="font-bold opacity-60">
                The people powering your squad
              </p>
            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {team.map((member) => (

              <div
                key={member.id}
                className={`rounded-3xl border-4 border-[#17142B] ${member.color} p-5 shadow-[7px_7px_0_#17142B] transition hover:-translate-y-2 hover:shadow-[9px_9px_0_#17142B]`}
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white text-4xl shadow-[2px_2px_0_#17142B]">
                    {member.emoji}
                  </div>

                  <div>

                    <h3 className="text-2xl font-black">
                      {member.name}
                    </h3>

                    <p className="font-bold">
                      {member.role}
                    </p>

                    <p className="text-sm font-bold opacity-60">
                      {member.experience}
                    </p>

                  </div>

                </div>

                <div className="mt-5 flex flex-wrap gap-2">

                  {member.skills.map((skill) => (

                    <span
                      key={skill}
                      className="rounded-full border-2 border-[#17142B] bg-white px-3 py-1 text-xs font-black"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* Skill Analysis */}
        <section className="mb-8">

          <div className="mb-5">

            <h2 className="text-3xl font-black">
              Skill Breakdown
            </h2>

            <p className="mt-1 font-bold text-[#17142B]/60">
              See what your squad can handle.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Covered */}
            <div className="rounded-3xl border-4 border-[#17142B] bg-[#BDE7D6] p-6 shadow-[7px_7px_0_#17142B]">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white">
                    <Check size={22} />
                  </div>

                  <div>

                    <h2 className="text-2xl font-black">
                      Skills Covered
                    </h2>

                    <p className="font-bold">
                      {coveredSkills.length} / {allSkills.length}
                    </p>

                  </div>

                </div>

                <div className="text-3xl font-black">
                  {skillCoverage}%
                </div>

              </div>

              {/* Progress */}
              <div className="mb-5 h-4 overflow-hidden rounded-full border-2 border-[#17142B] bg-white">

                <div
                  className="h-full rounded-full bg-[#17142B] transition-all duration-700"
                  style={{
                    width: `${skillCoverage}%`,
                  }}
                />

              </div>

              <div className="flex flex-wrap gap-3">

                {coveredSkills.map((skill) => (

                  <span
                    key={skill}
                    className="rounded-xl border-2 border-[#17142B] bg-white px-4 py-2 font-black shadow-[3px_3px_0_#17142B]"
                  >
                    ✓ {skill}
                  </span>

                ))}

              </div>

            </div>

            {/* Missing */}
            <div className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-6 shadow-[7px_7px_0_#17142B]">

              <div className="mb-5">

                <h2 className="text-2xl font-black">
                  🎯 Skills To Consider
                </h2>

                <p className="mt-1 font-bold">
                  Areas that could make the team stronger.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                {missingSkills.length > 0 ? (

                  missingSkills.map((skill) => (

                    <span
                      key={skill}
                      className="rounded-xl border-2 border-[#17142B] bg-white px-4 py-2 font-black shadow-[3px_3px_0_#17142B]"
                    >
                      + {skill}
                    </span>

                  ))

                ) : (

                  <div className="w-full rounded-2xl border-2 border-[#17142B] bg-white p-5 text-center">

                    <div className="text-4xl">
                      🎉
                    </div>

                    <p className="mt-2 font-black">
                      Full skill coverage!
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </section>

        {/* TeamFuse Verdict */}
        <section className="relative overflow-hidden rounded-3xl border-4 border-[#17142B] bg-[#7046D9] p-7 text-white shadow-[9px_9px_0_#17142B]">

          {/* Comic decoration */}
          <div className="absolute -right-4 -top-5 rotate-12 text-7xl opacity-20">
            ⚡
          </div>

          <div className="relative">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-white bg-white/10">
                <Zap size={17} />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.2em]">
                TeamFuse Verdict
              </p>

            </div>

            <h2 className="mt-4 max-w-3xl text-3xl font-black md:text-4xl">

              {missingSkills.length === 0
                ? "Your squad covers the full skill map! 🚀"
                : "Your squad is taking shape! 🔥"}

            </h2>

            <p className="mt-3 max-w-2xl text-lg font-bold text-white/90">

              {missingSkills.length === 0
                ? "Your selected teammates collectively cover all the core skills in our current skill map."
                : `Your team currently covers ${coveredSkills.length} core skills. Adding someone with ${missingSkills[0]} could expand your skill coverage.`}

            </p>

            <div className="mt-6 flex flex-wrap gap-4">

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">

                <p className="text-2xl font-black">
                  {team.length}
                </p>

                <p className="text-sm font-bold">
                  Team Members
                </p>

              </div>

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">

                <p className="text-2xl font-black">
                  {coveredSkills.length}
                </p>

                <p className="text-sm font-bold">
                  Skills Covered
                </p>

              </div>

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">

                <p className="text-2xl font-black">
                  {uniqueRoles.length}
                </p>

                <p className="text-sm font-bold">
                  Roles
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* Bottom Action */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <button
            onClick={() => navigate("/find-teammates")}
            className="rounded-2xl border-4 border-[#17142B] bg-[#FFD86B] px-7 py-4 text-lg font-black shadow-[6px_6px_0_#17142B] transition hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            ← Add More Teammates
          </button>

        </div>

      </div>

    </div>
  )
}

export default TeamAnalysis