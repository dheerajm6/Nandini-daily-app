import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Truck, Package, Check, X, ChevronRight, BadgeIndianRupee,
} from 'lucide-react'

// ── Constants ─────────────────────────────────────────────────────────────────
type WalletType = 'delivery' | 'product'

const DELIVERY_BAL   = 201
const PRODUCT_BAL    = 1799
const TOTAL_BAL      = DELIVERY_BAL + PRODUCT_BAL
const DELIVERIES_USED  = 18
const DELIVERIES_TOTAL = 30
const PLAN_PRICE       = 99

const PRESET_AMOUNTS = [99, 198, 500, 1000, 2000]

const TRANSACTIONS = [
  { id: 1, type: 'credit',  wallet: 'product'  as WalletType, label: 'Money Added',             amount: 1500, date: '22 Feb', icon: '💳' },
  { id: 2, type: 'debit',   wallet: 'product'  as WalletType, label: 'Full Cream Milk 1L',      amount: 68,   date: '18 Feb', icon: '🥛' },
  { id: 3, type: 'debit',   wallet: 'product'  as WalletType, label: 'Fresh Curd 400g',         amount: 48,   date: '18 Feb', icon: '🍶' },
  { id: 4, type: 'debit',   wallet: 'product'  as WalletType, label: 'Pure Ghee 500ml',         amount: 285,  date: '15 Feb', icon: '✨' },
  { id: 5, type: 'debit',   wallet: 'delivery' as WalletType, label: 'Delivery Plan · Feb',     amount: 99,   date: '1 Feb',  icon: '🚚' },
  { id: 6, type: 'credit',  wallet: 'delivery' as WalletType, label: 'Money Added',             amount: 300,  date: '28 Jan', icon: '💳' },
  { id: 7, type: 'debit',   wallet: 'product'  as WalletType, label: 'Table Butter 100g',       amount: 62,   date: '20 Jan', icon: '🧈' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function WalletScreen() {
  const [addingTo, setAddingTo] = useState<WalletType | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [custom,   setCustom]   = useState('')

  const productPct = (PRODUCT_BAL / TOTAL_BAL) * 100
  const usedPct    = (DELIVERIES_USED / DELIVERIES_TOTAL) * 100
  const finalAmt   = selected ?? (Number(custom) || 0)

  function closeSheet() {
    setAddingTo(null); setSelected(null); setCustom('')
  }

  return (
    <div className="relative h-full">

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-y-auto bg-[#F2F2F7]">

        {/* Header */}
        <div className="bg-white safe-top px-5 pt-4 pb-4 flex-shrink-0"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
          <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-[-0.5px]">Wallet</h1>
          <p className="text-[13px] text-ios-gray-1 mt-0.5">Your Nandini Daily balance</p>
        </div>

        <div className="px-4 pt-4 pb-8 space-y-4">

          {/* ── Total Balance Hero ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 8px 28px rgba(0,40,100,0.22)' }}
          >
            {/* Dark top: big balance */}
            <div className="px-5 pt-5 pb-4"
              style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0055A5 100%)' }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1"
                style={{ color: 'rgba(255,255,255,0.45)' }}>Total Balance</p>
              <p className="text-[42px] font-bold text-white leading-none tracking-[-1.5px] mb-4">
                ₹{TOTAL_BAL.toLocaleString('en-IN')}
              </p>

              {/* Split bar */}
              <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-3">
                <motion.div className="rounded-l-full"
                  style={{ background: '#34C759' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${productPct}%` }}
                  transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
                />
                <div className="flex-1 rounded-r-full" style={{ background: 'rgba(100,180,255,0.45)' }} />
              </div>

              {/* Two wallet breakdown */}
              <div className="flex gap-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
                    <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Products
                    </span>
                  </div>
                  <p className="text-[20px] font-bold text-white leading-none">
                    ₹{PRODUCT_BAL.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(120,190,255,0.8)' }} />
                    <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Delivery
                    </span>
                  </div>
                  <p className="text-[20px] font-bold text-white leading-none">
                    ₹{DELIVERY_BAL}
                  </p>
                </div>
              </div>
            </div>

            {/* Add money strip */}
            <button
              onClick={() => { setAddingTo('product'); setSelected(null); setCustom('') }}
              className="w-full flex items-center justify-center gap-2 py-3.5 active:opacity-80 transition-opacity"
              style={{ background: '#0077CC' }}
            >
              <Plus style={{ width: 16, height: 16, color: 'white' }} />
              <span className="text-[14px] font-bold text-white">Add Money</span>
            </button>
          </motion.div>

          {/* ── Delivery Plan Card ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ios-card overflow-hidden p-0"
          >
            {/* Main section */}
            <div className="flex" style={{ borderBottom: '1px solid #F0F0F0' }}>
              {/* Left accent */}
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
                    <p className="text-[22px] font-bold text-[#0055A5] leading-none">
                      ₹{PLAN_PRICE}
                    </p>
                    <p className="text-[10px] text-ios-gray-1 mt-0.5">/ month</p>
                  </div>
                </div>

                {/* Delivery usage bar */}
                <div className="mb-1.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] text-ios-gray-1 font-medium">
                      {DELIVERIES_USED} of {DELIVERIES_TOTAL} deliveries used
                    </span>
                    <span className="text-[11px] font-bold text-[#0055A5]">
                      {DELIVERIES_TOTAL - DELIVERIES_USED} remaining
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-[#F0F0F0]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #0055A5, #0077CC)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${usedPct}%` }}
                      transition={{ delay: 0.25, duration: 0.65, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Per delivery cost */}
                <p className="text-[11px]" style={{ color: '#8E8E93' }}>
                  Just <span className="font-bold text-[#0055A5]">₹{(PLAN_PRICE / DELIVERIES_TOTAL).toFixed(0)}</span> per delivery — everything else is on us
                </p>
              </div>
            </div>

            {/* Perks */}
            <div className="px-4 py-3.5 space-y-2.5" style={{ background: '#F8FBFF' }}>
              {[
                'Added something extra during the day? It ships with your morning order, free.',
                'Going on vacation? Paused days carry forward — not a rupee lost.',
              ].map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: '#0055A5' }}>
                    <Check style={{ width: 9, height: 9, color: 'white' }} />
                  </div>
                  <p className="text-[11.5px] text-ios-gray-1 leading-snug">{perk}</p>
                </div>
              ))}
            </div>

            {/* Top-up CTA */}
            <button
              onClick={() => { setAddingTo('delivery'); setSelected(null); setCustom('') }}
              className="w-full flex items-center justify-between px-4 py-3 active:bg-[#F0F6FF] transition-colors"
              style={{ borderTop: '1px solid #F0F0F0' }}
            >
              <span className="text-[13px] font-semibold text-brand-blue">Top up delivery balance</span>
              <ChevronRight style={{ width: 15, height: 15, color: '#0055A5' }} />
            </button>
          </motion.div>

          {/* ── Product Wallet Card ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
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
                    <p className="text-[12px] text-ios-gray-1">
                      For all your orders · MRP prices
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[22px] font-bold leading-none" style={{ color: '#34C759' }}>
                      ₹{PRODUCT_BAL.toLocaleString('en-IN')}
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

          {/* ── Recent Activity ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[15px] font-bold text-[#1C1C1E] mb-3">Recent Activity</p>
            <div className="ios-card p-0 overflow-hidden">
              {TRANSACTIONS.map((tx, i) => (
                <div key={tx.id}>
                  {i > 0 && (
                    <div style={{ height: 1, background: '#F2F2F7', marginLeft: 64 }} />
                  )}
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-[18px]"
                      style={{ background: tx.type === 'credit' ? '#E9FAF0' : '#F2F2F7' }}>
                      {tx.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1C1C1E] truncate">{tx.label}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{
                            background: tx.wallet === 'delivery' ? '#EBF4FF' : '#E9FAF0',
                            color:      tx.wallet === 'delivery' ? '#0055A5' : '#22A85A',
                          }}>
                          {tx.wallet === 'delivery' ? 'Delivery' : 'Product'}
                        </span>
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
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Add Money Bottom Sheet ────────────────────────────────────── */}
      <AnimatePresence>
        {addingTo && (
          <>
            {/* Scrim */}
            <motion.div
              className="absolute inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.4)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeSheet}
            />

            {/* Sheet */}
            <motion.div
              className="absolute bottom-0 inset-x-0 z-50 bg-white"
              style={{ borderRadius: '24px 24px 0 0' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
              </div>

              <div className="px-5 pt-3 pb-8">
                {/* Sheet header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-[18px] font-bold text-[#1C1C1E]">
                      Add to {addingTo === 'delivery' ? 'Delivery' : 'Product'} Wallet
                    </p>
                    <p className="text-[12px] text-ios-gray-1 mt-0.5">
                      {addingTo === 'delivery'
                        ? `Each ₹${PLAN_PRICE} = 30 days of delivery`
                        : 'Spend on any product at MRP'}
                    </p>
                  </div>
                  <button onClick={closeSheet}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F2F2F7]">
                    <X style={{ width: 16, height: 16, color: '#8E8E93' }} />
                  </button>
                </div>

                {/* Wallet switcher */}
                <div className="flex gap-2 mb-5 p-1 rounded-2xl" style={{ background: '#F2F2F7' }}>
                  {(['delivery', 'product'] as WalletType[]).map(w => (
                    <button
                      key={w}
                      onClick={() => { setAddingTo(w); setSelected(null); setCustom('') }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                      style={{
                        background: addingTo === w ? 'white' : 'transparent',
                        color:      addingTo === w
                          ? (w === 'delivery' ? '#0055A5' : '#22A85A')
                          : '#8E8E93',
                        boxShadow: addingTo === w ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {w === 'delivery'
                        ? <Truck style={{ width: 14, height: 14 }} />
                        : <Package style={{ width: 14, height: 14 }} />
                      }
                      {w === 'delivery' ? 'Delivery' : 'Products'}
                    </button>
                  ))}
                </div>

                {/* Preset amounts */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {PRESET_AMOUNTS.map(amt => {
                    const isActive = selected === amt
                    const activeColor = addingTo === 'delivery' ? '#0055A5' : '#22A85A'
                    return (
                      <button key={amt}
                        onClick={() => { setSelected(amt); setCustom('') }}
                        className="py-2.5 rounded-xl text-[12px] font-bold transition-all"
                        style={{
                          background: isActive ? activeColor : '#F2F2F7',
                          color:      isActive ? 'white'       : '#1C1C1E',
                        }}>
                        {amt >= 1000 ? `₹${amt / 1000}k` : `₹${amt}`}
                      </button>
                    )
                  })}
                </div>

                {/* Custom amount */}
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-4"
                  style={{ background: '#F2F2F7', border: '1.5px solid transparent' }}>
                  <span className="text-[16px] font-bold" style={{ color: '#C7C7CC' }}>₹</span>
                  <input
                    type="number"
                    placeholder="Or enter custom amount"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setSelected(null) }}
                    className="flex-1 bg-transparent text-[15px] font-semibold text-[#1C1C1E] outline-none placeholder:text-[#C7C7CC]"
                  />
                </div>

                {/* Delivery: months hint */}
                <AnimatePresence>
                  {addingTo === 'delivery' && finalAmt >= PLAN_PRICE && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                        style={{ background: '#EBF4FF' }}>
                        <Truck style={{ width: 14, height: 14, color: '#0055A5' }} />
                        <p className="text-[12px] font-medium text-[#0055A5]">
                          Covers{' '}
                          <span className="font-bold">
                            {Math.floor(finalAmt / PLAN_PRICE)} month{Math.floor(finalAmt / PLAN_PRICE) > 1 ? 's' : ''}
                          </span>
                          {' '}of delivery
                          {finalAmt % PLAN_PRICE > 0
                            ? ` + ₹${finalAmt % PLAN_PRICE} carried forward`
                            : ' — fully covered'}
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
                  {finalAmt > 0
                    ? `Pay ₹${finalAmt.toLocaleString('en-IN')}`
                    : 'Select an amount'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
