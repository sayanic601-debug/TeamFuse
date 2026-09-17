import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
  Wrench,
  Search,
  Zap,
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

    const profile = {
      name: e.target.name.value,
      role: e.target.role.value,
      experience: e.target.experience.value,
      skills: selectedSkills,
      lookingFor,
    }

    localStorage.setItem(
      "teamfuseProfile",
      JSON.stringify(profile)
    )

    navigate("/find-teammates")
  }

  return (
    <div className="min-h-screen bg-[#FFF9EF] px-5 py-8 text-[#17142B]">

      <div className="mx-auto max-w-5xl">

        {/* Back + Progress */}
        <div className="mb-8 flex items-center justify-between gap-4">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-black transition hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
            Back Home
          </button>

          <div className="flex items-center gap-2 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            <Zap size={17} />
            01 / 03
          </div>

        </div>

        {/* Hero */}
        <div className="relative mb-10">

          <div className="mb-4 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            <Sparkles size={17} />
            STEP 01
          </div>

          <div className="flex flex-wrap items-end gap-4">

            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Create Your
              <span className="ml-2 text-[#7046D9]">
                Profile
              </span>{" "}
              ✨
            </h1>

            <div className="mb-2 rotate-3 rounded-xl border-2 border-[#17142B] bg-[#F7A6C7] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#17142B]">
              LET'S FUSE!
            </div>

          </div>

          <p className="mt-4 max-w-2xl text-lg font-bold text-[#17142B]/70">
            Tell TeamFuse what you bring to the table — and what kind
            of teammate you're looking for.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* Basic Information */}
          <section className="overflow-hidden rounded-3xl border-4 border-[#17142B] bg-white shadow-[8px_8px_0_#17142B]">

            <div className="flex items-center justify-between border-b-4 border-[#17142B] bg-[#DCCFFF] px-6 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white shadow-[3px_3px_0_#17142B]">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Basic Information
                  </h2>

                  <p className="text-sm font-bold opacity-60">
                    Start with the basics
                  </p>
                </div>

              </div>

              <span className="hidden rounded-full border-2 border-[#17142B] bg-white px-3 py-1 text-xs font-black sm:block">
                ABOUT YOU
              </span>

            </div>

            <div className="p-6">

              <div className="grid gap-6 md:grid-cols-2">

                {/* Name */}
                <div>

                  <label className="mb-2 flex items-center gap-2 font-black">
                    <UserRound size={16} />
                    Your Name
                  </label>

                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Sayani"
                    required
                    className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-bold outline-none transition placeholder:text-[#17142B]/40 focus:-translate-y-0.5 focus:ring-4 focus:ring-[#DCCFFF]"
                  />

                </div>

                {/* Role */}
                <div>

                  <label className="mb-2 flex items-center gap-2 font-black">
                    <BriefcaseBusiness size={16} />
                    Your Role
                  </label>

                  <select
                    name="role"
                    required
                    className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-bold outline-none transition focus:ring-4 focus:ring-[#DCCFFF]"
                  >
                    <option value="">
                      Select your role
                    </option>

                    <option value="Frontend Developer">
                      Frontend Developer
                    </option>

                    <option value="Backend Developer">
                      Backend Developer
                    </option>

                    <option value="ML Engineer">
                      ML Engineer
                    </option>

                    <option value="UI/UX Designer">
                      UI/UX Designer
                    </option>

                    <option value="Full Stack Developer">
                      Full Stack Developer
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                {/* Experience */}
                <div className="md:col-span-2">

                  <label className="mb-2 flex items-center gap-2 font-black">
                    <GraduationCap size={16} />
                    Experience Level
                  </label>

                  <select
                    name="experience"
                    required
                    className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-bold outline-none transition focus:ring-4 focus:ring-[#DCCFFF]"
                  >
                    <option value="">
                      Select experience
                    </option>

                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>

                  </select>

                </div>

              </div>

            </div>

          </section>

          {/* Your Skills */}
          <section className="rounded-3xl border-4 border-[#17142B] bg-[#BDE7D6] p-6 shadow-[8px_8px_0_#17142B]">

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white shadow-[3px_3px_0_#17142B]">
                    <Wrench size={21} />
                  </div>

                  <h2 className="text-2xl font-black">
                    Your Skills
                  </h2>

                </div>

                <p className="mt-2 font-bold text-[#17142B]/70">
                  Pick the skills you already have.
                </p>

              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-white px-3 py-2 text-sm font-black shadow-[3px_3px_0_#17142B]">
                {selectedSkills.length} selected
              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              {skills.map((skill) => {

                const selected = selectedSkills.includes(skill)

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center gap-2 rounded-xl border-2 border-[#17142B] px-4 py-2.5 font-black transition ${
                      selected
                        ? "bg-[#7046D9] text-white shadow-[4px_4px_0_#17142B]"
                        : "bg-white hover:-translate-y-1 hover:shadow-[3px_3px_0_#17142B]"
                    }`}
                  >
                    {selected && <Check size={17} />}
                    {skill}
                  </button>
                )
              })}

            </div>

            {selectedSkills.length > 0 && (
              <div className="mt-5 rounded-2xl border-2 border-[#17142B] bg-white/70 p-4">

                <p className="mb-2 text-xs font-black uppercase tracking-wide">
                  Your Skill Stack
                </p>

                <p className="font-bold">
                  {selectedSkills.join(" • ")}
                </p>

              </div>
            )}

          </section>

          {/* Looking For */}
          <section className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-6 shadow-[8px_8px_0_#17142B]">

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white shadow-[3px_3px_0_#17142B]">
                    <Search size={21} />
                  </div>

                  <h2 className="text-2xl font-black">
                    Looking For
                  </h2>

                </div>

                <p className="mt-2 font-bold text-[#17142B]/70">
                  What skills would you like in your teammates?
                </p>

              </div>

              <div className="rounded-xl border-2 border-[#17142B] bg-white px-3 py-2 text-sm font-black shadow-[3px_3px_0_#17142B]">
                {lookingFor.length} wanted
              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              {skills.map((skill) => {

                const selected = lookingFor.includes(skill)

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleLookingFor(skill)}
                    className={`flex items-center gap-2 rounded-xl border-2 border-[#17142B] px-4 py-2.5 font-black transition ${
                      selected
                        ? "bg-[#17142B] text-white shadow-[4px_4px_0_#7046D9]"
                        : "bg-white hover:-translate-y-1 hover:shadow-[3px_3px_0_#17142B]"
                    }`}
                  >
                    {selected && <Check size={17} />}
                    {skill}
                  </button>
                )
              })}

            </div>

            {lookingFor.length > 0 && (
              <div className="mt-5 rounded-2xl border-2 border-[#17142B] bg-white/70 p-4">

                <p className="mb-2 text-xs font-black uppercase tracking-wide">
                  Team Wishlist
                </p>

                <p className="font-bold">
                  {lookingFor.join(" • ")}
                </p>

              </div>
            )}

          </section>

          {/* Final CTA */}
          <div className="relative overflow-hidden rounded-3xl border-4 border-[#17142B] bg-[#7046D9] p-6 text-white shadow-[8px_8px_0_#17142B]">

            <div className="absolute -right-3 -top-6 rotate-12 text-7xl opacity-20">
              💥
            </div>

            <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  READY?
                </p>

                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  Let's find your people.
                </h2>

                <p className="mt-1 font-bold text-white/80">
                  TeamFuse will match you with compatible teammates.
                </p>

              </div>

              <button
                type="submit"
                className="group flex shrink-0 items-center gap-3 rounded-2xl border-4 border-[#17142B] bg-[#FFD86B] px-6 py-4 text-lg font-black text-[#17142B] shadow-[6px_6px_0_#17142B] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#17142B] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Save & Find Teammates

                <ArrowRight
                  size={22}
                  className="transition group-hover:translate-x-1"
                />
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  )
}

export default CreateProfile