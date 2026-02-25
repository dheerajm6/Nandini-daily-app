import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronRight, MapPin, Clock, Gift, ArrowRight, Share2, SlidersHorizontal, Home, Users, Heart, Plus, BarChart2, Timer, ShoppingBag } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// ── Greeting based on device time ────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return { text: 'Good Morning',   emoji: '🌅' }
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', emoji: '☀️' }
  return { text: 'Good Evening', emoji: '🌆' }
}

// ── Add-on window (3 PM – 6 PM) ──────────────────────────────────────────────
function getAddOnTimeLeft() {
  const now   = new Date()
  const close = new Date(); close.setHours(18, 0, 0, 0)
  const diff  = close.getTime() - now.getTime()
  if (diff <= 0) return null
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  return { h, m, totalMins: Math.floor(diff / 60_000) }
}

const ADD_ON_QUICK = [
  { emoji: '🥛', name: 'Milk',    category: 'milk'    },
  { emoji: '🍶', name: 'Curd',    category: 'curd'    },
  { emoji: '🧈', name: 'Butter',  category: 'butter'  },
  { emoji: '🥚', name: 'Paneer',  category: 'paneer'  },
]

// ── Week calendar helpers ─────────────────────────────────────────────────────
type DayStatus = 'delivered' | 'upcoming' | 'vacation' | 'on-hold'

const STATUS = {
  delivered: { color: '#34C759', label: 'Delivered' },
  upcoming:  { color: '#007AFF', label: 'Upcoming'  },
  vacation:  { color: '#FF9500', label: 'Vacation'  },
  'on-hold': { color: '#FF3B30', label: 'On Hold'   },
}

const DAY_ABBREVS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

type CalView = 'this-week' | 'last-week' | 'this-month'

function getMidnight(d = new Date()) {
  const m = new Date(d); m.setHours(0, 0, 0, 0); return m
}

function getMondayOf(date: Date, weekOffset = 0) {
  const dow = date.getDay()
  const m = new Date(date)
  m.setDate(date.getDate() - (dow === 0 ? 6 : dow - 1) + weekOffset * 7)
  return getMidnight(m)
}

function getWeekData(weekOffset = 0) {
  const todayMid = getMidnight()
  const monday   = getMondayOf(new Date(), weekOffset)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const isToday = d.getTime() === todayMid.getTime()
    const isPast  = d.getTime() < todayMid.getTime()
    return {
      abbrev: DAY_ABBREVS[i],
      dateNum: d.getDate(),
      isToday,
      isOtherMonth: d.getMonth() !== new Date().getMonth(),
      status: (isPast ? 'delivered' : 'upcoming') as DayStatus,
    }
  })
}

function getMonthData() {
  const today    = new Date()
  const todayMid = getMidnight()
  const year     = today.getFullYear()
  const month    = today.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const start    = getMondayOf(firstDay)

  const days: { dateNum: number; isToday: boolean; isCurrentMonth: boolean; status: DayStatus }[] = []
  const d = new Date(start)
  while (d <= lastDay || days.length % 7 !== 0) {
    const isCurrent = d.getMonth() === month
    const isToday   = d.getTime() === todayMid.getTime()
    const isPast    = d.getTime() < todayMid.getTime()
    days.push({
      dateNum: d.getDate(),
      isToday,
      isCurrentMonth: isCurrent,
      status: (isPast ? 'delivered' : 'upcoming') as DayStatus,
    })
    d.setDate(d.getDate() + 1)
    if (days.length >= 42) break
  }
  return days
}

// ── Carousel slides ───────────────────────────────────────────────────────────
const CAROUSEL = [
  {
    id: 1, tag: 'Daily Fresh',
    title: 'Full Cream Milk',
    subtitle: 'Start your day the freshest way',
    gradient: ['#003B73', '#0077CC'] as [string, string],
    emoji: '🥛', category: 'milk',
  },
  {
    id: 2, tag: 'Premium',
    title: 'Pure Nandini Ghee',
    subtitle: 'Farm to your kitchen, pure gold',
    gradient: ['#92400E', '#D97706'] as [string, string],
    emoji: '✨', category: 'ghee',
  },
  {
    id: 3, tag: 'Probiotic Rich',
    title: 'Fresh Set Curd',
    subtitle: 'Thick, creamy & naturally set',
    gradient: ['#065F46', '#059669'] as [string, string],
    emoji: '🍶', category: 'curd',
  },
]

// ── Delivery addresses ────────────────────────────────────────────────────────
const ADDRESSES = [
  {
    id: 'home',
    label: 'Home',
    area: 'Koramangala',
    city: 'Bengaluru',
    Icon: Home,
    color: '#007AFF',
    bg: '#E8F4FF',
    schedule: [
      { day: 'Today',    time: '5:00 – 7:00 AM', status: 'upcoming' as DayStatus, items: 'Full Cream Milk × 1, Curd × 1' },
      { day: 'Tomorrow', time: '5:00 – 7:00 AM', status: 'upcoming' as DayStatus, items: 'Full Cream Milk × 1' },
      { day: 'Wed',      time: '5:00 – 7:00 AM', status: 'upcoming' as DayStatus, items: 'Full Cream Milk × 1, Ghee × 1' },
    ],
  },
  {
    id: 'parents',
    label: "Parents' House",
    area: 'Vijayanagar',
    city: 'Mysuru',
    Icon: Users,
    color: '#34C759',
    bg: '#E9FAF0',
    schedule: [
      { day: 'Sat',      time: '5:00 – 7:00 AM', status: 'upcoming' as DayStatus, items: 'Toned Milk × 2, Curd × 1' },
      { day: 'Sun',      time: '5:00 – 7:00 AM', status: 'upcoming' as DayStatus, items: 'Toned Milk × 2, Butter × 1' },
    ],
  },
  {
    id: 'inlaws',
    label: "In-Laws",
    area: 'Sadashivanagar',
    city: 'Bengaluru',
    Icon: Heart,
    color: '#FF2D55',
    bg: '#FFF0F3',
    schedule: [
      { day: 'Today',    time: '6:00 – 8:00 AM', status: 'upcoming' as DayStatus, items: 'Full Cream Milk × 1' },
      { day: 'Wed',      time: '6:00 – 8:00 AM', status: 'upcoming' as DayStatus, items: 'Full Cream Milk × 1, Paneer × 1' },
      { day: 'Fri',      time: '6:00 – 8:00 AM', status: 'upcoming' as DayStatus, items: 'Full Cream Milk × 1' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const navigate  = useNavigate()
  const { phone } = useApp()
  const greeting  = getGreeting()

  const [city,       setCity]       = useState('Bengaluru')
  const [slide,      setSlide]      = useState(0)
  const [calView,     setCalView]     = useState<CalView>('this-week')
  const [calExpanded, setCalExpanded] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Add-on window state
  const [addOnTime, setAddOnTime] = useState(getAddOnTimeLeft)
  const nowHour = new Date().getHours()
  const isAddOnWindow = nowHour >= 15 && nowHour < 18

  // Device location → city name
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          )
          const data = await res.json()
          const c    = data.address?.city || data.address?.town || data.address?.village
          if (c) setCity(c)
        } catch { /* keep default */ }
      },
      () => { /* permission denied */ }
    )
  }, [])

  // Countdown for add-on window — updates every minute
  useEffect(() => {
    if (!isAddOnWindow) return
    const t = setInterval(() => setAddOnTime(getAddOnTimeLeft()), 60_000)
    return () => clearInterval(t)
  }, [isAddOnWindow])

  // Auto-advance carousel every 3 s
  useEffect(() => {
    timer.current = setInterval(() => setSlide(s => (s + 1) % CAROUSEL.length), 3000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [])

  return (
    <div className="h-full overflow-y-auto bg-[#F2F2F7]">

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(160deg, #003B73 0%, #0055A5 100%)' }}>
        <div className="safe-top px-5 pt-4 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[13px] font-medium mb-0.5"
                style={{ color: 'rgba(255,255,255,0.65)' }}>
                {greeting.emoji} {greeting.text}
              </p>
              <h1 className="text-[22px] font-bold text-white tracking-[-0.5px]">
                Nandini Daily
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Bell style={{ width: 18, height: 18 }} className="text-white" />
              </button>
              <div className="w-9 h-9 rounded-full overflow-hidden"
                style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <MapPin style={{ width: 14, height: 14 }} className="text-white" />
            <span className="text-[13px] font-medium text-white">{city}</span>
            <ChevronRight style={{ width: 12, height: 12 }} className="text-white opacity-60" />
          </button>
        </div>
        <div className="h-6 rounded-t-[24px]" style={{ background: '#F2F2F7' }} />
      </div>

      <div className="px-4 -mt-2 pb-10">

        {/* ── Add to Tomorrow's Delivery (3 PM – 6 PM only) ──── */}
        <AnimatePresence>
          {isAddOnWindow && addOnTime && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1     }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="mb-4"
            >
              <div className="rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(194,113,0,0.22)' }}>

                {/* Top band */}
                <div className="flex items-center justify-between px-4 py-2.5"
                  style={{ background: 'linear-gradient(90deg, #B45309 0%, #D97706 100%)' }}>
                  <div className="flex items-center gap-1.5">
                    {/* Pulsing dot */}
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.6px]">
                      Order window open
                    </span>
                  </div>
                  {/* Countdown */}
                  <div className="flex items-center gap-1.5">
                    <Timer style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.85)' }} />
                    <span className="text-[13px] font-bold text-white">
                      {addOnTime.h > 0 ? `${addOnTime.h}h ` : ''}{addOnTime.m}m left
                    </span>
                  </div>
                </div>

                {/* Main card body */}
                <div className="bg-white px-4 pt-3.5 pb-4">
                  {/* Heading */}
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-[16px] font-bold text-[#1C1C1E] leading-tight">
                        Add to Tomorrow's Delivery
                      </p>
                      <p className="text-[12px] text-ios-gray-1 mt-0.5 leading-snug">
                        Guests coming? Add anything once — delivered with your <br />
                        <span className="font-semibold text-[#1C1C1E]">5–7 AM subscription tomorrow</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-2"
                      style={{ background: '#FFF7E6' }}>
                      <ShoppingBag style={{ width: 18, height: 18, color: '#D97706' }} />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-3" style={{ height: 1, background: '#F0F0F0' }} />

                  {/* Quick-add chips + Browse */}
                  <div className="flex items-center gap-2">
                    {ADD_ON_QUICK.map(item => (
                      <button
                        key={item.category}
                        onClick={() => navigate(`/app/products/${item.category}`)}
                        className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                      >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: '#FFF7E6', border: '1.5px solid #FDE68A' }}>
                          <span className="text-[22px]">{item.emoji}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-[#1C1C1E]">{item.name}</span>
                      </button>
                    ))}

                    {/* Browse all */}
                    <button
                      onClick={() => navigate('/app/categories')}
                      className="ml-auto flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl active:opacity-75"
                      style={{ background: '#D97706' }}
                    >
                      <Plus style={{ width: 14, height: 14, color: 'white' }} />
                      <span className="text-[12px] font-bold text-white">Browse</span>
                    </button>
                  </div>
                </div>

                {/* Tomorrow's date strip */}
                <div className="px-4 py-2.5 flex items-center gap-2"
                  style={{ background: '#FFFBF0', borderTop: '1px solid #FDE68A' }}>
                  <Clock style={{ width: 12, height: 12, color: '#D97706' }} />
                  <p className="text-[11px] font-medium" style={{ color: '#92400E' }}>
                    Delivery on{' '}
                    <span className="font-bold">
                      {new Date(Date.now() + 86_400_000).toLocaleDateString('en-IN', {
                        weekday: 'long', day: 'numeric', month: 'short'
                      })}
                    </span>
                    {' '}· 5:00 – 7:00 AM
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Week / Month Calendar ──────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }} className="ios-card mb-4">

          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-bold text-[#1C1C1E]">
              {calView === 'this-week'  ? 'This Week'  :
               calView === 'last-week'  ? 'Last Week'  : 'This Month'}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-ios-gray-1">
                {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCalExpanded(v => !v)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: calExpanded ? '#0055A5' : '#F2F2F7' }}
              >
                <SlidersHorizontal style={{ width: 14, height: 14,
                  color: calExpanded ? 'white' : '#8E8E93' }} />
              </button>
            </div>
          </div>

          {/* Filter tabs — visible when expanded */}
          <AnimatePresence>
            {calExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 mb-3">
                  {([
                    { id: 'this-week', label: 'This Week' },
                    { id: 'last-week', label: 'Last Week' },
                    { id: 'this-month', label: 'This Month' },
                  ] as { id: CalView; label: string }[]).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCalView(opt.id)}
                      className="flex-1 py-1.5 rounded-xl text-[12px] font-semibold transition-colors"
                      style={{
                        background: calView === opt.id ? '#0055A5' : '#F2F2F7',
                        color:      calView === opt.id ? 'white'    : '#8E8E93',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Week view (this-week / last-week) ── */}
          <AnimatePresence mode="wait">
            {calView !== 'this-month' ? (
              <motion.div key={calView}
                initial={{ opacity: 0, x: calView === 'last-week' ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between gap-1 mb-3">
                  {getWeekData(calView === 'last-week' ? -1 : 0).map((day) => {
                    const s = STATUS[day.status]
                    return (
                      <div key={day.abbrev}
                        className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-2xl"
                        style={{ background: day.isToday ? '#0055A5' : 'transparent',
                                 opacity: day.isOtherMonth ? 0.4 : 1 }}>
                        <span className="text-[10px] font-semibold"
                          style={{ color: day.isToday ? 'rgba(255,255,255,0.7)' : '#8E8E93' }}>
                          {day.abbrev}
                        </span>
                        <span className="text-[14px] font-bold leading-none"
                          style={{ color: day.isToday ? '#fff' : '#1C1C1E' }}>
                          {day.dateNum}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full"
                          style={{ background: day.isToday ? 'rgba(255,255,255,0.55)' : s.color }} />
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              /* ── Month view ── */
              <motion.div key="month"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Day-letter headers */}
                <div className="grid grid-cols-7 mb-1">
                  {DAY_LETTERS.map((l, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-ios-gray-1 py-1">
                      {l}
                    </div>
                  ))}
                </div>
                {/* Date grid */}
                <div className="grid grid-cols-7 gap-y-0.5 mb-3">
                  {getMonthData().map((day, i) => {
                    const s = STATUS[day.status]
                    return (
                      <div key={i}
                        className="flex flex-col items-center py-1.5 rounded-xl"
                        style={{
                          background: day.isToday ? '#0055A5' : 'transparent',
                          opacity: day.isCurrentMonth ? 1 : 0.25,
                        }}
                      >
                        <span className="text-[12px] font-semibold leading-none mb-1"
                          style={{ color: day.isToday ? '#fff' : '#1C1C1E' }}>
                          {day.dateNum}
                        </span>
                        <div className="w-1 h-1 rounded-full"
                          style={{ background: day.isToday ? 'rgba(255,255,255,0.6)' : s.color,
                                   opacity: day.isCurrentMonth ? 1 : 0 }} />
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2.5"
            style={{ borderTop: '1px solid #F0F0F0' }}>
            {(Object.entries(STATUS) as [DayStatus, typeof STATUS[DayStatus]][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: val.color }} />
                <span className="text-[11px] text-ios-gray-1 font-medium">{val.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Delivery Schedule ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }} className="mb-4">

          <div className="flex items-center justify-between mb-3">
            <p className="text-[15px] font-bold text-[#1C1C1E]">Today's Deliveries</p>
            <button className="text-[12px] font-semibold text-brand-blue">Manage all</button>
          </div>

          <div className="space-y-2.5">
            {ADDRESSES.map((addr, i) => {
              const Icon     = addr.Icon
              const today    = addr.schedule.find(d => d.day === 'Today')
              const s        = today ? STATUS[today.status] : null
              return (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + i * 0.06 }}
                  className="ios-card flex items-center gap-3"
                >
                  {/* Address icon */}
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: addr.bg }}>
                    <Icon style={{ width: 18, height: 18, color: addr.color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[14px] font-bold text-[#1C1C1E]">{addr.label}</p>
                      {s && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: `${s.color}15`, color: s.color }}>
                          {s.label}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ios-gray-1 truncate">
                      <span className="font-medium">{addr.area}, {addr.city}</span>
                    </p>
                    {today ? (
                      <p className="text-[11px] text-ios-gray-1 truncate mt-0.5">
                        {today.time} · {today.items}
                      </p>
                    ) : (
                      <p className="text-[11px] mt-0.5" style={{ color: '#C7C7CC' }}>
                        No delivery today
                      </p>
                    )}
                  </div>

                  {/* Time badge */}
                  {today && (
                    <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
                      style={{ background: `${addr.color}10` }}>
                      <Clock style={{ width: 11, height: 11, color: addr.color }} />
                      <span className="text-[11px] font-semibold" style={{ color: addr.color }}>
                        5–7 AM
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ── Discover Carousel ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }} className="mb-4">

          <p className="text-[15px] font-bold text-[#1C1C1E] mb-3">Discover</p>

          <div className="relative overflow-hidden rounded-2xl" style={{ height: 158 }}>
            <AnimatePresence mode="wait">
              {CAROUSEL.map((s, i) => i === slide ? (
                <motion.div key={s.id}
                  className="absolute inset-0 flex items-center px-5 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})` }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {/* Decorative circles */}
                  <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="absolute right-4 -bottom-10 w-28 h-28 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)' }} />

                  <div className="flex-1 pr-3 z-10">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.8px]
                                     px-2 py-1 rounded-full mb-2"
                      style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>
                      {s.tag}
                    </span>
                    <p className="text-[19px] font-bold text-white leading-tight mb-1">{s.title}</p>
                    <p className="text-[12px] mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {s.subtitle}
                    </p>
                    <button
                      onClick={() => navigate(`/app/products/${s.category}`)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white active:opacity-80"
                    >
                      <span className="text-[12px] font-bold" style={{ color: s.gradient[0] }}>
                        Order Now
                      </span>
                      <ArrowRight style={{ width: 12, height: 12, color: s.gradient[0] }} />
                    </button>
                  </div>

                  <div className="text-[70px] flex-shrink-0 z-10">{s.emoji}</div>
                </motion.div>
              ) : null)}
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-2.5">
            {CAROUSEL.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === slide ? 20 : 6, height: 6,
                  background: i === slide ? '#0055A5' : '#C7C7CC',
                }} />
            ))}
          </div>
        </motion.div>

        {/* ── Shop by Category ───────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.23 }} className="mb-4">

          <div className="flex items-center justify-between mb-3">
            <p className="text-[15px] font-bold text-[#1C1C1E]">Shop by Category</p>
            <button onClick={() => navigate('/app/categories')}
              className="text-[13px] font-semibold text-brand-blue active:opacity-60">
              See all
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Milk', file: 'milk.png', bg: '#EBF5FF', id: 'milk' },
              { name: 'Curd', file: 'curd.png', bg: '#EBF5FF', id: 'curd' },
              { name: 'Ghee', file: 'ghee.png', bg: '#EBF5FF', id: 'ghee' },
            ].map((cat, i) => (
              <motion.button key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.26 + i * 0.06, ease: [0.34, 1.3, 0.64, 1] }}
                onClick={() => navigate(`/app/products/${cat.id}`)}
                className="flex flex-col items-center gap-2 active:opacity-70 transition-opacity">
                <div className="w-full aspect-square rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{ background: cat.bg }}>
                  <img src={`/category%20images/${cat.file}`} alt={cat.name}
                    className="w-[75%] h-[75%] object-contain" />
                </div>
                <p className="text-[12px] font-semibold text-[#1C1C1E] text-center">{cat.name}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Insights Glance Card ───────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }} className="mb-4">
          <button
            onClick={() => navigate('/app/insights')}
            className="w-full text-left active:scale-[0.98] transition-transform"
          >
            <div className="ios-card overflow-hidden p-0">
              {/* Gradient accent top */}
              <div style={{ height: 3, background: 'linear-gradient(90deg, #0055A5 0%, #34C759 100%)' }} />

              <div className="px-4 pt-3 pb-4">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: '#EBF4FF' }}>
                      <BarChart2 style={{ width: 15, height: 15, color: '#0055A5' }} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#1C1C1E] leading-none">Monthly Insights</p>
                      <p className="text-[10px] text-ios-gray-1 mt-0.5">
                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[12px] font-semibold text-brand-blue">View all</span>
                    <ChevronRight style={{ width: 14, height: 14, color: '#0055A5' }} />
                  </div>
                </div>

                {/* 3 stat boxes */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { val: '₹1,240', label: 'Spent',       color: '#007AFF', bg: '#EBF4FF' },
                    { val: '18',      label: 'Deliveries',  color: '#34C759', bg: '#E9FAF0' },
                    { val: '₹220',   label: 'Saved',        color: '#FF9500', bg: '#FFF4E5' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl py-2.5 px-2 text-center"
                      style={{ background: s.bg }}>
                      <p className="text-[15px] font-bold leading-none" style={{ color: s.color }}>{s.val}</p>
                      <p className="text-[10px] font-medium mt-1" style={{ color: s.color + 'BB' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery success rate */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#F0F0F0]">
                    <div className="h-full rounded-full" style={{ width: '97%', background: '#34C759' }} />
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: '#34C759' }}>97% on-time</span>
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        {/* ── Discover KMF ───────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }} className="ios-card mb-4 overflow-hidden p-0">

          <div className="px-5 pt-5 pb-4"
            style={{ background: 'linear-gradient(135deg, #001F3D 0%, #003B73 100%)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
                <img src="/logo.jpeg" alt="KMF" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-white leading-tight">Karnataka Milk Federation</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Nandini · Est. 1984</p>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.72)' }}>
              India's second largest dairy cooperative, serving 22+ lakh farmers across Karnataka with 100% pure and natural dairy products.
            </p>
          </div>

          <div className="flex divide-x divide-[#F0F0F0]">
            {[
              { value: '22L+', label: 'Farmers'     },
              { value: '30+',  label: 'Districts'   },
              { value: '60L+', label: 'Litres/Day'  },
            ].map((s, i) => (
              <div key={i} className="flex-1 py-3 text-center">
                <p className="text-[16px] font-bold text-brand-blue">{s.value}</p>
                <p className="text-[11px] text-ios-gray-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Why Choose Nandini — static image card ─────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }} className="mb-4">
          <div style={{
            borderRadius: 20,
            overflow: 'hidden',
            height: 290,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            <img
              src="/Why%20choose%20nandini.png"
              alt="Why Choose Nandini"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </motion.div>

        {/* ── Refer & Earn ───────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(79,70,229,0.18)' }}>

          {/* Header */}
          <div className="relative px-5 pt-5 pb-5 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1D0050 0%, #4338CA 60%, #6D28D9 100%)' }}>

            {/* Decorative gift watermark */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[80px] opacity-10 rotate-12
                            select-none pointer-events-none">
              🎁
            </div>

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
                style={{ background: 'rgba(255,255,255,0.14)' }}>
                <Gift style={{ width: 11, height: 11, color: '#FCD34D' }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-white">
                  Refer & Earn
                </span>
              </div>

              {/* Headline */}
              <p className="text-white font-bold text-[22px] leading-snug tracking-[-0.5px]">
                Invite a friend.<br />
                Earn{' '}
                <span style={{ color: '#FCD34D' }}>₹50</span>
                {' '}each time.
              </p>
              <p className="text-[12px] mt-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                They subscribe · you earn · no limits
              </p>
            </div>
          </div>

          {/* Referral code row */}
          <div className="px-4 py-4 bg-white" style={{ borderBottom: '1px solid #F0F0F0' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.7px] text-ios-gray-1 mb-2">
              Your invite code
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 py-3 px-4 rounded-2xl flex items-center justify-center"
                style={{ background: '#F5F3FF', border: '1.5px dashed #A78BFA' }}>
                <span className="text-[18px] font-bold tracking-[4px]"
                  style={{ color: '#4F46E5', fontVariantNumeric: 'tabular-nums' }}>
                  NAN{phone?.slice(-4) || 'XXXX'}
                </span>
              </div>
              <button
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 active:opacity-75"
                style={{ background: '#4F46E5' }}>
                <Share2 style={{ width: 18, height: 18, color: 'white' }} />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex divide-x divide-[#F0F0F0] bg-white">
            {[
              { val: '0',    label: 'Referred'   },
              { val: '₹0',  label: 'Earned'     },
              { val: '₹50', label: 'Per invite'  },
            ].map((s, i) => (
              <div key={i} className="flex-1 py-3 text-center">
                <p className="text-[16px] font-bold text-[#1C1C1E]">{s.val}</p>
                <p className="text-[10px] text-ios-gray-1 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
