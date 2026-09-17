import { ArrowLeft, Check, Users, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

function TeamAnalysis() {
  const navigate = useNavigate()

  const team = JSON.parse(
    localStorage.getItem("teamfuseTeam") || "[]"
  )

  const allSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "Machine Learning",
    "UI/UX",
    "Figma",
  ]

  const coveredSkills = [
    ...new Set(
      team.flatMap((member) => member.skills)
    ),
  ]

  const missingSkills = allSkills.filter(
    (skill) => !coveredSkills.includes(skill)
  )

  if (team.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9EF] px-5 py-10 text-[#17142B]">
        <div className="mx-auto max-w-3xl">

          <button
            onClick={() => navigate("/find-teammates")}
            className="mb-8 flex items-center gap-2 font-black"
          >
            <ArrowLeft size={20} />
            Find Teammates
          </button>

          <div className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-10 text-center shadow-[9px_9px_0_#17142B]">

            <div className="text-6xl">💥</div>

            <h1 className="mt-5 text-4xl font-black">
              WHOOPS!
            </h1>

            <p className="mt-3 text-lg font-bold">
              Your team is empty.
              <br />
              Go recruit some teammates first!
            </p>

            <button
              onClick={() => navigate("/find-teammates")}
              className="mt-7 rounded-xl border-2 border-[#17142B] bg-[#7046D9] px-6 py-3 font-black text-white shadow-[5px_5px_0_#17142B]"
            >
              Find Teammates →
            </button>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9EF] px-5 py-8 pb-12 text-[#17142B]">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <button
            onClick={() => navigate("/find-teammates")}
            className="flex items-center gap-2 font-black hover:-translate-x-1 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="rounded-full border-2 border-[#17142B] bg-[#BDE7D6] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            STEP 03
          </div>

        </div>

        {/* Title */}
        <div className="mb-10">

          <div className="mb-3 inline-flex items-center gap-2 rotate-[-2deg] rounded-full border-2 border-[#17142B] bg-[#FFD86B] px-4 py-2 font-black shadow-[4px_4px_0_#17142B]">
            <Sparkles size={17} />
            TEAM ANALYSIS
          </div>

          <h1 className="text-4xl font-black md:text-6xl">
            Your Dream Team 💥
          </h1>

          <p className="mt-3 text-lg font-bold text-[#17142B]/70">
            Here's what your team looks like.
          </p>

        </div>

        {/* Team Members */}
        <section className="mb-10">

          <div className="mb-5 flex items-center gap-3">
            <Users size={25} />

            <h2 className="text-3xl font-black">
              Team Members
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {team.map((member) => (
              <div
                key={member.id}
                className={`rounded-3xl border-4 border-[#17142B] ${member.color} p-5 shadow-[7px_7px_0_#17142B]`}
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#17142B] bg-white text-4xl">
                    {member.emoji}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black">
                      {member.name}
                    </h3>

                    <p className="font-bold">
                      {member.role}
                    </p>

                    <p className="text-sm font-bold opacity-60">
                      {member.experience}
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex flex-wrap gap-2">

                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border-2 border-[#17142B] bg-white px-3 py-1 text-xs font-black"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* Skills */}
        <section className="grid gap-6 md:grid-cols-2">

          {/* Covered */}
          <div className="rounded-3xl border-4 border-[#17142B] bg-[#BDE7D6] p-6 shadow-[7px_7px_0_#17142B]">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#17142B] bg-white">
                <Check size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  Skills Covered
                </h2>

                <p className="font-bold">
                  {coveredSkills.length} skills found
                </p>
              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              {coveredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl border-2 border-[#17142B] bg-white px-4 py-2 font-black shadow-[3px_3px_0_#17142B]"
                >
                  ✓ {skill}
                </span>
              ))}

            </div>

          </div>

          {/* Missing */}
          <div className="rounded-3xl border-4 border-[#17142B] bg-[#F7A6C7] p-6 shadow-[7px_7px_0_#17142B]">

            <h2 className="mb-2 text-2xl font-black">
              🎯 Skills To Consider
            </h2>

            <p className="mb-5 font-bold">
              Skills your team doesn't currently cover.
            </p>

            <div className="flex flex-wrap gap-3">

              {missingSkills.length > 0 ? (
                missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border-2 border-[#17142B] bg-white px-4 py-2 font-black"
                  >
                    + {skill}
                  </span>
                ))
              ) : (
                <span className="rounded-xl border-2 border-[#17142B] bg-white px-4 py-2 font-black">
                  🎉 Full skill coverage!
                </span>
              )}

            </div>

          </div>

        </section>

        {/* Verdict */}
        <section className="mt-8 rounded-3xl border-4 border-[#17142B] bg-[#7046D9] p-7 text-white shadow-[9px_9px_0_#17142B]">

          <p className="text-sm font-black uppercase tracking-[0.2em]">
            ⚡ TeamFuse Verdict
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {missingSkills.length === 0
              ? "Your team has strong skill coverage! 🚀"
              : "Your team is taking shape! 🔥"}
          </h2>

          <p className="mt-3 max-w-2xl text-lg font-bold text-white/90">
            {missingSkills.length === 0
              ? "Your selected teammates collectively cover all the core skills in our current skill map."
              : `Your team currently covers ${coveredSkills.length} core skills. Adding someone with ${missingSkills[0]} could expand the skill coverage.`}
          </p>

          <div className="mt-6 flex flex-wrap gap-4">

            <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">
              <p className="text-2xl font-black">
                {team.length}
              </p>

              <p className="text-sm font-bold">
                Team Members
              </p>
            </div>

            <div className="rounded-xl border-2 border-white bg-white/10 px-5 py-3">
              <p className="text-2xl font-black">
                {coveredSkills.length}
              </p>

              <p className="text-sm font-bold">
                Skills Covered
              </p>
            </div>

          </div>

        </section>

        {/* Bottom Action */}
        <div className="mt-10 flex justify-center">

          <button
            onClick={() => navigate("/find-teammates")}
            className="rounded-2xl border-4 border-[#17142B] bg-[#FFD86B] px-7 py-4 text-lg font-black shadow-[6px_6px_0_#17142B] transition hover:-translate-y-1"
          >
            ← Add More Teammates
          </button>

        </div>

      </div>
    </div>
  )
}

export default TeamAnalysis