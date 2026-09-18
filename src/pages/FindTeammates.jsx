import { useCallback, useMemo, useState } from "react"
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
  const [selectedUsers, setSelectedUsers] = useState([])

  const profile = JSON.parse(
    localStorage.getItem("teamfuseProfile")
  )

  // Calculate compatibility score
  const calculateMatch = useCallback((user) => {
    if (!profile) return 75

    const lookingFor = profile.lookingFor || []

    // 1. Skill Score - 60 points
    const matchedSkills = user.skills.filter((skill) =>
      lookingFor.includes(skill)
    )

    const skillScore =
      lookingFor.length > 0
        ? (matchedSkills.length / lookingFor.length) * 60
        : 45

    // 2. Experience Score - 10 points
    const experienceScore =
      profile.experience === user.experience ? 10 : 5

    // 3. Role Compatibility - 20 points
    let roleScore = 0

    if (
      profile.role === "Frontend Developer" &&
      user.role === "Backend Developer"
    ) {
      roleScore = 20
    } else if (
      profile.role === "Backend Developer" &&
      user.role === "Frontend Developer"
    ) {
      roleScore = 20
    } else if (
      profile.role === "UI/UX Designer" &&
      user.role !== "UI/UX Designer"
    ) {
      roleScore = 20
    } else if (
      profile.role === "ML Engineer" &&
      user.role !== "ML Engineer"
    ) {
      roleScore = 20
    } else if (
      profile.role &&
      user.role !== profile.role
    ) {
      roleScore = 10
    }

    // 4. Project Goal - 10 points
    const projectGoalScore =
      profile.projectGoal &&
      profile.projectGoal === user.projectGoal
        ? 10
        : 0

    // Final Score
    return Math.min(
      100,
      Math.round(
        skillScore +
        roleScore +
        experienceScore +
        projectGoalScore
      )
    )
  }, [profile])

  // Get skills that match user's requirement
  const getMatchedSkills = (user) => {
    const lookingFor = profile?.lookingFor || []

    return user.skills.filter((skill) =>
      lookingFor.includes(skill)
    )
  }

  // Explain why this teammate is a match
  const getMatchReason = (user) => {
    const matchedSkills = getMatchedSkills(user)
    const reasons = []

    if (matchedSkills.length > 0) {
      reasons.push(
        `${matchedSkills.length} matching skill${
          matchedSkills.length > 1 ? "s" : ""
        }`
      )
    }

    if (
      profile?.experience &&
      profile.experience === user.experience
    ) {
      reasons.push("Same experience level")
    }

    if (
      profile?.projectGoal &&
      profile.projectGoal === user.projectGoal
    ) {
      reasons.push("Same project goal")
    }

    if (
      profile?.role &&
      user.role !== profile.role
    ) {
      reasons.push("Complementary role")
    }

    if (reasons.length === 0) {
      reasons.push("Potential teammate match")
    }

    return reasons
  }

  // Search + filter + sort
  const filteredUsers = useMemo(() => {
    return demoUsers
      .filter((user) => {
        const searchText = search.toLowerCase()

        const matchesSearch =
          user.name.toLowerCase().includes(searchText) ||
          user.skills.some((skill) =>
            skill.toLowerCase().includes(searchText)
          )

        const matchesRole =
          roleFilter === "All" ||
          user.role.includes(roleFilter)

        return matchesSearch && matchesRole
      })
      .sort(
        (a, b) =>
          calculateMatch(b) - calculateMatch(a)
      )
  }, [search, roleFilter, calculateMatch])

  // Add/remove teammate
  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    )
  }

  // Build team
  const buildTeam = () => {
    if (selectedUsers.length === 0) {
      alert("Add at least one teammate first! 👥")
      return
    }

    const selected = demoUsers.filter((user) =>
      selectedUsers.includes(user.id)
    )

    localStorage.setItem(
      "teamfuseTeam",
      JSON.stringify(selected)
    )

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
              {selectedUsers.length} ALLIES RECRUITED
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
                      IN SQUAD
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      + ADD TO TEAM
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

      {/* Floating Bottom Squad Bar */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border-2 border-[#17142B] bg-white p-3.5 shadow-[5px_5px_0_#17142B]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-base font-black uppercase text-[#17142B] leading-none">
                {selectedUsers.length} Teammate{selectedUsers.length > 1 ? "s" : ""} Recruited
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                Ready to fuse into your comic scoreboard
              </p>
            </div>
          </div>

          <button
            onClick={buildTeam}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#17142B] shadow-[2px_2px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Build Team
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default FindTeammates