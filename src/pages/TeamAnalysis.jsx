import { useMemo, useState } from "react"
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
  X,
  Share2,
  Award,
  Compass,
  Network,
  Copy,
  Info,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { allCoreSkills, demoUsers } from "../data/teamData"

function TeamAnalysis() {
  const navigate = useNavigate()

  // Load saved profile
  const profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("teamfuseProfile") || "null")
    } catch {
      return null
    }
  })()

  // Load saved squad
  const rawTeam = (() => {
    try {
      return JSON.parse(localStorage.getItem("teamfuseTeam") || "[]")
    } catch {
      return []
    }
  })()

  // Ensure current user is ALWAYS member #1 in team, without creating duplicates
  const team = useMemo(() => {
    if (profile && !rawTeam.some((m) => m.id === "current-user" || m.isCurrentUser)) {
      const userMember = {
        ...profile,
        id: "current-user",
        isCurrentUser: true,
        emoji: profile.emoji || "👩🏻‍💻",
      }
      return [userMember, ...rawTeam]
    }
    // If team already has member #1 or profile is inside rawTeam
    if (rawTeam.length > 0) {
      return rawTeam
    }
    // Fallback if accessed directly with a profile
    if (profile) {
      return [
        {
          ...profile,
          id: "current-user",
          isCurrentUser: true,
          emoji: profile.emoji || "👩🏻‍💻",
        },
      ]
    }
    return []
  }, [profile, rawTeam])

  const teamName =
    localStorage.getItem("teamfuseTeamName") ||
    (team[0]?.name ? `${team[0].name}'s Squad` : "Code Titans")

  // ==================== SKILL COVERAGE ====================
  const coveredSkills = useMemo(() => {
    return [...new Set(team.flatMap((member) => member.skills || []))]
  }, [team])

  const missingSkills = useMemo(() => {
    return allCoreSkills.filter((skill) => !coveredSkills.includes(skill))
  }, [coveredSkills])

  const skillCoverage = useMemo(() => {
    if (allCoreSkills.length === 0) return 0
    return Math.min(
      100,
      Math.round((coveredSkills.length / allCoreSkills.length) * 100)
    )
  }, [coveredSkills])

  // Roles in current squad
  const uniqueRoles = useMemo(() => {
    return [...new Set(team.map((member) => member.role).filter(Boolean))]
  }, [team])

  // Project Goal Alignment
  const projectGoal = profile?.projectGoal || team[0]?.projectGoal || "Hackathon"

  const sameGoalMembers = useMemo(() => {
    return team.filter((member) => member.projectGoal === projectGoal)
  }, [team, projectGoal])

  const projectGoalMatch = useMemo(() => {
    if (team.length === 0) return 0
    return Math.round((sameGoalMembers.length / team.length) * 100)
  }, [team, sameGoalMembers])

  // ==================== TEAM COMPATIBILITY ====================
  const compatibilityScore = useMemo(() => {
    if (team.length === 0) return 0
    let score = 0
    // Skill breadth: up to 35
    score += Math.min(35, coveredSkills.length * 5)
    // Role diversity: up to 25
    score += Math.min(25, uniqueRoles.length * 8)
    // Goal match: up to 25
    score += Math.round(projectGoalMatch * 0.25)
    // Experience mix: up to 15
    const experiences = new Set(team.map((m) => m.experience))
    score += Math.min(15, experiences.size * 5)

    return Math.min(100, Math.round(score))
  }, [team, coveredSkills, uniqueRoles, projectGoalMatch])

  const getCompatibilityLabel = () => {
    if (compatibilityScore >= 80) return "Highly Compatible"
    if (compatibilityScore >= 60) return "Good Compatibility"
    return "Growing Compatibility"
  }

  // ==================== TEAM READINESS ====================
  const readinessScore = useMemo(() => {
    if (team.length === 0) return 0
    let score = 0
    score += Math.round(skillCoverage * 0.45)
    score += Math.min(25, uniqueRoles.length * 8)
    score += Math.round(projectGoalMatch * 0.2)
    if (team.length >= 3) {
      score += 10
    } else if (team.length === 2) {
      score += 5
    }
    return Math.min(100, Math.round(score))
  }, [team, skillCoverage, uniqueRoles, projectGoalMatch])

  const getReadinessLabel = () => {
    if (readinessScore >= 80) return "READY TO BUILD 🚀"
    if (readinessScore >= 60) return "ALMOST READY 🔥"
    return "NEEDS A BOOST ⚡"
  }

  // ==================== TEAM CHEMISTRY ====================
  const chemistryScore = useMemo(() => {
    if (team.length === 0) return 0
    let score = 40 // Baseline cohesion
    // Role complementarity
    if (uniqueRoles.length >= 3) score += 20
    else if (uniqueRoles.length >= 2) score += 12

    // Shared mission
    score += Math.round(projectGoalMatch * 0.2)

    // Experience diversity
    const experiences = new Set(team.map((m) => m.experience))
    if (experiences.size >= 2) score += 10

    // Skill coverage contribution
    score += Math.round(skillCoverage * 0.1)

    return Math.min(100, Math.round(score))
  }, [team, uniqueRoles, projectGoalMatch, skillCoverage])

  // ==================== TEAM BALANCE (ROLE DISTRIBUTION) ====================
  const roleDistribution = useMemo(() => {
    const counts = {}
    team.forEach((m) => {
      const r = m.role || "Other"
      counts[r] = (counts[r] || 0) + 1
    })
    return counts
  }, [team])

  // Check key standard tech roles
  const standardRoles = [
    "Frontend Developer",
    "Backend Developer",
    "ML Engineer",
    "UI/UX Designer",
  ]

  const missingStandardRoles = useMemo(() => {
    return standardRoles.filter((role) => !uniqueRoles.includes(role))
  }, [uniqueRoles])

  // ==================== TEAM RISK RADAR (With Single-Person Dependency) ====================
  const teamRisks = useMemo(() => {
    const risks = []

    // 1. Small squad check
    if (team.length < 2) {
      risks.push({
        type: "warning",
        title: "Small Squad",
        message: "Add at least one more teammate for better collaboration and synergy.",
        icon: Users,
      })
    }

    // 2. Single-Person Dependencies detection
    if (team.length >= 2) {
      // Check each member's unique skills and roles
      team.forEach((member) => {
        const memberSkills = member.skills || []
        const otherMembers = team.filter((m) => m.id !== member.id)
        const otherSkills = new Set(otherMembers.flatMap((m) => m.skills || []))

        // Skills that ONLY this member provides
        const exclusiveSkills = memberSkills.filter((s) => !otherSkills.has(s))

        // Roles that ONLY this member provides
        const otherRoles = new Set(otherMembers.map((m) => m.role))
        const isExclusiveRole = !otherRoles.has(member.role)

        if (exclusiveSkills.length >= 2 || (isExclusiveRole && ["Backend Developer", "ML Engineer", "UI/UX Designer"].includes(member.role))) {
          const depArea = isExclusiveRole ? member.role.split(" ")[0] : exclusiveSkills[0]
          risks.push({
            type: "warning",
            title: `${depArea.toUpperCase()} DEPENDENCY`,
            message: `Only ${member.name} currently provides ${depArea} capabilities. If ${member.name} leaves, ${depArea} coverage would decrease significantly.`,
            icon: AlertTriangle,
          })
        }
      })
    }

    // 3. Large Skill Gap
    if (missingSkills.length >= 3) {
      risks.push({
        type: "warning",
        title: "Large Skill Gap",
        message: `${missingSkills.length} core abilities are still missing from your squad.`,
        icon: AlertTriangle,
      })
    }

    // 4. Role Concentration
    if (uniqueRoles.length === 1 && team.length > 1) {
      risks.push({
        type: "danger",
        title: "Role Concentration",
        message: "All squad allies belong to the same role class. Consider recruiting complementary classes.",
        icon: Briefcase,
      })
    }

    // 5. Mission Misalignment
    if (projectGoalMatch < 50 && team.length > 1) {
      risks.push({
        type: "warning",
        title: "Mission Misalignment",
        message: "Less than half of the squad shares the same primary project goal.",
        icon: Target,
      })
    }

    // 6. Experience Gap
    const beginnerCount = team.filter((m) => m.experience === "Beginner").length
    if (team.length >= 3 && beginnerCount === team.length) {
      risks.push({
        type: "warning",
        title: "Experience Gap",
        message: "Everyone is currently at beginner power level. Consider adding an experienced builder.",
        icon: Star,
      })
    }

    return risks
  }, [team, missingSkills, uniqueRoles, projectGoalMatch])

  // ==================== TEAMFUSE ADVISOR (Rule-Based Insights) ====================
  const advisorInsights = useMemo(() => {
    const insights = []

    // Missing backend check
    if (!uniqueRoles.includes("Backend Developer") && !uniqueRoles.includes("Full Stack Developer")) {
      insights.push({
        id: "missing-backend",
        tag: "ARCHITECTURE",
        text: "Your squad currently has no Backend specialist. Server-side API and database implementation may encounter friction.",
      })
    }

    // Single person key dependency check
    const backendMembers = team.filter((m) => m.role === "Backend Developer" || (m.skills || []).includes("Node.js"))
    if (backendMembers.length === 1 && team.length >= 3) {
      insights.push({
        id: "single-backend",
        tag: "REDUNDANCY",
        text: `Backend architecture currently depends entirely on ${backendMembers[0].name}. Consider cross-training or adding full-stack backup.`,
      })
    }

    // High coverage praise
    if (skillCoverage >= 85) {
      insights.push({
        id: "high-coverage",
        tag: "STRENGTH",
        text: "Most identified core technical superpowers are fully covered across your roster.",
      })
    }

    // Role diversity review
    if (uniqueRoles.length >= 3) {
      insights.push({
        id: "diverse-roles",
        tag: "DIVERSITY",
        text: `Strong cross-functional synergy with ${uniqueRoles.length} distinct specializations active in the squad.`,
      })
    } else if (team.length >= 3 && uniqueRoles.length < 2) {
      insights.push({
        id: "role-concentration",
        tag: "BALANCE",
        text: "Your squad has strong representation in one role but limited role diversity. Complementary classes recommended.",
      })
    }

    // Mission alignment check
    if (projectGoalMatch === 100 && team.length >= 2) {
      insights.push({
        id: "full-alignment",
        tag: "MISSION",
        text: `100% of your squad is aligned on the ${projectGoal} mission. High focus and shared velocity expected.`,
      })
    }

    // Return most valuable 1 to 3 insights
    return insights.slice(0, 3)
  }, [team, uniqueRoles, skillCoverage, projectGoalMatch, projectGoal])

  // ==================== SUGGESTED TEAM LEAD ====================
  const getTeamLeadScore = (member) => {
    let score = 0
    if (member.experience === "Advanced") score += 30
    else if (member.experience === "Intermediate") score += 20
    else if (member.experience === "Beginner") score += 10

    score += Math.min(25, (member.skills || []).length * 5)
    if (member.projectGoal === projectGoal) score += 25
    if (member.role === "Full Stack Developer" || member.role === "Backend Developer") {
      score += 15
    } else {
      score += 10
    }
    return Math.min(100, score)
  }

  const teamLead = useMemo(() => {
    if (team.length === 0) return null
    return [...team]
      .map((member) => ({
        ...member,
        leadScore: getTeamLeadScore(member),
      }))
      .sort((a, b) => b.leadScore - a.leadScore)[0]
  }, [team, projectGoal])

  // ==================== TEAM BADGES ====================
  const teamBadges = useMemo(() => {
    const experiences = new Set(team.map((m) => m.experience))
    return [
      {
        id: "skill-stacked",
        title: "SKILL STACKED",
        description: "High skill coverage across the board",
        unlocked: skillCoverage >= 80,
        icon: "⚡",
        criteria: "Coverage ≥ 80%",
      },
      {
        id: "role-mix",
        title: "ROLE MIX",
        description: "Multiple distinct role classes represented",
        unlocked: uniqueRoles.length >= 3,
        icon: "🎭",
        criteria: "≥ 3 distinct roles",
      },
      {
        id: "mission-aligned",
        title: "MISSION ALIGNED",
        description: "Strong alignment on project goal",
        unlocked: projectGoalMatch >= 70 && team.length >= 2,
        icon: "🎯",
        criteria: "≥ 70% mission fit",
      },
      {
        id: "diverse-builders",
        title: "DIVERSE BUILDER MIX",
        description: "Balanced mix of power levels",
        unlocked: experiences.size >= 2 && team.length >= 2,
        icon: "👑",
        criteria: "≥ 2 power levels",
      },
    ]
  }, [skillCoverage, uniqueRoles, projectGoalMatch, team])

  // ==================== REPLACEMENT & CANDIDATES ====================
  const [replaceMember, setReplaceMember] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Available candidate pool (excluding all members in current squad)
  const availableCandidates = useMemo(() => {
    return demoUsers.filter(
      (candidate) => !team.some((member) => member.id === candidate.id)
    )
  }, [team])

  // Recruitment Recommendations
  const recommendedCandidates = useMemo(() => {
    return availableCandidates
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
  }, [availableCandidates, missingSkills])

  const handleAddCandidate = (candidate) => {
    const updatedTeam = [...team, candidate]
    localStorage.setItem("teamfuseTeam", JSON.stringify(updatedTeam))
    window.location.reload()
  }

  // Prioritized candidates for replacement
  const prioritizedCandidates = useMemo(() => {
    return availableCandidates
      .map((candidate) => {
        const gapSkills = (candidate.skills || []).filter((skill) =>
          missingSkills.includes(skill)
        )
        let score = 0
        score += gapSkills.length * 20
        if (candidate.projectGoal === projectGoal) score += 15
        if (candidate.experience === "Advanced") score += 10
        else if (candidate.experience === "Intermediate") score += 5
        if (replaceMember && candidate.role === replaceMember.role) score += 10
        return { ...candidate, gapSkills, replacementScore: score }
      })
      .sort((a, b) => b.replacementScore - a.replacementScore)
  }, [availableCandidates, missingSkills, projectGoal, replaceMember])

  const handleReplaceMember = (oldMember, newMember) => {
    // Current user can NEVER be replaced
    if (oldMember.id === "current-user" || oldMember.isCurrentUser) return

    const updatedTeam = team.map((member) =>
      member.id === oldMember.id ? newMember : member
    )

    localStorage.setItem("teamfuseTeam", JSON.stringify(updatedTeam))
    setReplaceMember(null)
    window.location.reload()
  }

  // Handle Copy Squad Summary
  const handleCopySummary = () => {
    const summaryText = `⚡ TEAMFUSE SQUAD: ${teamName}\n` +
      `Builders (${team.length}): ${team.map((m) => `${m.name} (${m.role})`).join(", ")}\n` +
      `Skill Coverage: ${skillCoverage}%\n` +
      `Team Fit: ${compatibilityScore}%\n` +
      `Readiness: ${readinessScore}%\n` +
      `Mission: ${projectGoal}\n` +
      `Assembled on TeamFuse 🚀`

    navigator.clipboard.writeText(summaryText)
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2500)
  }

  // Empty State Fallback
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
              YOUR SQUAD IS EMPTY
            </div>

            <h1 className="mt-3 text-3xl font-black uppercase text-[#17142B]">
              Your Squad Is Empty
            </h1>

            <p className="mt-2 text-sm font-bold text-slate-600 leading-relaxed">
              Pick teammates whose skills complement yours to activate your team scoreboard.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/find-teammates")}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                BUILD YOUR SQUAD
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E8] px-5 py-8 pb-20 text-[#17142B] selection:bg-[#FFD86B] selection:text-[#17142B]">
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

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#17142B] bg-white px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5 hover:bg-[#FFF8E8]"
            >
              <Share2 size={13} />
              SHARE SQUAD
            </button>

            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#17142B]">
              <Zap size={13} fill="currentColor" />
              FINAL REPORT · ISSUE #01
            </div>
          </div>
        </header>

        {/* ==================== 1. TEAM IDENTITY ==================== */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] p-6 shadow-[6px_6px_0_#17142B] sm:p-8">
          <div className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 bg-halftone-purple opacity-40" />

          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-3 py-1 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Zap size={14} fill="currentColor" />
              ⚡ TEAMFUSE SQUAD DOSSIER
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5"
              >
                <Share2 size={13} />
                SHARE SQUAD CARD
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] px-3.5 py-1 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Flame size={14} className="text-amber-700" />
                FUSED & ASSEMBLED!
              </div>
            </div>
          </div>

          <div className="mt-2">
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#17142B] sm:text-4xl lg:text-5xl">
              {teamName}
            </h1>
            <p className="mt-1.5 text-xs font-bold text-slate-600 sm:text-sm">
              “Built around {team[0]?.name || "You"}. Powered by complementary superpowers.”
            </p>
          </div>

          {/* Prominent Team Specs Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t-2 border-[#17142B]/10 pt-4 text-xs font-black uppercase tracking-wider text-slate-700">
            <span className="rounded-xl border-2 border-[#17142B] bg-white px-3.5 py-1.5 text-[#17142B] shadow-[1px_1px_0_#17142B]">
              {team.length} {team.length === 1 ? "BUILDER" : "BUILDERS"}
            </span>
            <span className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1.5 text-[#17142B] shadow-[1px_1px_0_#17142B]">
              {skillCoverage}% SKILL COVERAGE
            </span>
            <span className="rounded-xl border-2 border-[#17142B] bg-white px-3.5 py-1.5 text-[#7046D9] shadow-[1px_1px_0_#17142B]">
              MISSION: {projectGoal}
            </span>
            <span className="rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] px-3.5 py-1.5 text-[#17142B] shadow-[1px_1px_0_#17142B]">
              CHEMISTRY: {chemistryScore}%
            </span>
          </div>
        </section>

        {/* Solo Builder Notice */}
        {team.length === 1 && (
          <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-[#17142B] bg-[#FFF9EF] p-5 shadow-[4px_4px_0_#17142B]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFD86B] text-2xl shadow-[2px_2px_0_#17142B]">
                ⚡
              </div>
              <div>
                <p className="text-sm font-black uppercase text-[#17142B]">
                  You're currently building solo!
                </p>
                <p className="text-xs font-bold text-slate-600">
                  Recruit allies whose technical abilities complement yours to unlock full synergy.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/find-teammates")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5"
            >
              <UserPlus size={14} />
              <span>RECRUIT TEAMMATES</span>
            </button>
          </section>
        )}

        {/* ==================== STAT BLOCKS GRID (Power, Fit, Readiness, Chemistry) ==================== */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  {coveredSkills.length} of {allCoreSkills.length} Skills
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Target size={22} />
              </div>
            </div>
          </div>

          {/* Team Fit / Compatibility */}
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

          {/* Team Chemistry Indicator */}
          <div className="rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] p-5 shadow-[4px_4px_0_#17142B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#17142B]/70">
                  TEAM CHEMISTRY
                </p>
                <p className="mt-1 text-3xl font-black text-[#17142B]">
                  {chemistryScore}%
                </p>
                <p className="text-xs font-black uppercase text-[#17142B]/80">
                  Synergy Index
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Flame size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-Side: Team Power Meter & Ready Check */}
        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* Panel 1: Team Power Meter */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#F7A6C7] shadow-[1px_1px_0_#17142B]">
                      <Sparkles size={18} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-wide text-[#17142B]">
                      TEAM COMPATIBILITY
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

              {/* Progress Meter */}
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

            {/* Supporting Breakdown */}
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

          {/* Panel 2: Ready Check & Chemistry Note */}
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

            <div className="mt-6 rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3.5 shadow-[2px_2px_0_#17142B]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#17142B]">
                  TEAM CHEMISTRY: {chemistryScore}%
                </span>
                <span className="text-[10px] font-black uppercase text-[#7046D9]">
                  COHESION
                </span>
              </div>
              <p className="mt-1 text-[11px] font-bold text-slate-600">
                “Based on role complementarity, skill coverage and shared goals.” (TeamFuse-generated indicator)
              </p>
            </div>
          </div>
        </section>

        {/* ==================== 5. TEAM BALANCE (ROLE DISTRIBUTION) ==================== */}
        <section className="mb-10 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#DCCFFF] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                <Briefcase size={18} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase text-[#17142B]">
                  TEAM BALANCE
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  Role class distribution and squad structural diversity
                </p>
              </div>
            </div>

            <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2.5 py-1 text-xs font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
              {uniqueRoles.length} {uniqueRoles.length === 1 ? "ROLE CLASS" : "DIFFERENT ROLES"} REPRESENTED
            </span>
          </div>

          {/* Role Distribution Bar Visualizer */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(roleDistribution).map(([roleName, count]) => (
              <div
                key={roleName}
                className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3.5 shadow-[2px_2px_0_#17142B]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#17142B]">
                    {roleName}
                  </span>
                  <span className="rounded-md border border-[#17142B] bg-white px-2 py-0.5 text-xs font-black text-[#7046D9]">
                    {count}
                  </span>
                </div>
                {/* Visual bar */}
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full border border-[#17142B] bg-white">
                  <div
                    className="h-full bg-[#7046D9]"
                    style={{ width: `${Math.min(100, (count / team.length) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Factual Absence Notices */}
          {missingStandardRoles.length > 0 && (
            <div className="mt-4 rounded-xl border border-[#17142B]/20 bg-[#FFF9EF] p-3">
              <p className="text-xs font-bold text-slate-700">
                <span className="font-black text-[#17142B]">Note: </span>
                {missingStandardRoles.map((role, idx) => (
                  <span key={role}>
                    Your squad currently has no {role} specialist{idx < missingStandardRoles.length - 1 ? " · " : "."}
                  </span>
                ))}
              </p>
            </div>
          )}
        </section>

        {/* ==================== 6. TEAM RISK RADAR ==================== */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#F7A6C7] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#17142B]">
                  TEAM RISK RADAR
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  Structural risks and single-person key dependencies
                </p>
              </div>
            </div>

            <span
              className={`rounded-lg border-2 border-[#17142B] px-3 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0_#17142B] ${
                teamRisks.length === 0 ? "bg-[#BDE7D6]" : "bg-[#FFD86B]"
              }`}
            >
              {teamRisks.length === 0
                ? "NO RISKS DETECTED"
                : `${teamRisks.length} ALERT${teamRisks.length > 1 ? "S" : ""}`}
            </span>
          </div>

          {teamRisks.length === 0 ? (
            <div className="rounded-2xl border-2 border-[#17142B] bg-[#BDE7D6] p-6 shadow-[4px_4px_0_#17142B]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase">
                    Squad Looks Well Balanced! 🎉
                  </h3>
                  <p className="mt-1 text-xs font-bold text-[#17142B]/70">
                    No single-person bottlenecks or critical structural vulnerabilities detected.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {teamRisks.map((risk, index) => {
                const RiskIcon = risk.icon
                return (
                  <div
                    key={`${risk.title}-${index}`}
                    className={`rounded-2xl border-2 border-[#17142B] p-5 shadow-[4px_4px_0_#17142B] ${
                      risk.type === "danger" ? "bg-[#F7A6C7]" : "bg-[#FFD86B]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white shadow-[2px_2px_0_#17142B]">
                        <RiskIcon size={19} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase">
                          {risk.title}
                        </h3>
                        <p className="mt-1 text-xs font-bold leading-relaxed text-[#17142B]/80">
                          {risk.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ==================== 7. TEAMFUSE ADVISOR ==================== */}
        <section className="mb-10 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                <Compass size={18} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase text-[#17142B]">
                  TEAMFUSE ADVISOR
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  Targeted rule-based strategic recommendations for your squad
                </p>
              </div>
            </div>

            <span className="rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
              RULE-BASED INSIGHTS
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {advisorInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex flex-col justify-between rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-4 shadow-[2px_2px_0_#17142B]"
              >
                <div>
                  <span className="inline-block rounded-md border border-[#17142B] bg-white px-2 py-0.5 text-[9px] font-black uppercase text-[#7046D9]">
                    {insight.tag}
                  </span>
                  <p className="mt-2 text-xs font-bold text-slate-800 leading-relaxed">
                    {insight.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 8. TEAM DEPENDENCY MAP ==================== */}
        <section className="mb-10 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex items-center gap-2.5 border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] text-[#17142B] shadow-[1px_1px_0_#17142B]">
              <Network size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase text-[#17142B]">
                TEAM RELATIONSHIP & DEPENDENCY MAP
              </h2>
              <p className="text-xs font-bold text-slate-500">
                Visual alignment between the founder and recruited allies
              </p>
            </div>
          </div>

          {/* Simple Clean Visual Relationship Tree */}
          <div className="flex flex-col items-center py-4">
            {/* Top Root Node: FOUNDER (YOU) */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2.5 rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] px-5 py-3 shadow-[3px_3px_0_#17142B]">
                <span className="text-2xl">{team[0]?.emoji}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black uppercase text-[#17142B]">
                      {team[0]?.name}
                    </span>
                    <span className="rounded bg-[#17142B] px-1 py-0.2 text-[8px] font-black text-white">
                      FOUNDER (YOU)
                    </span>
                  </div>
                  <span className="text-[11px] font-black uppercase text-[#7046D9]">
                    {team[0]?.role}
                  </span>
                </div>
              </div>

              {/* Connecting vertical trunk if allies exist */}
              {team.length > 1 && (
                <div className="h-6 w-0.5 border-l-2 border-dashed border-[#17142B]" />
              )}
            </div>

            {/* Allies row */}
            {team.length > 1 && (
              <div className="flex flex-wrap justify-center gap-4 pt-1">
                {team.slice(1).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2.5 rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-4 py-2.5 shadow-[2px_2px_0_#17142B]"
                  >
                    <span className="text-xl">{member.emoji}</span>
                    <div>
                      <p className="text-xs font-black uppercase text-[#17142B]">
                        {member.name}
                      </p>
                      <p className="text-[10px] font-black uppercase text-[#7046D9]">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ==================== 9. TEAM MEMBERS SECTION ==================== */}
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
                  Active builder roster powering your squad
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
            {team.map((member) => {
              const isCurrentUser =
                member.id === "current-user" || Boolean(member.isCurrentUser)

              return (
                <div
                  key={member.id}
                  className={`group flex flex-col justify-between rounded-2xl border-2 ${
                    isCurrentUser
                      ? "border-[#7046D9] ring-2 ring-[#FFD86B]/60 bg-[#FFFDF5]"
                      : "border-[#17142B] bg-white"
                  } p-5 shadow-[4px_4px_0_#17142B] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#17142B]`}
                >
                  <div>
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {isCurrentUser ? "PLAYER 1" : `MEMBER #${member.id}`}
                      </span>
                      {isCurrentUser ? (
                        <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[9px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                          YOU
                        </span>
                      ) : (
                        <span className="rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-2 py-0.2 text-[9px] font-black uppercase text-[#17142B]">
                          ALLY
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] text-3xl shadow-[2px_2px_0_#17142B]">
                        {member.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-lg font-black uppercase text-[#17142B]">
                            {member.name}
                          </h3>
                          {isCurrentUser && (
                            <span className="rounded border-2 border-[#17142B] bg-[#FFD86B] px-1.5 py-0.2 text-[8px] font-black uppercase text-[#17142B]">
                              YOU
                            </span>
                          )}
                        </div>
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

                  {/* Replace Button: Allowed ONLY for other teammates, NEVER for current user */}
                  {!isCurrentUser ? (
                    <button
                      type="button"
                      onClick={() => setReplaceMember(member)}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-white py-2 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5 hover:bg-[#FFF8E8] hover:shadow-[3px_3px_0_#17142B]"
                    >
                      <UserPlus size={14} className="text-[#7046D9]" />
                      <span>REPLACE</span>
                    </button>
                  ) : (
                    <div className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#17142B]/20 bg-[#FFF8E8] py-2 text-[10px] font-black uppercase tracking-wider text-slate-600">
                      <span>★ SQUAD FOUNDER (YOU)</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ==================== 10. SUGGESTED TEAM LEAD ==================== */}
        {teamLead && (
          <section className="relative mb-10 overflow-hidden rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] p-6 shadow-[5px_5px_0_#17142B]">
            <div className="relative">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_#17142B]">
                    <Star size={13} fill="currentColor" />
                    Suggested Team Lead
                  </div>
                  <p className="mt-2 text-xs font-bold text-[#17142B]/70">
                    Calculated based on experience, skill count, role leadership, and mission alignment.
                  </p>
                </div>

                <div className="hidden rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-3 py-2 text-center text-white shadow-[2px_2px_0_#17142B] sm:block">
                  <p className="text-[9px] font-black uppercase tracking-widest">
                    Lead Score
                  </p>
                  <p className="text-xl font-black">{teamLead.leadScore}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5 rounded-xl border-2 border-[#17142B] bg-white p-4 shadow-[3px_3px_0_#17142B] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-[#DCCFFF] text-3xl shadow-[2px_2px_0_#17142B]">
                    {teamLead.emoji}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black uppercase text-[#17142B]">
                        {teamLead.name}
                      </h3>
                      {(teamLead.id === "current-user" || teamLead.isCurrentUser) && (
                        <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[9px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                          YOU
                        </span>
                      )}
                      <span className="rounded-md border-2 border-[#17142B] bg-[#BDE7D6] px-2 py-0.5 text-[9px] font-black uppercase shadow-[1px_1px_0_#17142B]">
                        Lead Candidate
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs font-black uppercase text-[#7046D9]">
                      {teamLead.role}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-md border border-[#17142B] bg-[#FFF8E8] px-2 py-1 text-[10px] font-bold">
                        {teamLead.experience}
                      </span>
                      <span className="rounded-md border border-[#17142B] bg-[#FFF8E8] px-2 py-1 text-[10px] font-bold">
                        {teamLead.skills?.length || 0} Skills
                      </span>
                      {teamLead.projectGoal === projectGoal && (
                        <span className="rounded-md border border-[#17142B] bg-[#FFD86B] px-2 py-1 text-[10px] font-black uppercase">
                          Mission Aligned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:hidden">
                  <div className="flex-1 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-3 py-2 text-center text-white shadow-[2px_2px_0_#17142B]">
                    <p className="text-[9px] font-black uppercase tracking-widest">
                      Lead Score
                    </p>
                    <p className="text-xl font-black">{teamLead.leadScore}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== 11. SKILL BREAKDOWN & RECRUITMENT ==================== */}
        <section className="mb-10">
          <div className="mb-5 border-b-2 border-[#17142B]/10 pb-3">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#17142B]">
              SKILL BREAKDOWN & RECRUITMENT
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Covered technical superpowers vs missing gaps
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
                      {coveredSkills.length} of {allCoreSkills.length} abilities covered
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

            {/* Panel RIGHT: SKILLS WE NEED & RECRUITMENT ALERT */}
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
                      Your squad covers all standard core technical domains.
                    </p>
                  </div>
                )}
              </div>

              {/* Recruitment Alert: Candidates who fill gaps */}
              {missingSkills.length > 0 && recommendedCandidates.length > 0 && (
                <div className="mt-6 border-t-2 border-[#17142B] pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="flex items-center gap-1.5 text-sm font-black uppercase text-[#17142B]">
                        <Zap size={14} className="text-[#7046D9]" fill="currentColor" />
                        RECRUITMENT RECOMMENDATIONS
                      </h4>
                      <p className="text-[11px] font-bold text-slate-500">
                        Allies who provide the missing capabilities above
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
                        className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3.5 shadow-[3px_3px_0_#17142B]"
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
                                  +{candidate.gapSkills.length} SKILL GAP{candidate.gapSkills.length > 1 ? "S" : ""}
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==================== 12. TEAM BADGES ==================== */}
        <section className="mb-10 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]">
                <Award size={18} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase text-[#17142B]">
                  TEAM BADGES
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  Condition-based squad achievements
                </p>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              {teamBadges.filter((b) => b.unlocked).length} OF {teamBadges.length} UNLOCKED
            </span>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {teamBadges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col justify-between rounded-xl border-2 p-4 transition ${
                  badge.unlocked
                    ? "border-[#17142B] bg-[#FFF8E8] shadow-[3px_3px_0_#17142B]"
                    : "border-slate-300 bg-slate-50 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{badge.icon}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase border ${
                        badge.unlocked
                          ? "border-[#17142B] bg-[#BDE7D6] text-[#17142B]"
                          : "border-slate-300 bg-white text-slate-400"
                      }`}
                    >
                      {badge.unlocked ? "UNLOCKED" : "LOCKED"}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xs font-black uppercase text-[#17142B]">
                    {badge.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-600">
                    {badge.description}
                  </p>
                </div>
                <span className="mt-3 text-[9px] font-black uppercase text-[#7046D9]">
                  Goal: {badge.criteria}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 13. ADD MORE TEAMMATES ACTION ==================== */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/find-teammates")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-8 py-3.5 text-sm font-black uppercase tracking-wider text-[#17142B] shadow-[4px_4px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            ← Add More Teammates
          </button>
        </div>

        {/* ==================== SHAREABLE TEAM CARD MODAL ==================== */}
        {isShareModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#17142B]/80 p-4 backdrop-blur-xs"
            onClick={() => setIsShareModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] shadow-[8px_8px_0_#17142B]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between rounded-t-[22px] border-b-2 border-[#17142B] bg-white px-5 py-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#17142B]">
                  SHARE MY SQUAD CARD
                </span>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-white text-[#17142B] hover:bg-[#FFD6CE]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Trading Card Body */}
              <div className="p-6">
                <div className="rounded-2xl border-2 border-[#17142B] bg-white p-5 shadow-[4px_4px_0_#17142B]">
                  <div className="flex items-center justify-between border-b-2 border-[#17142B] pb-3">
                    <span className="text-xs font-black uppercase text-[#7046D9]">
                      ⚡ TEAMFUSE DOSSIER
                    </span>
                    <span className="rounded bg-[#FFD86B] border border-[#17142B] px-2 py-0.5 text-[9px] font-black uppercase">
                      ISSUE #01
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-black uppercase text-[#17142B]">
                    {teamName}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Mission: {projectGoal}
                  </p>

                  {/* Members list */}
                  <div className="mt-4 space-y-2 border-y-2 border-[#17142B]/10 py-3">
                    {team.map((m) => {
                      const isUser = m.id === "current-user" || m.isCurrentUser
                      return (
                        <div
                          key={m.id}
                          className="flex items-center justify-between text-xs font-black"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{m.emoji}</span>
                            <span>{m.name}</span>
                            {isUser && (
                              <span className="rounded bg-[#FFD86B] px-1 py-0.2 text-[8px]">
                                YOU
                              </span>
                            )}
                          </span>
                          <span className="text-slate-500">{m.role}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Metrics summary */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border border-[#17142B] bg-[#FFF8E8] p-2">
                      <p className="text-sm font-black text-[#17142B]">
                        {skillCoverage}%
                      </p>
                      <p className="text-[9px] font-black uppercase text-slate-500">
                        Coverage
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#17142B] bg-[#FFF8E8] p-2">
                      <p className="text-sm font-black text-[#17142B]">
                        {compatibilityScore}%
                      </p>
                      <p className="text-[9px] font-black uppercase text-slate-500">
                        Team Fit
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#17142B] bg-[#FFF8E8] p-2">
                      <p className="text-sm font-black text-[#17142B]">
                        {readinessScore}%
                      </p>
                      <p className="text-[9px] font-black uppercase text-slate-500">
                        Readiness
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] py-3 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5"
                  >
                    <Copy size={15} />
                    <span>{copyFeedback ? "COPIED TO CLIPBOARD! ✓" : "COPY SQUAD SUMMARY"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== REPLACEMENT MODAL ==================== */}
        {replaceMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#17142B]/80 p-4 backdrop-blur-xs"
            onClick={() => setReplaceMember(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] shadow-[8px_8px_0_#17142B]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between rounded-t-[22px] border-b-2 border-[#17142B] bg-white px-6 py-5">
                <div>
                  <div className="mb-1">
                    <span className="inline-block rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
                      REPLACE TEAMMATE
                    </span>
                  </div>
                  <h2
                    id="modal-headline"
                    className="text-2xl font-black uppercase tracking-tight text-[#17142B]"
                  >
                    Find a Better Fit
                  </h2>
                  <p className="text-xs font-bold text-slate-600">
                    Replace <span className="font-black text-[#7046D9]">{replaceMember.name}</span> with another teammate while preserving squad founder & name.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReplaceMember(null)}
                  aria-label="Close modal"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-lg font-black text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5 hover:bg-[#FFD6CE]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body / Candidate List */}
              <div className="overflow-y-auto p-6">
                {prioritizedCandidates.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-[#17142B]/30 bg-white/70 p-8 text-center">
                    <h3 className="text-base font-black uppercase text-[#17142B]">
                      No replacement candidates available.
                    </h3>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      All available teammates are already part of your squad.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {prioritizedCandidates.map((candidate) => {
                      const gapSkills = candidate.gapSkills || []
                      return (
                        <div
                          key={candidate.id}
                          className="flex flex-col justify-between rounded-2xl border-2 border-[#17142B] bg-white p-4 shadow-[4px_4px_0_#17142B]"
                        >
                          <div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] text-2xl shadow-[2px_2px_0_#17142B]">
                                {candidate.emoji}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="truncate text-base font-black uppercase text-[#17142B]">
                                  {candidate.name}
                                </h4>
                                <p className="text-xs font-black uppercase text-[#7046D9]">
                                  {candidate.role}
                                </p>
                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                  <span className="rounded-md border border-[#17142B] bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                    {candidate.experience}
                                  </span>
                                  {candidate.projectGoal && (
                                    <span className="truncate rounded-md border border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[10px] font-black uppercase text-[#17142B]">
                                      {candidate.projectGoal}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {gapSkills.length > 0 && (
                              <div className="mt-3.5 border-t-2 border-[#17142B]/10 pt-2.5">
                                <p className="text-[10px] font-black uppercase tracking-wider text-[#7046D9]">
                                  FILLS SKILL GAP
                                </p>
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {gapSkills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="rounded-md border-2 border-[#17142B] bg-[#BDE7D6] px-2 py-0.5 text-[10px] font-black text-[#17142B] shadow-[1px_1px_0_#17142B]"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleReplaceMember(replaceMember, candidate)
                            }
                            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] py-2.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5"
                          >
                            <ArrowRight size={14} />
                            <span>REPLACE WITH {candidate.name.toUpperCase()}</span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamAnalysis