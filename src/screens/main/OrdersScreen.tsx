import { motion } from 'framer-motion'
import { Package, Filter, ChevronRight } from 'lucide-react'

const FILTER_TABS = ['All', 'Delivered', 'Upcoming', 'Cancelled']

export default function OrdersScreen() {
  return (
    <div className="h-full overflow-y-auto bg-ios-gray-6">
      {/* Header */}
      <div className="bg-white safe-top px-5 pb-3 pt-4"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-[-0.4px]">Orders</h1>
            <p className="text-[13px] text-ios-gray-1">Your delivery history</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-ios-gray-6 flex items-center justify-center">
            <Filter className="w-4.5 h-4.5 text-ios-gray-1" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab, i) => (
            <button
              key={tab}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all"
              style={{
                background: i === 0 ? '#0055A5' : '#F2F2F7',
                color: i === 0 ? 'white' : '#8E8E93',
              }}
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
            { label: 'Delivered', value: '0', color: '#34C759' },
            { label: 'Upcoming', value: '0', color: '#FF9500' },
          ].map((s, i) => (
            <div key={i} className="ios-card text-center py-3">
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-ios-gray-1 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Empty state */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="ios-card flex flex-col items-center py-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-ios-gray-6 flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-ios-gray-2" />
          </div>
          <h2 className="text-[18px] font-bold text-[#1C1C1E] mb-2">No Orders Yet</h2>
          <p className="text-[14px] text-ios-gray-1 leading-relaxed max-w-[220px]">
            Once you start a subscription, your daily deliveries will appear here.
          </p>
        </motion.div>

        {/* Upcoming deliveries (placeholder) */}
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
            {['Mon, 26 Feb', 'Tue, 27 Feb', 'Wed, 28 Feb'].map((day, i) => (
              <div key={i} className="ios-card flex items-center gap-3 opacity-50">
                <div className="w-10 h-10 rounded-xl bg-ios-gray-6 flex items-center justify-center">
                  <span className="text-[18px]">🥛</span>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[#1C1C1E]">{day}</p>
                  <p className="text-[12px] text-ios-gray-1">No subscription active</p>
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
