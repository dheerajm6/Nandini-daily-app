import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Truck, Package, Check, X, ChevronRight, ChevronDown,
  BadgeIndianRupee, Home, Briefcase, MapPin,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type WalletType  = 'delivery' | 'product'
type TxCategory  = 'loaded' | 'product' | 'delivery'

// ── Address config ────────────────────────────────────────────────────────────
const ADDRESSES = [
  { id: 'all',   label: 'All Addresses', subtitle: '',                                       Icon: null,      color: '#0055A5' },
  { id: 'home',  label: 'Home',          subtitle: 'Flat 4B, Sunshine Apts, Koramangala',    Icon: Home,      color: '#007AFF' },
  { id: 'work',  label: 'Work',          subtitle: 'No. 12, 3rd Floor, MG Road, Bangalore',  Icon: Briefcase, color: '#FF9500' },
  { id: 'other', label: "Mum's Place",   subtitle: '22A, Rajajinagar, Bangalore',            Icon: MapPin,    color: '#34C759' },
]

// ── Per-address wallet data ───────────────────────────────────────────────────
const WALLET_DATA: Record<string, { product: number; delivery: number; deliveriesUsed: number; deliveriesTotal: number }> = {
  home:  { product: 1200, delivery: 201, deliveriesUsed: 18, deliveriesTotal: 30 },
  work:  { product: 800,  delivery: 149, deliveriesUsed: 10, deliveriesTotal: 30 },
  other: { product: 350,  delivery: 0,   deliveriesUsed: 0,  deliveriesTotal: 0  },
}
const TOTAL_PRODUCT  = Object.values(WALLET_DATA).reduce((s, v) => s + v.product, 0)
const TOTAL_DELIVERY = Object.values(WALLET_DATA).reduce((s, v) => s + v.delivery, 0)
const TOTAL_BAL      = TOTAL_PRODUCT + TOTAL_DELIVERY

// ── Transactions ──────────────────────────────────────────────────────────────
interface Transaction {
  id: number
  type: 'credit' | 'debit'
  category: TxCategory
  address: string
  label: string
  amount: number
  date: string
  icon: string
}

const TRANSACTIONS: Transaction[] = [
  { id: 1, type: 'credit', category: 'loaded',   address: 'home',  label: 'Money Added',          amount: 1500, date: '22 Feb', icon: '💳' },
  { id: 2, type: 'debit',  category: 'product',  address: 'home',  label: 'Full Cream Milk 1L',   amount: 68,   date: '20 Feb', icon: '🥛' },
  { id: 3, type: 'debit',  category: 'product',  address: 'work',  label: 'Toned Milk 500 ml',    amount: 22,   date: '20 Feb', icon: '🥛' },
  { id: 4, type: 'debit',  category: 'delivery', address: 'home',  label: 'Delivery Plan · Feb',  amount: 149,  date: '18 Feb', icon: '🚚' },
  { id: 5, type: 'debit',  category: 'product',  address: 'home',  label: 'Fresh Curd 400 g',     amount: 48,   date: '18 Feb', icon: '🍶' },
  { id: 6, type: 'credit', category: 'loaded',   address: 'work',  label: 'Money Added',          amount: 800,  date: '15 Feb', icon: '💳' },
  { id: 7, type: 'debit',  category: 'delivery', address: 'work',  label: 'Delivery Plan · Feb',  amount: 149,  date: '15 Feb', icon: '🚚' },
  { id: 8, type: 'debit',  category: 'product',  address: 'home',  label: 'Pure Ghee 500 ml',     amount: 285,  date: '15 Feb', icon: '✨' },
  { id: 9, type: 'credit', category: 'loaded',   address: 'other', label: 'Money Added',          amount: 350,  date: '10 Feb', icon: '💳' },
]

const ACTIVITY_TABS: { id: TxCategory | 'all'; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'loaded',   label: 'Money Loaded' },
  { id: 'product',  label: 'Products' },
  { id: 'delivery', label: 'Delivery' },
]


// ── Address Dropdown ──────────────────────────────────────────────────────────
function AddressDropdown({
  selected, open, onToggle, onSelect,
}: {
  selected: typeof ADDRESSES[number]
  open: boolean
  onToggle: (e: React.MouseEvent) => void
  onSelect: (addr: typeof ADDRESSES[number]) => void
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        <p className="text-[13px]" style={{ color: '#8E8E93' }}>Now viewing wallet for</p>
        <button
          className="flex items-center gap-1 px-2.5 py-1 rounded-full active:opacity-70 transition-opacity"
          style={{ background: 'rgba(0,85,165,0.10)' }}
          onClick={onToggle}
        >
          <p className="text-[13px] font-bold" style={{ color: '#0055A5' }}>{selected.label}</p>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" style={{ color: '#0055A5' }} />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-8 z-30 bg-white rounded-2xl overflow-hidden"
            style={{ minWidth: 270, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', border: '1px solid rgba(0,0,0,0.07)' }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
          >
            {ADDRESSES.map((addr, i) => {
              const Icon = addr.Icon
              const isSelected = addr.id === selected.id
              const w = addr.id !== 'all' ? WALLET_DATA[addr.id] : null
              return (
                <button
                  key={addr.id}
                  className="w-full flex items-center gap-3 px-4 py-3 active:bg-ios-gray-6 text-left"
                  style={{ borderBottom: i < ADDRESSES.length - 1 ? '1px solid #F2F2F7' : 'none' }}
                  onClick={() => onSelect(addr)}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: isSelected ? 'rgba(0,85,165,0.12)' : '#F2F2F7' }}>
                    {Icon
                      ? <Icon className="w-4 h-4" style={{ color: isSelected ? '#0055A5' : '#8E8E93' }} />
                      : <span className="text-[14px]">🏠</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#1C1C1E]">{addr.label}</p>
                    {w
                      ? <p className="text-[11px]" style={{ color: '#8E8E93' }}>₹{(w.product + w.delivery).toLocaleString('en-IN')} balance</p>
                      : <p className="text-[11px]" style={{ color: '#8E8E93' }}>₹{TOTAL_BAL.toLocaleString('en-IN')} combined</p>
                    }
                  </div>
                  {isSelected && <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#0055A5' }} />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function WalletScreen() {
  const { userMode } = useApp()
  const PLAN_PRICE     = userMode === 'business' ? 399 : 149
  const PRESET_AMOUNTS = userMode === 'business' ? [399, 798, 1000, 2000, 5000] : [149, 298, 500, 1000, 2000]

  const [selectedAddr, setSelectedAddr] = useState(ADDRESSES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activityCat,  setActivityCat]  = useState<TxCategory | 'all'>('all')
  const [addingTo,     setAddingTo]     = useState<WalletType | null>(null)
  const [selected,     setSelected]     = useState<number | null>(null)
  const [custom,       setCustom]       = useState('')

  const isAll   = selectedAddr.id === 'all'
  const wallet  = !isAll ? WALLET_DATA[selectedAddr.id] : null
  const bal     = wallet ? wallet.product + wallet.delivery : TOTAL_BAL
  const prodBal = wallet ? wallet.product  : TOTAL_PRODUCT
  const delBal  = wallet ? wallet.delivery : TOTAL_DELIVERY
  const prodPct = (prodBal / bal) * 100
  const finalAmt = selected ?? (Number(custom) || 0)

  const visibleTx = TRANSACTIONS.filter(tx => {
    const addrMatch = isAll || tx.address === selectedAddr.id
    const catMatch  = activityCat === 'all' || tx.category === activityCat
    return addrMatch && catMatch
  })

  function closeSheet() { setAddingTo(null); setSelected(null); setCustom('') }

  return (
    <div
      className="relative h-full"
      onClick={() => setDropdownOpen(false)}
    >
      <div className="absolute inset-0 overflow-y-auto bg-[#F2F2F7]">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="bg-white safe-top px-5 pt-4 pb-4"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
          <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-[-0.5px] mb-1">Wallet</h1>
          <AddressDropdown
            selected={selectedAddr}
            open={dropdownOpen}
            onToggle={e => { e.stopPropagation(); setDropdownOpen(o => !o) }}
            onSelect={addr => { setSelectedAddr(addr); setDropdownOpen(false) }}
          />
        </div>

        <div className="px-4 pt-4 pb-8 space-y-4">

          {/* ── Balance Hero ────────────────────────────────────── */}
          <motion.div
            key={selectedAddr.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 8px 28px rgba(0,40,100,0.22)' }}
          >
            <div className="px-5 pt-5 pb-4"
              style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0055A5 100%)' }}>

              <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1"
                style={{ color: 'rgba(255,255,255,0.45)' }}>
                {isAll ? 'Total Balance · All Addresses' : `Balance · ${selectedAddr.label}`}
              </p>
              <p className="text-[42px] font-bold text-white leading-none tracking-[-1.5px] mb-4">
                ₹{bal.toLocaleString('en-IN')}
              </p>

              {/* Split bar */}
              <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-3">
                <motion.div className="rounded-l-full" style={{ background: '#34C759' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${prodPct}%` }}
                  transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
                />
                <div className="flex-1 rounded-r-full" style={{ background: 'rgba(100,180,255,0.45)' }} />
              </div>

              <div className="flex gap-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
                    <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Products</span>
                  </div>
                  <p className="text-[20px] font-bold text-white leading-none">₹{prodBal.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(120,190,255,0.8)' }} />
                    <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Delivery</span>
                  </div>
                  <p className="text-[20px] font-bold text-white leading-none">₹{delBal.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setAddingTo('product'); setSelected(null); setCustom('') }}
              className="w-full flex items-center justify-center gap-2 py-3.5 active:opacity-80 transition-opacity"
              style={{ background: '#0077CC' }}
            >
              <Plus style={{ width: 16, height: 16, color: 'white' }} />
              <span className="text-[14px] font-bold text-white">Add Money</span>
            </button>
          </motion.div>

          {/* ── All Addresses: subscription summary cards ────────── */}
          {isAll && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-[13px] font-bold text-[#1C1C1E] mb-2.5">Subscriptions</p>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {ADDRESSES.filter(a => a.id !== 'all').map(addr => {
                  const w   = WALLET_DATA[addr.id]
                  const tot = w.product + w.delivery
                  const Icon = addr.Icon!
                  const pct = w.deliveriesTotal > 0 ? (w.deliveriesUsed / w.deliveriesTotal) * 100 : 0
                  return (
                    <button
                      key={addr.id}
                      className="flex-shrink-0 bg-white rounded-2xl p-4 text-left active:opacity-80 transition-opacity"
                      style={{ width: 160, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                      onClick={() => setSelectedAddr(addr)}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: `${addr.color}18` }}>
                          <Icon className="w-4 h-4" style={{ color: addr.color }} />
                        </div>
                        <p className="text-[13px] font-bold text-[#1C1C1E]">{addr.label}</p>
                      </div>

                      <p className="text-[20px] font-bold text-[#1C1C1E] leading-none mb-0.5">
                        ₹{tot.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] mb-3" style={{ color: '#8E8E93' }}>total balance</p>

                      {/* Delivery plan mini bar */}
                      {w.deliveriesTotal > 0 ? (
                        <>
                          <div className="h-1.5 rounded-full overflow-hidden mb-1"
                            style={{ background: '#F0F0F0' }}>
                            <div className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: addr.color }} />
                          </div>
                          <p className="text-[10px] font-medium" style={{ color: '#8E8E93' }}>
                            {w.deliveriesUsed}/{w.deliveriesTotal} deliveries
                          </p>
                        </>
                      ) : (
                        <p className="text-[10px] font-medium" style={{ color: '#FF3B30' }}>
                          No delivery plan
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ── Specific address: Delivery Plan card ─────────────── */}
          {!isAll && wallet && (
            <motion.div
              key={`delivery-${selectedAddr.id}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="ios-card overflow-hidden p-0"
            >
              <div className="flex" style={{ borderBottom: '1px solid #F0F0F0' }}>
                <div className="w-[3px] flex-shrink-0" style={{ background: '#0055A5' }} />
                <div className="flex-1 px-4 py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Truck style={{ width: 15, height: 15, color: '#0055A5' }} />
                        <p className="text-[14px] font-bold text-[#1C1C1E]">Delivery Plan</p>
                      </div>
                      <p className="text-[12px] text-ios-gray-1">
                        Feb 2026 · Renews <span className="font-semibold text-[#1C1C1E]">Mar 1</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[22px] font-bold text-[#0055A5] leading-none">₹{PLAN_PRICE}</p>
                      <p className="text-[10px] text-ios-gray-1 mt-0.5">/ month</p>
                    </div>
                  </div>

                  {wallet.deliveriesTotal > 0 ? (
                    <>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] text-ios-gray-1 font-medium">
                          {wallet.deliveriesUsed} of {wallet.deliveriesTotal} deliveries used
                        </span>
                        <span className="text-[11px] font-bold text-[#0055A5]">
                          {wallet.deliveriesTotal - wallet.deliveriesUsed} remaining
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-[#F0F0F0]">
                        <motion.div className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #0055A5, #0077CC)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(wallet.deliveriesUsed / wallet.deliveriesTotal) * 100}%` }}
                          transition={{ delay: 0.25, duration: 0.65, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: '#8E8E93' }}>
                        Just <span className="font-bold text-[#0055A5]">₹{(Math.floor(PLAN_PRICE * 10 / wallet.deliveriesTotal) / 10).toFixed(1)}</span> per delivery
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: '#FFF2F0' }}>
                      <p className="text-[12px] font-medium" style={{ color: '#FF3B30' }}>
                        No active delivery plan for this address
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 py-3.5 space-y-2.5" style={{ background: '#F8FBFF' }}>
                {['Paused days carry forward — not a rupee lost.',
                  'Add-ons ship with your morning order, free.'].map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#0055A5' }}>
                      <Check style={{ width: 9, height: 9, color: 'white' }} />
                    </div>
                    <p className="text-[11.5px] text-ios-gray-1 leading-snug">{perk}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setAddingTo('delivery'); setSelected(null); setCustom('') }}
                className="w-full flex items-center justify-between px-4 py-3 active:bg-[#F0F6FF] transition-colors"
                style={{ borderTop: '1px solid #F0F0F0' }}
              >
                <span className="text-[13px] font-semibold text-brand-blue">Top up delivery balance</span>
                <ChevronRight style={{ width: 15, height: 15, color: '#0055A5' }} />
              </button>
            </motion.div>
          )}

          {/* ── Specific address: Product Wallet card ────────────── */}
          {!isAll && wallet && (
            <motion.div
              key={`product-${selectedAddr.id}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13 }}
              className="ios-card overflow-hidden p-0"
            >
              <div className="flex" style={{ borderBottom: '1px solid #F0F0F0' }}>
                <div className="w-[3px] flex-shrink-0" style={{ background: '#34C759' }} />
                <div className="flex-1 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <BadgeIndianRupee style={{ width: 15, height: 15, color: '#34C759' }} />
                        <p className="text-[14px] font-bold text-[#1C1C1E]">Product Wallet</p>
                      </div>
                      <p className="text-[12px] text-ios-gray-1">For all orders · {selectedAddr.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[22px] font-bold leading-none" style={{ color: '#34C759' }}>
                        ₹{wallet.product.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-ios-gray-1 mt-0.5">available</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setAddingTo('product'); setSelected(null); setCustom('') }}
                className="w-full flex items-center justify-between px-4 py-3 active:bg-[#F0FFF4] transition-colors"
              >
                <span className="text-[13px] font-semibold" style={{ color: '#22A85A' }}>
                  Add money to product wallet
                </span>
                <ChevronRight style={{ width: 15, height: 15, color: '#22A85A' }} />
              </button>
            </motion.div>
          )}

          {/* ── Recent Activity ──────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-[15px] font-bold text-[#1C1C1E] mb-3">Recent Activity</p>

            {/* Category tabs */}
            <div className="flex gap-2 mb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {ACTIVITY_TABS.map(tab => (
                <button
                  key={tab.id}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                  style={{
                    background: activityCat === tab.id ? '#0055A5' : '#F2F2F7',
                    color:      activityCat === tab.id ? 'white'    : '#8E8E93',
                  }}
                  onClick={e => { e.stopPropagation(); setActivityCat(tab.id) }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedAddr.id}-${activityCat}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="ios-card p-0 overflow-hidden"
              >
                {visibleTx.length === 0 ? (
                  <div className="flex flex-col items-center py-10">
                    <p className="text-[32px] mb-2">🧾</p>
                    <p className="text-[14px] font-semibold text-[#1C1C1E]">No transactions</p>
                    <p className="text-[12px] text-ios-gray-1 mt-0.5">Nothing matches this filter yet</p>
                  </div>
                ) : (
                  visibleTx.map((tx, i) => {
                    const addrInfo = ADDRESSES.find(a => a.id === tx.address)
                    const AddrIcon = addrInfo?.Icon
                    return (
                      <div key={tx.id}>
                        {i > 0 && <div style={{ height: 1, background: '#F2F2F7', marginLeft: 64 }} />}
                        <div className="flex items-center gap-3 px-4 py-3.5">
                          {/* Icon */}
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-[18px]"
                            style={{ background: tx.type === 'credit' ? '#E9FAF0' : '#F2F2F7' }}>
                            {tx.icon}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1C1C1E] truncate">{tx.label}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {/* Category pill */}
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                                style={{
                                  background: tx.category === 'loaded' ? '#EBF4FF'
                                            : tx.category === 'product' ? '#E9FAF0'
                                            : '#FFF3E0',
                                  color:      tx.category === 'loaded' ? '#0055A5'
                                            : tx.category === 'product' ? '#22A85A'
                                            : '#E65100',
                                }}>
                                {tx.category === 'loaded' ? 'Money Loaded'
                                 : tx.category === 'product' ? 'Product'
                                 : 'Delivery'}
                              </span>
                              {/* Address tag (only when viewing all) */}
                              {isAll && addrInfo && (
                                <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                                  style={{ background: `${addrInfo.color}15`, color: addrInfo.color }}>
                                  {AddrIcon && <AddrIcon className="w-2.5 h-2.5" />}
                                  {addrInfo.label}
                                </span>
                              )}
                              <span className="text-[11px] text-ios-gray-1">{tx.date}</span>
                            </div>
                          </div>

                          {/* Amount */}
                          <p className="text-[14px] font-bold flex-shrink-0"
                            style={{ color: tx.type === 'credit' ? '#34C759' : '#1C1C1E' }}>
                            {tx.type === 'credit' ? '+' : '−'}₹{tx.amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* ── Add Money Bottom Sheet ─────────────────────────────────────── */}
      <AnimatePresence>
        {addingTo && (
          <>
            <motion.div
              className="absolute inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.4)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeSheet}
            />
            <motion.div
              className="absolute bottom-0 inset-x-0 z-50 bg-white"
              style={{ borderRadius: '24px 24px 0 0' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
              </div>
              <div className="px-5 pt-3 pb-8">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-[18px] font-bold text-[#1C1C1E]">
                      Add to {addingTo === 'delivery' ? 'Delivery' : 'Product'} Wallet
                    </p>
                    <p className="text-[12px] text-ios-gray-1 mt-0.5">
                      {isAll ? 'All addresses' : selectedAddr.label}
                      {addingTo === 'delivery'
                        ? ` · Each ₹${PLAN_PRICE} = 30 days`
                        : ' · Spend on any product at MRP'}
                    </p>
                  </div>
                  <button onClick={closeSheet}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F2F2F7]">
                    <X style={{ width: 16, height: 16, color: '#8E8E93' }} />
                  </button>
                </div>

                {/* Wallet type switcher */}
                <div className="flex gap-2 mb-5 p-1 rounded-2xl" style={{ background: '#F2F2F7' }}>
                  {(['delivery', 'product'] as WalletType[]).map(w => (
                    <button key={w}
                      onClick={() => { setAddingTo(w); setSelected(null); setCustom('') }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                      style={{
                        background: addingTo === w ? 'white' : 'transparent',
                        color:      addingTo === w ? (w === 'delivery' ? '#0055A5' : '#22A85A') : '#8E8E93',
                        boxShadow:  addingTo === w ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {w === 'delivery'
                        ? <Truck style={{ width: 14, height: 14 }} />
                        : <Package style={{ width: 14, height: 14 }} />}
                      {w === 'delivery' ? 'Delivery' : 'Products'}
                    </button>
                  ))}
                </div>

                {/* Preset amounts */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {PRESET_AMOUNTS.map(amt => {
                    const isActive    = selected === amt
                    const activeColor = addingTo === 'delivery' ? '#0055A5' : '#22A85A'
                    return (
                      <button key={amt}
                        onClick={() => { setSelected(amt); setCustom('') }}
                        className="py-2.5 rounded-xl text-[12px] font-bold transition-all"
                        style={{ background: isActive ? activeColor : '#F2F2F7', color: isActive ? 'white' : '#1C1C1E' }}>
                        {amt >= 1000 ? `₹${amt / 1000}k` : `₹${amt}`}
                      </button>
                    )
                  })}
                </div>

                {/* Custom amount */}
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-4"
                  style={{ background: '#F2F2F7' }}>
                  <span className="text-[16px] font-bold" style={{ color: '#C7C7CC' }}>₹</span>
                  <input
                    type="number"
                    placeholder="Or enter custom amount"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setSelected(null) }}
                    className="flex-1 bg-transparent text-[15px] font-semibold text-[#1C1C1E] outline-none placeholder:text-[#C7C7CC]"
                  />
                </div>

                {/* Delivery hint */}
                <AnimatePresence>
                  {addingTo === 'delivery' && finalAmt >= PLAN_PRICE && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: '#EBF4FF' }}>
                        <Truck style={{ width: 14, height: 14, color: '#0055A5' }} />
                        <p className="text-[12px] font-medium text-[#0055A5]">
                          Covers{' '}
                          <span className="font-bold">
                            {Math.floor(finalAmt / PLAN_PRICE)} month{Math.floor(finalAmt / PLAN_PRICE) > 1 ? 's' : ''}
                          </span>
                          {finalAmt % PLAN_PRICE > 0 ? ` + ₹${finalAmt % PLAN_PRICE} carried forward` : ' — fully covered'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pay button */}
                <button
                  disabled={finalAmt <= 0}
                  className="w-full py-4 rounded-2xl text-[15px] font-bold text-white transition-all active:opacity-85"
                  style={{
                    background: finalAmt > 0
                      ? addingTo === 'delivery'
                        ? 'linear-gradient(90deg, #003B73, #0077CC)'
                        : 'linear-gradient(90deg, #16A34A, #22C55E)'
                      : '#D1D1D6',
                  }}
                >
                  {finalAmt > 0 ? `Pay ₹${finalAmt.toLocaleString('en-IN')}` : 'Select an amount'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
