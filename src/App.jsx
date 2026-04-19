import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './sections/Home'
import Work from './sections/Work'
import About from './sections/About'
import useLenisSmoothScroll from './hooks/useLenisSmoothScroll'
import Landing2 from './sections/Landing2'
import MyPhilosophy from './sections/MyPhilosophy'
import WhatICanDo from './sections/WhatCan'
import LoadingScreen from './components/LoadingAnimation'

// Lazy load the Tetris game (not needed on initial page load)
const RhythmTetris = lazy(() => import('./game/RhythmTetris'))

function PortfolioHome({ onImageLoaded }) {
  useLenisSmoothScroll(true)

  return (
    <div className="w-full relative">
  
      <Navbar />
      <Home onImageLoaded={onImageLoaded} />
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)

  return (
    <>
      {/* Home always renders in background */}
      <Routes>
        <Route path="/" element={<PortfolioHome onImageLoaded={() => setImageLoaded(true)} />} />
        <Route 
          path="/tetris" 
          element={
            <Suspense fallback={<div className="w-full h-screen bg-white flex items-center justify-center"><p className="text-white">Loading game...</p></div>}>
              <RhythmTetris />
            </Suspense>
          } 
        />
      </Routes>

      {/* Loading screen overlays on top and closes when image loads */}
      {!loadingDone && (
        <LoadingScreen 
          onComplete={() => setLoadingDone(true)} 
          shouldClose={imageLoaded}
        />
      )}
    </>
  )
}
