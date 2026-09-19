import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Search,
  Users,
  Check,
  UserPlus,
  Sparkles,
  Target,
  X,
  ArrowRight,
  Flame,
  Wand2,
  TrendingUp,
  Briefcase,
  Award,
  Layers,
  HelpCircle,
  AlertCircle,
  Plus,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { allCoreSkills, demoUsers } from "../data/teamData"
import {
  calculateTeamMetrics,
  calculateWhatIfImpact,
  getCandidateMatchAnalysis,
} from "../utils/teamMetrics"

function FindTeammates() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")

  // What-If Simulator Candidate State
  const [whatIfCandidate, setWhatIfCandidate] = useState(null)

  // Retrieve saved profile with robust fallback
  const rawProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("teamfuseProfile") || "null")
    } catch {
      return null
    }
  })()

  // Current user representation with stable ID - strictly Member #1
  const currentUser = useMemo(() => {
    if (rawProfile && rawProfile.name) {
      return {
        ...rawProfile,
        id: "current-user",
        isCurrentUser: true,
        emoji: rawProfile.emoji || "👩🏻‍💻",
        color: rawProfile.color || "bg-[#FFD86B]",
      }
    }
    // Fallback default so user is never left without Member #1 status
    return {
      id: "current-user",
      name: "Sayani",
      role: "Frontend Developer",
      experience: "Intermediate",
      projectGoal: "Hackathon",
      projectBrief: "Build an AI-powered sustainability platform.",
      skills: ["React", "Figma", "UI/UX"],
      lookingFor: ["Node.js", "MongoDB"],
      emoji: "👩🏻‍💻",
      isCurrentUser: true,
      color: "bg-[#FFD86B]",
    }
  }, [rawProfile])

  // Initialize selected allies (excluding current user) from localStorage
  const [selectedUsers, setSelectedUsers] = useState(() => {
    try {
      const savedTeam = JSON.parse(localStorage.getItem("teamfuseTeam") || "[]")
      return Array.isArray(savedTeam)
        ? savedTeam
            .filter((m) => m.id !== "current-user" && !m.isCurrentUser)
            .map((m) => m.id)
        : []
    } catch {
      return []
    }
  })

  // Full squad: currentUser is ALWAYS the first team member
  const currentSquad = useMemo(() => {
    const recruited = demoUsers.filter((u) => selectedUsers.includes(u.id))
    return currentUser ? [currentUser, ...recruited] : recruited
  }, [currentUser, selectedUsers])

  // Helper to record team evolution history
  const recordTeamHistory = useCallback((squad) => {
    try {
      const metrics = calculateTeamMetrics(squad, currentUser?.projectGoal)
      const prev = JSON.parse(localStorage.getItem("teamfuseTeamHistory") || "[]")
      const last = squad[squad.length - 1]
      const eventTitle = squad.length === 1 ? "Starting Squad" : `Added ${last?.name || "Ally"}`
      const entry = {
        event: eventTitle,
        membersCount: squad.length,
        coverage: metrics.skillCoverage,
        timestamp: Date.now(),
      }
      if (!prev.some((h) => h.membersCount === squad.length && h.event === eventTitle)) {
        localStorage.setItem("teamfuseTeamHistory", JSON.stringify([...prev, entry]))
      }
    } catch {
      // ignore
    }
  }, [currentUser])

  // Keep localStorage team synchronized with currentUser as Member #1
  useEffect(() => {
    if (currentUser) {
      try {
        const savedTeam = JSON.parse(
          localStorage.getItem("teamfuseTeam") || "[]"
        )
        const otherMembers = Array.isArray(savedTeam)
          ? savedTeam.filter((m) => m.id !== "current-user" && !m.isCurrentUser)
          : []
        const synchedTeam = [currentUser, ...otherMembers]
        localStorage.setItem("teamfuseTeam", JSON.stringify(synchedTeam))

        // Initialize history if empty
        const existingHistory = localStorage.getItem("teamfuseTeamHistory")
        if (!existingHistory) {
          recordTeamHistory(synchedTeam)
        }
      } catch {
        localStorage.setItem("teamfuseTeam", JSON.stringify([currentUser]))
      }
    }
  }, [currentUser, recordTeamHistory])

  // Use centralized calculateTeamMetrics for squad calculations
  const squadMetrics = useMemo(() => {
    return calculateTeamMetrics(currentSquad, currentUser?.projectGoal)
  }, [currentSquad, currentUser])

  const squadSkills = squadMetrics.coveredSkills
  const missingSkills = squadMetrics.missingSkills

  // ==================== SKILL GAP PLANNER (Categorized by Priority) ====================
  const skillGapsCategorized = useMemo(() => {
    const userRole = currentUser?.role || ""
    const lookingFor = currentUser?.lookingFor || []

    const roleComplementaryMap = {
      "Frontend Developer": ["Node.js", "MongoDB", "Python"],
      "Backend Developer": ["React", "UI/UX", "Figma"],
      "ML Engineer": ["Node.js", "MongoDB", "React"],
      "UI/UX Designer": ["React", "Frontend Developer", "Node.js"],
      "Full Stack Developer": ["Machine Learning", "Python"],
    }
    const roleComplements = roleComplementaryMap[userRole] || ["Node.js", "React"]

    const critical = []
    const useful = []
    const optional = []

    missingSkills.forEach((skill) => {
      if (lookingFor.includes(skill) || roleComplements.includes(skill)) {
        critical.push(skill)
      } else if (["Machine Learning", "Python", "UI/UX", "Figma", "MongoDB"].includes(skill)) {
        useful.push(skill)
      } else {
        optional.push(skill)
      }
    })

    return { critical, useful, optional }
  }, [currentUser, missingSkills])

  // Team name state and modal management
  const [teamName, setTeamName] = useState(() => {
    return (
      localStorage.getItem("teamfuseTeamName") ||
      (currentUser ? `${currentUser.name}'s Squad` : "Code Titans")
    )
  })
  const [isNamingModalOpen, setIsNamingModalOpen] = useState(false)
  const [teamNameError, setTeamNameError] = useState("")

  // Ideal Team Generator Modal State
  const [isIdealModalOpen, setIsIdealModalOpen] = useState(false)

  // Search + filter + smart candidate sorting
  const filteredUsers = useMemo(() => {
    return demoUsers
      .filter((user) => {
        if (currentUser && (user.id === currentUser.id || user.isCurrentUser)) return false
        const searchText = search.toLowerCase()

        const matchesSearch =
          user.name.toLowerCase().includes(searchText) ||
          user.skills.some((skill) =>
            skill.toLowerCase().includes(searchText)
          )

        const matchesRole =
          roleFilter === "All" || user.role.includes(roleFilter)

        return matchesSearch && matchesRole
      })
      .sort((a, b) => {
        const scoreA = getCandidateMatchAnalysis(currentSquad, a, currentUser?.projectGoal).matchScore
        const scoreB = getCandidateMatchAnalysis(currentSquad, b, currentUser?.projectGoal).matchScore
        return scoreB - scoreA
      })
  }, [search, roleFilter, currentSquad, currentUser])

  // Add / remove ally from squad
  const toggleUser = (id) => {
    setSelectedUsers((prev) => {
      const next = prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]

      // Immediately synchronize squad in localStorage & history
      const recruited = demoUsers.filter((u) => next.includes(u.id))
      const updatedSquad = currentUser ? [currentUser, ...recruited] : recruited
      localStorage.setItem("teamfuseTeam", JSON.stringify(updatedSquad))
      recordTeamHistory(updatedSquad)

      return next
    })
  }

  // ==================== WHAT-IF SIMULATOR IMPACT CALCULATION ====================
  const whatIfImpact = useMemo(() => {
    if (!whatIfCandidate) return null
    return calculateWhatIfImpact(currentSquad, whatIfCandidate, currentUser?.projectGoal)
  }, [currentSquad, whatIfCandidate, currentUser])

  // ==================== IDEAL TEAM GENERATOR ====================
  const idealSquadRecommendation = useMemo(() => {
    if (!currentUser) return null

    const candidates = demoUsers.filter((u) => u.id !== currentUser.id)
    const userSkills = currentUser.skills || []

    let bestCombo = []
    let bestScore = -1

    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const combo = [candidates[i], candidates[j]]
        const allComboSkills = new Set([
          ...userSkills,
          ...combo.flatMap((c) => c.skills),
        ])
        const roles = new Set([currentUser.role, ...combo.map((c) => c.role)])
        const goalMatches = combo.filter(
          (c) => c.projectGoal === currentUser.projectGoal
        ).length

        const score = allComboSkills.size * 15 + roles.size * 12 + goalMatches * 10
        if (score > bestScore) {
          bestScore = score
          bestCombo = combo
        }

        for (let k = j + 1; k < candidates.length; k++) {
          const combo3 = [candidates[i], candidates[j], candidates[k]]
          const allComboSkills3 = new Set([
            ...userSkills,
            ...combo3.flatMap((c) => c.skills),
          ])
          const roles3 = new Set([currentUser.role, ...combo3.map((c) => c.role)])
          const goalMatches3 = combo3.filter(
            (c) => c.projectGoal === currentUser.projectGoal
          ).length

          const score3 =
            allComboSkills3.size * 18 + roles3.size * 14 + goalMatches3 * 10
          if (score3 > bestScore) {
            bestScore = score3
            bestCombo = combo3
          }
        }
      }
    }

    const idealSquadMembers = [currentUser, ...bestCombo]
    const idealMetrics = calculateTeamMetrics(idealSquadMembers, currentUser.projectGoal)

    return {
      candidates: bestCombo,
      fullSquad: idealSquadMembers,
      coveragePercent: idealMetrics.skillCoverage,
      uniqueRolesCount: idealMetrics.roleDiversity,
    }
  }, [currentUser])

  const applyIdealSquad = () => {
    if (!idealSquadRecommendation) return
    const newSelectedIds = idealSquadRecommendation.candidates.map((c) => c.id)
    setSelectedUsers(newSelectedIds)

    const updatedSquad = [
      currentUser,
      ...idealSquadRecommendation.candidates,
    ]
    localStorage.setItem("teamfuseTeam", JSON.stringify(updatedSquad))
    recordTeamHistory(updatedSquad)
    setIsIdealModalOpen(false)
  }

  // Final build team action after naming squad
  const handleBuildTeam = () => {
    const trimmed = teamName.trim()
    if (!trimmed) {
      setTeamNameError(
        "Team name cannot be empty. Every great team needs a name."
      )
      return
    }
    if (trimmed.length > 30) {
      setTeamNameError("Team name must be 30 characters or less.")
      return
    }

    localStorage.setItem("teamfuseTeam", JSON.stringify(currentSquad))
    localStorage.setItem("teamfuseTeamName", trimmed)
    recordTeamHistory(currentSquad)

    navigate("/team-analysis")
  }

  return (
    <div className="min-h-screen bg-[#FFF8E8] px-5 py-8 pb-32 text-[#17142B] selection:bg-[#FFD86B] selection:text-[#17142B]">
      <div className="mx-auto max-w-6xl">
        {/* Header Navigation & Comic Step */}
        <header className="mb-8 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-4">
          <button
            onClick={() => navigate("/create-profile")}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 transition hover:text-[#7046D9]"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </button>

          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#17142B]">
            <Users size={13} fill="currentColor" />
            STEP 02 · RECRUITMENT WALL
          </div>
        </header>

        {/* Hero: Recruitment Wall */}
        <section className="relative mb-8">
          <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 bg-halftone-subtle opacity-60" />

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-[#F7A6C7] px-3 py-0.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
            <Sparkles size={13} />
            SCOUTING WALL
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-[#17142B] sm:text-4xl lg:text-5xl">
                Find Your Squad
              </h1>
              <p className="mt-2 text-sm font-bold text-slate-600">
                Discover teammates with complementary skills built around you.
              </p>
              {currentUser?.projectBrief && (
                <p className="mt-2 max-w-2xl text-xs font-bold italic text-[#7046D9]">
                  “{currentUser.projectBrief}”
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Ideal Squad Quick Generator CTA */}
              <button
                type="button"
                onClick={() => setIsIdealModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Wand2 size={14} />
                <span>BUILD MY IDEAL TEAM</span>
              </button>

              <div className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] px-3.5 py-2 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Flame size={13} className="text-amber-700" />
                {currentSquad.length}{" "}
                {currentSquad.length === 1 ? "BUILDER IN SQUAD" : "BUILDERS IN SQUAD"}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== PROMINENT SQUAD PREVIEW SECTION ==================== */}
        <section className="mb-8 rounded-3xl border-2 border-[#17142B] bg-white p-6 shadow-[5px_5px_0_#17142B]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#17142B]/10 pb-4">
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                <Users size={12} />
                ACTIVE SQUAD ROSTER · {currentSquad.length}{" "}
                {currentSquad.length === 1 ? "BUILDER" : "BUILDERS"}
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#17142B] sm:text-2xl">
                Your Squad
              </h2>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Sparkles size={13} fill="currentColor" />
              YOU ARE MEMBER #1
            </div>
          </div>

          {/* Squad Member Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {currentSquad.map((member) => {
              const isUser = member.id === "current-user" || member.isCurrentUser
              return (
                <div
                  key={member.id}
                  className={`relative flex flex-col justify-between rounded-2xl border-2 border-[#17142B] p-4 shadow-[3px_3px_0_#17142B] transition ${
                    isUser
                      ? "bg-[#FFF8E8] ring-2 ring-[#7046D9]"
                      : "bg-white"
                  }`}
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      {isUser ? (
                        <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[9px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                          YOU
                        </span>
                      ) : (
                        <span className="rounded-md border border-[#17142B] bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-700">
                          ALLY
                        </span>
                      )}

                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => toggleUser(member.id)}
                          aria-label={`Remove ${member.name} from squad`}
                          className="rounded-md border border-[#17142B] bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:bg-[#FFD6CE] hover:text-red-700"
                        >
                          × Remove
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-2xl shadow-[1px_1px_0_#17142B]">
                        {member.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-black uppercase text-[#17142B]">
                          {member.name}
                        </h3>
                        <p className="truncate text-[11px] font-black uppercase text-[#7046D9]">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Skills Chips */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(member.skills || []).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-[#17142B]/30 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ==================== WHAT DOES YOUR SQUAD NEED? ==================== */}
          <div className="mt-6 rounded-2xl border-2 border-[#17142B] bg-[#FFF8E8] p-5 shadow-[2px_2px_0_#17142B]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#17142B]/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#F7A6C7] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                  <Target size={14} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-[#17142B]">
                    WHAT DOES YOUR SQUAD NEED?
                  </h3>
                  <p className="text-[11px] font-bold text-slate-600">
                    Prioritized skill gap roadmap tailored to your{" "}
                    <span className="font-black text-[#7046D9]">{currentUser?.role}</span> role
                    and <span className="font-black text-[#17142B]">{currentUser?.projectGoal}</span> mission:
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {missingSkills.length} SKILLS UNFILLED
              </span>
            </div>

            {missingSkills.length === 0 ? (
              <div className="rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] p-3 text-center">
                <p className="text-xs font-black uppercase text-[#17142B]">
                  ✓ FULL 100% SKILL COVERAGE ACHIEVED!
                </p>
                <p className="text-[11px] font-bold text-slate-700">
                  Your squad covers all standard core technical areas.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Critical / High Priority */}
                <div className="rounded-xl border-2 border-[#17142B] bg-white p-3 shadow-[1px_1px_0_#17142B]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-block rounded-md border border-[#17142B] bg-[#F7A6C7] px-2 py-0.5 text-[9px] font-black uppercase text-[#17142B]">
                      HIGH PRIORITY
                    </span>
                    <span className="text-[9px] font-bold text-slate-500">CRITICAL</span>
                  </div>
                  {skillGapsCategorized.critical.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {skillGapsCategorized.critical.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border-2 border-[#17142B] bg-[#FFF8E8] px-2 py-0.5 text-[10px] font-black text-[#17142B]"
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] font-bold text-slate-500">
                      ✓ Core complements covered
                    </p>
                  )}
                </div>

                {/* Useful */}
                <div className="rounded-xl border-2 border-[#17142B] bg-white p-3 shadow-[1px_1px_0_#17142B]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-block rounded-md border border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[9px] font-black uppercase text-[#17142B]">
                      USEFUL
                    </span>
                    <span className="text-[9px] font-bold text-slate-500">SYNERGY</span>
                  </div>
                  {skillGapsCategorized.useful.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {skillGapsCategorized.useful.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border-2 border-[#17142B] bg-[#FFF8E8] px-2 py-0.5 text-[10px] font-black text-[#17142B]"
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] font-bold text-slate-500">
                      ✓ Useful domains present
                    </p>
                  )}
                </div>

                {/* Optional */}
                <div className="rounded-xl border-2 border-[#17142B] bg-white p-3 shadow-[1px_1px_0_#17142B]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-block rounded-md border border-[#17142B] bg-[#DCCFFF] px-2 py-0.5 text-[9px] font-black uppercase text-[#17142B]">
                      OPTIONAL
                    </span>
                    <span className="text-[9px] font-bold text-slate-500">EXPANSION</span>
                  </div>
                  {skillGapsCategorized.optional.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {skillGapsCategorized.optional.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border-2 border-[#17142B] bg-[#FFF8E8] px-2 py-0.5 text-[10px] font-black text-[#17142B]"
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] font-bold text-slate-500">
                      ✓ No optional gaps remaining
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Search + Filter Panel */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-5 shadow-[4px_4px_0_#17142B]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                <Target size={14} />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-[#17142B]">
                  Filter Scouting Wall
                </h2>
              </div>
            </div>

            <span className="text-[11px] font-black uppercase text-[#7046D9]">
              DYNAMICALLY RANKED BY SYNERGY
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates by name or skill (e.g. Node.js, Python, MongoDB)..."
                className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] py-2.5 pl-10 pr-10 text-xs font-bold text-[#17142B] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#7046D9]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Role Filter Select */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-4 py-2.5 text-xs font-black uppercase text-[#17142B] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#7046D9]"
            >
              <option value="All">All Role Classes</option>
              <option value="Frontend">Frontend Developers</option>
              <option value="Backend">Backend Developers</option>
              <option value="ML">ML Engineers</option>
              <option value="UI/UX">UI/UX Designers</option>
              <option value="Full Stack">Full Stack Developers</option>
            </select>
          </div>

          {/* Result Count and Quick Reset */}
          <div className="mt-3 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
            <span>
              {filteredUsers.length} CHARACTER{filteredUsers.length !== 1 ? "S" : ""} DISCOVERED
            </span>
            {(search || roleFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("")
                  setRoleFilter("All")
                }}
                className="text-[#7046D9] underline hover:text-[#5E35B1]"
              >
                Reset filters
              </button>
            )}
          </div>
        </section>

        {/* ==================== CANDIDATE CARDS GRID ==================== */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const analysis = getCandidateMatchAnalysis(
              currentSquad,
              user,
              currentUser?.projectGoal
            )
            const match = analysis.matchScore
            const selected = selectedUsers.includes(user.id)
            const gapSkills = analysis.gapsAddressed
            const reasons = analysis.whyThisMatch
            const lowerReasons = analysis.whyNotThisMatch

            return (
              <div
                key={user.id}
                className={`group relative flex flex-col justify-between rounded-2xl border-2 border-[#17142B] bg-white p-5 shadow-[4px_4px_0_#17142B] transition duration-150 hover:-translate-y-1 hover:shadow-[6px_6px_0_#17142B] ${
                  selected ? "ring-2 ring-[#7046D9]" : ""
                }`}
              >
                <div>
                  {/* Card Header Tag */}
                  <div className="mb-3 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      RECRUIT #{user.id}
                    </span>
                    <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                      {match}% MATCH
                    </span>
                  </div>

                  {/* Character Avatar & Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] text-3xl shadow-[2px_2px_0_#17142B]">
                      {user.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-black uppercase text-[#17142B]">
                        {user.name}
                      </h3>
                      <p className="text-xs font-black uppercase text-[#7046D9]">
                        {user.role}
                      </p>
                      <span className="mt-0.5 inline-block rounded-md border border-[#17142B] bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {user.experience}
                      </span>
                    </div>
                  </div>

                  {/* Match Meter Bar */}
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <span>SYNERGY POWER</span>
                      <span>{match}/100</span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full border-2 border-[#17142B] bg-[#FFF8E8]">
                      <div
                        className="h-full rounded-full bg-[#7046D9] transition-all duration-500"
                        style={{ width: `${match}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Goal */}
                  {user.projectGoal && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border-2 border-[#17142B] bg-[#FFF8E8] px-2.5 py-1 text-xs">
                      <span className="font-black uppercase text-slate-500 text-[10px]">
                        Mission
                      </span>
                      <span className="font-black text-[#17142B]">{user.projectGoal}</span>
                    </div>
                  )}

                  {/* Skills Loadout */}
                  <div className="mt-3.5">
                    <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skills.map((skill) => {
                        const isGap = gapSkills.includes(skill)
                        return (
                          <span
                            key={skill}
                            className={`rounded-md border-2 px-2 py-0.5 text-[11px] font-black transition ${
                              isGap
                                ? "border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]"
                                : "border-[#17142B] bg-[#FFF8E8] text-slate-700"
                            }`}
                          >
                            {isGap && "✓ "}
                            {skill}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {/* Fills Skill Gap Callout Badge */}
                  {gapSkills.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] px-2.5 py-1 text-xs font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                      <Sparkles size={12} className="text-[#17142B]" />
                      <span>
                        ✦ Fills {gapSkills.length} skill gap{gapSkills.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {/* ==================== WHY THIS MATCH? ==================== */}
                  <div className="mt-3.5 rounded-xl border-2 border-[#17142B] bg-[#DCCFFF]/40 p-3 shadow-[1px_1px_0_#17142B]">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#17142B]">
                      <Sparkles size={11} className="text-[#7046D9]" />
                      WHY THIS MATCH?
                    </div>

                    <div className="space-y-1">
                      {reasons.map((reason, idx) => (
                        <p
                          key={idx}
                          className="flex items-start gap-1.5 text-[11px] font-bold text-slate-800"
                        >
                          <span className="text-[#7046D9] font-black">✓</span>
                          <span>{reason}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* ==================== WHY THIS MATCH IS LOWER (Neutral) ==================== */}
                  {lowerReasons.length > 0 && match < 90 && (
                    <div className="mt-2.5 rounded-xl border border-[#17142B]/20 bg-[#FFF9EF] p-2.5">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        WHY THIS MATCH IS LOWER:
                      </p>
                      <div className="mt-1 space-y-0.5">
                        {lowerReasons.map((reason, idx) => (
                          <p key={idx} className="text-[10px] font-bold text-slate-600">
                            • {reason}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Candidate Action Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  {/* SEE TEAM IMPACT (WHAT-IF SIMULATOR) BUTTON */}
                  <button
                    type="button"
                    onClick={() => setWhatIfCandidate(user)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-white py-2 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5 hover:bg-[#FFF8E8] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <TrendingUp size={14} className="text-[#7046D9]" />
                    <span>SEE TEAM IMPACT</span>
                  </button>

                  {/* ADD TO SQUAD BUTTON */}
                  <button
                    onClick={() => toggleUser(user.id)}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#17142B] py-2.5 text-xs font-black uppercase tracking-wider transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                      selected
                        ? "bg-[#17142B] text-white shadow-[2px_2px_0_#7046D9]"
                        : "bg-[#7046D9] text-white shadow-[2px_2px_0_#17142B] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#17142B]"
                    }`}
                  >
                    {selected ? (
                      <>
                        <Check size={16} />
                        ✓ ADDED TO SQUAD
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        + ADD TO SQUAD
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </section>

        {/* No Results Fallback */}
        {filteredUsers.length === 0 && (
          <div className="rounded-2xl border-2 border-[#17142B] bg-white p-10 text-center shadow-[4px_4px_0_#17142B]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] text-2xl shadow-[2px_2px_0_#17142B]">
              🔎
            </div>
            <h2 className="mt-4 text-xl font-black uppercase text-[#17142B]">
              No Teammates Found on this Wall!
            </h2>
            <p className="mt-1 text-xs font-bold text-slate-600">
              Try a different codename, skill keyword, or reset your class filter.
            </p>
            <button
              onClick={() => {
                setSearch("")
                setRoleFilter("All")
              }}
              className="mt-5 rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ==================== WHAT-IF TEAM SIMULATOR MODAL ==================== */}
      {whatIfCandidate && whatIfImpact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17142B]/80 p-4 backdrop-blur-xs"
          onClick={() => setWhatIfCandidate(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] shadow-[8px_8px_0_#17142B]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between rounded-t-[22px] border-b-2 border-[#17142B] bg-white px-6 py-5">
              <div>
                <div className="mb-1">
                  <span className="inline-block rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
                    ⚡ WHAT-IF SQUAD SIMULATOR
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#17142B]">
                  WHAT IF YOU ADD {whatIfCandidate.name.toUpperCase()}?
                </h2>
                <p className="text-xs font-bold text-slate-600">
                  Preview the projected impact on team power and synergy before committing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setWhatIfCandidate(null)}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-lg font-black text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:bg-[#FFD6CE]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-5">
              {/* Candidate Quick Header */}
              <div className="flex items-center justify-between rounded-2xl border-2 border-[#17142B] bg-white p-4 shadow-[3px_3px_0_#17142B]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] text-2xl shadow-[1px_1px_0_#17142B]">
                    {whatIfCandidate.emoji}
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase text-[#17142B]">
                      {whatIfCandidate.name}
                    </h3>
                    <p className="text-xs font-black uppercase text-[#7046D9]">
                      {whatIfCandidate.role} · {whatIfCandidate.experience}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2.5 py-1 text-xs font-black uppercase shadow-[1px_1px_0_#17142B]">
                    {whatIfCandidate.projectGoal}
                  </span>
                </div>
              </div>

              {/* BEFORE VS AFTER METRICS COMPARISON GRID */}
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  PROJECTED SQUAD METRICS COMPARISON
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                  {/* Skill Coverage */}
                  <div className="rounded-xl border-2 border-[#17142B] bg-white p-3 text-center shadow-[2px_2px_0_#17142B]">
                    <p className="text-[10px] font-black uppercase text-slate-500">COVERAGE</p>
                    <div className="mt-1 flex items-center justify-center gap-1 font-black">
                      <span className="text-xs text-slate-400">{whatIfImpact.currentMetrics.skillCoverage}%</span>
                      <span className="text-xs text-[#7046D9]">→</span>
                      <span className="text-sm text-[#17142B]">{whatIfImpact.projectedMetrics.skillCoverage}%</span>
                    </div>
                    <span className="mt-1 inline-block rounded bg-[#BDE7D6] px-1.5 py-0.2 text-[9px] font-black text-[#17142B]">
                      +{whatIfImpact.deltas.skillCoverage}%
                    </span>
                  </div>

                  {/* Role Diversity */}
                  <div className="rounded-xl border-2 border-[#17142B] bg-white p-3 text-center shadow-[2px_2px_0_#17142B]">
                    <p className="text-[10px] font-black uppercase text-slate-500">ROLES</p>
                    <div className="mt-1 flex items-center justify-center gap-1 font-black">
                      <span className="text-xs text-slate-400">{whatIfImpact.currentMetrics.roleDiversity}</span>
                      <span className="text-xs text-[#7046D9]">→</span>
                      <span className="text-sm text-[#17142B]">{whatIfImpact.projectedMetrics.roleDiversity}</span>
                    </div>
                    <span className="mt-1 inline-block rounded bg-[#DCCFFF] px-1.5 py-0.2 text-[9px] font-black text-[#17142B]">
                      {whatIfImpact.deltas.roleDiversity > 0 ? `+${whatIfImpact.deltas.roleDiversity} NEW` : "SAME"}
                    </span>
                  </div>

                  {/* Compatibility */}
                  <div className="rounded-xl border-2 border-[#17142B] bg-white p-3 text-center shadow-[2px_2px_0_#17142B]">
                    <p className="text-[10px] font-black uppercase text-slate-500">FIT</p>
                    <div className="mt-1 flex items-center justify-center gap-1 font-black">
                      <span className="text-xs text-slate-400">{whatIfImpact.currentMetrics.compatibility}%</span>
                      <span className="text-xs text-[#7046D9]">→</span>
                      <span className="text-sm text-[#17142B]">{whatIfImpact.projectedMetrics.compatibility}%</span>
                    </div>
                    <span className="mt-1 inline-block rounded bg-[#F7A6C7] px-1.5 py-0.2 text-[9px] font-black text-[#17142B]">
                      {whatIfImpact.deltas.compatibility >= 0 ? `+${whatIfImpact.deltas.compatibility}%` : `${whatIfImpact.deltas.compatibility}%`}
                    </span>
                  </div>

                  {/* Readiness */}
                  <div className="rounded-xl border-2 border-[#17142B] bg-white p-3 text-center shadow-[2px_2px_0_#17142B]">
                    <p className="text-[10px] font-black uppercase text-slate-500">READINESS</p>
                    <div className="mt-1 flex items-center justify-center gap-1 font-black">
                      <span className="text-xs text-slate-400">{whatIfImpact.currentMetrics.readiness}%</span>
                      <span className="text-xs text-[#7046D9]">→</span>
                      <span className="text-sm text-[#17142B]">{whatIfImpact.projectedMetrics.readiness}%</span>
                    </div>
                    <span className="mt-1 inline-block rounded bg-[#FFD86B] px-1.5 py-0.2 text-[9px] font-black text-[#17142B]">
                      +{whatIfImpact.deltas.readiness}%
                    </span>
                  </div>

                  {/* Chemistry */}
                  <div className="col-span-2 sm:col-span-1 rounded-xl border-2 border-[#17142B] bg-white p-3 text-center shadow-[2px_2px_0_#17142B]">
                    <p className="text-[10px] font-black uppercase text-slate-500">CHEMISTRY</p>
                    <div className="mt-1 flex items-center justify-center gap-1 font-black">
                      <span className="text-xs text-slate-400">{whatIfImpact.currentMetrics.chemistry}%</span>
                      <span className="text-xs text-[#7046D9]">→</span>
                      <span className="text-sm text-[#17142B]">{whatIfImpact.projectedMetrics.chemistry}%</span>
                    </div>
                    <span className="mt-1 inline-block rounded bg-[#BDE7D6] px-1.5 py-0.2 text-[9px] font-black text-[#17142B]">
                      +{whatIfImpact.deltas.chemistry}%
                    </span>
                  </div>
                </div>
              </div>

              {/* SKILLS GAINED VS ALREADY COVERED */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Gained */}
                <div className="rounded-xl border-2 border-[#17142B] bg-white p-4 shadow-[2px_2px_0_#17142B]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#7046D9]">
                    SKILLS YOU GAIN
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {whatIfImpact.gainedSkills.length > 0 ? (
                      whatIfImpact.gainedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border-2 border-[#17142B] bg-[#BDE7D6] px-2.5 py-1 text-xs font-black text-[#17142B] shadow-[1px_1px_0_#17142B]"
                        >
                          + {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-bold text-slate-500">
                        No brand-new skills added
                      </span>
                    )}
                  </div>
                </div>

                {/* Already Covered */}
                <div className="rounded-xl border-2 border-[#17142B] bg-white p-4 shadow-[2px_2px_0_#17142B]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    ALREADY COVERED
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {whatIfImpact.alreadyCoveredSkills.length > 0 ? (
                      whatIfImpact.alreadyCoveredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-[#17142B]/30 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600"
                        >
                          • {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-bold text-slate-500">
                        Zero skill overlap
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* GAP & ROLE & GOAL IMPACT DETAILS */}
              <div className="rounded-2xl border-2 border-[#17142B] bg-[#DCCFFF]/40 p-4 shadow-[2px_2px_0_#17142B] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black uppercase text-slate-600">GAP IMPACT:</span>
                  <span className="font-black text-[#17142B]">
                    {whatIfImpact.gapsAddressed.length} of {whatIfImpact.currentMetrics.missingSkills.length} major skill gaps addressed
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-[#17142B]/10 pt-2">
                  <span className="font-black uppercase text-slate-600">ROLE IMPACT:</span>
                  <span className="font-black text-[#7046D9]">
                    {whatIfImpact.roleImpact.text}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-[#17142B]/10 pt-2">
                  <span className="font-black uppercase text-slate-600">MISSION ALIGNMENT:</span>
                  <span className="font-black text-[#17142B]">
                    {whatIfImpact.goalImpact.text}
                  </span>
                </div>
              </div>

              {/* TEAM IMPACT SUMMARY BULLETS */}
              <div className="rounded-xl border-2 border-[#17142B] bg-white p-4 shadow-[2px_2px_0_#17142B]">
                <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  KEY TEAM IMPACT SUMMARY
                </p>
                <div className="space-y-1 text-xs font-bold text-slate-800">
                  {whatIfImpact.impactSummary.map((item, idx) => (
                    <p key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#7046D9] font-black">✓</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 sm:flex-row pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedUsers.includes(whatIfCandidate.id)) {
                      toggleUser(whatIfCandidate.id)
                    }
                    setWhatIfCandidate(null)
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] py-3.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#17142B]"
                >
                  <UserPlus size={16} />
                  <span>
                    {selectedUsers.includes(whatIfCandidate.id)
                      ? "ALREADY IN SQUAD"
                      : `ADD ${whatIfCandidate.name.toUpperCase()} TO SQUAD`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWhatIfCandidate(null)}
                  className="rounded-2xl border-2 border-[#17142B] bg-white px-6 py-3.5 text-xs font-black uppercase text-slate-700 shadow-[2px_2px_0_#17142B] hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PERSISTENT SQUAD DOCK ==================== */}
      <aside
        aria-label="Squad Selection Preview"
        className="fixed bottom-5 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center justify-between gap-4 rounded-3xl border-2 border-[#17142B] bg-white p-4 shadow-[6px_6px_0_#17142B] transition-all"
      >
        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex -space-x-2 overflow-hidden py-1">
              {currentSquad.map((m) => {
                const isUser = m.id === "current-user" || m.isCurrentUser
                return (
                  <div
                    key={m.id}
                    title={`${m.name}${isUser ? " (YOU)" : ""}`}
                    className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-[#17142B] text-lg sm:text-xl shadow-[2px_2px_0_#17142B] ${
                      isUser ? "bg-[#FFD86B]" : "bg-[#FFF8E8]"
                    }`}
                  >
                    {m.emoji}
                  </div>
                )
              })}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black uppercase text-[#17142B]">
                YOUR SQUAD — {currentSquad.length}{" "}
                {currentSquad.length === 1 ? "BUILDER" : "BUILDERS"}
              </p>
              <p className="text-[11px] font-bold text-slate-500">
                {currentSquad.length === 1
                  ? `${currentUser?.name} (YOU) · Select allies above`
                  : `${currentSquad.length} builders ready to analyze`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setTeamNameError("")
              setIsNamingModalOpen(true)
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] px-5 py-2.5 sm:py-3 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 hover:bg-[#ffe28a] hover:shadow-[4px_4px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <span>NAME YOUR SQUAD</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </aside>

      {/* ==================== IDEAL SQUAD RECOMMENDATION MODAL ==================== */}
      {isIdealModalOpen && idealSquadRecommendation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17142B]/80 p-4 backdrop-blur-xs"
          onClick={() => setIsIdealModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] shadow-[8px_8px_0_#17142B]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between rounded-t-[22px] border-b-2 border-[#17142B] bg-white px-6 py-5">
              <div>
                <div className="mb-1">
                  <span className="inline-block rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
                    ⚡ SMART COMPOSITION ENGINE
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#17142B]">
                  Your Ideal Squad
                </h2>
                <p className="text-xs font-bold text-slate-600">
                  Recommended allies designed to fill your skill gaps and balance roles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsIdealModalOpen(false)}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-lg font-black text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:bg-[#FFD6CE]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6">
              <div className="space-y-3">
                {idealSquadRecommendation.fullSquad.map((m) => {
                  const isUser = m.id === "current-user" || m.isCurrentUser
                  return (
                    <div
                      key={m.id}
                      className={`flex items-center justify-between rounded-2xl border-2 border-[#17142B] p-3.5 shadow-[2px_2px_0_#17142B] ${
                        isUser ? "bg-[#FFD86B]/30" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-2xl shadow-[1px_1px_0_#17142B]">
                          {m.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black uppercase text-[#17142B]">
                              {m.name}
                            </h4>
                            {isUser && (
                              <span className="rounded border-2 border-[#17142B] bg-[#FFD86B] px-1.5 py-0.2 text-[8px] font-black uppercase">
                                YOU (FOUNDER)
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-black uppercase text-[#7046D9]">
                            {m.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                        {(m.skills || []).slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="rounded-md border border-[#17142B]/30 bg-[#FFF8E8] px-1.5 py-0.5 text-[9px] font-bold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* WHY THIS SQUAD? Reason Block */}
              <div className="mt-5 rounded-2xl border-2 border-[#17142B] bg-[#DCCFFF]/40 p-4 shadow-[2px_2px_0_#17142B]">
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#17142B]">
                  <Sparkles size={13} className="text-[#7046D9]" />
                  WHY THIS SQUAD?
                </h4>
                <div className="space-y-1.5 text-xs font-bold text-slate-800">
                  <p className="flex items-center gap-2">
                    <span className="text-[#7046D9] font-black">✓</span>
                    <span>
                      Covers <strong>{idealSquadRecommendation.coveragePercent}%</strong> of all core technical superpowers
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#7046D9] font-black">✓</span>
                    <span>
                      Includes <strong>{idealSquadRecommendation.uniqueRolesCount}</strong> distinct complementary classes
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#7046D9] font-black">✓</span>
                    <span>
                      High mission synergy for <strong>{currentUser?.projectGoal}</strong>
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={applyIdealSquad}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] py-3 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#17142B]"
                >
                  <Check size={16} />
                  <span>USE THIS SQUAD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsIdealModalOpen(false)}
                  className="rounded-2xl border-2 border-[#17142B] bg-white px-5 py-3 text-xs font-black uppercase text-slate-700 shadow-[2px_2px_0_#17142B] hover:bg-slate-50"
                >
                  Keep Current Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== NAME YOUR SQUAD MODAL ==================== */}
      {isNamingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17142B]/80 p-4 backdrop-blur-xs"
          onClick={() => setIsNamingModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="name-squad-title"
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] shadow-[8px_8px_0_#17142B]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between rounded-t-[22px] border-b-2 border-[#17142B] bg-white px-6 py-5">
              <div>
                <div className="mb-1">
                  <span className="inline-block rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
                    STEP 03 · NAME YOUR SQUAD
                  </span>
                </div>
                <h2
                  id="name-squad-title"
                  className="text-2xl font-black uppercase tracking-tight text-[#17142B]"
                >
                  NAME YOUR SQUAD
                </h2>
                <p className="text-xs font-bold text-slate-600">
                  Every great team needs a name.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNamingModalOpen(false)}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-lg font-black text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:bg-[#FFD6CE]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-5 rounded-2xl border-2 border-[#17142B] bg-white p-4 shadow-[2px_2px_0_#17142B]">
                <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  CONFIRMED ROSTER ({currentSquad.length} BUILDERS)
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentSquad.map((m) => {
                    const isUser = m.id === "current-user" || m.isCurrentUser
                    return (
                      <span
                        key={m.id}
                        className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] px-2.5 py-1 text-xs font-black text-[#17142B] shadow-[1px_1px_0_#17142B] ${
                          isUser ? "bg-[#FFD86B]" : "bg-[#FFF8E8]"
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.name}</span>
                        {isUser && (
                          <span className="rounded bg-[#17142B] px-1 py-0.2 text-[8px] font-black text-white">
                            YOU
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-[#7046D9]">
                          • {m.role}
                        </span>
                      </span>
                    )
                  })}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleBuildTeam()
                }}
              >
                <label
                  htmlFor="squad-name-input"
                  className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#17142B]"
                >
                  Enter your team name…
                </label>
                <div className="relative">
                  <input
                    id="squad-name-input"
                    type="text"
                    maxLength={30}
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value)
                      if (teamNameError) setTeamNameError("")
                    }}
                    placeholder="e.g. Code Titans"
                    autoFocus
                    className="w-full rounded-2xl border-2 border-[#17142B] bg-white px-4 py-3 text-sm font-black text-[#17142B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7046D9]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                    {teamName.length}/30
                  </span>
                </div>

                {teamNameError && (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    {teamNameError}
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] py-3.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[4px_4px_0_#17142B] transition hover:-translate-y-0.5 hover:bg-[#ffe28a] hover:shadow-[5px_5px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <span>BUILD MY SQUAD</span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNamingModalOpen(false)}
                    className="py-2 text-xs font-black uppercase text-slate-500 hover:text-slate-800"
                  >
                    Keep Scouting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindTeammates