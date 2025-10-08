import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function Dashboard(){
  const [stats, setStats] = useState<any>(null)
  useEffect(()=>{ api.get('/analytics/summary').then(r=>setStats(r.data)) },[])
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stats ? (
        <>
          {[
            { label: 'Total Pickups (qty)', value: stats.totals.totalProducts },
            { label: 'Total Weight', value: `${stats.totals.totalWeight} kg` },
            { label: 'Total Value', value: `₹${stats.totals.totalValue}` },
            { label: 'Sold Today', value: stats.today.soldToday },
            { label: 'Sold Overall', value: stats.soldOverall },
            { label: 'Inventory Left', value: stats.inventoryLeft },
          ].map((c,i)=> (
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.05*i}} className="card p-6">
              <div className="text-sm text-zinc-400">{c.label}</div>
              <div className="mt-2 text-3xl font-semibold">{c.value}</div>
            </motion.div>
          ))}
        </>
      ) : (
        <>
          {[1,2,3].map(i=> <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-900" />)}
        </>
      )}
      <div className="card p-6 col-span-full flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Start a new pickup</div>
          <div className="text-zinc-400">Enter product details and upload documents</div>
        </div>
        <NavLink to="/pickup" className="btn-primary">Create</NavLink>
      </div>

      {/* Charts */}
      <div className="card p-6 col-span-full grid gap-6 md:grid-cols-2">
        <div>
          <div className="text-sm text-zinc-400">Material Distribution</div>
          <div className="mt-4 h-64">
            {stats && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={Object.entries(stats.byType).map(([name,value])=>({name,value}))} dataKey="value" nameKey="name" outerRadius={90}>
                    {Object.keys(stats.byType).map((_, i)=> <Cell key={i} fill={["#22c55e","#06b6d4","#f59e0b","#ef4444","#a78bfa"][i%5]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-zinc-400">Weekly Pickups</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{name:'Mon',value:5},{name:'Tue',value:7},{name:'Wed',value:3},{name:'Thu',value:8},{name:'Fri',value:6},{name:'Sat',value:2},{name:'Sun',value:0}] }>
                <XAxis dataKey="name" stroke="#71717a"/>
                <YAxis stroke="#71717a"/>
                <Tooltip/>
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Pickups (demo table) */}
      <div className="card p-6 col-span-full">
        <div className="text-lg font-semibold">Recent Pickups</div>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-left text-zinc-400">
              <tr>
                <th className="px-3 py-2">Pickup ID</th>
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Products</th>
                <th className="px-3 py-2">Total Weight</th>
                <th className="px-3 py-2">Total Value</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                {id:'PU001',client:'ABC Electronics',date:'2023-07-15',products:5,weight:'120 kg',value:'₹12,500',status:'Complete'},
                {id:'PU002',client:'XYZ Corp',date:'2023-07-14',products:3,weight:'85 kg',value:'₹8,200',status:'Complete'},
                {id:'PU003',client:'Tech Solutions',date:'2023-07-13',products:7,weight:'210 kg',value:'₹18,900',status:'Pending'},
              ].map((r)=> (
                <tr key={r.id} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.client}</td>
                  <td className="px-3 py-2">{r.date}</td>
                  <td className="px-3 py-2">{r.products}</td>
                  <td className="px-3 py-2">{r.weight}</td>
                  <td className="px-3 py-2">{r.value}</td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2"><NavLink to="/reports" className="btn">View</NavLink></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Quick Sales Entry */}
      <div className="card col-span-full p-6">
        <div className="text-lg font-semibold">Record Sale</div>
        <form className="mt-4 grid gap-3 md:grid-cols-4" onSubmit={async (e)=>{
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement)
          const payload = {
            pickupId: String(fd.get('pickupId')||''),
            productId: String(fd.get('productId')||''),
            quantitySold: Number(fd.get('quantitySold')||0),
            name: String(fd.get('name')||''),
            materialType: String(fd.get('materialType')||'')
          }
          if(!payload.pickupId || !payload.productId || !payload.quantitySold){
            alert('pickupId, productId, quantitySold required')
            return
          }
          await api.post('/sales', payload)
          const res = await api.get('/analytics/summary');
          setStats(res.data)
          ;(e.target as HTMLFormElement).reset()
          alert('Sale recorded')
        }}>
          <input name="pickupId" placeholder="Pickup ID (e.g., PU1234)" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <input name="productId" placeholder="Product ID (e.g., P1)" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <input name="quantitySold" type="number" placeholder="Qty Sold" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <input name="name" placeholder="Name (optional)" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <select name="materialType" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2">
            <option value="">Type (optional)</option>
            <option value="laptop">Laptop</option>
            <option value="desktop">Desktop</option>
            <option value="server">Server</option>
            <option value="charger">Charger</option>
            <option value="monitor">Monitor</option>
          </select>
          <button className="btn-primary md:col-span-4 w-full md:w-auto">Save Sale</button>
        </form>
      </div>
    </div>
  )
}


