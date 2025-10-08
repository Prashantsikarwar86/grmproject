import { useEffect, useMemo, useState } from 'react'
import { api, Pickup } from '@/api/client'

export default function Products(){
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    api.get('/materials', { params: { page: 1, pageSize: 100 } }).then(r => setPickups(r.data.items || r.data))
  }, [])

  const rows = useMemo(() => {
    const items = pickups.flatMap(p => p.materials.map(m => ({...m, pickupId: p.pickupId})))
    return items.filter(r => {
      const term = q.toLowerCase();
      return !q || r.productId.toLowerCase().includes(term) || (r.materialType||'').toLowerCase().includes(term) || (r.name||'').toLowerCase().includes(term)
    })
  }, [pickups, q])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Products</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
      </div>
      <div className="overflow-auto rounded-lg border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-left text-zinc-400">
            <tr>
              <th className="px-3 py-2">Pickup</th>
              <th className="px-3 py-2">Product ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Weight</th>
              <th className="px-3 py-2">Unit Price</th>
              <th className="px-3 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                <td className="px-3 py-2">{r.pickupId}</td>
                <td className="px-3 py-2">{r.productId}</td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2 capitalize">{r.materialType}</td>
                <td className="px-3 py-2">{r.quantity}</td>
                <td className="px-3 py-2">{r.weight}</td>
                <td className="px-3 py-2">{r.unitPrice}</td>
                <td className="px-3 py-2">{r.totalValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


