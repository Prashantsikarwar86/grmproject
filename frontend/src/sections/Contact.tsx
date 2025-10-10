import { motion } from 'framer-motion'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useState } from 'react'

export default function Contact(){
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 })
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    await new Promise(r => setTimeout(r, 800))
    setStatus('sent')
    setTimeout(()=>setStatus('idle'), 2000)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <section id="contact" ref={ref} className="mx-auto max-w-3xl px-6 py-20">
      <motion.h2 initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5}} className="text-3xl font-semibold">Contact Us</motion.h2>
      <motion.form initial={{opacity:0, y:10}} animate={inView?{opacity:1, y:0}:{}} transition={{duration:0.5, delay:0.05}} onSubmit={onSubmit} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="text-sm text-zinc-400">Email</label>
          <input required type="email" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none ring-primary/40 transition focus:ring-2" placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-sm text-zinc-400">Message</label>
          <textarea required className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none ring-primary/40 transition focus:ring-2" placeholder="How can we help?" rows={5} />
        </div>
        <div className="flex items-center gap-3">
          <button disabled={status!=='idle'} className="btn-primary disabled:opacity-50">{status==='loading' ? 'Sending…' : status==='sent' ? 'Sent ✓' : 'Send Message'}</button>
          <span className="text-sm text-zinc-400">We usually respond within 1 business day.</span>
        </div>
      </motion.form>
    </section>
  )
}



