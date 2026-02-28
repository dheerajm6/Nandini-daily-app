import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, ChevronDown, Check, Home, Briefcase, MapPin } from 'lucide-react'

const FILTER_TABS = ['All', 'Delivered', 'Upcoming', 'Cancelled']

// Mock subscribed addresses — replace with real data when subscriptions are live
const SUBSCRIBED_ADDRESSES = [
  { id: 'home',  label: 'Home',   subtitle: 'Flat 4B, Sunshine Apts, Koramangala',  icon: Home },
  { id: 'work',  label: 'Work',   subtitle: 'No. 12, 3rd Floor, MG Road, Bangalore', icon: Briefcase },
  { id: 'other', label: "Mum's Place", subtitle: '22A, Rajajinagar, Bangalore',      icon: MapPin },
]

export default function OrdersScreen() {
  const [activeFilter, setActiveFilter] = useState(0)
  const [selectedAddr, setSelectedAddr] = useState(SUBSCRIBED_ADDRESSES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="h-full overflow-y-auto bg-ios-gray-6" onClick={() => setDropdownOpen(false)}>

      {/* Header */}
      <div className="bg-white safe-top px-5 pb-3 pt-4"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>

        <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-[-0.4px] mb-1">Orders</h1>

        {/* Address context line */}
        <div className="flex items-center gap-1.5 mb-3 relative">
          <p className="text-[13px]" style={{ color: '#8E8E93' }}>Now viewing orders for</p>

          {/* Dropdown trigger */}
          <button
            className="flex items-center gap-1 px-2.5 py-1 rounded-full active:opacity-70 transition-opacity"
            style={{ background: 'rgba(0,85,165,0.10)' }}
            onClick={e => { e.stopPropagation(); setDropdownOpen(o => !o) }}
          >
            <p className="text-[13px] font-bold" style={{ color: '#0055A5' }}>{selectedAddr.label}</p>
            <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: '#0055A5' }} />
            </motion.div>
          </button>

          {/* Dropdown panel */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="absolute left-0 top-8 z-30 bg-white rounded-2xl overflow-hidden"
                style={{
                  minWidth: 260,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                  border: '1px solid rgba(0,0,0,0.07)',
                }}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                onClick={e => e.stopPropagation()}
              >
                {SUBSCRIBED_ADDRESSES.map((addr, i) => {
                  const Icon = addr.icon
                  const isSelected = addr.id === selectedAddr.id
                  return (
                    <button
                      key={addr.id}
                      className="w-full flex items-center gap-3 px-4 py-3 active:bg-ios-gray-6 text-left"
                      style={{
                        borderBottom: i < SUBSCRIBED_ADDRESSES.length - 1 ? '1px solid #F2F2F7' : 'none',
                      }}
                      onClick={() => { setSelectedAddr(addr); setDropdownOpen(false) }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: isSelected ? 'rgba(0,85,165,0.12)' : '#F2F2F7' }}>
                        <Icon className="w-4 h-4" style={{ color: isSelected ? '#0055A5' : '#8E8E93' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#1C1C1E]">{addr.label}</p>
                        <p className="text-[11px] truncate" style={{ color: '#8E8E93' }}>{addr.subtitle}</p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#0055A5' }} />
                      )}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {FILTER_TABS.map((tab, i) => (
            <button
              key={tab}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all"
              style={{
                background: activeFilter === i ? '#0055A5' : '#F2F2F7',
                color: activeFilter === i ? 'white' : '#8E8E93',
              }}
              onClick={() => setActiveFilter(i)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6">

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-4"
        >
          {[
            { label: 'Total Orders', value: '0', color: '#007AFF' },
            { label: 'Delivered',    value: '0', color: '#34C759' },
            { label: 'Upcoming',     value: '0', color: '#FF9500' },
          ].map((s, i) => (
            <div key={i} className="ios-card text-center py-3">
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-ios-gray-1 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Empty state */}
        <motion.div
          key={selectedAddr.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="ios-card flex flex-col items-center py-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-ios-gray-6 flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-ios-gray-2" />
          </div>
          <h2 className="text-[18px] font-bold text-[#1C1C1E] mb-1">No Orders Yet</h2>
          <p className="text-[13px] mb-1" style={{ color: '#0055A5', fontWeight: 600 }}>
            {selectedAddr.label}
          </p>
          <p className="text-[13px] text-ios-gray-1 leading-relaxed max-w-[220px]">
            {selectedAddr.subtitle}
          </p>
          <p className="text-[13px] text-ios-gray-1 leading-relaxed max-w-[220px] mt-2">
            Once you start a subscription, your daily deliveries will appear here.
          </p>
        </motion.div>

        {/* Upcoming deliveries */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4"
        >
          <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-2 ml-1">
            Upcoming This Week
          </p>
          <div className="space-y-2">
            {['Mon, 2 Mar', 'Tue, 3 Mar', 'Wed, 4 Mar'].map((day, i) => (
              <div key={i} className="ios-card flex items-center gap-3 opacity-50">
                <div className="w-10 h-10 rounded-xl bg-ios-gray-6 flex items-center justify-center">
                  <span className="text-[18px]">🥛</span>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[#1C1C1E]">{day}</p>
                  <p className="text-[12px] text-ios-gray-1">{selectedAddr.label} · No subscription active</p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: '#F2F2F7', color: '#8E8E93' }}>
                  Pending
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
