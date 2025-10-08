import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1503596476-1c12a8ba09a0?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
      <div className="px-6 py-24 text-center md:px-16">
        <div className="flex justify-center">
          <img src="https://images.provenexpert.com/d9/a2/9a88229f9716ce27bea000847bb4/deshwal-waste-management_full_1704436285.jpg" alt="Deshwal Waste Management" className="h-16 w-auto rounded-md object-contain shadow-soft"/>
        </div>
        <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="text-4xl font-bold tracking-tight md:text-6xl">
          Deshwal Waste Management
        </motion.h1>
        <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="mx-auto mt-4 max-w-2xl text-zinc-300">
          Sustainable e-waste collection, material processing, and insightful GRM analytics.
        </motion.p>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="mt-8">
          <NavLink to="/dashboard" className="btn-primary">Explore Dashboard</NavLink>
        </motion.div>
      </div>
    </div>
  )
}


