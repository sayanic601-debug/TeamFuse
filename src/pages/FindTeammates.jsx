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

function FindTeammates() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")

  const profile = JSON.parse(
    localStorage.getItem("teamfuseProfile") || "null"
  )

  // Current user representation with stable ID
  const currentUser = useMemo(() => {
    if (!profile) return null
    return {
      ...profile,
      id: "current-user",
      isCurrentUser: true,
      emoji: profile.emoji || "👩🏻‍💻",
      color: profile.color || "bg-[#FFD86B]",
    }
  }, [profile])

  // Initialize selected allies (excluding current user) from localStorage
  const [selectedUsers, setSelectedUsers] = useState(() => {
    try {
      const savedTeam = JSON.parse(localStorage.getItem("teamfuseTeam") || "[]")
      return Array.isArray(savedTeam)
        ? savedTeam
            .filter((m) => m.id !== "current-user")
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

  // Automatically ensure currentUser is in teamfuseTeam
  useEffect(() => {
    if (currentUser) {
      try {
        const savedTeam = JSON.parse(
          localStorage.getItem("teamfuseTeam") || "[]"
        )
        const otherMembers = Array.isArray(savedTeam)
          ? savedTeam.filter((m) => m.id !== "current-user")
          : []
        localStorage.setItem(
          "teamfuseTeam",
          JSON.stringify([currentUser, ...otherMembers])
        )
      } catch {
        localStorage.setItem("teamfuseTeam", JSON.stringify([currentUser]))
      }
    }
  }, [currentUser])

  // All core abilities & what squad already possesses
  const allSkills = useMemo(
    () => [
      "React",
      "Node.js",
      "MongoDB",
      "Python",
      "Machine Learning",
      "UI/UX",
      "Figma",
    ],
    []
  )

  const squadSkills = useMemo(() => {
    return [...new Set(currentSquad.flatMap((m) => m.skills || []))]
  }, [currentSquad])

  // Complementary abilities missing from current squad
  const neededSkills = useMemo(() => {
    return allSkills.filter((skill) => !squadSkills.includes(skill))
  }, [allSkills, squadSkills])

  // Team name state and modal management
  const [teamName, setTeamName] = useState(() => {
    return localStorage.getItem("teamfuseTeamName") || ""
  })
  const [isNamingModalOpen, setIsNamingModalOpen] = useState(false)
  const [teamNameError, setTeamNameError] = useState("")

  // Identify skills candidate brings that fill squad's missing skills
  const getGapSkills = useCallback(
    (user) => {
      return (user.skills || []).filter(
        (skill) =>
          neededSkills.includes(skill) ||
          (profile?.lookingFor || []).includes(skill)
      )
    },
    [neededSkills, profile]
  )

  // Identify skills candidate has that squad does not have
  const getNewSkills = useCallback(
    (user) => {
      return (user.skills || []).filter((skill) => !squadSkills.includes(skill))
    },
    [squadSkills]
  )

  // Calculate compatibility score with transparent scoring
  const calculateMatch = useCallback(
    (user) => {
      if (!profile) return 75

      let score = 35 // Base score

      // 1. If candidate brings skills the squad doesn't have: +10
      const newSkills = getNewSkills(user)
      if (newSkills.length > 0) {
        score += 10
      }

      // 2. If candidate fills missing squad skills: +20
      const gapSkills = getGapSkills(user)
      if (gapSkills.length > 0) {
        score += 20
      }

      // 3. Same project goal: +15
      if (profile.projectGoal && profile.projectGoal === user.projectGoal) {
        score += 15
      }

      // 4. Complementary role: +15
      if (profile.role && user.role !== profile.role) {
        score += 15
      }

      // 5. Useful experience: +5
      if (
        user.experience === "Advanced" ||
        (profile.experience && user.experience === profile.experience)
      ) {
        score += 5
      }

      return Math.min(100, score)
    },
    [profile, getNewSkills, getGapSkills]
  )

  // Get skills that match user's requirement
  const getMatchedSkills = useCallback(
    (user) => {
      return (user.skills || []).filter(
        (skill) =>
          neededSkills.includes(skill) ||
          (profile?.lookingFor || []).includes(skill)
      )
    },
    [neededSkills, profile]
  )

  // Explain why this teammate is a match
  const getMatchReason = useCallback(
    (user) => {
      const gapSkills = getGapSkills(user)
      const newSkills = getNewSkills(user)
      const reasons = []

      if (gapSkills.length > 0) {
        reasons.push(
          `Fills ${gapSkills.length} skill gap${gapSkills.length > 1 ? "s" : ""} (${gapSkills.slice(0, 2).join(", ")})`
        )
      } else if (newSkills.length > 0) {
        reasons.push(`Brings ${newSkills.slice(0, 2).join(", ")}`)
      }

      if (profile?.projectGoal && profile.projectGoal === user.projectGoal) {
        reasons.push(`Aligned mission: ${user.projectGoal}`)
      }

      if (profile?.role && user.role !== profile.role) {
        reasons.push("Complementary role")
      }

      if (reasons.length === 0) {
        reasons.push("Potential teammate match")
      }

      return reasons
    },
    [getGapSkills, getNewSkills, profile]
  )

  // Search + filter + sort candidates (strictly exclude current user)
  const filteredUsers = useMemo(() => {
    return demoUsers
      .filter((user) => {
        if (currentUser && user.id === currentUser.id) return false
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
      .sort((a, b) => calculateMatch(b) - calculateMatch(a))
  }, [search, roleFilter, calculateMatch, currentUser])

  // Add/remove teammate
  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    )
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

    // Save full squad with currentUser as member #1
    localStorage.setItem("teamfuseTeam", JSON.stringify(currentSquad))
    localStorage.setItem("teamfuseTeamName", trimmed)

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
                Collectible builder cards ranked by automated skill & goal compatibility.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] px-3.5 py-1.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Flame size={13} className="text-amber-700" />
              {currentSquad.length} {currentSquad.length === 1 ? "BUILDER IN SQUAD" : "BUILDERS IN SQUAD"}
            </div>
          </div>
        </section>

        {/* ==================== PROMINENT SQUAD PREVIEW SECTION ==================== */}
        <section className="mb-8 rounded-3xl border-2 border-[#17142B] bg-white p-6 shadow-[5px_5px_0_#17142B]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#17142B]/10 pb-4">
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
                <Users size={12} />
                ACTIVE SQUAD ROSTER · {currentSquad.length} {currentSquad.length === 1 ? "BUILDER" : "BUILDERS"}
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#17142B] sm:text-2xl">
                Your Squad
              </h2>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Sparkles size={13} fill="currentColor" />
              YOU ARE IN THE SQUAD
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

          {/* WHAT DOES YOUR SQUAD NEED? Panel */}
          <div className="mt-6 rounded-2xl border-2 border-[#17142B] bg-[#FFF8E8] p-4 shadow-[2px_2px_0_#17142B]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#17142B] bg-[#F7A6C7] text-[#17142B]">
                    <Target size={13} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wide text-[#17142B]">
                    WHAT DOES YOUR SQUAD NEED?
                  </h3>
                </div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-600">
                  {neededSkills.length > 0
                    ? "Target these complementary abilities from candidates below to maximize squad synergy:"
                    : "Your squad has full 100% skill coverage! Fantastic job assembling!"}
                </p>
              </div>

              {neededSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {neededSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]"
                    >
                      <span>+</span>
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="rounded-md border-2 border-[#17142B] bg-[#BDE7D6] px-2.5 py-1 text-[10px] font-black uppercase text-[#17142B]">
                  ✓ FULL COVERAGE
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Search + Filter Panel */}
        <section className="mb-8 rounded-2xl border-2 border-[#17142B] bg-white p-5 shadow-[4px_4px_0_#17142B]">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]">
              <Target size={14} />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#17142B]">
                Filter Scouting Wall
              </h2>
            </div>
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
                placeholder="Search candidates by name or skill (e.g. React, Python)..."
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

        {/* Teammates Character Cards Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const match = calculateMatch(user)
            const selected = selectedUsers.includes(user.id)
            const matchedSkills = getMatchedSkills(user)
            const gapSkills = getGapSkills(user)
            const reasons = getMatchReason(user)

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
                    <span className="rounded-md border-2 border-[#17142B] bg-[#FFD86B] px-2 py-0.5 text-[10px] font-black uppercase text-[#17142B] shadow-[1px_1px_0_#17142B]">
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
                      <span className="font-black uppercase text-slate-500 text-[10px]">Mission</span>
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
                        const isMatched = matchedSkills.includes(skill)
                        return (
                          <span
                            key={skill}
                            className={`rounded-md border-2 px-2 py-0.5 text-[11px] font-black transition ${
                              isMatched
                                ? "border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[1px_1px_0_#17142B]"
                                : "border-[#17142B] bg-[#FFF8E8] text-slate-700"
                            }`}
                          >
                            {isMatched && "✓ "}
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
                      <span>✦ Fills {gapSkills.length} skill gap{gapSkills.length > 1 ? "s" : ""}</span>
                    </div>
                  )}

                  {/* Why this match callout */}
                  <div className="mt-3.5 rounded-xl border-2 border-[#17142B] bg-[#DCCFFF]/40 p-3 shadow-[1px_1px_0_#17142B]">
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#17142B]">
                      <Sparkles size={11} className="text-[#7046D9]" />
                      Why this match?
                    </div>

                    <div className="space-y-0.5">
                      {reasons.map((reason) => (
                        <p
                          key={reason}
                          className="text-[11px] font-bold text-slate-700"
                        >
                          ✓ {reason}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add to Team Action Button */}
                <button
                  onClick={() => toggleUser(user.id)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#17142B] py-2.5 text-xs font-black uppercase tracking-wider transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
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

      {/* Persistent Squad Selection & Preview Dock */}
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
                  ? "Solo builder (YOU) · Add allies above"
                  : `${currentSquad.length} builders ready to fuse`}
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

      {/* Name Your Squad Modal */}
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
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white text-lg font-black text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5 hover:bg-[#FFD6CE] hover:shadow-[3px_3px_0_#17142B]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Confirmed Roster Snapshot */}
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

              {/* Form Input */}
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