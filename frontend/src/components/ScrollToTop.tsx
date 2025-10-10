import { useEffect, useState } from 'react'

export default function ScrollToTop(){
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if(!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 rounded-full bg-primary p-3 text-black shadow-soft transition hover:brightness-110"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  )
}


