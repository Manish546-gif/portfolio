import grainTexture from '../../assets/grain.webp'

const GrainOverlay = () => {
  return (
    <div
      aria-hidden='true'
      className='grain-marquee pointer-events-none fixed inset-0 z-9999'
      style={{
        backgroundImage: `url(${grainTexture})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px 100px',
        opacity: .7,
      }}
    />
  )
}

export default GrainOverlay
