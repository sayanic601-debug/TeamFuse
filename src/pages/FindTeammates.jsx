import { useMemo, useState } from "react"
import {
  ArrowLeft,
  Search,
  Users,
  Check,
  UserPlus,
  Sparkles,
  Target,
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
  const calculateMatch = (user) => {
    if (!profile) return 75

    const lookingFor = profile.lookingFor || []

    // -----------------------------
    // 1. Skill Score - 60 points
    // -----------------------------

    const matchedSkills = user.skills.filter((skill) =>
      lookingFor.includes(skill)
    )

    let skillScore = 0

    if (lookingFor.length > 0) {
      skillScore =
        (matchedSkills.length / lookingFor.length) * 60
    } else {
      // If user did not specify required skills
      skillScore = 45
    }

    // -----------------------------
    // 2. Experience Score - 10 points
    // -----------------------------

    const experienceScore =
      profile.experience === user.experience ? 10 : 5

    // -----------------------------
    // 3. Role Compatibility - 20 points
    // -----------------------------

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

    // -----------------------------
    // 4. Project Goal - 10 points
    // -----------------------------

    const projectGoalScore =
      profile.projectGoal &&
      profile.projectGoal === user.projectGoal
        ? 10
        : 0

    // -----------------------------
    // Final Score
    // -----------------------------

    return Math.min(
      100,
      Math.round(
        skillScore +
        roleScore +
        experienceScore +
        projectGoalScore
      )
    )
  }

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

    // Matching skills
    if (matchedSkills.length > 0) {
      reasons.push(
        `${matchedSkills.length} matching skill${
          matchedSkills.length > 1 ? "s" : ""
        }`
      )
    }

    // Same experience
    if (
      profile?.experience &&
      profile.experience === user.experience
    ) {
      reasons.push("Same experience level")
    }

    // Same project goal
    if (
      profile?.projectGoal &&
      profile.projectGoal === user.projectGoal
    ) {
      reasons.push("Same project goal")
    }

    // Complementary role
    if (
      profile?.role &&
      user.role !== profile.role
    ) {
      reasons.push("Complementary role")
    }

    // Fallback
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
  }, [search, roleFilter, profile])

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
    <div className="min-h-screen bg-[#FFF9EF] px-5 py-8 pb-32 text-[#17142B]">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <button
            onClick={() => navigate("/create-profile")}
            className="flex items-center gap-2 font-black transition hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-2 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            <Users size={18} />
            Find Teammates
          </div>

        </div>

        {/* Title */}
        <div className="mb-8">

          <div className="mb-3 inline-block rotate-2 rounded-full border-2 border-[#17142B] bg-[#BDE7D6] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            STEP 02
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-4xl font-black md:text-5xl">
              Build Your Dream Team 💥
            </h1>

            <div className="rotate-3 rounded-xl border-2 border-[#17142B] bg-[#F7A6C7] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#17142B]">
              MATCH. FUSE. BUILD.
            </div>

          </div>

          <p className="mt-3 max-w-2xl text-lg font-bold text-[#17142B]/70">
            Find people whose skills complete yours.
          </p>

        </div>

        {/* Search + Filter */}
        <div className="mb-8 rounded-3xl border-4 border-[#17142B] bg-white p-5 shadow-[7px_7px_0_#17142B]">

          <div className="mb-4 flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#DCCFFF]">
              <Target size={18} />
            </div>

            <div>
              <p className="font-black">
                Find Your Match
              </p>

              <p className="text-xs font-bold opacity-60">
                Search and filter potential teammates
              </p>
            </div>

          </div>

          <div className="flex flex-col gap-4 md:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <Search
                size={21}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or skill..."
                className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] py-3 pl-12 pr-4 font-bold outline-none transition focus:ring-4 focus:ring-[#DCCFFF]"
              />

            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-black outline-none"
            >
              <option value="All">
                All Roles
              </option>

              <option value="Frontend">
                Frontend
              </option>

              <option value="Backend">
                Backend
              </option>

              <option value="ML">
                ML
              </option>

              <option value="UI/UX">
                UI/UX
              </option>

              <option value="Full Stack">
                Full Stack
              </option>
            </select>

          </div>

          {/* Result Count */}
          <div className="mt-4 flex items-center justify-between">

            <p className="text-sm font-black opacity-60">
              {filteredUsers.length} teammate
              {filteredUsers.length !== 1 ? "s" : ""} found
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-black underline"
              >
                Clear search
              </button>
            )}

          </div>

        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {filteredUsers.map((user) => {

            const match = calculateMatch(user)
            const selected = selectedUsers.includes(user.id)
            const matchedSkills = getMatchedSkills(user)
            const reasons = getMatchReason(user)

            return (
              <div
                key={user.id}
                className={`rounded-3xl border-4 border-[#17142B] ${user.color} p-5 shadow-[7px_7px_0_#17142B] transition duration-200 hover:-translate-y-2 hover:shadow-[9px_9px_0_#17142B]`}
              >

                {/* User Header */}
                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white text-3xl shadow-[2px_2px_0_#17142B]">
                      {user.emoji}
                    </div>

                    <div>

                      <h2 className="text-xl font-black">
                        {user.name}
                      </h2>

                      <p className="font-bold">
                        {user.role}
                      </p>

                      <p className="text-sm font-bold opacity-60">
                        {user.experience}
                      </p>

                    </div>

                  </div>

                  {/* Match */}
                  <div className="rotate-3 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-3 py-2 text-center shadow-[3px_3px_0_#17142B]">

                    <p className="text-xl font-black">
                      {match}%
                    </p>

                    <p className="text-[9px] font-black uppercase">
                      Match
                    </p>

                  </div>

                </div>

                {/* Match Meter */}
                <div className="mt-4">

                  <div className="mb-1 flex items-center justify-between text-xs font-black">
                    <span>
                      COMPATIBILITY
                    </span>

                    <span>
                      {match}/100
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full border-2 border-[#17142B] bg-white">

                    <div
                      className="h-full rounded-full bg-[#7046D9] transition-all duration-500"
                      style={{
                        width: `${match}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Project Goal */}
                {user.projectGoal && (
                  <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-[#17142B] bg-white/70 px-3 py-2">

                    <span className="text-xs font-black uppercase tracking-wide">
                      Project
                    </span>

                    <span className="text-xs font-black">
                      {user.projectGoal}
                    </span>

                  </div>
                )}

                {/* Skills */}
                <div className="mt-5">

                  <p className="mb-2 text-xs font-black uppercase tracking-wide">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {user.skills.map((skill) => {

                      const isMatched =
                        matchedSkills.includes(skill)

                      return (
                        <span
                          key={skill}
                          className={`rounded-full border-2 border-[#17142B] px-3 py-1 text-xs font-black transition ${
                            isMatched
                              ? "bg-[#17142B] text-white"
                              : "bg-white"
                          }`}
                        >
                          {isMatched && "✓ "}
                          {skill}
                        </span>
                      )
                    })}

                  </div>

                </div>

                {/* Match Explanation */}
                <div className="mt-4 rounded-2xl border-2 border-[#17142B] bg-white/75 p-3">

                  <div className="mb-2 flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#17142B] bg-[#FFD86B]">
                      <Sparkles size={14} />
                    </div>

                    <p className="text-xs font-black uppercase tracking-wide">
                      Why this match?
                    </p>

                  </div>

                  <div className="space-y-1">

                    {reasons.map((reason) => (
                      <p
                        key={reason}
                        className="text-xs font-bold"
                      >
                        ✓ {reason}
                      </p>
                    ))}

                  </div>

                </div>

                {/* Button */}
                <button
                  onClick={() => toggleUser(user.id)}
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#17142B] px-4 py-3 font-black shadow-[4px_4px_0_#17142B] transition active:translate-x-1 active:translate-y-1 active:shadow-none ${
                    selected
                      ? "bg-[#17142B] text-white"
                      : "bg-white hover:-translate-y-1"
                  }`}
                >

                  {selected ? (
                    <>
                      <Check size={19} />
                      Added to Team
                    </>
                  ) : (
                    <>
                      <UserPlus size={19} />
                      Add to Team
                    </>
                  )}

                </button>

              </div>
            )
          })}

        </div>

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <div className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-10 text-center shadow-[7px_7px_0_#17142B]">

            <div className="text-5xl">
              🔎
            </div>

            <h2 className="mt-4 text-2xl font-black">
              No teammates found!
            </h2>

            <p className="mt-2 font-bold">
              Try a different name, skill or role.
            </p>

            <button
              onClick={() => {
                setSearch("")
                setRoleFilter("All")
              }}
              className="mt-5 rounded-xl border-2 border-[#17142B] bg-white px-5 py-3 font-black shadow-[4px_4px_0_#17142B] transition hover:-translate-y-1"
            >
              Reset Filters
            </button>

          </div>
        )}

      </div>

      {/* Bottom Team Bar */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border-4 border-[#17142B] bg-white p-4 shadow-[7px_7px_0_#17142B]">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#BDE7D6]">
              <Users size={20} />
            </div>

            <div>

              <p className="text-2xl font-black leading-none">
                {selectedUsers.length}
              </p>

              <p className="text-sm font-bold">
                teammate
                {selectedUsers.length > 1 ? "s" : ""} selected
              </p>

            </div>

          </div>

          <button
            onClick={buildTeam}
            className="rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-5 py-3 font-black text-white shadow-[4px_4px_0_#17142B] transition hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Build Team →
          </button>

        </div>
      )}

    </div>
  )
}

export default FindTeammates