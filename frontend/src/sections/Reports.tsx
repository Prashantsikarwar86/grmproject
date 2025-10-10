import { motion } from 'framer-motion'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { name: 'Jan', volume: 120 },
  { name: 'Feb', volume: 160 },
  { name: 'Mar', volume: 180 },
  { name: 'Apr', volume: 220 },
  { name: 'May', volume: 260 },
  { name: 'Jun', volume: 300 },
]

export default function Reports(){
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 })
  return (
    <section id="reports" ref={ref} className="mx-auto max-w-6xl px-6 py-20">
      <motion.h2 initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5}} className="text-3xl font-semibold">Reports & Insights</motion.h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <motion.div initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5, delay:0.05}} className="card p-6">
          <div className="text-sm text-zinc-400">Monthly Recycled Volume (t)</div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', color: '#e4e4e7' }} />
                <Line type="monotone" dataKey="volume" stroke="#2BB673" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5, delay:0.1}} className="card grid place-items-center p-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">300t+</div>
            <div className="mt-2 text-zinc-400">Materials Recycled in H1</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}



