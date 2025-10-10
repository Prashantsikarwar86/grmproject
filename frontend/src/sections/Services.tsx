import { motion } from 'framer-motion'
import { useInViewOnce } from '@/hooks/useInViewOnce'

const services = [
  { title: 'Waste Collection', desc: 'Efficient and safe pickup scheduling and processing.' },
  { title: 'Recycling', desc: 'Material recovery with modern, compliant facilities.' },
  { title: 'E-Waste', desc: 'Secure handling and certified e-waste processing.' },
  { title: 'Reporting', desc: 'Transparent analytics and GRM reporting dashboards.' },
  { title: 'Consulting', desc: 'Sustainability consulting tailored to your org.' },
  { title: 'Logistics', desc: 'Optimized routing and traceability end-to-end.' },
]

export default function Services(){
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 })
  return (
    <section id="services" ref={ref} className="mx-auto max-w-6xl px-6 py-20">
      <motion.h2 initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5}} className="text-3xl font-semibold">Services</motion.h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div key={s.title} initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5, delay: 0.05 * i}} className="card group p-6 transition-transform hover:-translate-y-1">
            <div className="text-xl font-medium">{s.title}</div>
            <p className="mt-2 text-zinc-400">{s.desc}</p>
            <div className="mt-4 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}



