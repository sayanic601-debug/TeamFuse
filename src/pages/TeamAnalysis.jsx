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
  Clock,
  Shield,
  Activity,
  GitCommit,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { allCoreSkills, demoUsers } from "../data/teamData"
import { calculateTeamMetrics, standardDomains } from "../utils/teamMetrics"

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

  // Ensure current user is ALWAYS member #1 in team
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
    if (rawTeam.length > 0) return rawTeam
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

  const projectGoal = profile?.projectGoal || team[0]?.projectGoal || "Hackathon"
  const projectBrief = profile?.projectBrief || "Build an intelligent, high-impact product with an unstoppable complementary squad."

  // Centralized metrics calculated from shared teamMetrics utility
  const metrics = useMemo(() => {
    return calculateTeamMetrics(team, projectGoal)
  }, [team, projectGoal])

  const skillCoverage = metrics.skillCoverage
  const coveredSkills = metrics.coveredSkills
  const missingSkills = metrics.missingSkills
  const uniqueRoles = metrics.uniqueRoles
  const roleDistribution = metrics.roleDistribution
  const projectGoalMatch = metrics.projectGoalMatch
  const compatibilityScore = metrics.compatibility
  const readinessScore = metrics.readiness
  const chemistryScore = metrics.chemistry

  const getCompatibilityLabel = () => {
    if (compatibilityScore >= 80) return "Highly Compatible"
    if (compatibilityScore >= 60) return "Good Compatibility"
    return "Growing Compatibility"
  }

  const getReadinessLabel = () => {
    if (readinessScore >= 80) return "READY TO BUILD 🚀"
    if (readinessScore >= 60) return "ALMOST READY 🔥"
    return "NEEDS A BOOST ⚡"
  }

  // Standard roles check for Team Balance
  const standardRoles = [
    "Frontend Developer",
    "Backend Developer",
    "ML Engineer",
    "UI/UX Designer",
  ]
  const missingStandardRoles = standardRoles.filter((role) => !uniqueRoles.includes(role))

  // ==================== TEAM EVOLUTION HISTORY ====================
  const teamEvolution = useMemo(() => {
    try {
      const savedHistory = JSON.parse(
        localStorage.getItem("teamfuseTeamHistory") || "[]"
      )
      if (Array.isArray(savedHistory) && savedHistory.length > 0) {
        return savedHistory
      }
    } catch {
      // fallback
    }

    // Reconstruct timeline steps if history wasn't recorded
    const steps = []
    for (let i = 1; i <= team.length; i++) {
      const subTeam = team.slice(0, i)
      const subMetrics = calculateTeamMetrics(subTeam, projectGoal)
      const memberName = i === 1 ? "Starting Squad" : `Added ${team[i - 1].name}`
      steps.push({
        event: memberName,
        membersCount: i,
        coverage: subMetrics.skillCoverage,
        timestamp: Date.now() - (team.length - i) * 60000,
      })
    }
    return steps
  }, [team, projectGoal])

  // ==================== TEAM RISK RADAR ====================
  const teamRisks = useMemo(() => {
    const risks = []

    if (team.length < 2) {
      risks.push({
        type: "warning",
        title: "Small Squad",
        message: "Add at least one more teammate for better collaboration and synergy.",
        icon: Users,
      })
    }

    // Single-Person Dependencies from metrics
    metrics.singleDependencies.forEach((dep) => {
      risks.push({
        type: "warning",
        title: `${dep.domain.toUpperCase()} DEPENDENCY`,
        message: `Only ${dep.member} currently provides ${dep.domain} skills. If ${dep.member} leaves, ${dep.domain} coverage would decrease significantly.`,
        icon: AlertTriangle,
      })
    })

    if (missingSkills.length >= 3) {
      risks.push({
        type: "warning",
        title: "Large Skill Gap",
        message: `${missingSkills.length} core abilities are still missing from your squad.`,
        icon: AlertTriangle,
      })
    }

    if (uniqueRoles.length === 1 && team.length > 1) {
      risks.push({
        type: "danger",
        title: "Role Concentration",
        message: "All squad allies belong to the same role class. Consider recruiting complementary classes.",
        icon: Briefcase,
      })
    }

    if (projectGoalMatch < 50 && team.length > 1) {
      risks.push({
        type: "warning",
        title: "Mission Misalignment",
        message: "Less than half of the squad shares the same primary project goal.",
        icon: Target,
      })
    }

    const beginnerCount = metrics.experienceCounts.Beginner || 0
    if (team.length >= 3 && beginnerCount === team.length) {
      risks.push({
        type: "warning",
        title: "Experience Gap",
        message: "Everyone is currently at beginner power level. Consider adding an experienced builder.",
        icon: Star,
      })
    }

    return risks
  }, [team, metrics, missingSkills, uniqueRoles, projectGoalMatch])

  // ==================== TEAMFUSE ADVISOR ====================
  const advisorInsights = useMemo(() => {
    const insights = []

    if (!uniqueRoles.includes("Backend Developer") && !uniqueRoles.includes("Full Stack Developer")) {
      insights.push({
        id: "missing-backend",
        tag: "ARCHITECTURE",
        text: "Your squad currently has no Backend specialist. Server-side API and database implementation may encounter friction.",
      })
    }

    if (metrics.singleDependencies.length > 0) {
      const firstDep = metrics.singleDependencies[0]
      insights.push({
        id: "dep-risk",
        tag: "RESILIENCE",
        text: `${firstDep.domain} currently relies on ${firstDep.member}. Cross-training or recruiting backup will protect team velocity.`,
      })
    }

    if (skillCoverage >= 85) {
      insights.push({
        id: "high-coverage",
        tag: "STRENGTH",
        text: "Most identified core technical superpowers are fully covered across your roster.",
      })
    }

    if (uniqueRoles.length >= 3) {
      insights.push({
        id: "diverse-roles",
        tag: "DIVERSITY",
        text: `Strong cross-functional synergy with ${uniqueRoles.length} distinct specializations active in the squad.`,
      })
    }

    if (projectGoalMatch === 100 && team.length >= 2) {
      insights.push({
        id: "full-alignment",
        tag: "MISSION",
        text: `100% of your squad is aligned on the ${projectGoal} mission. High focus and shared velocity expected.`,
      })
    }

    return insights.slice(0, 3)
  }, [uniqueRoles, metrics, skillCoverage, projectGoalMatch, team, projectGoal])

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

  // ==================== DATA-DRIVEN TEAM ACHIEVEMENTS (BADGES) ====================
  const teamAchievements = useMemo(() => {
    const hasFrontend = uniqueRoles.some((r) => r.includes("Frontend") || r.includes("Full Stack") || r.includes("UI/UX"))
    const hasBackend = uniqueRoles.some((r) => r.includes("Backend") || r.includes("Full Stack"))
    const uniqueExpCount = Object.values(metrics.experienceCounts).filter((c) => c > 0).length

    return [
      {
        id: "full-stack",
        title: "FULL STACK SQUAD",
        description: "Frontend + Backend coverage active",
        unlocked: hasFrontend && hasBackend,
        icon: "🛠️",
        criteria: "Frontend + Backend representation",
      },
      {
        id: "role-mix",
        title: "ROLE MIX",
        description: "3+ distinct role classes represented",
        unlocked: uniqueRoles.length >= 3,
        icon: "🎭",
        criteria: "≥ 3 distinct roles",
      },
      {
        id: "mission-aligned",
        title: "MISSION ALIGNED",
        description: "Strong project-goal overlap across squad",
        unlocked: projectGoalMatch >= 70 && team.length >= 2,
        icon: "🎯",
        criteria: "≥ 70% mission fit",
      },
      {
        id: "skill-stacked",
        title: "SKILL STACKED",
        description: "High core skill coverage attained",
        unlocked: skillCoverage >= 80,
        icon: "⚡",
        criteria: "Coverage ≥ 80%",
      },
      {
        id: "diverse-experience",
        title: "DIVERSE EXPERIENCE",
        description: "Multiple power levels combined",
        unlocked: uniqueExpCount >= 2 && team.length >= 2,
        icon: "👑",
        criteria: "≥ 2 power levels",
      },
    ]
  }, [uniqueRoles, metrics, projectGoalMatch, team, skillCoverage])

  // ==================== REPLACEMENT & CANDIDATES ====================
  const [replaceMember, setReplaceMember] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const availableCandidates = useMemo(() => {
    return demoUsers.filter(
      (candidate) => !team.some((member) => member.id === candidate.id)
    )
  }, [team])

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

    // Record evolution
    const nextMetrics = calculateTeamMetrics(updatedTeam, projectGoal)
    const prevHistory = JSON.parse(localStorage.getItem("teamfuseTeamHistory") || "[]")
    const newEntry = {
      event: `Added ${candidate.name}`,
      membersCount: updatedTeam.length,
      coverage: nextMetrics.skillCoverage,
      timestamp: Date.now(),
    }
    localStorage.setItem("teamfuseTeamHistory", JSON.stringify([...prevHistory, newEntry]))

    window.location.reload()
  }

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
    if (oldMember.id === "current-user" || oldMember.isCurrentUser) return

    const updatedTeam = team.map((member) =>
      member.id === oldMember.id ? newMember : member
    )

    localStorage.setItem("teamfuseTeam", JSON.stringify(updatedTeam))

    const nextMetrics = calculateTeamMetrics(updatedTeam, projectGoal)
    const prevHistory = JSON.parse(localStorage.getItem("teamfuseTeamHistory") || "[]")
    const newEntry = {
      event: `Replaced ${oldMember.name} with ${newMember.name}`,
      membersCount: updatedTeam.length,
      coverage: nextMetrics.skillCoverage,
      timestamp: Date.now(),
    }
    localStorage.setItem("teamfuseTeamHistory", JSON.stringify([...prevHistory, newEntry]))

    setReplaceMember(null)
    window.location.reload()
  }

  const handleCopySummary = () => {
    const summaryText = `⚡ TEAMFUSE SQUAD: ${teamName}\n` +
      `Mission: "${projectBrief}"\n` +
      `Goal: ${projectGoal}\n` +
      `Builders (${team.length}): ${team.map((m) => `${m.name} (${m.role})`).join(", ")}\n` +
      `Skill Coverage: ${skillCoverage}%\n` +
      `Team Fit: ${compatibilityScore}%\n` +
      `Readiness: ${readinessScore}%\n` +
      `Chemistry: ${chemistryScore}%\n` +
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
            <h1 className="mt-4 text-3xl font-black uppercase text-[#17142B]">
              Your Squad Is Empty
            </h1>
            <p className="mt-2 text-sm font-bold text-slate-600 leading-relaxed">
              Recruit teammates whose skills complement yours to activate your team intelligence report.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/find-teammates")}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5"
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
        {/* Header Navigation */}
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
              INTELLIGENCE REPORT
            </div>
          </div>
        </header>

        {/* ==================== 1. TEAM IDENTITY ==================== */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] p-6 shadow-[6px_6px_0_#17142B] sm:p-8">
          <div className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 bg-halftone-purple opacity-40" />

          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-3 py-1 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Zap size={14} fill="currentColor" />
              ⚡ TEAM IDENTITY
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
              Built around {team[0]?.name || "You"} · Powered by complementary abilities.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t-2 border-[#17142B]/10 pt-4 text-xs font-black uppercase tracking-wider text-slate-700">
            <span className="rounded-xl border-2 border-[#17142B] bg-white px-3.5 py-1.5 text-[#17142B] shadow-[1px_1px_0_#17142B]">
              {team.length} {team.length === 1 ? "BUILDER" : "BUILDERS"}
            </span>
            <span className="rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1.5 text-[#17142B] shadow-[1px_1px_0_#17142B]">
              {skillCoverage}% SKILL COVERAGE
            </span>
            <span className="rounded-xl border-2 border-[#17142B] bg-white px-3.5 py-1.5 text-[#7046D9] shadow-[1px_1px_0_#17142B]">
              GOAL: {projectGoal}
            </span>
          </div>
        </section>

        {/* ==================== 2. TEAM MISSION ==================== */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[2px_2px_0_#17142B]">
                <Target size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7046D9]">
                  TEAM MISSION
                </span>
                <h2 className="mt-0.5 text-lg font-black text-[#17142B] sm:text-xl">
                  “{projectBrief}”
                </h2>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="rounded-md border border-[#17142B] bg-[#FFF8E8] px-2 py-0.5 font-black uppercase text-[#17142B]">
                    {projectGoal}
                  </span>
                  <span>·</span>
                  <span>{projectGoalMatch}% squad mission alignment</span>
                </div>
              </div>
            </div>

            {/* Team Goal Progress Box */}
            <div className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-4 shadow-[2px_2px_0_#17142B] sm:min-w-[260px]">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#17142B]">
                <span>{projectGoal} Readiness</span>
                <span className="text-[#7046D9]">{readinessScore}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full border border-[#17142B] bg-white">
                <div
                  className="h-full bg-[#7046D9] transition-all duration-500"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] font-bold text-slate-500">
                TeamFuse readiness indicator based on core coverage.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== 3 & 4 & 5. STATS SUMMARY (Power, Fit, Readiness, Chemistry) ==================== */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 3. Team Power */}
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

          {/* 4. Team Compatibility */}
          <div className="rounded-2xl border-2 border-[#17142B] bg-[#F7A6C7] p-5 shadow-[4px_4px_0_#17142B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#17142B]/70">
                  TEAM COMPATIBILITY
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

          {/* 5. Team Readiness */}
          <div className="rounded-2xl border-2 border-[#17142B] bg-[#DCCFFF] p-5 shadow-[4px_4px_0_#17142B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#17142B]/70">
                  TEAM READINESS
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

          {/* 6. Team Chemistry */}
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

        {/* ==================== 6. TRANSPARENT TEAM CHEMISTRY BREAKDOWN ==================== */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B]">
                <Flame size={16} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-[#17142B]">
                  TEAM CHEMISTRY BREAKDOWN
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Transparent factor scoring powering squad cohesion
                </p>
              </div>
            </div>

            <span className="text-sm font-black text-[#7046D9]">
              {chemistryScore} / 100 POINTS
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3 shadow-[2px_2px_0_#17142B]">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#17142B]">
                <span>Role Complementarity</span>
                <span className="text-[#7046D9]">+{metrics.chemistryBreakdown.rolePoints}</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-500">
                {uniqueRoles.length} unique role classes active
              </p>
            </div>

            <div className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3 shadow-[2px_2px_0_#17142B]">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#17142B]">
                <span>Skill Diversity</span>
                <span className="text-[#7046D9]">+{metrics.chemistryBreakdown.skillPoints}</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-500">
                {coveredSkills.length} core competencies equipped
              </p>
            </div>

            <div className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3 shadow-[2px_2px_0_#17142B]">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#17142B]">
                <span>Goal Alignment</span>
                <span className="text-[#7046D9]">+{metrics.chemistryBreakdown.goalPoints}</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-500">
                {projectGoalMatch}% shared mission focus
              </p>
            </div>

            <div className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3 shadow-[2px_2px_0_#17142B]">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#17142B]">
                <span>Experience Mix</span>
                <span className="text-[#7046D9]">+{metrics.chemistryBreakdown.expPoints}</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-500">
                Balanced builder power levels
              </p>
            </div>
          </div>

          <p className="mt-3 text-[10px] font-bold text-slate-400">
            * TeamFuse-generated indicator based on team composition and skill distribution.
          </p>
        </section>

        {/* ==================== 7. TEAM BALANCE ==================== */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#DCCFFF] text-[#17142B]">
                <Briefcase size={16} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-[#17142B]">
                  TEAM BALANCE
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Role class distribution and squad structural balance
                </p>
              </div>
            </div>

            <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2.5 py-1 text-xs font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
              {uniqueRoles.length} {uniqueRoles.length === 1 ? "ROLE CLASS" : "DIFFERENT ROLES"} REPRESENTED
            </span>
          </div>

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
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full border border-[#17142B] bg-white">
                  <div
                    className="h-full bg-[#7046D9]"
                    style={{ width: `${Math.min(100, (count / team.length) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {missingStandardRoles.length > 0 && (
            <div className="mt-4 rounded-xl border border-[#17142B]/20 bg-[#FFF9EF] p-3">
              <p className="text-xs font-bold text-slate-700">
                <span className="font-black text-[#17142B]">Factual observation: </span>
                {missingStandardRoles.map((role, idx) => (
                  <span key={role}>
                    Your squad currently has no {role} specialist{idx < missingStandardRoles.length - 1 ? " · " : "."}
                  </span>
                ))}
              </p>
            </div>
          )}
        </section>

        {/* ==================== 8. TEAM RESILIENCE ==================== */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] text-[#17142B]">
                <Shield size={16} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-[#17142B]">
                  TEAM RESILIENCE
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Redundancy mapping across core technical capabilities
                </p>
              </div>
            </div>

            <span className="text-xs font-black uppercase text-[#7046D9]">
              REDUNDANCY CHECK
            </span>
          </div>

          {/* Contributor Counts per Technical Domain */}
          <div className="grid gap-3 sm:grid-cols-5">
            {Object.entries(metrics.domainContributors).map(([domainName, count]) => (
              <div
                key={domainName}
                className="rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3 text-center shadow-[2px_2px_0_#17142B]"
              >
                <p className="text-[10px] font-black uppercase text-slate-500">{domainName}</p>
                <p className="mt-1 text-xl font-black text-[#17142B]">{count}</p>
                <span
                  className={`mt-1 inline-block rounded px-1.5 py-0.2 text-[9px] font-black uppercase ${
                    count > 1
                      ? "bg-[#BDE7D6] text-[#17142B]"
                      : count === 1
                      ? "bg-[#FFD86B] text-[#17142B]"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {count > 1 ? "REDUNDANT" : count === 1 ? "1 BUILDER" : "OPEN"}
                </span>
              </div>
            ))}
          </div>

          {/* Single Person Dependency Structural Observation */}
          {metrics.singleDependencies.length > 0 && (
            <div className="mt-4 rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-4 shadow-[2px_2px_0_#17142B]">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={17} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase text-[#17142B]">
                    SINGLE-PERSON DEPENDENCY
                  </h4>
                  <p className="mt-0.5 text-xs font-bold text-slate-700">
                    {metrics.singleDependencies[0].domain} currently depends on one teammate ({metrics.singleDependencies[0].member}). If {metrics.singleDependencies[0].member} leaves, {metrics.singleDependencies[0].domain} coverage would decrease significantly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==================== 9. TEAM RISK RADAR ==================== */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#F7A6C7] text-[#17142B]">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-[#17142B]">
                  TEAM RISK RADAR
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Potential gaps and structural vulnerabilities
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
            <div className="rounded-2xl border-2 border-[#17142B] bg-[#BDE7D6] p-5 shadow-[4px_4px_0_#17142B]">
              <div className="flex items-center gap-3.5">
                <ShieldCheck size={22} />
                <div>
                  <h4 className="text-sm font-black uppercase">
                    Squad Looks Well Balanced! 🎉
                  </h4>
                  <p className="text-xs font-bold text-[#17142B]/70">
                    No single-person bottlenecks or critical structural risks detected.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2">
              {teamRisks.map((risk, index) => {
                const RiskIcon = risk.icon
                return (
                  <div
                    key={`${risk.title}-${index}`}
                    className={`rounded-2xl border-2 border-[#17142B] p-4 shadow-[3px_3px_0_#17142B] ${
                      risk.type === "danger" ? "bg-[#F7A6C7]" : "bg-[#FFD86B]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white shadow-[1px_1px_0_#17142B]">
                        <RiskIcon size={17} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase">
                          {risk.title}
                        </h4>
                        <p className="mt-0.5 text-xs font-bold leading-relaxed text-[#17142B]/80">
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

        {/* ==================== 10. TEAMFUSE ADVISOR ==================== */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B]">
                <Compass size={16} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-[#17142B]">
                  TEAMFUSE ADVISOR
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Targeted rule-based strategic recommendations
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

        {/* ==================== 11. TEAM MEMBERS ==================== */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B]">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-[#17142B]">
                  Team Members
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Active builder roster powering your squad
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/find-teammates")}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5"
            >
              <UserPlus size={14} />
              Add Teammates
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  } p-5 shadow-[4px_4px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17142B]`}
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {isCurrentUser ? "FOUNDER" : `MEMBER #${member.id}`}
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
                      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] text-2xl shadow-[2px_2px_0_#17142B]">
                        {member.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-base font-black uppercase text-[#17142B]">
                            {member.name}
                          </h4>
                          {isCurrentUser && (
                            <span className="rounded border-2 border-[#17142B] bg-[#FFD86B] px-1.5 py-0.2 text-[8px] font-black uppercase">
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

                    <div className="mt-4 flex flex-wrap gap-1.5 border-t-2 border-[#17142B]/10 pt-3">
                      {(member.skills || []).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border-2 border-[#17142B] bg-[#FFF8E8] px-2 py-0.5 text-[10px] font-black text-slate-800 shadow-[1px_1px_0_#17142B]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {!isCurrentUser ? (
                    <button
                      type="button"
                      onClick={() => setReplaceMember(member)}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-white py-2 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5 hover:bg-[#FFF8E8]"
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

        {/* ==================== 12. SKILL BREAKDOWN ==================== */}
        <section className="mb-8">
          <div className="mb-4 border-b-2 border-[#17142B]/10 pb-3">
            <h3 className="text-base font-black uppercase tracking-tight text-[#17142B]">
              SKILL BREAKDOWN & RECRUITMENT
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Superpowers currently unlocked vs missing capabilities
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* SKILLS WE HAVE */}
            <div className="rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] text-[#17142B]">
                    <Check size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase text-[#17142B]">
                      SKILLS WE HAVE
                    </h4>
                    <p className="text-xs font-bold text-slate-500">
                      {coveredSkills.length} of {allCoreSkills.length} abilities covered
                    </p>
                  </div>
                </div>
                <span className="rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] px-2.5 py-1 text-xs font-black text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  {skillCoverage}%
                </span>
              </div>

              <div className="mb-5 h-3 w-full overflow-hidden rounded-full border-2 border-[#17142B] bg-[#FFF8E8]">
                <div
                  className="h-full bg-[#17142B] transition-all duration-500"
                  style={{ width: `${skillCoverage}%` }}
                />
              </div>

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

            {/* SKILLS WE NEED & RECRUITMENT ALERT */}
            <div className="rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-black uppercase text-[#17142B]">
                    SKILLS WE NEED
                  </h4>
                  <p className="text-xs font-bold text-slate-500">
                    Open capability areas to complete your squad
                  </p>
                </div>
                {missingSkills.length > 0 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B]">
                    <AlertTriangle size={15} />
                  </div>
                )}
              </div>

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
                  <div className="w-full rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] p-4 text-center">
                    <p className="text-sm font-black uppercase text-[#17142B]">
                      Full Skill Coverage Achieved! 🎉
                    </p>
                  </div>
                )}
              </div>

              {/* Recruitment Alert */}
              {missingSkills.length > 0 && recommendedCandidates.length > 0 && (
                <div className="mt-5 border-t-2 border-[#17142B] pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h5 className="flex items-center gap-1.5 text-xs font-black uppercase text-[#17142B]">
                      <Zap size={13} className="text-[#7046D9]" fill="currentColor" />
                      RECRUITMENT RECOMMENDATIONS
                    </h5>
                    <span className="rounded-md border border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[9px] font-black uppercase">
                      {recommendedCandidates.length} CANDIDATES
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {recommendedCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3 shadow-[2px_2px_0_#17142B]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{candidate.emoji}</span>
                          <div>
                            <p className="text-xs font-black uppercase text-[#17142B]">
                              {candidate.name}
                            </p>
                            <p className="text-[10px] font-black uppercase text-[#7046D9]">
                              {candidate.role} · +{candidate.gapSkills.length} Gaps
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddCandidate(candidate)}
                          className="inline-flex items-center gap-1 rounded-lg border-2 border-[#17142B] bg-[#7046D9] px-2.5 py-1 text-[10px] font-black uppercase text-white shadow-[1px_1px_0_#17142B] hover:-translate-y-0.5"
                        >
                          <UserPlus size={11} />
                          ADD
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==================== 13. TEAM EVOLUTION TIMELINE ==================== */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B]">
                <Clock size={16} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-[#17142B]">
                  TEAM EVOLUTION
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  How your squad power evolved as allies were assembled
                </p>
              </div>
            </div>

            <span className="text-xs font-black uppercase text-[#7046D9]">
              {teamEvolution.length} MILESTONES
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            {teamEvolution.map((step, idx) => (
              <div
                key={idx}
                className="relative flex flex-1 flex-col items-center text-center w-full"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#17142B] bg-[#FFD86B] text-xs font-black shadow-[2px_2px_0_#17142B]">
                  #{step.membersCount}
                </div>
                <h4 className="mt-2 text-xs font-black uppercase text-[#17142B]">
                  {step.event}
                </h4>
                <span className="mt-0.5 inline-block rounded-md border border-[#17142B] bg-[#BDE7D6] px-2 py-0.5 text-[10px] font-black">
                  {step.coverage}% Coverage
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">
                  {step.membersCount} {step.membersCount === 1 ? "builder" : "builders"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 14. SUGGESTED TEAM LEAD ==================== */}
        {teamLead && (
          <section className="relative mb-8 overflow-hidden rounded-2xl border-2 border-[#17142B] bg-[#FFD86B] p-6 shadow-[5px_5px_0_#17142B]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_#17142B]">
                  <Star size={13} fill="currentColor" />
                  Suggested Team Lead
                </div>
                <p className="mt-1 text-xs font-bold text-[#17142B]/70">
                  Calculated based on experience, skill count, and mission alignment.
                </p>
              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-3 py-2 text-center text-white shadow-[2px_2px_0_#17142B]">
                <p className="text-[9px] font-black uppercase">Lead Score</p>
                <p className="text-xl font-black">{teamLead.leadScore}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border-2 border-[#17142B] bg-white p-4 shadow-[3px_3px_0_#17142B]">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-[#DCCFFF] text-3xl shadow-[2px_2px_0_#17142B]">
                {teamLead.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black uppercase text-[#17142B]">
                    {teamLead.name}
                  </h4>
                  {(teamLead.id === "current-user" || teamLead.isCurrentUser) && (
                    <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[9px] font-black uppercase">
                      YOU
                    </span>
                  )}
                </div>
                <p className="text-xs font-black uppercase text-[#7046D9]">
                  {teamLead.role} · {teamLead.experience}
                </p>
                <p className="mt-1 text-[11px] font-bold text-slate-600">
                  Provides high technical capability and strong alignment with {projectGoal}.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ==================== 15. TEAM ACHIEVEMENTS (BADGES) ==================== */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B]">
          <div className="mb-4 flex items-center justify-between border-b-2 border-[#17142B]/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B]">
                <Award size={16} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-[#17142B]">
                  TEAM ACHIEVEMENTS
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Data-driven condition achievements earned by your squad
                </p>
              </div>
            </div>

            <span className="text-xs font-black uppercase text-slate-500">
              {teamAchievements.filter((b) => b.unlocked).length} OF {teamAchievements.length} UNLOCKED
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {teamAchievements.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col justify-between rounded-xl border-2 p-3.5 transition ${
                  badge.unlocked
                    ? "border-[#17142B] bg-[#FFF8E8] shadow-[3px_3px_0_#17142B]"
                    : "border-slate-300 bg-slate-50 opacity-50"
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
                  <h4 className="mt-2 text-xs font-black uppercase text-[#17142B]">
                    {badge.title}
                  </h4>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-600">
                    {badge.description}
                  </p>
                </div>
                <span className="mt-2 text-[8px] font-black uppercase text-[#7046D9]">
                  {badge.criteria}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 16 & 17. SHARE & ADD MORE ==================== */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-white px-7 py-3.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5"
          >
            <Share2 size={15} />
            Share My Squad Card
          </button>

          <button
            onClick={() => navigate("/find-teammates")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[4px_4px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17142B]"
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
              className="relative flex max-h-[92vh] w-full max-w-md flex-col rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] shadow-[8px_8px_0_#17142B]"
              onClick={(e) => e.stopPropagation()}
            >
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
                      ⚡ TEAMFUSE SQUAD
                    </span>
                    <span className="rounded bg-[#FFD86B] border border-[#17142B] px-2 py-0.5 text-[9px] font-black uppercase">
                      ISSUE #01
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-black uppercase text-[#17142B]">
                    {teamName}
                  </h3>
                  <p className="mt-0.5 text-xs font-bold italic text-slate-600">
                    “{projectBrief}”
                  </p>
                  <p className="text-[11px] font-black uppercase text-[#7046D9] mt-1">
                    MISSION: {projectGoal} · {team.length} BUILDERS
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
                  <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
                    <div className="rounded-lg border border-[#17142B] bg-[#FFF8E8] p-1.5">
                      <p className="text-xs font-black text-[#17142B]">
                        {skillCoverage}%
                      </p>
                      <p className="text-[8px] font-black uppercase text-slate-500">
                        Coverage
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#17142B] bg-[#FFF8E8] p-1.5">
                      <p className="text-xs font-black text-[#17142B]">
                        {compatibilityScore}%
                      </p>
                      <p className="text-[8px] font-black uppercase text-slate-500">
                        Fit
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#17142B] bg-[#FFF8E8] p-1.5">
                      <p className="text-xs font-black text-[#17142B]">
                        {readinessScore}%
                      </p>
                      <p className="text-[8px] font-black uppercase text-slate-500">
                        Ready
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#17142B] bg-[#FFF8E8] p-1.5">
                      <p className="text-xs font-black text-[#17142B]">
                        {chemistryScore}%
                      </p>
                      <p className="text-[8px] font-black uppercase text-slate-500">
                        Chemistry
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
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
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border-2 border-[#17142B] bg-[#FFF8E8] shadow-[8px_8px_0_#17142B]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between rounded-t-[22px] border-b-2 border-[#17142B] bg-white px-6 py-5">
                <div>
                  <span className="inline-block rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
                    REPLACE TEAMMATE
                  </span>
                  <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#17142B]">
                    Find a Better Fit
                  </h2>
                  <p className="text-xs font-bold text-slate-600">
                    Replace <span className="font-black text-[#7046D9]">{replaceMember.name}</span> with another teammate while preserving squad founder & name.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReplaceMember(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-lg font-black text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:bg-[#FFD6CE]"
                >
                  <X size={18} />
                </button>
              </div>

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
                                  {candidate.role} · {candidate.experience}
                                </p>
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