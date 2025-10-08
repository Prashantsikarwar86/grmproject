import { useEffect, useState } from 'react'
import { api, Pickup } from '@/api/client'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

const COLORS = ['#22c55e', '#06b6d4', '#f59e0b', '#ef4444', '#a78bfa']

export default function Analytics(){
  const [pickups, setPickups] = useState<Pickup[]>([])
  useEffect(()=>{ api.get('/materials', { params: { page: 1, pageSize: 200 } }).then(r=>setPickups(r.data.items || r.data)) },[])

  const typeData = Object.values(
    pickups.flatMap(p=>p.materials).reduce((acc:any, m)=>{
      acc[m.materialType] = acc[m.materialType] || { name: m.materialType||'other', value: 0 }
      acc[m.materialType].value += m.quantity || 0
      return acc
    }, {})
  )

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const lineData = days.map((d,i)=> ({ name: d, value: (pickups[i]?.totals.totalProducts ?? 0) }))

  const counters = {
    products: pickups.reduce((s,p)=> s + (p.totals.totalProducts||0), 0),
    weight: pickups.reduce((s,p)=> s + (p.totals.totalWeight||0), 0),
    value: pickups.reduce((s,p)=> s + (p.totals.totalValue||0), 0),
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-6">
        <div className="text-sm text-zinc-400">Product Type Distribution</div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={90}>
                {typeData.map((_, i)=> <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-6">
        <div className="text-sm text-zinc-400">Daily Pickups</div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="name" stroke="#71717a"/>
              <YAxis stroke="#71717a"/>
              <Tooltip/>
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-6 md:col-span-2">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-sm text-zinc-400">Total Products</div>
            <div className="mt-1 text-3xl font-semibold">{counters.products}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Total Weight</div>
            <div className="mt-1 text-3xl font-semibold">{counters.weight} kg</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Total Value</div>
            <div className="mt-1 text-3xl font-semibold">₹{counters.value}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


