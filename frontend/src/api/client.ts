import axios from 'axios'

const env = (import.meta as any).env || {}
const baseFromUrl = env?.VITE_API_BASE_URL || env?.VITE_API_BASE
export const api = axios.create({
  baseURL: baseFromUrl || '/api',
})

export type MaterialItem = {
  productId: string
  name?: string
  materialType: string
  quantity: number
  weight: number
  unitPrice: number
  totalValue: number
  condition: string
}

export type Pickup = {
  id: string
  pickupId: string
  pickupDate: string
  clientName: string
  clientContact: string
  vehicleNumber: string
  driverName: string
  vehicleCharges: number
  labourCharges: number
  materials: MaterialItem[]
  totals: { totalProducts: number; totalWeight: number; totalValue: number }
}


