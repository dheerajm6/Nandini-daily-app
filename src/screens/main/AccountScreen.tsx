import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  User, MapPin, Bell, Shield, HelpCircle, Star, LogOut,
  ChevronRight, Phone, Gift, X, Copy, Check, Home,
  Briefcase, Edit2, MessageCircle, PhoneCall, ChevronDown, Package, LayoutGrid,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

type SheetType = 'personal' | 'addresses' | 'phone' | 'notifications' | 'offers' | 'help' | 'rate' | 'privacy' | 'categories' | null

// ── Reusable bottom sheet wrapper ─────────────────────────────────────────────
function Sheet({ open, onClose, title, children }: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute bottom-0 inset-x-0 z-50 bg-white"
            style={{ borderRadius: '24px 24px 0 0', maxHeight: '88%', display: 'flex', flexDirection: 'column' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
            </div>
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 pt-2 pb-4 flex-shrink-0">
              <p className="text-[18px] font-bold text-[#1C1C1E]">{title}</p>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F2F2F7]">
                <X style={{ width: 16, height: 16, color: '#8E8E93' }} />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 pb-8 px-5">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── iOS Toggle ────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative flex-shrink-0 transition-colors"
      style={{
        width: 51, height: 31,
        background: on ? '#34C759' : '#E5E5EA',
        borderRadius: 999,
      }}
    >
      <motion.div
        className="absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    </button>
  )
}

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #F2F2F7' }}>
      <button className="w-full flex items-center justify-between py-3.5 text-left"
        onClick={() => setOpen(o => !o)}>
        <p className="text-[14px] font-semibold text-[#1C1C1E] flex-1 pr-3">{q}</p>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown style={{ width: 16, height: 16, color: '#8E8E93' }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-[13px] leading-relaxed pb-3.5" style={{ color: '#636366' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Initials avatar ───────────────────────────────────────────────────────────
function Initials({ name, size = 64 }: { name: string; size?: number }) {
  const letters = name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('')
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 rounded-2xl"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #003B73, #0077CC)',
        fontSize: size * 0.35,
        fontWeight: 700,
        color: 'white',
        letterSpacing: '-0.5px',
      }}
    >
      {letters}
    </div>
  )
}

// ── Saved addresses data ──────────────────────────────────────────────────────
const SAVED_ADDRESSES = [
  { id: 'home',  label: 'Home',        sub: 'Flat 4B, Sunshine Apts, Koramangala, Bangalore 560034', Icon: Home,      color: '#007AFF' },
  { id: 'work',  label: 'Work',        sub: 'No. 12, 3rd Floor, Prestige Tower, MG Road, Bangalore 560001', Icon: Briefcase, color: '#FF9500' },
  { id: 'other', label: "Mum's Place", sub: '22A, 5th Cross, Rajajinagar, Bangalore 560010',         Icon: MapPin,    color: '#34C759' },
]

// ── Main component ────────────────────────────────────────────────────────────
export default function AccountScreen() {
  const navigate = useNavigate()
  const { phone, setPhone, userName, setUserName, userMode, switchMode, enabledCategories, setEnabledCategories } = useApp()

  const [openSheet, setOpenSheet] = useState<SheetType>(null)

  // Personal details
  const [draftName,  setDraftName]  = useState(userName)
  const [draftEmail, setDraftEmail] = useState('akash.m@gmail.com')
  const [savedEmail, setSavedEmail] = useState('akash.m@gmail.com')

  // Change number
  const [newPhone,   setNewPhone]   = useState('')
  const [otpSent,    setOtpSent]    = useState(false)

  // Notifications
  const [notifs, setNotifs] = useState({ delivery: true, offers: true, insights: false, reminders: true })

  // Rating
  const [rating,    setRating]    = useState(0)
  const [hovered,   setHovered]   = useState(0)
  const [feedback,  setFeedback]  = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Copy referral
  const [copied, setCopied] = useState(false)
  const referralCode = `${userName.toUpperCase().replace(/\s/g, '')}50`

  function open(sheet: SheetType) { setOpenSheet(sheet) }
  function close() { setOpenSheet(null) }

  function savePersonal() {
    setUserName(draftName.trim() || userName)
    setSavedEmail(draftEmail)
    close()
  }

  function copyReferral() {
    navigator.clipboard?.writeText(referralCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function submitRating() {
    if (rating > 0) setSubmitted(true)
  }

  const ALL_CATS = [
    { id: 'milk',           name: 'Milk',               file: 'milk.png',                bg: '#EBF5FF' },
    { id: 'curd',           name: 'Curd',               file: 'curd.png',                bg: '#FFFBEB' },
    { id: 'paneer',         name: 'Paneer & Cheese',    file: 'Paneer&Cheese.png',       bg: '#FFF0E6' },
    { id: 'milk-powder',    name: 'Milk Powder',        file: 'Milk-powder.png',         bg: '#F5F5FF' },
    { id: 'ice-creams',     name: 'Ice Creams',         file: 'Ice Creams.png',          bg: '#FFF0F7' },
    { id: 'ghee',           name: 'Ghee',               file: 'ghee.png',                bg: '#FFF7E6' },
    { id: 'butter',         name: 'Butter',             file: 'butter.png',              bg: '#FFF3E0' },
    { id: 'flavoured-milk', name: 'Flavoured Milk',     file: 'Flavoured Milk.png',      bg: '#F3EEFF' },
    { id: 'sweets',         name: 'Sweets',             file: 'sweets.png',              bg: '#FFE9EE' },
    { id: 'chocolates',     name: 'Chocolates',         file: 'chocolates.png',          bg: '#FBF0E8' },
    { id: 'bakery',         name: 'Bakery',             file: 'bakery.png',              bg: '#FEFBF0' },
    { id: 'namkeen',        name: 'Namkeen',            file: 'Namkeen.png',             bg: '#F0FFF4' },
    { id: 'rusk',           name: 'Rusk & Cookies',     file: 'Rusk&Cookies.png',        bg: '#FFFDE6' },
    { id: 'instant-mix',    name: 'Instant Mix',        file: 'Instant mix.png',         bg: '#E8F7F7' },
    { id: 'buttermilk',     name: 'Buttermilk & Lassi', file: 'butter milk & lassi.png', bg: '#F0FBF4' },
    { id: 'soda',           name: 'Soda Drink',         file: 'Soda Drink.png',          bg: '#E6FBFF' },
    { id: 'good-life',      name: 'Good Life',          file: 'nandini-goodlife.png',    bg: '#E8F7EE' },
    { id: 'merchandise',    name: 'Merchandise',        file: 'Merchandise.png',         bg: '#F0F0FF' },
  ]

  const MENU_SECTIONS = [
    {
      title: 'My Account',
      items: [
        { icon: Package, label: 'My Orders',            sub: 'Delivery history & upcoming',                    color: '#5856D6', sheet: null             as SheetType, nav: '/app/orders' },
        { icon: User,    label: 'Personal Details',     sub: `${userName} · ${savedEmail}`,                    color: '#007AFF', sheet: 'personal'       as SheetType, nav: null },
        { icon: MapPin,  label: 'Saved Addresses',      sub: `${SAVED_ADDRESSES.length} addresses saved`,      color: '#34C759', sheet: 'addresses'      as SheetType, nav: null },
        { icon: Phone,   label: 'Change Number',        sub: `+91 ${phone || 'XXXXXXXXXX'}`,                   color: '#FF9500', sheet: 'phone'          as SheetType, nav: null },
        ...(userMode === 'business' ? [{ icon: LayoutGrid, label: 'Categories', sub: `${enabledCategories.length} of ${ALL_CATS.length} enabled`, color: '#0055A5', sheet: 'categories' as SheetType, nav: null }] : []),
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications',     sub: `${Object.values(notifs).filter(Boolean).length} of 4 enabled`, color: '#5856D6', sheet: 'notifications' as SheetType, nav: null },
        { icon: Gift, label: 'Offers & Referrals', sub: `Code: ${referralCode}`,                                        color: '#FF2D55', sheet: 'offers'        as SheetType, nav: null },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', sub: 'FAQs, chat, call',          color: '#007AFF', sheet: 'help'    as SheetType, nav: null },
        { icon: Star,       label: 'Rate the App',   sub: rating > 0 ? `You rated ${rating}★` : 'Share your feedback', color: '#FF9500', sheet: 'rate' as SheetType, nav: null },
        { icon: Shield,     label: 'Privacy Policy', sub: 'How we protect your data',  color: '#34C759', sheet: 'privacy' as SheetType, nav: null },
      ],
    },
  ]

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto bg-ios-gray-6">

        {/* Header */}
        <div className="bg-white safe-top px-5 pb-4 pt-4"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
          <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-[-0.4px]">Account</h1>
        </div>

        <div className="px-4 pt-4 pb-6">

          {/* Profile card */}
          <motion.button
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ios-card flex items-center gap-4 mb-6 w-full text-left active:opacity-80 transition-opacity"
            onClick={() => open('personal')}
          >
            <Initials name={userName} size={64} />
            <div className="flex-1">
              <h2 className="text-[18px] font-bold text-[#1C1C1E] leading-tight">{userName}</h2>
              <p className="text-[13px] text-ios-gray-1">+91 {phone || 'XXXXXXXXXX'}</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#636366' }}>{savedEmail}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-2 h-2 rounded-full bg-[#34C759]" />
                <span className="text-[12px] font-medium" style={{ color: '#34C759' }}>Active Member</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,85,165,0.08)' }}>
              <Edit2 style={{ width: 15, height: 15, color: '#0055A5' }} />
            </div>
          </motion.button>

          {/* ── Individual / Business mode card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="ios-card mb-4 p-0 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3">
              <p className="text-[12px] font-bold uppercase tracking-[0.6px] mb-0.5" style={{ color: '#8E8E93' }}>Account Type</p>
              <p className="text-[13px]" style={{ color: '#636366' }}>
                {userMode === 'individual'
                  ? 'Switch to Business for bulk orders, invoices & supply management'
                  : 'Switch to Individual for daily home delivery subscriptions'}
              </p>
            </div>
            <div className="flex p-1 mx-4 mb-4 rounded-2xl gap-1" style={{ background: '#F2F2F7' }}>
              {([
                { mode: 'individual', icon: '🏠', label: 'Individual', sub: 'Home delivery' },
                { mode: 'business',   icon: '🏢', label: 'Business',   sub: 'Café / Restaurant' },
              ] as { mode: 'individual' | 'business'; icon: string; label: string; sub: string }[]).map(opt => {
                const isActive = userMode === opt.mode
                return (
                  <button key={opt.mode}
                    className="flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all"
                    style={{
                      background: isActive ? 'white' : 'transparent',
                      boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                    }}
                    onClick={() => switchMode(opt.mode)}
                  >
                    <span className="text-[20px] mb-0.5">{opt.icon}</span>
                    <p className="text-[13px] font-bold" style={{ color: isActive ? '#0055A5' : '#8E8E93' }}>{opt.label}</p>
                    <p className="text-[10px]" style={{ color: isActive ? '#636366' : '#AEAEB2' }}>{opt.sub}</p>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Menu sections */}
          {MENU_SECTIONS.map((section, si) => (
            <motion.div key={section.title}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + si * 0.07 }}
              className="mb-4"
            >
              <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-2 ml-1">
                {section.title}
              </p>
              <div className="ios-card p-0 overflow-hidden">
                {section.items.map((item, ii) => {
                  const Icon = item.icon
                  return (
                    <button key={item.label}
                      className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-ios-gray-6 transition-colors text-left"
                      style={{ borderBottom: ii < section.items.length - 1 ? '0.5px solid #E5E5EA' : 'none' }}
                      onClick={() => item.nav ? navigate(item.nav) : open(item.sheet)}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}18` }}>
                        <Icon style={{ width: 18, height: 18, color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-[#1C1C1E] leading-tight">{item.label}</p>
                        <p className="text-[12px] text-ios-gray-1 truncate">{item.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ios-gray-3 flex-shrink-0" />
                    </button>
                  )
                })}
              </div>
            </motion.div>
          ))}

          <p className="text-center text-[12px] text-ios-gray-2 mb-4">
            Nandini Daily v1.0.0 · Karnataka Milk Federation
          </p>

          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)' }}
          >
            <LogOut style={{ width: 18, height: 18, color: '#FF3B30' }} />
            <span className="text-[15px] font-semibold" style={{ color: '#FF3B30' }}>Log Out</span>
          </motion.button>
        </div>
      </div>

      {/* ── Personal Details Sheet ────────────────────────────────── */}
      <Sheet open={openSheet === 'personal'} onClose={close} title="Personal Details">
        <div className="flex flex-col items-center mb-6">
          <Initials name={draftName || userName} size={80} />
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1.5" style={{ color: '#8E8E93' }}>Full Name</p>
        <input
          className="w-full px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-[#1C1C1E] outline-none mb-4"
          style={{ background: '#F2F2F7', border: '1.5px solid transparent' }}
          value={draftName}
          onChange={e => setDraftName(e.target.value)}
          placeholder="Your name"
        />

        <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1.5" style={{ color: '#8E8E93' }}>Email Address</p>
        <input
          className="w-full px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-[#1C1C1E] outline-none mb-4"
          style={{ background: '#F2F2F7' }}
          value={draftEmail}
          onChange={e => setDraftEmail(e.target.value)}
          placeholder="your@email.com"
          type="email"
        />

        <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1.5" style={{ color: '#8E8E93' }}>Mobile Number</p>
        <div className="w-full px-4 py-3.5 rounded-2xl mb-6 flex items-center gap-2"
          style={{ background: '#F2F2F7' }}>
          <span className="text-[15px] font-semibold text-[#1C1C1E]">+91 {phone || 'XXXXXXXXXX'}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold ml-auto"
            style={{ background: '#E9FAF0', color: '#22A85A' }}>Verified</span>
        </div>

        <button
          onClick={savePersonal}
          className="w-full py-4 rounded-2xl text-[15px] font-bold text-white"
          style={{ background: 'linear-gradient(90deg, #003B73, #0077CC)' }}
        >
          Save Changes
        </button>
      </Sheet>

      {/* ── Saved Addresses Sheet ─────────────────────────────────── */}
      <Sheet open={openSheet === 'addresses'} onClose={close} title="Saved Addresses">
        <div className="space-y-3 mb-6">
          {SAVED_ADDRESSES.map(addr => {
            const Icon = addr.Icon
            return (
              <div key={addr.id} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: '#F8F8F8', border: '1px solid #F0F0F0' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${addr.color}15` }}>
                  <Icon style={{ width: 18, height: 18, color: addr.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[14px] font-bold text-[#1C1C1E]">{addr.label}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: '#E9FAF0', color: '#22A85A' }}>Active</span>
                  </div>
                  <p className="text-[12px] leading-snug" style={{ color: '#636366' }}>{addr.sub}</p>
                </div>
              </div>
            )
          })}
        </div>

        <button className="w-full py-4 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2"
          style={{ background: '#F2F2F7', color: '#0055A5' }}>
          <span className="text-[18px] font-light leading-none">+</span>
          Add New Address
        </button>
      </Sheet>

      {/* ── Change Number Sheet ───────────────────────────────────── */}
      <Sheet open={openSheet === 'phone'} onClose={close} title="Change Number">
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-6"
          style={{ background: '#FFF9E6', border: '1px solid #FFE066' }}>
          <span className="text-[20px]">⚠️</span>
          <p className="text-[12px] leading-snug" style={{ color: '#92620A' }}>
            Your existing subscriptions and wallet balance will move to the new number.
          </p>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1.5" style={{ color: '#8E8E93' }}>Current Number</p>
        <div className="px-4 py-3.5 rounded-2xl mb-4" style={{ background: '#F2F2F7' }}>
          <p className="text-[15px] font-semibold" style={{ color: '#8E8E93' }}>+91 {phone || 'XXXXXXXXXX'}</p>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1.5" style={{ color: '#8E8E93' }}>New Number</p>
        <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl mb-6"
          style={{ background: '#F2F2F7' }}>
          <span className="text-[15px] font-bold text-[#1C1C1E]">+91</span>
          <input
            className="flex-1 bg-transparent text-[15px] font-semibold text-[#1C1C1E] outline-none"
            placeholder="Enter new number"
            type="tel"
            maxLength={10}
            value={newPhone}
            onChange={e => { setNewPhone(e.target.value); setOtpSent(false) }}
          />
        </div>

        {otpSent ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-4"
            style={{ background: '#E9FAF0' }}>
            <Check style={{ width: 16, height: 16, color: '#22A85A' }} />
            <p className="text-[13px] font-semibold" style={{ color: '#22A85A' }}>OTP sent to +91 {newPhone}</p>
          </div>
        ) : null}

        <button
          onClick={() => { if (newPhone.length === 10) setOtpSent(true) }}
          className="w-full py-4 rounded-2xl text-[15px] font-bold text-white"
          style={{ background: newPhone.length === 10 ? 'linear-gradient(90deg, #003B73, #0077CC)' : '#D1D1D6' }}
        >
          {otpSent ? 'Resend OTP' : 'Send OTP'}
        </button>
      </Sheet>

      {/* ── Notifications Sheet ───────────────────────────────────── */}
      <Sheet open={openSheet === 'notifications'} onClose={close} title="Notifications">
        {([
          { key: 'delivery',  label: 'Delivery Alerts',   sub: 'Your milk is on the way, delivered etc.' },
          { key: 'offers',    label: 'Offers & Deals',    sub: 'Exclusive discounts and seasonal offers' },
          { key: 'insights',  label: 'Weekly Insights',   sub: 'Your consumption summary every Sunday' },
          { key: 'reminders', label: 'Order Reminders',   sub: 'Nudges before subscription renews' },
        ] as { key: keyof typeof notifs; label: string; sub: string }[]).map((n, i, arr) => (
          <div key={n.key}
            className="flex items-center gap-3 py-4"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid #F2F2F7' : 'none' }}>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-[#1C1C1E]">{n.label}</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#8E8E93' }}>{n.sub}</p>
            </div>
            <Toggle
              on={notifs[n.key]}
              onChange={v => setNotifs(prev => ({ ...prev, [n.key]: v }))}
            />
          </div>
        ))}
      </Sheet>

      {/* ── Offers & Referrals Sheet ──────────────────────────────── */}
      <Sheet open={openSheet === 'offers'} onClose={close} title="Offers & Referrals">
        {/* Referral card */}
        <div className="rounded-2xl p-5 mb-5"
          style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0055A5 100%)' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.8px] mb-1"
            style={{ color: 'rgba(255,255,255,0.5)' }}>Your Referral Code</p>
          <div className="flex items-center justify-between">
            <p className="text-[28px] font-bold text-white tracking-[2px]">{referralCode}</p>
            <button onClick={copyReferral}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl active:opacity-70"
              style={{ background: copied ? '#34C759' : 'rgba(255,255,255,0.15)' }}>
              {copied
                ? <Check style={{ width: 14, height: 14, color: 'white' }} />
                : <Copy style={{ width: 14, height: 14, color: 'white' }} />}
              <span className="text-[12px] font-bold text-white">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[12px] mt-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Share with friends · Both get ₹50 off their first month
          </p>
        </div>

        {/* Offers */}
        <p className="text-[13px] font-bold text-[#1C1C1E] mb-3">Available Offers</p>
        {[
          { emoji: '🎁', label: 'First Month Free Delivery', sub: 'Auto-applied on signup · Active', tag: 'Applied' },
          { emoji: '🥛', label: '10% off Full Cream Milk',   sub: 'Valid till Mar 31',              tag: 'Active'  },
          { emoji: '🧈', label: '₹30 off Ghee 500ml',       sub: 'Use code GHEE30 at checkout',    tag: 'New'     },
        ].map((offer, i) => (
          <div key={i} className="flex items-center gap-3 py-3.5"
            style={{ borderBottom: i < 2 ? '1px solid #F2F2F7' : 'none' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0"
              style={{ background: '#F2F2F7' }}>{offer.emoji}</div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#1C1C1E]">{offer.label}</p>
              <p className="text-[12px]" style={{ color: '#8E8E93' }}>{offer.sub}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{
                background: offer.tag === 'Applied' ? '#E9FAF0' : offer.tag === 'New' ? '#EBF4FF' : '#FFF3E0',
                color:      offer.tag === 'Applied' ? '#22A85A' : offer.tag === 'New' ? '#0055A5' : '#E65100',
              }}>
              {offer.tag}
            </span>
          </div>
        ))}
      </Sheet>

      {/* ── Help & Support Sheet ──────────────────────────────────── */}
      <Sheet open={openSheet === 'help'} onClose={close} title="Help & Support">
        {/* Contact buttons */}
        <div className="flex gap-3 mb-6">
          <button className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl active:opacity-80"
            style={{ background: '#E9FAF0' }}>
            <MessageCircle style={{ width: 22, height: 22, color: '#22A85A' }} />
            <span className="text-[13px] font-bold" style={{ color: '#22A85A' }}>WhatsApp</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl active:opacity-80"
            style={{ background: '#EBF4FF' }}>
            <PhoneCall style={{ width: 22, height: 22, color: '#0055A5' }} />
            <span className="text-[13px] font-bold" style={{ color: '#0055A5' }}>Call Us</span>
          </button>
        </div>

        <p className="text-[13px] font-bold text-[#1C1C1E] mb-2">Frequently Asked</p>
        <div className="bg-white rounded-2xl overflow-hidden px-1" style={{ border: '1px solid #F0F0F0' }}>
          {[
            { q: 'How do I pause my subscription?',        a: 'Go to Subscriptions → tap your active plan → Pause. Paused days roll over automatically.' },
            { q: 'When is my morning delivery?',           a: 'Between 5:00 AM – 7:00 AM. You can update the window in Subscriptions → Delivery Time.' },
            { q: 'Can I change my delivery address?',      a: 'Yes! Go to Subscriptions → select the plan → Change Address. Changes apply from the next delivery.' },
            { q: 'How does the wallet work?',              a: 'Your wallet has two parts — Product (for orders) and Delivery (for your monthly plan). Both are prepaid.' },
            { q: 'What if I miss a delivery?',             a: 'Missed deliveries are credited back to your wallet within 24 hours automatically.' },
          ].map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </Sheet>

      {/* ── Rate the App Sheet ────────────────────────────────────── */}
      <Sheet open={openSheet === 'rate'} onClose={close} title="Rate the App">
        {submitted ? (
          <div className="flex flex-col items-center py-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: '#E9FAF0' }}>
              <Check style={{ width: 36, height: 36, color: '#22A85A' }} />
            </div>
            <p className="text-[18px] font-bold text-[#1C1C1E] mb-2">Thank you, {userName}!</p>
            <p className="text-[14px] text-center" style={{ color: '#636366' }}>
              Your {rating}-star review helps us make Nandini Daily better every day.
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-[15px] mb-6" style={{ color: '#636366' }}>
              How's your experience with Nandini Daily?
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform active:scale-90"
                  style={{ transform: (hovered || rating) >= s ? 'scale(1.15)' : 'scale(1)' }}
                >
                  <Star
                    style={{ width: 40, height: 40 }}
                    fill={(hovered || rating) >= s ? '#FF9500' : 'transparent'}
                    color={(hovered || rating) >= s ? '#FF9500' : '#D1D1D6'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-center text-[16px] font-semibold text-[#1C1C1E] mb-4">
                  {['', 'Not great 😕', 'Could be better 🤔', 'Pretty good 😊', 'Love it! 😍', 'Absolutely love it! 🥛✨'][rating]}
                </p>
                <textarea
                  className="w-full px-4 py-3.5 rounded-2xl text-[14px] text-[#1C1C1E] outline-none resize-none mb-5"
                  style={{ background: '#F2F2F7', minHeight: 90 }}
                  placeholder="Tell us more (optional)..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
                <button
                  onClick={submitRating}
                  className="w-full py-4 rounded-2xl text-[15px] font-bold text-white"
                  style={{ background: 'linear-gradient(90deg, #FF6A00, #FF9500)' }}
                >
                  Submit Review
                </button>
              </motion.div>
            )}
          </>
        )}
      </Sheet>

      {/* ── Privacy Policy Sheet ──────────────────────────────────── */}
      <Sheet open={openSheet === 'privacy'} onClose={close} title="Privacy Policy">
        {[
          { heading: 'What we collect', body: 'We collect your phone number, delivery address, and order history to provide the Nandini Daily service. We do not sell or share your data with third parties.' },
          { heading: 'How we use it',   body: 'Your data is used solely to process deliveries, manage your wallet, send relevant notifications, and improve the app experience.' },
          { heading: 'Data security',   body: 'All data is encrypted in transit and at rest. We use industry-standard security practices and regular audits to protect your information.' },
          { heading: 'Your rights',     body: 'You can request deletion of your account and all associated data at any time by contacting our support team.' },
          { heading: 'Cookies',         body: 'The app uses session tokens for authentication only. No advertising or tracking cookies are used.' },
        ].map((s, i) => (
          <div key={i} className="mb-5">
            <p className="text-[13px] font-bold text-[#1C1C1E] mb-1.5">{s.heading}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: '#636366' }}>{s.body}</p>
          </div>
        ))}
        <p className="text-[11px] text-center mt-2" style={{ color: '#AEAEB2' }}>
          Last updated: 1 February 2026 · Karnataka Milk Federation
        </p>
      </Sheet>

      {/* ── Categories Sheet ───────────────────────────────────── */}
      <Sheet open={openSheet === 'categories'} onClose={close} title="Categories">
        <p className="text-[13px] mb-4 leading-relaxed" style={{ color: '#636366' }}>
          Select the categories your business needs. Only enabled categories will appear in your app.
        </p>

        {/* Default set note */}
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-2xl mb-5"
          style={{ background: '#EBF4FF' }}>
          <span className="text-[16px]">💡</span>
          <p className="text-[12px] leading-snug" style={{ color: '#0055A5' }}>
            Milk, Curd, Ghee, Butter, Paneer & Cheese, Milk Powder and Ice Creams are enabled by default.
          </p>
        </div>

        <div className="space-y-0 rounded-2xl overflow-hidden" style={{ border: '1px solid #F0F0F0' }}>
          {ALL_CATS.map((cat, i) => {
            const isOn = enabledCategories.includes(cat.id)
            return (
              <div key={cat.id}
                className="flex items-center gap-3 px-4 py-3 bg-white"
                style={{ borderBottom: i < ALL_CATS.length - 1 ? '1px solid #F2F2F7' : 'none' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: cat.bg }}>
                  <img
                    src={`/category%20images/${cat.file.replace(/ /g, '%20')}`}
                    alt={cat.name}
                    className="w-[78%] h-[78%] object-contain"
                  />
                </div>
                <p className="flex-1 text-[14px] font-semibold text-[#1C1C1E]">{cat.name}</p>
                <Toggle
                  on={isOn}
                  onChange={v => {
                    setEnabledCategories(
                      v
                        ? [...enabledCategories, cat.id]
                        : enabledCategories.filter(id => id !== cat.id)
                    )
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Reset to defaults */}
        <button
          className="w-full mt-4 py-3.5 rounded-2xl text-[14px] font-semibold"
          style={{ background: '#F2F2F7', color: '#0055A5' }}
          onClick={() => setEnabledCategories(['milk', 'curd', 'paneer', 'milk-powder', 'ice-creams'])}
        >
          Reset to Defaults
        </button>
      </Sheet>

    </div>
  )
}
