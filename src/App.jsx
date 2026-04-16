import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './sections/Home'
import Work from './sections/Work'
import About from './sections/About'
import useLenisSmoothScroll from './hooks/useLenisSmoothScroll'



import Landing2 from './sections/Landing2'
import MyPhilosophy from './sections/MyPhilosophy'

export default function App() {
  useLenisSmoothScroll(true)

  return (
    <div className="w-full relative">
      {/* <Cursor /> */}
      {/* <Overlay /> */}
      <Navbar />
      <Home />
   <Landing2/>
      <About />
      <Work />
      <MyPhilosophy />
      {/* <RhythmTetris /> */}
      <Footer />
    </div>
  )
}
