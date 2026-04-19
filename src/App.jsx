import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './sections/Home'
import useLenisSmoothScroll from './hooks/useLenisSmoothScroll'
import Landing2 from './sections/Landing2'
import LoadingScreen from './components/LoadingAnimation'

// Lazy load heavy sections (below the fold)
const About = lazy(() => import('./sections/About'))
const Work = lazy(() => import('./sections/Work'))
const MyPhilosophy = lazy(() => import('./sections/MyPhilosophy'))
const WhatICanDo = lazy(() => import('./sections/WhatCan'))
const RhythmTetris = lazy(() => import('./game/RhythmTetris'))

// Fallback component for lazy-loaded sections
const SectionFallback = () => (
  <div className="w-full bg-white py-20 flex items-center justify-center">
    <div className="text-gray-400">Loading...</div>
  </div>
)

function PortfolioHome({ onImageLoaded }) {
  useLenisSmoothScroll(true)

  return (
    <div className="w-full relative">
      <Navbar />
      <Home onImageLoaded={onImageLoaded} />
      <Landing2 />
      
      {/* Lazy-loaded sections with Suspense fallback */}
      <Suspense fallback={<SectionFallback />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <Work />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <MyPhilosophy />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <WhatICanDo />
      </Suspense>
      
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
            <Suspense fallback={<div className="w-full h-screen bg-white flex items-center justify-center"><p className="text-gray-500">Loading game...</p></div>}>
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
