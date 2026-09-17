import {
  ArrowLeft,
  Check,
  Users,
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  AlertTriangle,
  BriefcaseBusiness,
  UserRoundPlus,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

function TeamAnalysis() {
  const navigate = useNavigate()

  const team = JSON.parse(
    localStorage.getItem("teamfuseTeam") || "[]"
  )

  const profile = JSON.parse(
    localStorage.getItem("teamfuseProfile") || "null"
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
      team.flatMap((member) => member.skills || [])
    ),
  ]

  const missingSkills = allSkills.filter(
    (skill) => !coveredSkills.includes(skill)
  )

  const skillCoverage =
    allSkills.length > 0
      ? Math.round(
          (coveredSkills.length / allSkills.length) * 100
        )
      : 0

  const uniqueRoles = [
    ...new Set(team.map((member) => member.role)),
  ]

  // Project Goal
  const projectGoal = profile?.projectGoal || "Project"

  const sameGoalMembers = team.filter(
    (member) => member.projectGoal === projectGoal
  )

  const projectGoalMatch =
    team.length > 0
      ? Math.round(
          (sameGoalMembers.length / team.length) * 100
        )
      : 0

  // Team Compatibility
  const calculateCompatibility = () => {
    if (team.length === 0) return 0

    let score = 0

    const skillScore = Math.min(
      40,
      coveredSkills.length * 6
    )

    score += skillScore

    const roleScore = Math.min(
      25,
      uniqueRoles.length * 8
    )

    score += roleScore

    score += Math.round(
      projectGoalMatch * 0.2
    )

    const experiences = [
      ...new Set(
        team.map((member) => member.experience)
      ),
    ]

    const experienceScore = Math.min(
      15,
      experiences.length * 5
    )

    score += experienceScore

    return Math.min(100, Math.round(score))
  }

  const compatibilityScore =
    calculateCompatibility()

  // Team Readiness
  const calculateReadiness = () => {
    if (team.length === 0) return 0

    let score = 0

    score += Math.round(
      skillCoverage * 0.5
    )

    score += Math.min(
      20,
      uniqueRoles.length * 7
    )

    score += Math.round(
      projectGoalMatch * 0.2
    )

    if (team.length >= 3) {
      score += 10
    } else if (team.length === 2) {
      score += 5
    }

    return Math.min(100, Math.round(score))
  }

  const readinessScore = calculateReadiness()

  const getReadinessLabel = () => {
    if (readinessScore >= 80) {
      return "READY TO BUILD 🚀"
    }

    if (readinessScore >= 60) {
      return "ALMOST READY 🔥"
    }

    return "NEEDS A BOOST ⚡"
  }

  const getCompatibilityLabel = () => {
    if (compatibilityScore >= 80) {
      return "Highly Compatible"
    }

    if (compatibilityScore >= 60) {
      return "Good Compatibility"
    }

    return "Growing Compatibility"
  }

  // Empty State
  if (team.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9EF] px-5 py-10 text-[#17142B]">

        <div className="mx-auto max-w-3xl">

          <button
            onClick={() =>
              navigate("/find-teammates")
            }
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
              onClick={() =>
                navigate("/find-teammates")
              }
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
            onClick={() =>
              navigate("/find-teammates")
            }
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

          <div className="flex flex-wrap items-end gap-4">

            <div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                Your Dream Team 💥
              </h1>

              <p className="mt-3 max-w-2xl text-lg font-bold text-[#17142B]/70">
                Let's see what happens when your skills come together.
              </p>

            </div>

            <div className="mb-2 rotate-3 rounded-xl border-2 border-[#17142B] bg-[#F7A6C7] px-4 py-2 text-xs font-black shadow-[4px_4px_0_#17142B]">
              TEAM: FUSED!
            </div>

          </div>

        </div>

        {/* Project Goal */}
        <section className="mb-8 rounded-3xl border-4 border-[#17142B] bg-[#DCCFFF] p-5 shadow-[7px_7px_0_#17142B]">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white shadow-[3px_3px_0_#17142B]">
                <Target size={23} />
              </div>

              <div>

                <p className="text-xs font-black uppercase tracking-wider opacity-60">
                  Project Goal
                </p>

                <h2 className="text-2xl font-black">
                  {projectGoal}
                </h2>

              </div>

            </div>

            <div className="rounded-xl border-2 border-[#17142B] bg-white px-4 py-3 font-black shadow-[3px_3px_0_#17142B]">
              {sameGoalMembers.length}/{team.length} aligned
            </div>

          </div>

        </section>

        {/* Smart Stats */}
        <section className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {/* Squad Size */}
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

          {/* Skill Coverage */}
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

          {/* Compatibility */}
          <div className="rotate-[-1deg] rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-5 shadow-[7px_7px_0_#17142B]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider">
                  Team Fit
                </p>

                <p className="mt-1 text-4xl font-black">
                  {compatibilityScore}%
                </p>

                <p className="font-bold">
                  Compatibility
                </p>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white">
                <Sparkles size={26} />
              </div>

            </div>

          </div>

          {/* Readiness */}
          <div className="rotate-[1deg] rounded-3xl border-4 border-[#17142B] bg-[#DCCFFF] p-5 shadow-[7px_7px_0_#17142B]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider">
                  Readiness
                </p>

                <p className="mt-1 text-4xl font-black">
                  {readinessScore}%
                </p>

                <p className="font-bold">
                  {getReadinessLabel()}
                </p>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white">
                <Zap size={26} />
              </div>

            </div>

          </div>

        </section>

        {/* Compatibility + Readiness */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">

          {/* Team Compatibility */}
          <div className="rounded-3xl border-4 border-[#17142B] bg-white p-6 shadow-[7px_7px_0_#17142B]">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#F7A6C7]">
                    <Sparkles size={21} />
                  </div>

                  <h2 className="text-2xl font-black">
                    Team Compatibility
                  </h2>

                </div>

                <p className="mt-2 font-bold opacity-60">
                  How well the selected teammates fit together.
                </p>

              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3 py-2 text-xl font-black shadow-[3px_3px_0_#17142B]">
                {compatibilityScore}%
              </div>

            </div>

            <div className="mt-5 h-5 overflow-hidden rounded-full border-2 border-[#17142B] bg-[#FFF9EF]">

              <div
                className="h-full rounded-full bg-[#7046D9] transition-all duration-700"
                style={{
                  width: `${compatibilityScore}%`,
                }}
              />

            </div>

            <div className="mt-4 flex items-center gap-2">

              <ShieldCheck size={18} />

              <p className="font-black">
                {getCompatibilityLabel()}
              </p>

            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">

              <div className="rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] p-3">

                <p className="text-2xl font-black">
                  {coveredSkills.length}
                </p>

                <p className="text-xs font-black">
                  Skills
                </p>

              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B] p-3">

                <p className="text-2xl font-black">
                  {uniqueRoles.length}
                </p>

                <p className="text-xs font-black">
                  Roles
                </p>

              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#DCCFFF] p-3">

                <p className="text-2xl font-black">
                  {projectGoalMatch}%
                </p>

                <p className="text-xs font-black">
                  Goal Fit
                </p>

              </div>

            </div>

          </div>

          {/* Team Readiness */}
          <div className="rounded-3xl border-4 border-[#17142B] bg-[#BDE7D6] p-6 shadow-[7px_7px_0_#17142B]">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white">
                    <Zap size={21} />
                  </div>

                  <h2 className="text-2xl font-black">
                    Team Readiness
                  </h2>

                </div>

                <p className="mt-2 font-bold text-[#17142B]/70">
                  Is your squad ready to start building?
                </p>

              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-white px-3 py-2 text-xl font-black shadow-[3px_3px_0_#17142B]">
                {readinessScore}%
              </div>

            </div>

            <div className="mt-5 h-5 overflow-hidden rounded-full border-2 border-[#17142B] bg-white">

              <div
                className="h-full rounded-full bg-[#17142B] transition-all duration-700"
                style={{
                  width: `${readinessScore}%`,
                }}
              />

            </div>

            <div className="mt-5 rounded-2xl border-2 border-[#17142B] bg-white p-4">

              <p className="text-xl font-black">
                {getReadinessLabel()}
              </p>

              <p className="mt-1 text-sm font-bold opacity-60">

                {missingSkills.length === 0
                  ? "Your team covers the current core skill map."
                  : `Consider adding someone with ${missingSkills[0]} to close a skill gap.`}

              </p>

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

                {member.projectGoal && (
                  <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-[#17142B] bg-white/70 px-3 py-2">

                    <span className="text-xs font-black uppercase">
                      Goal
                    </span>

                    <span className="text-xs font-black">
                      {member.projectGoal}
                    </span>

                  </div>
                )}

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
        <section className="mb-10">

          <div className="mb-5">

            <h2 className="text-3xl font-black">
              Skill Breakdown
            </h2>

            <p className="mt-1 font-bold text-[#17142B]/60">
              See what your squad can handle.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Covered Skills */}
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

            {/* Missing Skills */}
            <div className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-6 shadow-[7px_7px_0_#17142B]">

              <div className="mb-5 flex items-start justify-between gap-3">

                <div>

                  <h2 className="text-2xl font-black">
                    🎯 Skills To Consider
                  </h2>

                  <p className="mt-1 font-bold">
                    Areas that could make the team stronger.
                  </p>

                </div>

                {missingSkills.length > 0 && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white">
                    <AlertTriangle size={20} />
                  </div>
                )}

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

        {/* Team Roles */}
        <section className="mb-10 rounded-3xl border-4 border-[#17142B] bg-white p-6 shadow-[7px_7px_0_#17142B]">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFD86B]">
              <BriefcaseBusiness size={21} />
            </div>

            <div>

              <h2 className="text-2xl font-black">
                Role Mix
              </h2>

              <p className="font-bold opacity-60">
                Different roles bring different strengths.
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            {uniqueRoles.map((role) => (

              <div
                key={role}
                className="flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-black shadow-[3px_3px_0_#17142B]"
              >
                <UserRoundPlus size={17} />
                {role}
              </div>

            ))}

          </div>

        </section>

        {/* TeamFuse Verdict */}
        <section className="relative overflow-hidden rounded-3xl border-4 border-[#17142B] bg-[#7046D9] p-7 text-white shadow-[9px_9px_0_#17142B]">

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

              {readinessScore >= 80
                ? "Your squad is ready to make some noise! 🚀"
                : readinessScore >= 60
                ? "Your squad is taking serious shape! 🔥"
                : "You've got the foundation — now fill the gaps! ⚡"}

            </h2>

            <p className="mt-3 max-w-2xl text-lg font-bold text-white/90">

              {missingSkills.length === 0
                ? `Your team covers all ${allSkills.length} core skills in the current skill map.`
                : `Your team covers ${coveredSkills.length} of ${allSkills.length} core skills. Adding ${missingSkills[0]} expertise could expand your coverage.`}

            </p>

            <div className="mt-6 flex flex-wrap gap-4">

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">

                <p className="text-2xl font-black">
                  {compatibilityScore}%
                </p>

                <p className="text-sm font-bold">
                  Compatibility
                </p>

              </div>

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">

                <p className="text-2xl font-black">
                  {skillCoverage}%
                </p>

                <p className="text-sm font-bold">
                  Skill Coverage
                </p>

              </div>

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">

                <p className="text-2xl font-black">
                  {readinessScore}%
                </p>

                <p className="text-sm font-bold">
                  Readiness
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* Bottom Action */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <button
            onClick={() =>
              navigate("/find-teammates")
            }
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