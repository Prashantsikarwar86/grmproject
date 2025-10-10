import { NavLink } from 'react-router-dom'
import { useTheme } from '@/ui/theme/ThemeContext'

export default function Navbar(){
  const { theme, toggleTheme } = useTheme()
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="#home" className="flex items-center gap-3 font-semibold tracking-wide">
          <img src="https://images.provenexpert.com/d9/a2/9a88229f9716ce27bea000847bb4/deshwal-waste-management_full_1704436285.jpg" alt="Deshwal Waste Management" className="h-9 w-auto rounded-md object-contain"/>
          <span className="hidden sm:inline">Deshwal Waste Management</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#home" className="hover:text-primary">Home</a>
          <a href="#about" className="hover:text-primary">About</a>
          <a href="#services" className="hover:text-primary">Services</a>
          <a href="#reports" className="hover:text-primary">Reports</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </nav>
        <button onClick={toggleTheme} className="rounded-md border border-zinc-700 px-3 py-1 text-sm hover:border-zinc-500">{theme==='dark'?'Light':'Dark'}</button>
      </div>
    </header>
  )
}


