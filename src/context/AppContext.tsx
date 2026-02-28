import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Address {
  type: 'home' | 'work' | 'other'
  flat: string
  building: string
  street: string
  city: string
  pincode: string
}

interface Product {
  id: number
  name: string
  variant: string
  price: number
  unit: string
  quantity: number
}

interface AppState {
  phone: string
  setPhone: (v: string) => void
  userName: string
  setUserName: (v: string) => void
  city: string
  setCity: (v: string) => void
  address: Address | null
  setAddress: (v: Address) => void
  deliveryTime: string
  setDeliveryTime: (v: string) => void
  deliveryDays: string[]
  setDeliveryDays: (v: string[]) => void
  cart: Product[]
  updateCart: (product: Product) => void
  totalItems: number
  totalPrice: number
  walletBalance: number
  setWalletBalance: (v: number) => void
  userMode: 'individual' | 'business'
  setUserMode: (v: 'individual' | 'business') => void
  switchMode: (v: 'individual' | 'business') => void
  enabledCategories: string[]
  setEnabledCategories: (v: string[]) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState('')
  const [userName, setUserName] = useState('Akash')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState<Address | null>(null)
  const [deliveryTime, setDeliveryTime] = useState('5:00 AM – 7:00 AM')
  const [deliveryDays, setDeliveryDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  const [cart, setCart] = useState<Product[]>([])
  const [walletBalance, setWalletBalance] = useState(2350)
  const [userMode, setUserMode] = useState<'individual' | 'business'>('individual')
  const [enabledCategories, setEnabledCategories] = useState<string[]>([
    'milk', 'curd', 'paneer', 'milk-powder', 'ice-creams',
  ])

  const DEFAULTS = {
    individual: ['milk', 'curd', 'paneer', 'milk-powder', 'ice-creams'],
    business:   ['milk', 'curd', 'ghee', 'butter', 'paneer', 'milk-powder', 'ice-creams'],
  }

  const switchMode = (mode: 'individual' | 'business') => {
    setUserMode(mode)
    setEnabledCategories(DEFAULTS[mode])
  }

  const updateCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (product.quantity === 0) {
        return prev.filter(p => p.id !== product.id)
      }
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p)
      }
      return [...prev, product]
    })
  }

  const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0)
  const totalPrice = cart.reduce((sum, p) => sum + p.price * p.quantity, 0)

  return (
    <AppContext.Provider value={{
      phone, setPhone,
      userName, setUserName,
      city, setCity,
      address, setAddress,
      deliveryTime, setDeliveryTime,
      deliveryDays, setDeliveryDays,
      cart, updateCart,
      totalItems, totalPrice,
      walletBalance, setWalletBalance,
      userMode, setUserMode, switchMode,
      enabledCategories, setEnabledCategories,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
