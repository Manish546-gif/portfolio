import React from 'react'
import homelanding from '../assets/homelanding.mp4'
import VideoWithGlitch from '../components/VideoWithGlitch'

const Home = () => {
  return (
    <div>
      <div 
        className='h-screen w-full'
        style={{
          perspective: '1000px',
        }}
      > 
        <VideoWithGlitch
          src={homelanding}
          effect="displacement"
          intensity={0.75}
          blockSize={0.4}
          width="100%"
          height="100%"
          autoplay={true}
          loop={true}
          muted={true}
        />
      </div>
    </div>
  )
}

export default Home
