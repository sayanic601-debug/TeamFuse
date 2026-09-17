import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CreateProfile from "./pages/CreateProfile"
import FindTeammates from "./pages/FindTeammates"
import TeamAnalysis from "./pages/TeamAnalysis"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/find-teammates" element={<FindTeammates />} />
        <Route path="/team-analysis" element={<TeamAnalysis />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App