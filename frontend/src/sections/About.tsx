import { motion } from 'framer-motion'
import { useInViewOnce } from '@/hooks/useInViewOnce'

export default function About(){
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 })
  return (
    <section id="about" ref={ref} className="mx-auto max-w-6xl px-6 py-20">
      <motion.h2 initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5}} className="text-3xl font-semibold">About Us</motion.h2>
      <motion.p initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5, delay:0.1}} className="mt-4 max-w-3xl text-zinc-300">
        Deshwal Waste Management is committed to environmental stewardship through responsible waste collection, e-waste recycling, and material recovery. Our mission is to reduce landfill reliance and foster a circular economy.
      </motion.p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {[
          { title: 'Sustainability', desc: 'Eco-friendly processes across our operations' },
          { title: 'Compliance', desc: 'Strict adherence to regulations and standards' },
          { title: 'Innovation', desc: 'Data-led insights and modern infrastructure' },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5, delay: 0.15 + i*0.05}} className="card p-6">
            <div className="text-xl font-medium">{item.title}</div>
            <p className="mt-2 text-zinc-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}


