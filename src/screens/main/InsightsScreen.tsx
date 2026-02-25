import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, Package, Flame, BadgeIndianRupee, CalendarCheck } from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────
type Period = 'Week' | 'Month' | '3M' | '6M'
const PERIODS: Period[] = ['Week', 'Month', '3M', '6M']
const PERIOD_LABELS: Record<Period, string> = {
  Week: 'This Week', Month: 'This Month', '3M': 'Last 3 Months', '6M': 'Last 6 Months',
}

const CHART_DATA: Record<Period, { bars: number[]; labels: string[] }> = {
  Week:  {
    bars:   [60, 80, 70, 100, 85, 90, 75],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  Month: {
    bars:   [55, 70, 60, 85, 75, 90, 65, 80, 70, 95, 85, 75],
    labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23'],
  },
  '3M':  {
    bars:   [65, 80, 70, 85, 90, 75, 88, 70, 60, 85, 78, 90],
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
  },
  '6M':  {
    bars:   [60, 70, 80, 75, 85, 90],
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
  },
}

const STATS: Record<Period, {
  spend: string; deliveries: number; saved: string; streak: number; trend: number
}> = {
  Week:  { spend: '₹476',   deliveries: 7,   saved: '₹84',    streak: 12, trend: +8  },
  Month: { spend: '₹1,240', deliveries: 18,  saved: '₹220',   streak: 18, trend: +12 },
  '3M':  { spend: '₹3,680', deliveries: 54,  saved: '₹650',   streak: 18, trend: -3  },
  '6M':  { spend: '₹7,120', deliveries: 106, saved: '₹1,280', streak: 18, trend: +5  },
}

const TOP_PRODUCTS = [
  { name: 'Full Cream Milk 1L', orders: 18, pct: 100, color: '#007AFF', emoji: '🥛' },
  { name: 'Fresh Curd 400g',    orders: 12, pct: 67,  color: '#FF9500', emoji: '🍶' },
  { name: 'Pure Ghee 500ml',    orders: 4,  pct: 22,  color: '#FF2D55', emoji: '✨' },
  { name: 'Table Butter 100g',  orders: 3,  pct: 17,  color: '#34C759', emoji: '🧈' },
]

const ADDRESS_BREAKDOWN = [
  { label: 'Home',           city: 'Bengaluru', pct: 60, orders: 11, color: '#007AFF', bg: '#EBF4FF' },
  { label: "Parents' House", city: 'Mysuru',    pct: 25, orders: 4,  color: '#34C759', bg: '#E9FAF0' },
  { label: 'In-Laws',        city: 'Bengaluru', pct: 15, orders: 3,  color: '#FF2D55', bg: '#FFF0F3' },
]

// ─────────────────────────────────────────────────────────────────────────────
export default function InsightsScreen() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<Period>('Month')

  const stats  = STATS[period]
  const chart  = CHART_DATA[period]
  const maxBar = Math.max(...chart.bars)

  return (
    <motion.div
      className="absolute inset-0 bg-[#F2F2F7] z-10 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white flex-shrink-0"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 px-4 safe-top pb-3 pt-4">
          <button
            onClick={() => navigate('/app/home')}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-ios-gray-6"
          >
            <ArrowLeft className="w-5 h-5 text-brand-blue" />
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.3px]">Insights</h1>
            <p className="text-[12px] text-ios-gray-1">Your delivery & spend summary</p>
          </div>
        </div>

        {/* Period tabs */}
        <div className="flex px-4 pb-3 gap-2">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                background: period === p ? '#0055A5' : '#F2F2F7',
                color:      period === p ? 'white'   : '#8E8E93',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10">

        {/* ── Hero Summary Card ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={period}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="ios-card mb-4 overflow-hidden p-0"
          >
            {/* Top section — big spend */}
            <div className="px-5 pt-5 pb-4"
              style={{ background: 'linear-gradient(135deg, #0055A5 0%, #0077CC 100%)' }}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.5px] mb-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}>
                {PERIOD_LABELS[period]}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[38px] font-bold text-white leading-none tracking-[-1px]">
                    {stats.spend}
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Total spend
                  </p>
                </div>
                {/* Trend badge */}
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full mb-1"
                  style={{
                    background: stats.trend >= 0
                      ? 'rgba(255,59,48,0.2)'
                      : 'rgba(52,199,89,0.2)',
                  }}>
                  {stats.trend >= 0
                    ? <TrendingUp style={{ width: 13, height: 13, color: '#FF6B6B' }} />
                    : <TrendingDown style={{ width: 13, height: 13, color: '#34C759' }} />
                  }
                  <span className="text-[12px] font-bold"
                    style={{ color: stats.trend >= 0 ? '#FF6B6B' : '#34C759' }}>
                    {stats.trend >= 0 ? '+' : ''}{stats.trend}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom stats row */}
            <div className="flex divide-x divide-[#F0F0F0] bg-white">
              {[
                { Icon: Package,          val: `${stats.deliveries}`,    label: 'Deliveries', color: '#34C759' },
                { Icon: BadgeIndianRupee, val: stats.saved,               label: 'You Saved',  color: '#FF9500' },
                { Icon: Flame,            val: `${stats.streak}d`,        label: 'Streak',     color: '#FF2D55' },
              ].map((s, i) => {
                const Icon = s.Icon
                return (
                  <div key={i} className="flex-1 flex flex-col items-center py-3.5 gap-1">
                    <Icon style={{ width: 16, height: 16, color: s.color }} />
                    <p className="text-[15px] font-bold text-[#1C1C1E] leading-none">{s.val}</p>
                    <p className="text-[10px] text-ios-gray-1 font-medium">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Activity Chart ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`chart-${period}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.05 }}
            className="ios-card mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] font-bold text-[#1C1C1E]">Delivery Activity</p>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: '#E9FAF0' }}>
                <CalendarCheck style={{ width: 12, height: 12, color: '#34C759' }} />
                <span className="text-[11px] font-bold text-[#34C759]">97% success</span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1.5 mb-2" style={{ height: 80 }}>
              {chart.bars.map((val, i) => {
                const isLast = i === chart.bars.length - 1
                const heightPx = Math.max(4, (val / maxBar) * 80)
                return (
                  <motion.div
                    key={`${period}-bar-${i}`}
                    className="flex-1 rounded-lg"
                    initial={{ height: 0 }}
                    animate={{ height: heightPx }}
                    transition={{ delay: i * 0.03, duration: 0.4, ease: 'easeOut' }}
                    style={{
                      background: isLast
                        ? 'linear-gradient(180deg, #0077CC, #0055A5)'
                        : 'linear-gradient(180deg, #C7DCFF, #D8E8FF)',
                      minWidth: 0,
                    }}
                  />
                )
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-1.5">
              {chart.labels.map((l, i) => (
                <p key={i} className="flex-1 text-center text-[9px] font-medium text-ios-gray-1">
                  {l}
                </p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Top Products ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="ios-card mb-4"
        >
          <p className="text-[14px] font-bold text-[#1C1C1E] mb-4">Most Ordered</p>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[22px] flex-shrink-0 w-8 text-center">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[13px] font-semibold text-[#1C1C1E] truncate pr-2">{p.name}</p>
                    <span className="text-[12px] font-bold flex-shrink-0"
                      style={{ color: p.color }}>
                      {p.orders}×
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F2F2F7' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: p.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }}
                      transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Deliveries by Address ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="ios-card mb-4"
        >
          <p className="text-[14px] font-bold text-[#1C1C1E] mb-4">Deliveries by Address</p>
          <div className="space-y-3">
            {ADDRESS_BREAKDOWN.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* Icon dot */}
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: a.bg }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-[13px] font-semibold text-[#1C1C1E] leading-none">{a.label}</p>
                      <p className="text-[10px] text-ios-gray-1 mt-0.5">{a.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold leading-none" style={{ color: a.color }}>{a.pct}%</p>
                      <p className="text-[10px] text-ios-gray-1 mt-0.5">{a.orders} orders</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F2F2F7' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: a.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${a.pct}%` }}
                      transition={{ delay: 0.18 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Savings Card ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ios-card overflow-hidden p-0"
        >
          <div className="px-5 py-5"
            style={{ background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.8px] mb-2"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              You've saved vs retail prices
            </p>
            <p className="text-[36px] font-bold text-white leading-none tracking-[-1px]">
              {stats.saved}
            </p>
            <p className="text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
              by subscribing instead of buying retail
            </p>
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <span className="text-[13px]">💡</span>
              <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Keep your streak going — you're saving more each month!
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
