import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function RootLayout(){
  const location = useLocation()

  // initialize theme: prefer saved value, then system preference
  const [theme, setTheme] = useState<'dark'|'light'>(() => {
    try {
      const stored = localStorage.getItem('theme')
      if(stored === 'dark' || stored === 'light') return stored
    } catch (e) {
      // ignore
    }
    return (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
  })

  // apply theme to document and persist
  useEffect(() => {
    const root = document.documentElement
    if(theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')

    try { localStorage.setItem('theme', theme) } catch(e){}

    // update meta theme-color if present (improves appearance on mobile browsers)
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if(meta){
      meta.content = theme === 'dark' ? '#0f172a' : '#ffffff'
    }
  }, [theme])

  // listen for system preference changes and update only when user hasn't explicitly chosen
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem('theme')
        if(!stored) setTheme(e.matches ? 'dark' : 'light')
      } catch(e){
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 transition-all duration-200">
          <NavLink to="/" className="flex items-center gap-3 font-semibold tracking-wide">
            <img src="https://images.provenexpert.com/d9/a2/9a88229f9716ce27bea000847bb4/deshwal-waste-management_full_1704436285.jpg" alt="Deshwal Waste Management" className="h-9 w-auto rounded-md object-contain"/>
            <span className="hidden sm:inline">Deshwal Waste Management</span>
          </NavLink>
          <nav className="hidden gap-6 md:flex">
            <NavLink to="/dashboard" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Dashboard</NavLink>
            <NavLink to="/pickup" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Pickup Entry</NavLink>
            <NavLink to="/products" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Products</NavLink>
            <NavLink to="/reports" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>GRM Reports</NavLink>
            <NavLink to="/analytics" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Analytics</NavLink>
          </nav>
          <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} className="rounded-md border border-zinc-700 px-3 py-1 text-sm hover:border-zinc-500">{theme==='dark'?'Light':'Dark'}</button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration:0.2}} className="mx-auto max-w-7xl px-4 py-8">
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  )
}


