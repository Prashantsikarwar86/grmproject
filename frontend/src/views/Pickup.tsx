import { useState } from 'react'
import { motion } from 'framer-motion'
import { api, MaterialItem } from '@/api/client'

type Form = {
  pickupId?: string
  pickupDate: string
  clientName: string
  clientContact: string
  vehicleNumber: string
  driverName: string
  vehicleCharges: number
  labourCharges: number
}

export default function Pickup(){
  const [form, setForm] = useState<Form>({
    pickupId: '', pickupDate: new Date().toISOString().slice(0,10), clientName: '', clientContact: '', vehicleNumber: '', driverName: '', vehicleCharges: 0, labourCharges: 0
  })
  const [materials, setMaterials] = useState<MaterialItem[]>([{
    productId: 'P1', name: '', materialType: '', quantity: 1, weight: 0, unitPrice: 0, totalValue: 0, condition: '' as any
  } as any])
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<any>(null)

  function addMaterial(){
    const index = materials.length + 1
    setMaterials(m => [...m, { productId: `P${index}`, name: '', materialType: '', quantity: 1, weight: 0, unitPrice: 0, totalValue: 0, condition: '' as any } as any])
  }

  function removeMaterial(i:number){
    setMaterials(prev => prev.filter((_,idx)=> idx!==i).map((m,idx)=> ({...m, productId: `P${idx+1}`})))
  }

  function updateMaterial(i:number, patch: Partial<MaterialItem>){
    setMaterials(prev => prev.map((item, idx) => idx===i ? ({...item, ...patch, totalValue: (patch.quantity ?? item.quantity) * (patch.unitPrice ?? item.unitPrice)}) : item))
  }

  async function handleSubmit(){
    setSaving(true)
    try{
      const { data } = await api.post('/materials', { ...form, materials })
      setResult(data)
      if(files.length){
        const fd = new FormData()
        files.forEach(f => fd.append('files', f))
        fd.append('pickupId', data.pickupId)
        fd.append('fileType', 'invoice')
        await api.post('/files', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      alert('Pickup saved successfully')
    }catch(err:any){
      alert('Failed to save pickup')
    }finally{
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card p-6">
        <div className="text-lg font-semibold">Pickup Information</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-zinc-400">Pickup ID</span>
            <input placeholder="Auto-generated" value={form.pickupId||''} onChange={e=>setForm({...form, pickupId: e.target.value})} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
          </label>
          {[
            ['pickupDate','date','Pickup Date'],
            ['clientName','text','Client Name'],
            ['clientContact','text','Client Contact'],
            ['vehicleNumber','text','Vehicle Number'],
            ['driverName','text','Driver Name'],
          ].map(([key,type,label])=> (
            <label key={key as string} className="space-y-1 text-sm">
              <span className="text-zinc-400">{label}</span>
              <input type={type as string} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" value={(form as any)[key as string]} onChange={e=>setForm({...form, [key as string]: e.target.value})} max={key==='pickupDate'? new Date().toISOString().slice(0,10): undefined}/>
            </label>
          ))}
          <label className="space-y-1 text-sm">
            <span className="text-zinc-400">Vehicle Charges</span>
            <input type="number" className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" value={form.vehicleCharges} onChange={e=>setForm({...form, vehicleCharges: Number(e.target.value)})}/>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-400">Labour Charges</span>
            <input type="number" className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" value={form.labourCharges} onChange={e=>setForm({...form, labourCharges: Number(e.target.value)})}/>
          </label>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="card p-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Materials</div>
          <button className="btn-primary" onClick={addMaterial}>Add Another Material</button>
        </div>
        <div className="mt-4 space-y-3">
          {materials.map((m,i)=> (
            <motion.div key={i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="grid gap-3 md:grid-cols-8">
              <input readOnly aria-label="Product ID" value={m.productId} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
              <input placeholder="Name" value={(m as any).name||''} onChange={e=>updateMaterial(i,{ name: e.target.value } as any)} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" />
              <select value={m.materialType} onChange={e=>updateMaterial(i,{materialType:e.target.value})} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2">
                <option value="">Material</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
                <option value="server">Server</option>
                <option value="charger">Charger</option>
                <option value="monitor">Monitor</option>
                <option value="keyboard">Keyboard</option>
                <option value="mouse">Mouse</option>
                <option value="other">Other</option>
              </select>
              <input type="number" value={m.quantity} onChange={e=>updateMaterial(i,{quantity:Number(e.target.value)})} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" placeholder="Qty"/>
              <input type="number" value={m.weight} onChange={e=>updateMaterial(i,{weight:Number(e.target.value)})} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" placeholder="Weight"/>
              <input type="number" value={m.unitPrice} onChange={e=>updateMaterial(i,{unitPrice:Number(e.target.value)})} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" placeholder="Unit Price"/>
              <input readOnly value={m.totalValue} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2" placeholder="Total"/>
              <button type="button" onClick={()=>removeMaterial(i)} className="rounded-md border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">Remove</button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="card p-6">
        <div className="text-lg font-semibold">Upload Documents</div>
        <label className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-700 p-6 text-sm hover:border-zinc-500">
          <input multiple type="file" onChange={e=>setFiles(Array.from(e.target.files||[]))} className="hidden" />
          Click to select files or drop them here
        </label>
        {files.length>0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-6">
            {files.map((f,i)=> (
              <div key={i} className="rounded-md border border-zinc-700 p-2 text-center text-xs">
                <div className="truncate">{f.name}</div>
                <div className="text-zinc-500">{Math.round(f.size/1024)} KB</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="flex justify-end">
        <button disabled={saving} onClick={handleSubmit} className="btn-primary">{saving?'Saving...':'Submit'}</button>
      </div>

      {result && (
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card p-6">
          <div className="font-semibold">Saved Pickup</div>
          <div className="text-sm text-zinc-400">Pickup ID: {result.pickupId}</div>
        </motion.div>
      )}
    </div>
  )
}


