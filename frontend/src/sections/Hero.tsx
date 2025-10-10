import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function Particles(){
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden opacity-70">
      <svg className="absolute -top-10 left-1/4 h-[600px] w-[600px] blur-3xl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2BB673" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2BB673" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#g1)" />
      </svg>
      <svg className="absolute bottom-0 right-10 h-[500px] w-[500px] blur-3xl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00AEEF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#g2)" />
      </svg>
    </div>
  )
}

export default function Hero(){
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 60])

  return (
    <section id="home" ref={ref} className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-white/10 dark:bg-black/30" />
      <Particles />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h1 initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{duration:0.6}} className="text-4xl font-bold tracking-tight md:text-6xl">
          Building a Greener Tomorrow
        </motion.h1>
        <motion.p initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{duration:0.6, delay:0.1}} className="mx-auto mt-4 max-w-2xl text-zinc-200">
          Deshwal Waste Management specializes in sustainable collection, processing, and recycling solutions.
        </motion.p>
        <motion.div initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{duration:0.6, delay:0.2}} className="mt-8">
          <a href="#services" className="btn-primary">Explore Services</a>
        </motion.div>
      </div>
    </section>
  )
}


