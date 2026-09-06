import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"

function Mainroutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default Mainroutes