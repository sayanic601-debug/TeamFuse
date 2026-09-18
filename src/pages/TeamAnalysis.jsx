import {
  ArrowLeft,
  Check,
  Users,
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  UserPlus,
  ArrowRight,
  Flame,
  Star,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const demoUsers = [
  {
    id: 1,
    name: "Rahul",
    role: "Backend Developer",
    experience: "Intermediate",
    projectGoal: "Hackathon",
    skills: ["Node.js", "MongoDB", "Express"],
    emoji: "👨🏻‍💻",
    color: "bg-[#BDE7D6]",
  },
  {
    id: 2,
    name: "Ananya",
    role: "ML Engineer",
    experience: "Advanced",
    projectGoal: "Startup",
    skills: ["Python", "Machine Learning", "Figma"],
    emoji: "👩🏻‍🔬",
    color: "bg-[#FFD86B]",
  },
  {
    id: 3,
    name: "Riya",
    role: "UI/UX Designer",
    experience: "Intermediate",
    projectGoal: "College Project",
    skills: ["UI/UX", "Figma", "React"],
    emoji: "👩🏻‍🎨",
    color: "bg-[#F7A6C7]",
  },
  {
    id: 4,
    name: "Arjun",
    role: "Full Stack Developer",
    experience: "Advanced",
    projectGoal: "Hackathon",
    skills: ["React", "Node.js", "MongoDB"],
    emoji: "👨🏻‍💻",
    color: "bg-[#DCCFFF]",
  },
  {
    id: 5,
    name: "Sneha",
    role: "Frontend Developer",
    experience: "Beginner",
    projectGoal: "Personal Project",
    skills: ["React", "Java", "UI/UX"],
    emoji: "👩🏻‍💻",
    color: "bg-[#FFD6CE]",
  },
  {
    id: 6,
    name: "Aditya",
    role: "Backend Developer",
    experience: "Intermediate",
    projectGoal: "Open Source",
    skills: ["Python", "Node.js", "MongoDB"],
    emoji: "👨🏻‍💻",
    color: "bg-[#BDE7D6]",
  },
]

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
    ...new Set(team.flatMap((member) => member.skills || [])),
  ]

  const missingSkills = allSkills.filter(
    (skill) => !coveredSkills.includes(skill)
  )

  const skillCoverage =
    allSkills.length > 0
      ? Math.min(
          100,
          Math.round((coveredSkills.length / allSkills.length) * 100)
        )
      : 0

  const uniqueRoles = [
    ...new Set(team.map((member) => member.role).filter(Boolean)),
  ]

  // Project Goal
  const projectGoal = profile?.projectGoal || team[0]?.projectGoal || "Project"

  const sameGoalMembers = team.filter(
    (member) => member.projectGoal === projectGoal
  )

  const projectGoalMatch =
    team.length > 0
      ? Math.round((sameGoalMembers.length / team.length) * 100)
      : 0

  // Team Compatibility calculation
  const calculateCompatibility = () => {
    if (team.length === 0) return 0

    let score = 0

    const skillScore = Math.min(40, coveredSkills.length * 6)
    score += skillScore

    const roleScore = Math.min(25, uniqueRoles.length * 8)
    score += roleScore

    score += Math.round(projectGoalMatch * 0.2)

    const experiences = [
      ...new Set(team.map((member) => member.experience)),
    ]

    const experienceScore = Math.min(15, experiences.length * 5)
    score += experienceScore

    return Math.min(100, Math.round(score))
  }

  const compatibilityScore = calculateCompatibility()

  // Team Readiness calculation
  const calculateReadiness = () => {
    if (team.length === 0) return 0

    let score = 0

    score += Math.round(skillCoverage * 0.5)

    score += Math.min(20, uniqueRoles.length * 7)

    score += Math.round(projectGoalMatch * 0.2)

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

  // Candidates who can fill missing skills
  const availableCandidates = demoUsers.filter(
    (candidate) => !team.some((member) => member.id === candidate.id)
  )

  const recommendedCandidates = availableCandidates
    .map((candidate) => {
      const matchingGapSkills = (candidate.skills || []).filter((skill) =>
        missingSkills.includes(skill)
      )
      return {
        ...candidate,
        gapSkills: matchingGapSkills,
      }
    })
    .filter((candidate) => candidate.gapSkills.length > 0)
    .sort((a, b) => b.gapSkills.length - a.gapSkills.length)

  const handleAddCandidate = (candidate) => {
    const updatedTeam = [...team, candidate]
    localStorage.setItem("teamfuseTeam", JSON.stringify(updatedTeam))
    window.location.reload()
  }

  // Empty State: Comic Style
  if (team.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF8E8] px-5 py-12 text-[#17142B] selection:bg-[#FFD86B] selection:text-[#17142B]">
        <div className="mx-auto max-w-xl">
          <button
            onClick={() => navigate("/find-teammates")}
            className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 transition hover:text-[#7046D9]"
          >
            <ArrowLeft size={16} />
            Back to Teammates
          </button>

          <div className="rounded-2xl border-2 border-[#17142B] bg-white p-10 text-center shadow-[6px_6px_0_#17142B]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-[#F7A6C7] text-3xl shadow-[3px_3px_0_#17142B]">
              💥
            </div>

            <div className="mt-5 inline-block rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#17142B]">
              ISSUE PENDING
            </div>

            <h1 className="mt-3 text-3xl font-black uppercase text-[#17142B]">
              No Squad Yet!
            </h1>

            <p className="mt-2 text-sm font-bold text-slate-600 leading-relaxed">
              Your story starts with your first teammate. Recruit allies from the recruitment
              wall to activate your team scoreboard.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/find-teammates")}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Find Teammates
                <ArrowRight size={15} />
              </button>

              {profile && (
                <button
                  onClick={() => navigate("/create-profile")}
                  className="rounded-xl border-2 border-[#17142B] bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E8] px-5 py-8 pb-16 text-[#17142B] selection:bg-[#FFD86B] selection:text-[#17142B]">
      <div className="mx-auto max-w-6xl">
        {/* Header Navigation & Comic Issue Badge */}
        <header className="mb-8 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-4">
          <button
            onClick={() => navigate("/find-teammates")}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 transition hover:text-[#7046D9]"
          >
            <ArrowLeft size={16} />
            Back to Teammates
          </button>

          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#17142B]">
            <Zap size={13} fill="currentColor" />
            FINAL SCOREBOARD · ISSUE #01
          </div>
        </header>

        {/* Hero: Comic Scoreboard Header */}
        <section className="relative mb-8">
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 bg-halftone-purple opacity-50" />

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-3 py-0.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
            <Sparkles size={13} />
            SQUAD SCOREBOARD
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-[#17142B] sm:text-4xl lg:text-5xl">
                Your Dream Team
              </h1>
              <p className="mt-2 text-sm font-bold text-slate-600">
                Let's see what happens when your skills and superpowers fuse together!
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] px-3.5 py-1.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Flame size={14} className="text-amber-700" />
              TEAM: FUSED & READY!
            </div>
          </div>
        </section>

        {/* Project Goal Mission Badge Card */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-5 shadow-[4px_4px_0_#17142B]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#DCCFFF] text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Target size={24} />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#7046D9]">
                  PROJECT MISSION BADGE
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#17142B]">
                  MISSION: {projectGoal}
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-4 py-2 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B] sm:self-center">
              <span className="h-2 w-2 rounded-full bg-[#7046D9]" />
              {sameGoalMembers.length} of {team.length} ALLIES ALIGNED
            </div>
          </div>
        </section>

        {/* Comic Stat Blocks Grid */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Squad Size */}
          <div className="rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] p-5 shadow-[4px_4px_0_#17142B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#17142B]/70">
                  SQUAD SIZE
                </p>
                <p className="mt-1 text-3xl font-black text-[#17142B]">
                  {team.length}
                </p>
                <p className="text-xs font-black uppercase text-[#17142B]/80">
                  Builders
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Users size={22} />
              </div>
            </div>
          </div>

          {/* Skill Power */}
          <div className="rounded-2xl border-2 border-[#17142B] bg-[#BDE7D6] p-5 shadow-[4px_4px_0_#17142B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#17142B]/70">
                  TEAM POWER
                </p>
                <p className="mt-1 text-3xl font-black text-[#17142B]">
                  {skillCoverage}%
                </p>
                <p className="text-xs font-black uppercase text-[#17142B]/80">
                  Coverage
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Target size={22} />
              </div>
            </div>
          </div>

          {/* Team Fit */}
          <div className="rounded-2xl border-2 border-[#17142B] bg-[#F7A6C7] p-5 shadow-[4px_4px_0_#17142B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#17142B]/70">
                  TEAM FIT
                </p>
                <p className="mt-1 text-3xl font-black text-[#17142B]">
                  {compatibilityScore}%
                </p>
                <p className="text-xs font-black uppercase text-[#17142B]/80 truncate max-w-[110px]">
                  {getCompatibilityLabel()}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Sparkles size={22} />
              </div>
            </div>
          </div>

          {/* Readiness */}
          <div className="rounded-2xl border-2 border-[#17142B] bg-[#DCCFFF] p-5 shadow-[4px_4px_0_#17142B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#17142B]/70">
                  READINESS
                </p>
                <p className="mt-1 text-3xl font-black text-[#17142B]">
                  {readinessScore}%
                </p>
                <p className="text-xs font-black uppercase text-[#17142B]/80 truncate max-w-[110px]">
                  {getReadinessLabel()}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#7046D9] shadow-[2px_2px_0_#17142B]">
                <Zap size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-Side: Team Power Meter & Ready Check ⚡ */}
        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* Panel 1: TEAM POWER METER (Compatibility) */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#F7A6C7] shadow-[1px_1px_0_#17142B]">
                      <Sparkles size={18} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-wide text-[#17142B]">
                      TEAM POWER METER
                    </h2>
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    Synergy calculated from shared skill sets, role diversity, and mission fit.
                  </p>
                </div>

                <div className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3 py-1 text-xl font-black text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  {compatibilityScore}%
                </div>
              </div>

              {/* Comic-Style Meter Bar */}
              <div className="mt-5 h-4 w-full overflow-hidden rounded-full border-2 border-[#17142B] bg-[#FFF8E8]">
                <div
                  className="h-full rounded-full bg-[#7046D9] transition-all duration-700"
                  style={{ width: `${compatibilityScore}%` }}
                />
              </div>

              <div className="mt-3.5 flex items-center gap-2 text-xs font-black uppercase text-[#17142B]">
                <ShieldCheck size={16} className="text-[#7046D9]" />
                <span>{getCompatibilityLabel()}</span>
              </div>
            </div>

            {/* Supporting Metrics Panel */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t-2 border-[#17142B]/10 pt-4 text-center">
              <div className="rounded-xl border-2 border-[#17142B] bg-[#BDE7D6]/40 p-2.5 shadow-[2px_2px_0_#17142B]">
                <p className="text-xl font-black text-[#17142B]">
                  {coveredSkills.length}
                </p>
                <p className="text-[10px] font-black uppercase text-slate-500">
                  Skills
                </p>
              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B]/40 p-2.5 shadow-[2px_2px_0_#17142B]">
                <p className="text-xl font-black text-[#17142B]">
                  {uniqueRoles.length}
                </p>
                <p className="text-[10px] font-black uppercase text-slate-500">
                  Classes
                </p>
              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#DCCFFF]/40 p-2.5 shadow-[2px_2px_0_#17142B]">
                <p className="text-xl font-black text-[#17142B]">
                  {projectGoalMatch}%
                </p>
                <p className="text-[10px] font-black uppercase text-slate-500">
                  Goal Fit
                </p>
              </div>
            </div>
          </div>

          {/* Panel 2: READY CHECK ⚡ (Readiness) */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                      <Zap size={18} fill="currentColor" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-wide text-[#17142B]">
                      READY CHECK ⚡
                    </h2>
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    Game-style readiness evaluation measuring squad size, core coverage, and building capacity.
                  </p>
                </div>

                <div className="rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] px-3 py-1 text-xl font-black text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  {readinessScore}%
                </div>
              </div>

              {/* Inked Progress Bar */}
              <div className="mt-5 h-4 w-full overflow-hidden rounded-full border-2 border-[#17142B] bg-[#FFF8E8]">
                <div
                  className="h-full rounded-full bg-[#17142B] transition-all duration-700"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>

              <div className="mt-3.5 flex items-center gap-2 text-xs font-black uppercase text-[#17142B]">
                <Star size={16} fill="currentColor" className="text-amber-500" />
                <span>{getReadinessLabel()}</span>
              </div>
            </div>

            {/* Ready Status Box */}
            <div className="mt-6 rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3.5 shadow-[2px_2px_0_#17142B]">
              <p className="text-xs font-black uppercase text-[#17142B]">
                {readinessScore >= 80
                  ? "SQUAD IS READY TO MAKE SOME NOISE! 🚀"
                  : readinessScore >= 60
                  ? "SQUAD IS TAKING SERIOUS SHAPE! 🔥"
                  : "YOU'VE GOT THE FOUNDATION — NOW FILL THE GAPS! ⚡"}
              </p>
              <p className="mt-1 text-[11px] font-bold text-slate-600">
                {missingSkills.length === 0
                  ? "All standard technical requirements are accounted for in the core loadout."
                  : `Recruiting someone with ${missingSkills[0]} expertise will close your remaining skill gap.`}
              </p>
            </div>
          </div>
        </section>

        {/* Team Members Section (Collectible Character Cards) */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                <Users size={18} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#17142B]">
                  Team Members
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  Collectible builder cards powering your squad
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/find-teammates")}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-white px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5"
            >
              <UserPlus size={14} />
              Add Teammates
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="group rounded-2xl border-2 border-[#17142B] bg-white p-5 shadow-[4px_4px_0_#17142B] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#17142B]"
              >
                {/* Collectible Badge Header */}
                <div className="mb-3 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    MEMBER #{member.id}
                  </span>
                  <span className="rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-2 py-0.2 text-[9px] font-black uppercase text-[#17142B]">
                    {member.role?.split(" ")[0]?.toUpperCase() || "CLASS"}
                  </span>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] text-3xl shadow-[2px_2px_0_#17142B]">
                    {member.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-black uppercase text-[#17142B]">
                      {member.name}
                    </h3>
                    <p className="text-xs font-black uppercase text-[#7046D9]">
                      {member.role}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="rounded-md border border-[#17142B] bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {member.experience}
                      </span>
                      {member.projectGoal && (
                        <span className="truncate rounded-md border border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[10px] font-black uppercase text-[#17142B]">
                          {member.projectGoal}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5 border-t-2 border-[#17142B]/10 pt-3">
                  {(member.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border-2 border-[#17142B] bg-[#FFF8E8] px-2 py-0.5 text-[11px] font-black text-slate-800 shadow-[1px_1px_0_#17142B]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Breakdown (Two Comic Panels: SKILLS WE HAVE & SKILLS WE NEED) */}
        <section className="mb-10">
          <div className="mb-5 border-b-2 border-[#17142B]/10 pb-3">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#17142B]">
              Skill Breakdown
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Unlocked superpowers vs. missing abilities
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Panel LEFT: SKILLS WE HAVE */}
            <div className="rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                    <Check size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-[#17142B]">
                      SKILLS WE HAVE
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      {coveredSkills.length} of {allSkills.length} core abilities unlocked
                    </p>
                  </div>
                </div>

                <span className="rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] px-2.5 py-1 text-sm font-black text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  {skillCoverage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-5 h-3 w-full overflow-hidden rounded-full border-2 border-[#17142B] bg-[#FFF8E8]">
                <div
                  className="h-full rounded-full bg-[#17142B] transition-all duration-700"
                  style={{ width: `${skillCoverage}%` }}
                />
              </div>

              {/* Unlocked Skill Chips */}
              <div className="flex flex-wrap gap-2">
                {coveredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] px-3 py-1.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]"
                  >
                    <Check size={13} className="text-[#17142B]" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Panel RIGHT: SKILLS WE NEED & RECRUITMENT ALERT ⚡ */}
            <div className="rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-[#17142B]">
                    SKILLS WE NEED
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Missing skill areas to complete your squad
                  </p>
                </div>

                {missingSkills.length > 0 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                    <AlertTriangle size={16} />
                  </div>
                )}
              </div>

              {/* Missing skills chips */}
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-lg border-2 border-[#17142B] bg-[#F7A6C7] px-3 py-1.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]"
                    >
                      + {skill}
                    </span>
                  ))
                ) : (
                  <div className="w-full rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] p-4 text-center shadow-[2px_2px_0_#17142B]">
                    <p className="text-sm font-black uppercase text-[#17142B]">
                      Full Skill Coverage Achieved! 🎉
                    </p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      Your squad covers all standard technical domains.
                    </p>
                  </div>
                )}
              </div>

              {/* "WHO CAN FILL THE GAP?" as RECRUITMENT ALERT ⚡ */}
              {missingSkills.length > 0 && recommendedCandidates.length > 0 && (
                <div className="mt-6 border-t-2 border-[#17142B] pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="flex items-center gap-1.5 text-sm font-black uppercase text-[#17142B]">
                        <Zap size={14} className="text-[#7046D9]" fill="currentColor" />
                        RECRUITMENT ALERT ⚡
                      </h4>
                      <p className="text-[11px] font-bold text-slate-500">
                        Candidates from the recruitment wall who supply missing abilities
                      </p>
                    </div>

                    <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                      {recommendedCandidates.length} RECRUITS
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recommendedCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3.5 shadow-[3px_3px_0_#17142B] transition duration-150 hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-xl shadow-[1px_1px_0_#17142B]">
                              {candidate.emoji}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-black uppercase text-[#17142B]">
                                  {candidate.name}
                                </h5>
                                <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-1.5 py-0.2 text-[9px] font-black uppercase text-[#17142B]">
                                  {candidate.gapSkills.length} GAP SKILL
                                  {candidate.gapSkills.length > 1 ? "S" : ""}
                                </span>
                              </div>
                              <p className="text-xs font-black uppercase text-[#7046D9]">
                                {candidate.role} · {candidate.experience}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddCandidate(candidate)}
                            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0_#17142B] transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5"
                          >
                            <UserPlus size={13} />
                            + ADD TO TEAM
                          </button>
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-[#17142B]/10 pt-2">
                          <span className="text-[10px] font-black uppercase text-slate-500">
                            CAN BRING:
                          </span>
                          {candidate.gapSkills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md border border-[#17142B] bg-white px-2 py-0.5 text-[10px] font-black uppercase text-[#7046D9]"
                            >
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Role Mix: TEAM LOADOUT */}
        <section className="mb-10 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]">
              <Briefcase size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase text-[#17142B]">
                TEAM LOADOUT
              </h2>
              <p className="text-xs font-bold text-slate-500">
                Functional role classes currently active in your squad
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {uniqueRoles.map((role) => (
              <div
                key={role}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-3.5 py-2 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]"
              >
                <Zap size={13} className="text-[#7046D9]" fill="currentColor" />
                {role}
              </div>
            ))}
          </div>
        </section>

        {/* TeamFuse Verdict: FINAL COMIC PANEL */}
        <section className="relative mb-10 overflow-hidden rounded-2xl border-2 border-[#17142B] bg-[#7046D9] p-7 text-white shadow-[6px_6px_0_#17142B] sm:p-8">
          {/* Halftone texture overlay */}
          <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 bg-halftone-white opacity-25" />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-white bg-white/15 px-3 py-0.5 text-xs font-black uppercase tracking-widest text-[#FFD86B]">
              <Zap size={13} fill="currentColor" />
              TEAMFUSE VERDICT · FINAL SCORE
            </div>

            <h2 className="mt-4 max-w-3xl text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
              {readinessScore >= 80
                ? "READY TO MAKE SOME NOISE! 🚀"
                : readinessScore >= 60
                ? "YOUR SQUAD IS TAKING SERIOUS SHAPE! 🔥"
                : "YOU'VE GOT THE FOUNDATION — NOW FILL THE GAPS! ⚡"}
            </h2>

            <p className="mt-2.5 max-w-2xl text-sm font-bold text-white/90 leading-relaxed">
              {missingSkills.length === 0
                ? "Your selected teammates collectively cover all the core skills in our current skill map."
                : `Your team currently covers ${coveredSkills.length} core skills. Adding someone with ${missingSkills[0]} could expand your skill coverage.`}
            </p>

            {/* 3 Metric cards inside verdict */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                <p className="text-xs font-black uppercase text-purple-200">
                  TEAM FIT
                </p>
                <p className="text-2xl font-black text-white">
                  {compatibilityScore}%
                </p>
              </div>

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                <p className="text-xs font-black uppercase text-purple-200">
                  SKILLS POWER
                </p>
                <p className="text-2xl font-black text-white">
                  {skillCoverage}%
                </p>
              </div>

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                <p className="text-xs font-black uppercase text-purple-200">
                  READY
                </p>
                <p className="text-2xl font-black text-white">
                  {readinessScore}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Action */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/find-teammates")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-8 py-3.5 text-sm font-black uppercase tracking-wider text-[#17142B] shadow-[4px_4px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            ← Add More Teammates
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamAnalysis