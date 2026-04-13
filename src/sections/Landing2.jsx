import React from 'react'
import star from '../assets/star.svg'

const Landing2 = () => {
  return (
    <div className='h-320 w-full bg-white'>
       <div className=''>
        <div className='h-110 w-full flex'>
          <div className='h-120 w-1/3 flex justify-center items-center px-6'>
            <p className='text-black text-lg leading-relaxed text-center' style={{fontFamily:'GermaniaOne', letterSpacing: '0.08em'}}>
              THE FUSION OF DESIGN PRINCIPLES WITH UNPARALLELED VISUAL STORYTELLING.
            </p>
          </div>
          <div className='h-120 w-1/3 flex justify-center items-center '>
          <div className='h-45 border-1  border-black gap-17 w-120 rounded-b-full flex justify-center items-center rounded-t-full'>
            <img className='h-9 w-9 rotate-star' src={star} alt="" />

            <h1 className='text-black text-[6rem] mr-4 ' style={{fontFamily:'FleurDeLeah'}}>MK</h1>
            <img className='h-9 w-9 rotate-star' src={star} alt="" />
          </div>
          </div>
          <div className='h-120 w-1/3 flex justify-center items-center px-6'>
            <p className='text-black text-lg leading-relaxed text-center' style={{fontFamily:'GermaniaOne', letterSpacing: '0.08em'}}>
              I CRAFT WEBSITES WHICH WILL ELEVATE YOUR BRAND TO A GLOBAL STAGE.
            </p>
          </div>
        </div>
        <div className='h-210 flex justify-center items-center'>
          <div className='h-210 w-1/4 bg-amber-200'></div>
          <div className='h-210 w-1/2  '>
           <div className='w-full h-30 border-b-2 flex items-center justify-center'> 
            <div className='h-4 w-40 bg-black pl-3 pr-3  flex items-center justify-center'>
              <div className='h-4 w-full flex items-center justify-center rounded-r-full rounded-l-full bg-white'>
                <h2 style={{fontFamily:'thunder-blackl'}} className='text-gray-900'>About me</h2>
              </div>
            </div>
           </div>
           <div className='w-full h-110 border-b-2'></div>
           <div className='w-full h-70 border-b-2'></div>
          </div>
          <div className='h-210 w-1/4 bg-amber-400'></div>
        </div>
       </div>
    </div>
  )
}

export default Landing2
