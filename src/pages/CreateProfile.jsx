import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

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
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 font-black hover:-translate-x-1 transition"
        >
          <ArrowLeft size={20} />
          Back Home
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-block rotate-[-2deg] rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            STEP 01
          </div>

          <h1 className="text-4xl font-black md:text-5xl">
            Create Your Profile ✨
          </h1>

          <p className="mt-3 text-lg font-bold text-[#17142B]/70">
            Tell TeamFuse what you bring to the table.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Basic Information */}
          <div className="rounded-3xl border-4 border-[#17142B] bg-white p-6 shadow-[8px_8px_0_#17142B]">

            <h2 className="mb-5 text-2xl font-black">
              👤 Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block font-black">
                  Your Name
                </label>

                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-[#DCCFFF]"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block font-black">
                  Your Role
                </label>

                <select
                  name="role"
                  required
                  className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-bold outline-none"
                >
                  <option value="">Select your role</option>
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
                <label className="mb-2 block font-black">
                  Experience Level
                </label>

                <select
                  name="experience"
                  required
                  className="w-full rounded-xl border-2 border-[#17142B] bg-[#FFF9EF] px-4 py-3 font-bold outline-none"
                >
                  <option value="">Select experience</option>
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

          {/* Skills */}
          <div className="rounded-3xl border-4 border-[#17142B] bg-[#BDE7D6] p-6 shadow-[8px_8px_0_#17142B]">

            <h2 className="mb-2 text-2xl font-black">
              🛠️ Your Skills
            </h2>

            <p className="mb-5 font-bold text-[#17142B]/70">
              Pick the skills you already have.
            </p>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => {
                const selected = selectedSkills.includes(skill)

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center gap-2 rounded-xl border-2 border-[#17142B] px-4 py-2 font-black transition ${
                      selected
                        ? "bg-[#7046D9] text-white shadow-[4px_4px_0_#17142B]"
                        : "bg-white hover:-translate-y-1"
                    }`}
                  >
                    {selected && <Check size={17} />}
                    {skill}
                  </button>
                )
              })}
            </div>

          </div>

          {/* Looking For */}
          <div className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-6 shadow-[8px_8px_0_#17142B]">

            <h2 className="mb-2 text-2xl font-black">
              🔎 Looking For
            </h2>

            <p className="mb-5 font-bold text-[#17142B]/70">
              What skills would you like in your teammates?
            </p>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => {
                const selected = lookingFor.includes(skill)

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleLookingFor(skill)}
                    className={`flex items-center gap-2 rounded-xl border-2 border-[#17142B] px-4 py-2 font-black transition ${
                      selected
                        ? "bg-[#17142B] text-white shadow-[4px_4px_0_#7046D9]"
                        : "bg-white hover:-translate-y-1"
                    }`}
                  >
                    {selected && <Check size={17} />}
                    {skill}
                  </button>
                )
              })}
            </div>

          </div>

          {/* Submit */}
          <div className="flex justify-end pb-10">
            <button
              type="submit"
              className="flex items-center gap-3 rounded-2xl border-4 border-[#17142B] bg-[#7046D9] px-7 py-4 text-lg font-black text-white shadow-[7px_7px_0_#17142B] transition hover:-translate-y-1 hover:shadow-[9px_9px_0_#17142B] active:translate-y-1 active:shadow-[3px_3px_0_#17142B]"
            >
              Save & Find Teammates
              <ArrowRight size={22} />
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default CreateProfile