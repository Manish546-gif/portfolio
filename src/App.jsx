import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './sections/Home'
import Work from './sections/Work'
import About from './sections/About'
import RhythmTetris from './game/RhythmTetris'
import useLenisSmoothScroll from './hooks/useLenisSmoothScroll'
import Landing2 from './sections/Landing2'
import MyPhilosophy from './sections/MyPhilosophy'
import WhatICanDo from './sections/WhatCan'

function PortfolioHome() {
  useLenisSmoothScroll(true)

  return (
    <div className="w-full relative">
  
      <Navbar />
      <Home />
      <Landing2 />
      <About />
      <Work />
      <MyPhilosophy />
      <WhatICanDo />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route path="/tetris" element={<RhythmTetris />} />
    </Routes>
  )
}
