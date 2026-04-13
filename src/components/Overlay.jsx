import grain from '../assets/grain2.gif'

export default function Overlay() {
  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      style={{ 
        backgroundImage: `url(${grain})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '80px 80px',
        opacity: 0.25,
        userSelect: 'none'
      }}
    />
  )
}
