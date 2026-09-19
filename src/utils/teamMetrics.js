import { allCoreSkills } from "../data/teamData"

/**
 * Standard technical domains evaluated for team balance and resilience
 */
export const standardDomains = [
  { key: "Frontend", label: "Frontend", matchSkills: ["React", "UI/UX", "Figma"], matchRoles: ["Frontend Developer", "Full Stack Developer"] },
  { key: "Backend", label: "Backend", matchSkills: ["Node.js", "Express", "MongoDB"], matchRoles: ["Backend Developer", "Full Stack Developer"] },
  { key: "Database", label: "Database", matchSkills: ["MongoDB"], matchRoles: ["Backend Developer", "Full Stack Developer"] },
  { key: "Intelligence", label: "Machine Learning", matchSkills: ["Machine Learning", "Python"], matchRoles: ["ML Engineer"] },
  { key: "Design", label: "UI/UX & Design", matchSkills: ["UI/UX", "Figma"], matchRoles: ["UI/UX Designer"] },
]

/**
 * Calculate comprehensive, consistent metrics for any squad configuration
 * @param {Array} team - list of member objects
 * @param {string} targetProjectGoal - mission goal of the squad founder
 */
export function calculateTeamMetrics(team = [], targetProjectGoal = null) {
  if (!team || team.length === 0) {
    return {
      skillCoverage: 0,
      coveredSkills: [],
      missingSkills: [...allCoreSkills],
      compatibility: 0,
      readiness: 0,
      chemistry: 0,
      chemistryBreakdown: { rolePoints: 0, skillPoints: 0, goalPoints: 0, expPoints: 0 },
      roleDiversity: 0,
      uniqueRoles: [],
      roleDistribution: {},
      experienceCounts: { Beginner: 0, Intermediate: 0, Advanced: 0 },
      singleDependencies: [],
      domainContributors: {},
      projectGoalMatch: 0,
      memberCount: 0,
    }
  }

  // 1. Skill Coverage
  const coveredSkills = [...new Set(team.flatMap((m) => m.skills || []))]
  const missingSkills = allCoreSkills.filter((s) => !coveredSkills.includes(s))
  const skillCoverage = allCoreSkills.length > 0
    ? Math.min(100, Math.round((coveredSkills.length / allCoreSkills.length) * 100))
    : 0

  // 2. Role Diversity & Distribution
  const roleDistribution = {}
  team.forEach((m) => {
    const role = m.role || "Other"
    roleDistribution[role] = (roleDistribution[role] || 0) + 1
  })
  const uniqueRoles = Object.keys(roleDistribution)
  const roleDiversity = uniqueRoles.length

  // 3. Goal Alignment
  const activeGoal = targetProjectGoal || team[0]?.projectGoal || "Hackathon"
  const alignedMembers = team.filter((m) => m.projectGoal === activeGoal)
  const projectGoalMatch = team.length > 0
    ? Math.round((alignedMembers.length / team.length) * 100)
    : 0

  // 4. Experience Distribution
  const experienceCounts = { Beginner: 0, Intermediate: 0, Advanced: 0 }
  team.forEach((m) => {
    if (m.experience && experienceCounts[m.experience] !== undefined) {
      experienceCounts[m.experience]++
    }
  })
  const uniqueExpCount = Object.values(experienceCounts).filter((c) => c > 0).length

  // 5. Compatibility Score (0 - 100)
  let compScore = 0
  compScore += Math.min(35, coveredSkills.length * 5)
  compScore += Math.min(25, roleDiversity * 8)
  compScore += Math.round(projectGoalMatch * 0.25)
  compScore += Math.min(15, uniqueExpCount * 5)
  const compatibility = Math.min(100, Math.round(compScore))

  // 6. Readiness Score (0 - 100)
  let readyScore = 0
  readyScore += Math.round(skillCoverage * 0.45)
  readyScore += Math.min(25, roleDiversity * 8)
  readyScore += Math.round(projectGoalMatch * 0.2)
  if (team.length >= 3) readyScore += 10
  else if (team.length === 2) readyScore += 5
  const readiness = Math.min(100, Math.round(readyScore))

  // 7. Team Chemistry (0 - 100) with Transparent Factors
  // Factors: Role Complementarity (+25), Skill Diversity (+24), Goal Alignment (+20), Experience Mix (+17)
  const rolePoints = Math.min(25, roleDiversity * 8)
  const skillPoints = Math.min(25, Math.round((coveredSkills.length / allCoreSkills.length) * 25))
  const goalPoints = Math.min(25, Math.round((projectGoalMatch / 100) * 25))
  const expPoints = Math.min(25, uniqueExpCount * 8)
  const chemistry = Math.min(100, rolePoints + skillPoints + goalPoints + expPoints)

  // 8. Domain Contributors & Single-Person Dependencies (Resilience)
  const domainContributors = {}
  standardDomains.forEach((domain) => {
    const contributors = team.filter((m) => {
      const hasSkill = (m.skills || []).some((s) => domain.matchSkills.includes(s))
      const hasRole = domain.matchRoles.includes(m.role)
      return hasSkill || hasRole
    })
    domainContributors[domain.label] = contributors.length
  })

  // Single-person dependencies: where only 1 person provides a critical domain
  const singleDependencies = []
  if (team.length >= 2) {
    standardDomains.forEach((domain) => {
      const contributors = team.filter((m) => {
        const hasSkill = (m.skills || []).some((s) => domain.matchSkills.includes(s))
        const hasRole = domain.matchRoles.includes(m.role)
        return hasSkill || hasRole
      })
      if (contributors.length === 1) {
        singleDependencies.push({
          domain: domain.label,
          member: contributors[0].name,
          role: contributors[0].role,
        })
      }
    })
  }

  return {
    skillCoverage,
    coveredSkills,
    missingSkills,
    compatibility,
    readiness,
    chemistry,
    chemistryBreakdown: {
      rolePoints,
      skillPoints,
      goalPoints,
      expPoints,
    },
    roleDiversity,
    uniqueRoles,
    roleDistribution,
    experienceCounts,
    singleDependencies,
    domainContributors,
    projectGoalMatch,
    memberCount: team.length,
  }
}

/**
 * Calculate What-If impact of adding a candidate to the current team
 */
export function calculateWhatIfImpact(currentTeam = [], candidate, targetProjectGoal = null) {
  const currentMetrics = calculateTeamMetrics(currentTeam, targetProjectGoal)
  const projectedTeam = [...currentTeam, candidate]
  const projectedMetrics = calculateTeamMetrics(projectedTeam, targetProjectGoal)

  // Deltas
  const skillCoverageDelta = projectedMetrics.skillCoverage - currentMetrics.skillCoverage
  const roleDiversityDelta = projectedMetrics.roleDiversity - currentMetrics.roleDiversity
  const compatibilityDelta = projectedMetrics.compatibility - currentMetrics.compatibility
  const readinessDelta = projectedMetrics.readiness - currentMetrics.readiness
  const chemistryDelta = projectedMetrics.chemistry - currentMetrics.chemistry

  // Skill categorization
  const candidateSkills = candidate.skills || []
  const gainedSkills = candidateSkills.filter((s) => !currentMetrics.coveredSkills.includes(s))
  const alreadyCoveredSkills = candidateSkills.filter((s) => currentMetrics.coveredSkills.includes(s))
  const gapsAddressed = candidateSkills.filter((s) => currentMetrics.missingSkills.includes(s))

  // Role impact
  const isNewRole = !currentMetrics.uniqueRoles.includes(candidate.role)
  const roleImpactText = isNewRole
    ? `+1 new role (${candidate.role})`
    : `No new role added (${candidate.role} already represented)`

  // Goal impact
  const currentGoal = targetProjectGoal || currentTeam[0]?.projectGoal || "Hackathon"
  const isSameGoal = candidate.projectGoal === currentGoal
  const goalImpactText = isSameGoal
    ? `✓ Same project goal (${candidate.projectGoal})`
    : `⚠ Different project goal (${candidate.projectGoal} vs ${currentGoal})`

  // Experience impact
  const experienceImpactText = `+1 ${candidate.experience} member`

  // High-level impact bullet points
  const impactSummary = []
  if (gapsAddressed.length > 0) {
    impactSummary.push(`Fills ${gapsAddressed.length} missing skill${gapsAddressed.length > 1 ? "s" : ""} (${gapsAddressed.join(", ")})`)
  }
  if (isNewRole) {
    impactSummary.push(`Adds ${candidate.role} specialization`)
  }
  if (skillCoverageDelta > 0) {
    impactSummary.push(`Improves skill coverage by +${skillCoverageDelta}%`)
  }
  if (isSameGoal) {
    impactSummary.push(`Shares your ${currentGoal} mission`)
  }
  if (candidate.experience === "Advanced") {
    impactSummary.push(`Adds high-tier Advanced technical guidance`)
  }
  if (impactSummary.length === 0) {
    impactSummary.push(`Reinforces existing team capabilities`)
  }

  return {
    currentMetrics,
    projectedMetrics,
    deltas: {
      skillCoverage: skillCoverageDelta,
      roleDiversity: roleDiversityDelta,
      compatibility: compatibilityDelta,
      readiness: readinessDelta,
      chemistry: chemistryDelta,
    },
    gainedSkills,
    alreadyCoveredSkills,
    gapsAddressed,
    roleImpact: {
      isNewRole,
      text: roleImpactText,
    },
    goalImpact: {
      isSameGoal,
      text: goalImpactText,
    },
    experienceImpact: {
      text: experienceImpactText,
    },
    impactSummary,
  }
}

/**
 * Derives both "Why This Match?" and neutral "Why This Match is Lower" reasons
 */
export function getCandidateMatchAnalysis(currentTeam = [], candidate, targetProjectGoal = null) {
  const currentMetrics = calculateTeamMetrics(currentTeam, targetProjectGoal)
  const candidateSkills = candidate.skills || []
  const gapsAddressed = candidateSkills.filter((s) => currentMetrics.missingSkills.includes(s))
  const newSkills = candidateSkills.filter((s) => !currentMetrics.coveredSkills.includes(s))
  const isNewRole = !currentMetrics.uniqueRoles.includes(candidate.role)
  const currentGoal = targetProjectGoal || currentTeam[0]?.projectGoal || "Hackathon"
  const isSameGoal = candidate.projectGoal === currentGoal

  // Calculate Match Score
  let score = 35
  if (newSkills.length > 0) score += Math.min(15, newSkills.length * 5)
  if (gapsAddressed.length > 0) score += Math.min(25, gapsAddressed.length * 10)
  if (isSameGoal) score += 15
  if (isNewRole) score += 15
  if (candidate.experience === "Advanced") score += 10
  else if (candidate.experience === "Intermediate") score += 5
  const matchScore = Math.min(100, score)

  // Positive Reasons
  const whyThisMatch = []
  if (gapsAddressed.length > 0) {
    whyThisMatch.push(`Fills ${gapsAddressed.length} skill gap${gapsAddressed.length > 1 ? "s" : ""} (${gapsAddressed.slice(0, 2).join(" + ")})`)
  } else if (newSkills.length > 0) {
    whyThisMatch.push(`Adds ${newSkills.slice(0, 2).join(" + ")}`)
  }
  if (isNewRole) {
    whyThisMatch.push(`Adds ${candidate.role} class`)
  }
  if (isSameGoal) {
    whyThisMatch.push(`Same ${candidate.projectGoal} goal`)
  }
  if (candidate.experience === "Advanced" || candidate.experience === "Intermediate") {
    whyThisMatch.push(`Experienced builder (${candidate.experience})`)
  }
  if (whyThisMatch.length === 0) {
    whyThisMatch.push("Potential teammate match")
  }

  // Neutral Lower Match Observations (if any)
  const whyNotThisMatch = []
  const alreadyCovered = candidateSkills.filter((s) => currentMetrics.coveredSkills.includes(s))

  if (gapsAddressed.length === 0 && currentMetrics.missingSkills.length > 0) {
    whyNotThisMatch.push("Does not address currently open skill gaps")
  }
  if (!isNewRole && currentTeam.length > 1) {
    whyNotThisMatch.push(`${candidate.role} is already present in your squad`)
  }
  if (alreadyCovered.length >= 2) {
    whyNotThisMatch.push(`${alreadyCovered.slice(0, 2).join(" and ")} already covered by current team`)
  }
  if (!isSameGoal) {
    whyNotThisMatch.push(`Different project goal (${candidate.projectGoal})`)
  }

  return {
    matchScore,
    whyThisMatch,
    whyNotThisMatch: whyNotThisMatch.slice(0, 2),
    gapsAddressed,
    newSkills,
  }
}
