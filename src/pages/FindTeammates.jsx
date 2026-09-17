import { useMemo, useState } from "react"
import { ArrowLeft, Search, Users, Check, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"

const demoUsers = [
  {
    id: 1,
    name: "Rahul",
    role: "Backend Developer",
    experience: "Intermediate",
    skills: ["Node.js", "MongoDB", "Express"],
    emoji: "👨🏻‍💻",
    color: "bg-[#BDE7D6]",
  },
  {
    id: 2,
    name: "Ananya",
    role: "ML Engineer",
    experience: "Advanced",
    skills: ["Python", "Machine Learning", "Figma"],
    emoji: "👩🏻‍🔬",
    color: "bg-[#FFD86B]",
  },
  {
    id: 3,
    name: "Riya",
    role: "UI/UX Designer",
    experience: "Intermediate",
    skills: ["UI/UX", "Figma", "React"],
    emoji: "👩🏻‍🎨",
    color: "bg-[#F7A6C7]",
  },
  {
    id: 4,
    name: "Arjun",
    role: "Full Stack Developer",
    experience: "Advanced",
    skills: ["React", "Node.js", "MongoDB"],
    emoji: "👨🏻‍💻",
    color: "bg-[#DCCFFF]",
  },
  {
    id: 5,
    name: "Sneha",
    role: "Frontend Developer",
    experience: "Beginner",
    skills: ["React", "Java", "UI/UX"],
    emoji: "👩🏻‍💻",
    color: "bg-[#FFD6CE]",
  },
  {
    id: 6,
    name: "Aditya",
    role: "Backend Developer",
    experience: "Intermediate",
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

  const calculateMatch = (user) => {
    if (!profile) return 75

    const lookingFor = profile.lookingFor || []

    if (lookingFor.length === 0) return 75

    const matchedSkills = user.skills.filter((skill) =>
      lookingFor.includes(skill)
    )

    const skillScore =
      (matchedSkills.length / lookingFor.length) * 70

    const experienceScore =
      profile.experience === user.experience ? 10 : 5

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
      roleScore = 15
    } else if (
      profile.role === "ML Engineer" &&
      user.role !== "ML Engineer"
    ) {
      roleScore = 15
    }

    return Math.min(
      100,
      Math.round(skillScore + roleScore + experienceScore)
    )
  }

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

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    )
  }

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
            className="flex items-center gap-2 font-black hover:-translate-x-1 transition"
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

          <h1 className="text-4xl font-black md:text-5xl">
            Build Your Dream Team 💥
          </h1>

          <p className="mt-3 max-w-2xl text-lg font-bold text-[#17142B]/70">
            Find people whose skills complete yours.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="mb-8 rounded-3xl border-4 border-[#17142B] bg-white p-5 shadow-[7px_7px_0_#17142B]">

          <div className="flex flex-col gap-4 md:flex-row">

            <div className="relative flex-1">
              <Search
                size={21}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or skill..."
                className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] py-3 pl-12 pr-4 font-bold outline-none focus:ring-4 focus:ring-[#DCCFFF]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-black outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="ML">ML</option>
              <option value="UI/UX">UI/UX</option>
              <option value="Full Stack">Full Stack</option>
            </select>

          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {filteredUsers.map((user) => {
            const match = calculateMatch(user)
            const selected = selectedUsers.includes(user.id)

            return (
              <div
                key={user.id}
                className={`rounded-3xl border-4 border-[#17142B] ${user.color} p-5 shadow-[7px_7px_0_#17142B] transition hover:-translate-y-1`}
              >

                {/* User */}
                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white text-3xl">
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

                {/* Skills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border-2 border-[#17142B] bg-white px-3 py-1 text-xs font-black"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => toggleUser(user.id)}
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#17142B] px-4 py-3 font-black shadow-[4px_4px_0_#17142B] transition active:translate-x-1 active:translate-y-1 active:shadow-none ${
                    selected
                      ? "bg-[#17142B] text-white"
                      : "bg-white"
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

        {/* No results */}
        {filteredUsers.length === 0 && (
          <div className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-10 text-center shadow-[7px_7px_0_#17142B]">
            <div className="text-5xl">🔎</div>

            <h2 className="mt-4 text-2xl font-black">
              No teammates found!
            </h2>

            <p className="mt-2 font-bold">
              Try a different name, skill or role.
            </p>
          </div>
        )}

      </div>

      {/* Bottom Team Bar */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border-4 border-[#17142B] bg-white p-4 shadow-[7px_7px_0_#17142B]">

          <div>
            <p className="text-2xl font-black">
              {selectedUsers.length}
            </p>

            <p className="text-sm font-bold">
              teammate{selectedUsers.length > 1 ? "s" : ""} selected
            </p>
          </div>

          <button
            onClick={buildTeam}
            className="rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-5 py-3 font-black text-white shadow-[4px_4px_0_#17142B] transition hover:-translate-y-1"
          >
            Build Team →
          </button>

        </div>
      )}

    </div>
  )
}

export default FindTeammates