import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
  Crown,
  Trash2,
  Copy,
  RotateCcw,
} from "lucide-react"

function TeamAnalysis() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  // Safe parsing helper
  const safeParse = (key, fallback) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  }

  const [team, setTeam] = useState(() => safeParse("teamfuseTeam", []))
  const [profile] = useState(() => safeParse("teamfuseProfile", null))

  // Define full core skill repository across the app
  const allSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "Machine Learning",
    "UI/UX",
    "Figma",
    "Java",
    "Express",
  ]

  // Integrate profile creator into full squad if available
  const userMember = profile?.name
    ? {
        id: "creator-user",
        name: `${profile.name} (You)`,
        role: profile.role || "Team Lead",
        experience: profile.experience || "Intermediate",
        projectGoal: profile.projectGoal || "Hackathon",
        skills: profile.skills || [],
        emoji: "👑",
        color: "bg-[#FFD86B]",
        isLeader: true,
      }
    : null

  const fullSquad = userMember ? [userMember, ...team] : team

  // Teammates removal handler
  const handleRemoveTeammate = (id) => {
    const updatedTeam = team.filter((member) => member.id !== id)
    setTeam(updatedTeam)
    localStorage.setItem("teamfuseTeam", JSON.stringify(updatedTeam))
  }

  // Clear squad handler
  const handleClearSquad = () => {
    setTeam([])
    localStorage.setItem("teamfuseTeam", JSON.stringify([]))
  }

  // Skills calculations
  const squadSkills = [
    ...new Set(fullSquad.flatMap((member) => member.skills || [])),
  ]

  const coveredCoreSkills = allSkills.filter((skill) =>
    squadSkills.includes(skill)
  )

  const missingSkills = allSkills.filter(
    (skill) => !squadSkills.includes(skill)
  )

  const skillCoverage =
    allSkills.length > 0
      ? Math.min(
          100,
          Math.round((coveredCoreSkills.length / allSkills.length) * 100)
        )
      : 0

  const uniqueRoles = [
    ...new Set(fullSquad.map((member) => member.role).filter(Boolean)),
  ]

  // Project Goal & Alignment
  const projectGoal = profile?.projectGoal || team[0]?.projectGoal || "Project"

  const sameGoalMembers = team.filter(
    (member) => member.projectGoal === projectGoal
  )

  const projectGoalMatch =
    team.length > 0
      ? Math.round((sameGoalMembers.length / team.length) * 100)
      : 100

  // Needs / looking-for skill match
  const lookingFor = profile?.lookingFor || []
  const matchedLookingFor = lookingFor.filter((skill) =>
    squadSkills.includes(skill)
  )

  // Team Compatibility Calculation
  const calculateCompatibility = () => {
    if (team.length === 0) return 0

    let score = 0

    // 1. Skill diversity & coverage (up to 40 pts)
    const skillScore = Math.min(40, squadSkills.length * 6)
    score += skillScore

    // 2. Role diversity (up to 25 pts)
    const roleScore = Math.min(25, uniqueRoles.length * 8)
    score += roleScore

    // 3. Goal alignment (up to 20 pts)
    score += Math.round(projectGoalMatch * 0.2)

    // 4. Experience balance (up to 15 pts)
    const experiences = [
      ...new Set(fullSquad.map((member) => member.experience).filter(Boolean)),
    ]
    const experienceScore = Math.min(15, experiences.length * 5)
    score += experienceScore

    return Math.min(100, Math.max(0, Math.round(score)))
  }

  const compatibilityScore = calculateCompatibility()

  // Team Readiness Calculation
  const calculateReadiness = () => {
    if (team.length === 0) return 0

    let score = 0

    // Skill coverage impact (up to 50 pts)
    score += Math.round(skillCoverage * 0.5)

    // Role diversity impact (up to 20 pts)
    score += Math.min(20, uniqueRoles.length * 7)

    // Goal alignment impact (up to 20 pts)
    score += Math.round(projectGoalMatch * 0.2)

    // Squad size bonus (up to 10 pts)
    if (fullSquad.length >= 4) {
      score += 10
    } else if (fullSquad.length >= 3) {
      score += 7
    } else if (fullSquad.length >= 2) {
      score += 5
    }

    return Math.min(100, Math.max(0, Math.round(score)))
  }

  const readinessScore = calculateReadiness()

  const getReadinessLabel = () => {
    if (readinessScore >= 80) return "READY TO BUILD 🚀"
    if (readinessScore >= 60) return "ALMOST READY 🔥"
    return "NEEDS A BOOST ⚡"
  }

  const getCompatibilityLabel = () => {
    if (compatibilityScore >= 80) return "Highly Compatible"
    if (compatibilityScore >= 60) return "Good Compatibility"
    return "Growing Compatibility"
  }

  // Copy squad summary
  const copySquadSummary = () => {
    const summary = [
      `⚡ TeamFuse Dream Team Roster ⚡`,
      `Goal: ${projectGoal}`,
      `Squad Size: ${fullSquad.length} members`,
      `Compatibility: ${compatibilityScore}% | Readiness: ${readinessScore}%`,
      `Skills Covered (${coveredCoreSkills.length}/${allSkills.length}): ${squadSkills.join(", ")}`,
      `Members:`,
      ...fullSquad.map(
        (m) => `- ${m.name} (${m.role}, ${m.experience}) [${(m.skills || []).join(", ")}]`
      ),
    ].join("\n")

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  // Empty State
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
            <div className="text-6xl">💥</div>

            <h1 className="mt-5 text-4xl font-black">WHOOPS!</h1>

            <p className="mt-3 text-lg font-bold">
              Your squad has no recruited teammates yet.
              <br />
              Go scout and pick your dream partners first!
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/find-teammates")}
                className="rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-6 py-3 font-black text-white shadow-[5px_5px_0_#17142B] transition hover:-translate-y-1"
              >
                Find Teammates →
              </button>

              {profile && (
                <button
                  onClick={() => navigate("/create-profile")}
                  className="rounded-xl border-2 border-[#17142B] bg-white px-6 py-3 font-black shadow-[5px_5px_0_#17142B] transition hover:-translate-y-1"
                >
                  Edit Profile ✏️
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9EF] px-5 py-8 pb-16 text-[#17142B]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/find-teammates")}
            className="flex items-center gap-2 font-black transition hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
            Back to Teammates
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={copySquadSummary}
              className="flex items-center gap-1.5 rounded-full border-2 border-[#17142B] bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              title="Copy squad roster to clipboard"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" />
                  Copied! 🎉
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Share Squad
                </>
              )}
            </button>

            <div className="flex items-center gap-2 rounded-full border-2 border-[#17142B] bg-[#BDE7D6] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
              <Zap size={17} />
              STEP 03
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="relative mb-10">
          <div className="mb-4 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            <Sparkles size={17} />
            TEAM ANALYSIS
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                Your Dream Team 💥
              </h1>
              <p className="mt-3 max-w-2xl text-lg font-bold text-[#17142B]/70">
                Let's see what happens when your skills and strengths fuse together!
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
                  Target Project Goal
                </p>
                <h2 className="text-2xl font-black">{projectGoal}</h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border-2 border-[#17142B] bg-white px-4 py-2.5 font-black shadow-[3px_3px_0_#17142B]">
                {sameGoalMembers.length}/{team.length} Teammates Aligned
              </div>

              {lookingFor.length > 0 && (
                <div className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2.5 font-black shadow-[3px_3px_0_#17142B]">
                  {matchedLookingFor.length}/{lookingFor.length} Needed Skills Found
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Smart Stats Grid */}
        <section className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Squad Size */}
          <div className="rotate-[-1deg] rounded-3xl border-4 border-[#17142B] bg-[#FFD86B] p-5 shadow-[7px_7px_0_#17142B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider">
                  Squad Size
                </p>
                <p className="mt-1 text-4xl font-black">{fullSquad.length}</p>
                <p className="text-sm font-bold">
                  {userMember ? `You + ${team.length} Teammates` : `${team.length} Members`}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white shadow-[2px_2px_0_#17142B]">
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
                <p className="mt-1 text-4xl font-black">{skillCoverage}%</p>
                <p className="text-sm font-bold">
                  {coveredCoreSkills.length}/{allSkills.length} Core Skills
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white shadow-[2px_2px_0_#17142B]">
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
                <p className="mt-1 text-4xl font-black">{compatibilityScore}%</p>
                <p className="text-sm font-bold">{getCompatibilityLabel()}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white shadow-[2px_2px_0_#17142B]">
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
                <p className="mt-1 text-4xl font-black">{readinessScore}%</p>
                <p className="text-sm font-bold">{getReadinessLabel()}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white shadow-[2px_2px_0_#17142B]">
                <Zap size={26} />
              </div>
            </div>
          </div>
        </section>

        {/* Compatibility + Readiness Details */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          {/* Team Compatibility */}
          <div className="rounded-3xl border-4 border-[#17142B] bg-white p-6 shadow-[7px_7px_0_#17142B]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#F7A6C7]">
                    <Sparkles size={21} />
                  </div>
                  <h2 className="text-2xl font-black">Team Compatibility</h2>
                </div>
                <p className="mt-2 font-bold opacity-60">
                  How well the selected teammates blend together.
                </p>
              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3 py-2 text-xl font-black shadow-[3px_3px_0_#17142B]">
                {compatibilityScore}%
              </div>
            </div>

            <div className="mt-5 h-5 overflow-hidden rounded-full border-2 border-[#17142B] bg-[#FFF9EF]">
              <div
                className="h-full rounded-full bg-[#7046D9] transition-all duration-700"
                style={{ width: `${compatibilityScore}%` }}
              />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <ShieldCheck size={18} />
              <p className="font-black">{getCompatibilityLabel()}</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] p-3 text-center">
                <p className="text-2xl font-black">{squadSkills.length}</p>
                <p className="text-xs font-black">Total Skills</p>
              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B] p-3 text-center">
                <p className="text-2xl font-black">{uniqueRoles.length}</p>
                <p className="text-xs font-black">Roles</p>
              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#DCCFFF] p-3 text-center">
                <p className="text-2xl font-black">{projectGoalMatch}%</p>
                <p className="text-xs font-black">Goal Match</p>
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
                  <h2 className="text-2xl font-black">Team Readiness</h2>
                </div>
                <p className="mt-2 font-bold text-[#17142B]/70">
                  Is your squad equipped and ready to start building?
                </p>
              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-white px-3 py-2 text-xl font-black shadow-[3px_3px_0_#17142B]">
                {readinessScore}%
              </div>
            </div>

            <div className="mt-5 h-5 overflow-hidden rounded-full border-2 border-[#17142B] bg-white">
              <div
                className="h-full rounded-full bg-[#17142B] transition-all duration-700"
                style={{ width: `${readinessScore}%` }}
              />
            </div>

            <div className="mt-5 rounded-2xl border-2 border-[#17142B] bg-white p-4">
              <p className="text-xl font-black">{getReadinessLabel()}</p>
              <p className="mt-1 text-sm font-bold opacity-60">
                {missingSkills.length === 0
                  ? "Your squad covers the full core skill map! You're ready to ship."
                  : `Consider adding someone with ${missingSkills[0]} to close your remaining skill gap.`}
              </p>
            </div>
          </div>
        </section>

        {/* Team Members List */}
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#F7A6C7] shadow-[3px_3px_0_#17142B]">
                <Users size={21} />
              </div>
              <div>
                <h2 className="text-3xl font-black">Team Members</h2>
                <p className="font-bold opacity-60">
                  The people powering your squad
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/find-teammates")}
              className="flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 text-sm font-black shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <UserRoundPlus size={16} />
              Add More Teammates
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fullSquad.map((member) => (
              <div
                key={member.id}
                className={`relative rounded-3xl border-4 border-[#17142B] ${member.color} p-5 shadow-[7px_7px_0_#17142B] transition hover:-translate-y-1`}
              >
                {/* User Leader Badge or Remove Button */}
                {member.isLeader ? (
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border-2 border-[#17142B] bg-white px-2.5 py-1 text-[11px] font-black uppercase shadow-[2px_2px_0_#17142B]">
                    <Crown size={13} className="text-amber-500" />
                    Squad Lead
                  </div>
                ) : (
                  <button
                    onClick={() => handleRemoveTeammate(member.id)}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:bg-[#F05A47] hover:text-white"
                    title={`Remove ${member.name} from squad`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white text-4xl shadow-[2px_2px_0_#17142B]">
                    {member.emoji}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black">{member.name}</h3>
                    <p className="font-bold">{member.role}</p>
                    <p className="text-sm font-bold opacity-60">
                      {member.experience}
                    </p>
                  </div>
                </div>

                {member.projectGoal && (
                  <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-[#17142B] bg-white/70 px-3 py-2">
                    <span className="text-xs font-black uppercase">Goal</span>
                    <span className="text-xs font-black">
                      {member.projectGoal}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {(member.skills || []).map((skill) => (
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
            <h2 className="text-3xl font-black">Skill Breakdown</h2>
            <p className="mt-1 font-bold text-[#17142B]/60">
              See what technical areas your squad can tackle.
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
                    <h2 className="text-2xl font-black">Core Skills Covered</h2>
                    <p className="font-bold">
                      {coveredCoreSkills.length} / {allSkills.length} Core Skills
                    </p>
                  </div>
                </div>

                <div className="text-3xl font-black">{skillCoverage}%</div>
              </div>

              <div className="mb-5 h-4 overflow-hidden rounded-full border-2 border-[#17142B] bg-white">
                <div
                  className="h-full rounded-full bg-[#17142B] transition-all duration-700"
                  style={{ width: `${skillCoverage}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2.5">
                {squadSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border-2 border-[#17142B] bg-white px-3.5 py-1.5 text-sm font-black shadow-[2px_2px_0_#17142B]"
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
                  <h2 className="text-2xl font-black">🎯 Skills To Consider</h2>
                  <p className="mt-1 font-bold">
                    Additional capabilities that could elevate your project.
                  </p>
                </div>

                {missingSkills.length > 0 && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white">
                    <AlertTriangle size={20} />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border-2 border-[#17142B] bg-white px-3.5 py-1.5 text-sm font-black shadow-[2px_2px_0_#17142B]"
                    >
                      + {skill}
                    </span>
                  ))
                ) : (
                  <div className="w-full rounded-2xl border-2 border-[#17142B] bg-white p-5 text-center">
                    <div className="text-4xl">🎉</div>
                    <p className="mt-2 text-lg font-black">
                      Full skill coverage achieved!
                    </p>
                    <p className="text-xs font-bold opacity-60">
                      Your team has all the core building blocks needed.
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
              <h2 className="text-2xl font-black">Role Distribution</h2>
              <p className="font-bold opacity-60">
                A diverse role mix prevents bottlenecks.
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
                ? "Your squad is primed to make serious noise! 🚀"
                : readinessScore >= 60
                ? "Your squad is taking great shape! 🔥"
                : "You've got the foundation — now fill the missing gaps! ⚡"}
            </h2>

            <p className="mt-3 max-w-2xl text-lg font-bold text-white/90">
              {missingSkills.length === 0
                ? `Your squad covers all ${allSkills.length} core technical domains in the skill map.`
                : `Your squad covers ${coveredCoreSkills.length} of ${allSkills.length} core technical domains. Adding expertise in ${missingSkills[0]} would maximize project success.`}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">
                <p className="text-2xl font-black">{compatibilityScore}%</p>
                <p className="text-sm font-bold">Compatibility</p>
              </div>

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">
                <p className="text-2xl font-black">{skillCoverage}%</p>
                <p className="text-sm font-bold">Skill Coverage</p>
              </div>

              <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">
                <p className="text-2xl font-black">{readinessScore}%</p>
                <p className="text-sm font-bold">Readiness</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/find-teammates")}
            className="rounded-2xl border-4 border-[#17142B] bg-[#FFD86B] px-7 py-4 text-lg font-black shadow-[6px_6px_0_#17142B] transition hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            ← Add More Teammates
          </button>

          <button
            onClick={copySquadSummary}
            className="flex items-center gap-2 rounded-2xl border-4 border-[#17142B] bg-[#BDE7D6] px-7 py-4 text-lg font-black shadow-[6px_6px_0_#17142B] transition hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <Copy size={20} />
            {copied ? "Roster Copied! 🎉" : "Copy Squad Roster"}
          </button>

          <button
            onClick={handleClearSquad}
            className="flex items-center gap-2 rounded-2xl border-4 border-[#17142B] bg-white px-7 py-4 text-lg font-black shadow-[6px_6px_0_#17142B] transition hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <RotateCcw size={18} />
            Reset Squad
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamAnalysis