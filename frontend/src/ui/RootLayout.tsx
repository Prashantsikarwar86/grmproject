import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './theme/ThemeContext'

export default function RootLayout(){
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration:0.2}}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  )
}


