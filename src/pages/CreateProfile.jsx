import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  UserRound,
  Briefcase,
  GraduationCap,
  Wrench,
  Search,
  Zap,
  Target,
  Shield,
  Flame,
} from "lucide-react"

function CreateProfile() {
  const navigate = useNavigate()

  const [selectedSkills, setSelectedSkills] = useState([])
  const [lookingFor, setLookingFor] = useState([])

  const skills = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "UI/UX",
    "MongoDB",
    "Machine Learning",
    "Figma",
  ]

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    )
  }

  const toggleLookingFor = (skill) => {
    setLookingFor((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const roleEmojis = {
      "Frontend Developer": "👩🏻‍💻",
      "Backend Developer": "👨🏻‍💻",
      "ML Engineer": "👩🏻‍🔬",
      "UI/UX Designer": "👩🏻‍🎨",
      "Full Stack Developer": "👨🏻‍💻",
      "Other": "⚡",
    }

    const roleVal = e.target.role.value
    const userEmoji = roleEmojis[roleVal] || "👤"

    const profile = {
      id: "current-user",
      name: e.target.name.value.trim() || "Builder",
      role: roleVal,
      experience: e.target.experience.value,
      projectGoal: e.target.projectGoal.value,
      skills: selectedSkills,
      lookingFor,
      emoji: userEmoji,
      isCurrentUser: true,
      color: "bg-[#FFD86B]",
    }

    localStorage.setItem(
      "teamfuseProfile",
      JSON.stringify(profile)
    )

    // User automatically becomes member #1 in teamfuseTeam
    try {
      const existingTeam = JSON.parse(
        localStorage.getItem("teamfuseTeam") || "[]"
      )
      const otherMembers = Array.isArray(existingTeam)
        ? existingTeam.filter((m) => m.id !== "current-user")
        : []
      localStorage.setItem(
        "teamfuseTeam",
        JSON.stringify([profile, ...otherMembers])
      )
    } catch {
      localStorage.setItem(
        "teamfuseTeam",
        JSON.stringify([profile])
      )
    }

    navigate("/find-teammates")
  }

  return (
    <div className="min-h-screen bg-[#FFF8E8] px-5 py-8 text-[#17142B] selection:bg-[#FFD86B] selection:text-[#17142B]">
      <div className="mx-auto max-w-4xl">
        {/* Navigation & Comic Step Header */}
        <header className="mb-8 flex items-center justify-between gap-4 border-b-2 border-[#17142B]/10 pb-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 transition hover:text-[#7046D9]"
          >
            <ArrowLeft size={16} />
            Back Home
          </button>

          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#17142B]">
            <Zap size={13} fill="currentColor" />
            STEP 01 · CHARACTER CREATION
          </div>
        </header>

        {/* Hero: Character Creation Banner */}
        <section className="relative mb-8">
          <div className="pointer-events-none absolute -right-4 -top-6 h-28 w-28 bg-halftone-subtle opacity-60" />

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border-2 border-[#17142B] bg-[#DCCFFF] px-3 py-0.5 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
            <Sparkles size={13} />
            BUILDER DOSSIER
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-[#17142B] sm:text-4xl">
                Create Your Builder Profile
              </h1>
              <p className="mt-2 text-sm font-bold text-slate-600">
                Choose your identity, assign your power levels, and equip your core technical loadout.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#17142B] bg-[#BDE7D6] px-3 py-1 text-xs font-black uppercase text-[#17142B] shadow-[2px_2px_0_#17142B]">
              <Flame size={13} className="text-amber-700" />
              PLAYER 1 READY
            </div>
          </div>
        </section>

        {/* Character Sheet Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Panel 1: Identity & Role Specs */}
          <section className="rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B] sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b-2 border-[#17142B] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#FFD86B] text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  <UserRound size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide text-[#17142B]">
                    Identity & Mission Specs
                  </h2>
                  <p className="text-xs font-bold text-slate-500">
                    Character codename, specialty, and quest objective
                  </p>
                </div>
              </div>

              <span className="hidden rounded-md border-2 border-[#17142B] bg-[#FFF8E8] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#17142B] sm:inline-block shadow-[1px_1px_0_#17142B]">
                CHARACTER SPECS
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Identity Name */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                  <UserRound size={13} className="text-[#7046D9]" />
                  Character Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Sayani"
                  required
                  className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-4 py-3 text-sm font-bold text-[#17142B] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#7046D9]"
                />
              </div>

              {/* Your Role */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                  <Briefcase size={13} className="text-[#7046D9]" />
                  Your Role / Class
                </label>
                <select
                  name="role"
                  required
                  className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-4 py-3 text-sm font-bold text-[#17142B] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#7046D9]"
                >
                  <option value="">Select your role class</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="ML Engineer">ML Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Power Level / Experience */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                  <GraduationCap size={13} className="text-[#7046D9]" />
                  Power Level / Experience
                </label>
                <select
                  name="experience"
                  required
                  className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-4 py-3 text-sm font-bold text-[#17142B] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#7046D9]"
                >
                  <option value="">Select power level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Project Mission */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                  <Target size={13} className="text-[#7046D9]" />
                  Project Mission
                </label>
                <select
                  name="projectGoal"
                  required
                  className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] px-4 py-3 text-sm font-bold text-[#17142B] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#7046D9]"
                >
                  <option value="">What is your mission?</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="College Project">College Project</option>
                  <option value="Startup">Startup</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Personal Project">Personal Project</option>
                </select>
              </div>
            </div>
          </section>

          {/* Panel 2: Skill Loadout (Abilities) */}
          <section className="rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B] sm:p-7">
            <div className="mb-5 flex items-center justify-between border-b-2 border-[#17142B] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#BDE7D6] text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  <Wrench size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide text-[#17142B]">
                    Skill Loadout
                  </h2>
                  <p className="text-xs font-bold text-slate-500">
                    Equip the technical powers you currently possess
                  </p>
                </div>
              </div>

              <span className="rounded-md border-2 border-[#17142B] bg-[#BDE7D6] px-2.5 py-0.5 text-xs font-black text-[#17142B] shadow-[1px_1px_0_#17142B]">
                {selectedSkills.length} EQUIPPED
              </span>
            </div>

            {/* Interactive Ability Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => {
                const selected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                      selected
                        ? "border-[#17142B] bg-[#7046D9] text-white shadow-[2px_2px_0_#17142B]"
                        : "border-[#17142B] bg-[#FFF8E8] text-slate-800 shadow-[2px_2px_0_#17142B] hover:-translate-y-0.5 hover:bg-white"
                    }`}
                  >
                    {selected && <Check size={14} />}
                    {skill}
                  </button>
                )
              })}
            </div>

            {/* Active Loadout Summary Box */}
            {selectedSkills.length > 0 && (
              <div className="mt-5 rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3.5 shadow-[2px_2px_0_#17142B]">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  EQUIPPED SUPERPOWERS
                </p>
                <p className="mt-1 text-xs font-black uppercase text-[#7046D9]">
                  {selectedSkills.join(" · ")}
                </p>
              </div>
            )}
          </section>

          {/* Panel 3: Looking For (Team Wishlist) */}
          <section className="rounded-2xl border-2 border-[#17142B] bg-white p-6 shadow-[4px_4px_0_#17142B] sm:p-7">
            <div className="mb-5 flex items-center justify-between border-b-2 border-[#17142B] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-[#F7A6C7] text-[#17142B] shadow-[2px_2px_0_#17142B]">
                  <Search size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide text-[#17142B]">
                    Looking For (Squad Wishlist)
                  </h2>
                  <p className="text-xs font-bold text-slate-500">
                    What special abilities do you need your allies to bring?
                  </p>
                </div>
              </div>

              <span className="rounded-md border-2 border-[#17142B] bg-[#F7A6C7] px-2.5 py-0.5 text-xs font-black text-[#17142B] shadow-[1px_1px_0_#17142B]">
                {lookingFor.length} RECRUITS WANTED
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => {
                const selected = lookingFor.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleLookingFor(skill)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                      selected
                        ? "border-[#17142B] bg-[#17142B] text-white shadow-[2px_2px_0_#7046D9]"
                        : "border-[#17142B] bg-[#FFF8E8] text-slate-800 shadow-[2px_2px_0_#17142B] hover:-translate-y-0.5 hover:bg-white"
                    }`}
                  >
                    {selected && <Check size={14} />}
                    {skill}
                  </button>
                )
              })}
            </div>

            {lookingFor.length > 0 && (
              <div className="mt-5 rounded-xl border-2 border-[#17142B] bg-[#FFF8E8] p-3.5 shadow-[2px_2px_0_#17142B]">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  DESIRED ALLY SKILLS
                </p>
                <p className="mt-1 text-xs font-black uppercase text-[#17142B]">
                  {lookingFor.join(" · ")}
                </p>
              </div>
            )}
          </section>

          {/* Comic Action Submission Banner */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#17142B] bg-[#7046D9] p-6 text-white shadow-[5px_5px_0_#17142B] sm:p-7 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 bg-halftone-white opacity-40" />

            <div className="relative">
              <div className="mb-2 inline-flex items-center gap-1 rounded-md border-2 border-white bg-white/15 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#FFD86B]">
                <Shield size={12} />
                READY TO LOCK IN?
              </div>
              <h3 className="text-xl font-black uppercase text-white sm:text-2xl">
                Seal Your Character Profile
              </h3>
              <p className="mt-1 text-xs font-bold text-purple-200">
                TeamFuse will calculate synergy scores and open the teammate recruitment wall.
              </p>
            </div>

            <div className="relative mt-6 shrink-0 sm:mt-0">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#17142B] bg-[#FFD86B] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-[#17142B] shadow-[3px_3px_0_#17142B] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#17142B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:w-auto"
              >
                Save & Scout Teammates
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProfile