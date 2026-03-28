import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import ElasticCursor from './components/Common/ElasticCursor'
import useLenisSmoothScroll from './hooks/useLenisSmoothScroll'
import Navbar from './components/Common/Navbar'
import GrainOverlay from './components/Common/GrainOverlay'
import Work from './pages/Work'
import Stairs from './components/Common/Stairs'
import Footer from './components/Common/Footer'

const App = () => {
  useLenisSmoothScroll(true)

  return (
    <div className='min-h-screen bg-[#f6ead8] text-[#5a3b1f]'>
      <ElasticCursor />
      <Navbar />
      <GrainOverlay />

      <Stairs>
        <Routes>
          <Route path='/' element={<Home isReady={true} />} />
          <Route path='/about' element={<About />} />
          <Route path='/work' element={<Work />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Stairs>

      <Footer />
    </div>
  )
}

export default App
