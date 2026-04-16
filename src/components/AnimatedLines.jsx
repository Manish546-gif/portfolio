import React from 'react'

const AnimatedLines = () => {
  return (
    <div className='h-100 bg-amber-300 w-100 relative'>
           <div className='h-px w-40 absolute top-[50%] left-[30%] bg-black'></div>
           <div className='h-20 w-px absolute top-[40%] left-[50%] bg-black'></div>
    </div>
  )
}

export default AnimatedLines
