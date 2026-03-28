import React, { useRef } from 'react'
import HomeModel from '../components/home/HomeModel'
import FeaturedSection from '../components/home/FeaturedSection'

export default function Home() {
  const mainRef = useRef(null)

  return (
    <main ref={mainRef} className='relative w-full overflow-y-hidden bg-transparent'>
      <HomeModel />
      <FeaturedSection />
    </main>
  )
}
