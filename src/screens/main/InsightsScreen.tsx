import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Flame, Star, Plus, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// ── All 8 Nandini products ────────────────────────────────────────────────
interface NProduct {
  id: number
  name: string
  short: string
  emoji: string
  benefit: string
  detail: string
  used: boolean
  color: string
  bg: string
}

const ALL_PRODUCTS: NProduct[] = [
  {
    id: 1, name: 'Full Cream Milk',  short: 'Full Cream', emoji: '🥛',
    benefit: 'Rich calcium & vitamin D',
    detail: 'Your daily anchor. 22 mornings strong.',
    used: true,  color: '#007AFF', bg: '#EBF4FF',
  },
  {
    id: 2, name: 'Toned Milk',       short: 'Toned',      emoji: '🥛',
    benefit: 'Lighter, same nutrition',
    detail: 'Great for chai that feels lighter without losing taste.',
    used: false, color: '#5AC8FA', bg: '#EDF9FF',
  },
  {
    id: 3, name: 'Double Toned',     short: 'Dbl Toned',  emoji: '🥛',
    benefit: 'Low fat, everyday nourishment',
    detail: 'Perfect for calorie-conscious households.',
    used: false, color: '#34C759', bg: '#E9FAF0',
  },
  {
    id: 4, name: 'Fresh Curd',       short: 'Curd',       emoji: '🍶',
    benefit: 'Billions of live cultures',
    detail: "Your gut's best ally — and already part of your home.",
    used: true,  color: '#FF9500', bg: '#FFF5E5',
  },
  {
    id: 5, name: 'Table Butter',     short: 'Butter',     emoji: '🧈',
    benefit: 'Natural A2 butterfat',
    detail: 'Richer, purer than any branded spread. Weekend parathas approved.',
    used: true,  color: '#FFD60A', bg: '#FFFBE5',
  },
  {
    id: 6, name: 'Pure Ghee',        short: 'Ghee',       emoji: '✨',
    benefit: "A good fat. Ayurveda's gold",
    detail: 'Butyric acid, brain food, and the secret to every great tadka.',
    used: true,  color: '#FF6B00', bg: '#FFF2E5',
  },
  {
    id: 7, name: 'Paneer',           short: 'Paneer',     emoji: '🧀',
    benefit: '18g protein per 100g',
    detail: 'No gym needed. Add it once a week and feel the difference.',
    used: false, color: '#FF2D55', bg: '#FFF0F3',
  },
  {
    id: 8, name: 'Skim Milk',        short: 'Skim',       emoji: '🥛',
    benefit: 'Zero fat, pure protein',
    detail: "The athlete's milk. Nothing removed except fat.",
    used: false, color: '#5856D6', bg: '#F0EFFF',
  },
]

const USED_COUNT   = ALL_PRODUCTS.filter(p => p.used).length  // 4
const TOTAL        = ALL_PRODUCTS.length                       // 8
const STREAK_DAYS  = 22
const NANDINI_SCORE = 73
const DISCOVERY    = ALL_PRODUCTS.find(p => p.id === 7)!      // Paneer

const SCORE_PILLARS = [
  { label: 'Variety',     pct: 50, tip: '4 of 8 discovered', color: '#5AC8FA' },
  { label: 'Streak',      pct: 73, tip: '22-day ritual',     color: '#34C759' },
  { label: 'Consistency', pct: 97, tip: '97% deliveries',    color: '#FFD60A' },
]

// ── Animated counter ──────────────────────────────────────────────────────
function useCounter(target: number, duration = 1500, delay = 500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const t0 = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - t0) / duration, 1)
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(t)
  }, [target, duration, delay])
  return val
}

// ── Score ring (SVG) ──────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r    = 54
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - score / 100)
  return (
    <svg width="136" height="136" viewBox="0 0 136 136" className="absolute inset-0">
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx="68" cy="68" r={r} fill="none"
        stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
      {/* Progress */}
      <motion.circle
        cx="68" cy="68" r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: dash }}
        transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
        transform="rotate(-90 68 68)"
      />
    </svg>
  )
}

// ── Constellation ─────────────────────────────────────────────────────────
function Constellation({
  selected,
  onSelect,
}: {
  selected: NProduct | null
  onSelect: (p: NProduct) => void
}) {
  const CX = 140, CY = 128, R = 90

  return (
    <div className="relative mx-auto" style={{ width: 280, height: 256 }}>
      {/* SVG connector lines from centre to used dots */}
      <svg className="absolute inset-0 pointer-events-none" width={280} height={256}>
        {ALL_PRODUCTS.map((p, i) => {
          if (!p.used) return null
          const a  = -Math.PI / 2 + i * (2 * Math.PI / TOTAL)
          const x1 = CX + R * Math.cos(a)
          const y1 = CY + R * Math.sin(a)
          return (
            <line key={i}
              x1={CX} y1={CY} x2={x1} y2={y1}
              stroke={p.color}
              strokeWidth={1.5}
              strokeOpacity={0.18}
              strokeDasharray="3 6"
            />
          )
        })}
      </svg>

      {/* Centre hub */}
      <div className="absolute" style={{
        left: CX - 8, top: CY - 8, width: 16, height: 16,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #003B73, #0055A5)',
        boxShadow: '0 0 16px rgba(0,85,165,0.45)',
      }} />

      {/* Product dots */}
      {ALL_PRODUCTS.map((p, i) => {
        const a   = -Math.PI / 2 + i * (2 * Math.PI / TOTAL)
        const x   = CX + R * Math.cos(a)
        const y   = CY + R * Math.sin(a)
        const sel = selected?.id === p.id
        return (
          <motion.button
            key={p.id}
            className="absolute flex flex-col items-center gap-[3px]"
            style={{ left: x - 26, top: y - 27, width: 52 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.07, type: 'spring', stiffness: 280, damping: 22 }}
            onClick={() => onSelect(p)}
          >
            {/* Dot */}
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              background: p.used ? p.bg : '#F2F2F7',
              border: `2px solid ${sel ? p.color : p.used ? p.color + '35' : '#E5E5EA'}`,
              boxShadow: sel
                ? `0 4px 18px ${p.color}50`
                : p.used ? `0 2px 10px ${p.color}20` : 'none',
              transition: 'all 0.2s ease',
            }}>
              <span style={{
                fontSize: 22,
                filter: p.used ? 'none' : 'grayscale(1) opacity(0.28)',
              }}>
                {p.emoji}
              </span>
              {/* Active indicator */}
              {p.used && (
                <div style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 11, height: 11, borderRadius: '50%',
                  border: '2px solid white',
                  background: p.color,
                }} />
              )}
            </div>
            {/* Label */}
            <p style={{
              fontSize: 8,
              fontWeight: 600,
              color: p.used ? '#3C3C43' : '#AEAEB2',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: 52,
            }}>
              {p.short}
            </p>
          </motion.button>
        )
      })}
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────
export default function InsightsScreen() {
  const navigate    = useNavigate()
  const { userName } = useApp()
  const displayScore = useCounter(NANDINI_SCORE)
  const [selected, setSelected] = useState<NProduct | null>(null)

  function handleTap(p: NProduct) {
    setSelected(prev => prev?.id === p.id ? null : p)
  }

  return (
    <motion.div
      className="absolute inset-0 bg-[#F2F2F7] z-10 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
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
            <h1 className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.3px]">
              Your Nandini Journey
            </h1>
            <p className="text-[12px] text-ios-gray-1">February 2026</p>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10">

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. NANDINI SCORE                                           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="ios-card mb-4 p-0 overflow-hidden"
        >
          {/* Gradient top */}
          <div className="px-5 pt-5 pb-5"
            style={{ background: 'linear-gradient(150deg, #002F5F 0%, #0055A5 100%)' }}>

            <p className="text-[10px] font-bold uppercase tracking-[1px] mb-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              Nandini Score — Feb 2026
            </p>

            {/* Ring + headline */}
            <div className="flex items-center gap-5 mb-5">
              <div className="relative w-[136px] h-[136px] flex-shrink-0">
                <ScoreRing score={NANDINI_SCORE} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[40px] font-bold text-white leading-none tracking-[-1.5px]">
                    {displayScore}
                  </p>
                  <p className="text-[10px] font-semibold mt-0.5"
                    style={{ color: 'rgba(255,255,255,0.4)' }}>
                    out of 100
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-[18px] font-bold text-white leading-snug tracking-[-0.4px]">
                  Growing steady,<br />{userName}
                </p>
                <p className="text-[12px] mt-1.5 leading-snug"
                  style={{ color: 'rgba(255,255,255,0.55)' }}>
                  You're 7 points from 80.
                </p>
                <div className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <span className="text-[13px]">🧀</span>
                  <p className="text-[11px] font-semibold"
                    style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Add Paneer → jump to 80
                  </p>
                </div>
              </div>
            </div>

            {/* Score pillars */}
            <div className="space-y-3">
              {SCORE_PILLARS.map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[11px] font-semibold"
                      style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {s.label}
                    </p>
                    <p className="text-[11px] font-bold"
                      style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {s.tip}
                    </p>
                  </div>
                  <div className="h-[6px] rounded-full"
                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. PRODUCT CONSTELLATION                                   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="ios-card mb-4 p-0 overflow-hidden"
        >
          {/* Card header */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#1C1C1E]">Your Nandini Home</p>
              <p className="text-[12px] text-ios-gray-1 mt-0.5">
                {USED_COUNT} of {TOTAL} products in your home
              </p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{ background: '#EBF4FF' }}>
              <Star style={{ width: 11, height: 11, color: '#007AFF' }} />
              <p className="text-[12px] font-bold text-brand-blue ml-0.5">
                {USED_COUNT}/{TOTAL}
              </p>
            </div>
          </div>

          {/* Constellation */}
          <Constellation selected={selected} onSelect={handleTap} />

          {/* Tooltip / hint */}
          <div className="px-4 pb-5" style={{ minHeight: 68 }}>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{
                    background: selected.bg,
                    border: `1px solid ${selected.color}25`,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{selected.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-bold text-[#1C1C1E]">
                        {selected.name}
                      </p>
                      {selected.used && (
                        <div className="px-1.5 py-0.5 rounded-full"
                          style={{ background: selected.color + '20' }}>
                          <p className="text-[9px] font-bold"
                            style={{ color: selected.color }}>
                            IN HOME
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] text-ios-gray-1 leading-tight mt-0.5">
                      {selected.detail}
                    </p>
                  </div>
                  {!selected.used && (
                    <button
                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
                      style={{ background: selected.color }}>
                      <Plus style={{ width: 11, height: 11, color: 'white' }} />
                      <p className="text-[11px] font-bold text-white">Add</p>
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-[12px] text-center py-3"
                  style={{ color: '#AEAEB2' }}
                >
                  Tap any product to learn more ·{' '}
                  <span style={{ color: '#C7C7CC' }}>
                    {TOTAL - USED_COUNT} left to discover
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. STREAK  +  DISCOVERY  (side by side)                   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="flex gap-3 mb-4">

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 ios-card p-0 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3"
              style={{ background: 'linear-gradient(145deg, #FF5E00, #FF9500)' }}>
              <Flame className="text-white mb-2" style={{ width: 22, height: 22 }} />
              <p className="text-[42px] font-bold text-white leading-none tracking-[-2px]">
                {STREAK_DAYS}
              </p>
              <p className="text-[11px] font-semibold mt-1"
                style={{ color: 'rgba(255,255,255,0.65)' }}>
                morning streak
              </p>
            </div>
            <div className="px-4 py-3 bg-white">
              <p className="text-[12px] font-bold text-[#1C1C1E]">Daily ritual built</p>
              <p className="text-[11px] text-ios-gray-1 mt-0.5 leading-snug">
                Fresh dairy, every morning. Don't break it.
              </p>
            </div>
          </motion.div>

          {/* Discovery */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 ios-card p-0 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-4 bg-white">
              <div className="flex items-center gap-1 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF2D55' }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.6px]"
                  style={{ color: '#FF2D55' }}>
                  Not discovered
                </p>
              </div>
              <span style={{ fontSize: 34 }}>{DISCOVERY.emoji}</span>
              <p className="text-[14px] font-bold text-[#1C1C1E] mt-1 leading-tight">
                {DISCOVERY.name}
              </p>
              <p className="text-[11px] text-ios-gray-1 mt-1 leading-snug">
                {DISCOVERY.benefit}
              </p>
              <button
                className="mt-3 w-full py-2 rounded-xl flex items-center justify-center gap-1.5"
                style={{
                  background: '#FFF0F3',
                  border: '1px solid rgba(255,45,85,0.2)',
                }}
              >
                <Plus style={{ width: 11, height: 11, color: '#FF2D55' }} />
                <p className="text-[12px] font-bold" style={{ color: '#FF2D55' }}>
                  Add to home
                </p>
              </button>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. KITCHEN STORY                                           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="ios-card mb-4 p-0 overflow-hidden"
        >
          <div className="px-5 pt-5 pb-5"
            style={{ background: 'linear-gradient(150deg, #FFFCF0 0%, #FFF8E1 100%)' }}>

            <p className="text-[10px] font-bold uppercase tracking-[0.8px] mb-3"
              style={{ color: '#FF9500' }}>
              🏠 {userName}'s kitchen this month
            </p>

            <p className="text-[15px] text-[#1C1C1E] leading-relaxed font-medium">
              Your home had fresh milk on{' '}
              <span className="font-bold" style={{ color: '#007AFF' }}>22 mornings</span>,
              gut-friendly curd through the week, golden ghee in every tadka, and butter on
              those weekend parathas.{' '}
              <span className="font-bold" style={{ color: '#FF9500' }}>
                A proper Nandini kitchen.
              </span>
            </p>

            {/* Nudge */}
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl px-3.5 py-3"
              style={{ background: 'rgba(255,149,0,0.1)' }}>
              <span className="text-[15px] mt-0.5">💡</span>
              <div className="flex-1">
                <p className="text-[12px] leading-snug" style={{ color: '#CC6600' }}>
                  Add Paneer this month and your kitchen unlocks{' '}
                  <span className="font-bold">4 more dishes</span> — palak paneer, paneer
                  butter masala, bhurji & more.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. CATEGORY BALANCE                                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="ios-card mb-2"
        >
          <p className="text-[14px] font-bold text-[#1C1C1E] mb-4">Home Balance</p>

          {[
            {
              cat: 'Liquid Dairy',   emoji: '🥛', covered: 1, total: 4,
              color: '#007AFF', bg: '#EBF4FF',
              note: 'Full Cream covered. Toned, Dbl Toned & Skim await.',
            },
            {
              cat: 'Fermented',      emoji: '🍶', covered: 1, total: 1,
              color: '#FF9500', bg: '#FFF5E5',
              note: 'Curd on point. Your gut is happy.',
            },
            {
              cat: 'Good Fats',      emoji: '✨', covered: 2, total: 2,
              color: '#FF6B00', bg: '#FFF2E5',
              note: 'Butter + Ghee. Full marks.',
            },
            {
              cat: 'Protein',        emoji: '🧀', covered: 0, total: 1,
              color: '#FF2D55', bg: '#FFF0F3',
              note: 'Paneer missing. Add it to complete this.',
            },
          ].map((row, i) => {
            const pct = Math.round((row.covered / row.total) * 100)
            return (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: row.bg }}>
                      <span style={{ fontSize: 16 }}>{row.emoji}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1C1C1E] leading-none">
                        {row.cat}
                      </p>
                      <p className="text-[10px] text-ios-gray-1 mt-0.5">{row.note}</p>
                    </div>
                  </div>
                  <p className="text-[13px] font-bold flex-shrink-0 ml-2"
                    style={{ color: pct === 100 ? '#34C759' : row.color }}>
                    {row.covered}/{row.total}
                  </p>
                </div>
                <div className="h-2 rounded-full ml-10"
                  style={{ background: '#F2F2F7' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: pct === 100 ? '#34C759' : row.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )
          })}
        </motion.div>

      </div>
    </motion.div>
  )
}
