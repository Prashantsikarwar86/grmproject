import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { motion } from 'framer-motion'

export default function Reports(){
  const [pickupId, setPickupId] = useState('')
  const [reports, setReports] = useState<any[]>([])

  useEffect(()=>{ api.get('/reports').then(r=>setReports(r.data)) },[])

  async function generate(){
    if(!pickupId) return
    const { data } = await api.post('/reports/generate', { pickupId })
    setReports(r=>[data, ...r])
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <label className="text-sm">
            <span className="text-zinc-400">Pickup ID</span>
            <input value={pickupId} onChange={e=>setPickupId(e.target.value)} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="text-zinc-400">Date From</span>
            <input type="date" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="text-zinc-400">Date To</span>
            <input type="date" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="text-zinc-400">Client</span>
            <input className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          </label>
          <div className="flex items-end">
            <button onClick={generate} className="btn-primary w-full">Generate Report</button>
          </div>
        </div>
      </motion.div>
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((r)=> (
          <motion.div key={r.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">GRM Report: {r.summary.pickupId}</div>
                <div className="mt-1 text-sm text-zinc-400">Client: {r.summary.clientName}</div>
                <div className="mt-1 text-sm text-zinc-400">Date: {r.summary.pickupDate || '—'}</div>
                <div className="mt-1 text-sm">Status: <span className="text-green-400">Complete (100%)</span></div>
              </div>
              <div className="flex gap-2">
                <a className="btn" href={`/api/reports/${r.id}/export.pdf`} target="_blank">Export as PDF</a>
                <a className="btn" href={`/api/reports/${r.id}/export.csv`} target="_blank">Export as CSV</a>
              </div>
            </div>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
              <div className="rounded-md bg-zinc-900 p-3">
                <div className="text-xs text-zinc-400">Total Products</div>
                <div className="text-xl font-semibold">{r.summary?.totals?.totalProducts ?? 0}</div>
              </div>
              <div className="rounded-md bg-zinc-900 p-3">
                <div className="text-xs text-zinc-400">Total Weight</div>
                <div className="text-xl font-semibold">{r.summary?.totals?.totalWeight ?? 0} kg</div>
              </div>
              <div className="rounded-md bg-zinc-900 p-3">
                <div className="text-xs text-zinc-400">Total Value</div>
                <div className="text-xl font-semibold">₹{r.summary?.totals?.totalValue ?? 0}</div>
              </div>
              <div className="rounded-md bg-zinc-900 p-3">
                <div className="text-xs text-zinc-400">Labour Charges</div>
                <div className="text-xl font-semibold">₹{r.summary?.charges?.labourCharges ?? 0}</div>
              </div>
              <div className="rounded-md bg-zinc-900 p-3">
                <div className="text-xs text-zinc-400">Grand Total</div>
                <div className="text-xl font-semibold">₹{r.summary?.grandTotal ?? 0}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


