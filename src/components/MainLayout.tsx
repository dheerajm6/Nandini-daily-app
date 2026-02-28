import { useRef, useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, RefreshCw, Wallet, User, LayoutGrid } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

const LEFT_TABS = [
  { id: 'home',          label: 'Home',     icon: Home,      path: '/app/home' },
  { id: 'subscriptions', label: 'Subscribe', icon: RefreshCw, path: '/app/subscriptions' },
]

const RIGHT_TABS = [
  { id: 'wallet',  label: 'Wallet',  icon: Wallet, path: '/app/wallet' },
  { id: 'account', label: 'Account', icon: User,   path: '/app/account' },
]

const ALL_TABS = [...LEFT_TABS, ...RIGHT_TABS]

export default function MainLayout() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { walletBalance, userMode } = useApp()
  const activeTab = ALL_TABS.find(t => location.pathname === t.path)?.id || 'home'
  const isCat     = location.pathname.startsWith('/app/categories') || location.pathname.startsWith('/app/products')

  // Mode-switch splash
  const prevMode = useRef(userMode)
  const [splashMode, setSplashMode] = useState<'individual' | 'business' | null>(null)
  useEffect(() => {
    if (prevMode.current !== userMode) {
      prevMode.current = userMode
      setSplashMode(userMode)
      const t = setTimeout(() => setSplashMode(null), 1800)
      return () => clearTimeout(t)
    }
  }, [userMode])

  const walletDot = walletBalance < 100  ? '#FF3B30'   // red  — critical
                  : walletBalance < 500  ? '#FF9500'   // amber — getting low
                  : '#34C759'                           // green — healthy

  function TabButton({ tab }: { tab: typeof ALL_TABS[number] }) {
    const Icon     = tab.icon
    const isActive = activeTab === tab.id
    const isWallet = tab.id === 'wallet'

    return (
      <button
        onClick={() => navigate(tab.path)}
        className="flex-1 flex flex-col items-center justify-center gap-[3px] active:opacity-60 transition-opacity"
      >
        <motion.div
          className="relative"
          animate={{ scale: isActive ? 1 : 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Icon style={{
            width: 22, height: 22,
            color: isActive ? '#0055A5' : '#8E8E93',
            strokeWidth: isActive ? 2.2 : 1.8,
          }} />

          {/* Wallet status dot */}
          {isWallet && (
            <motion.div
              key={walletDot}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 600, damping: 28 }}
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[2px]"
              style={{
                background: walletDot,
                borderColor: 'rgba(249,249,251,0.95)',
              }}
            />
          )}
        </motion.div>

        <span className="text-[10px] leading-none"
          style={{ color: isActive ? '#0055A5' : '#8E8E93', fontWeight: isActive ? 600 : 400 }}>
          {tab.label}
        </span>
      </button>
    )
  }

  return (
    <div className="screen bg-ios-gray-6">
      {/* Page content */}
      <div className="flex-1 overflow-hidden relative" style={{ paddingBottom: 83 }}>
        <Outlet />
      </div>

      {/* Bottom Tab Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(249,249,251,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '0.5px solid rgba(0,0,0,0.12)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          overflow: 'visible',
        }}
      >
        <div className="flex items-stretch h-[49px]">

          {/* Left tabs */}
          {LEFT_TABS.map(tab => <TabButton key={tab.id} tab={tab} />)}

          {/* Center FAB slot */}
          <div className="relative flex-shrink-0" style={{ width: 72 }}>
            {/* FAB rises above the bar */}
            <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 6 }}>
              <motion.button
                onClick={() => navigate('/app/categories')}
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  animate={{ scale: isCat ? 0.93 : 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: isCat
                      ? 'linear-gradient(145deg, #003B73 0%, #001F45 100%)'
                      : 'linear-gradient(145deg, #0077CC 0%, #0044A0 100%)',
                    boxShadow: isCat
                      ? '0 4px 16px rgba(0,40,100,0.5), 0 0 0 3.5px rgba(249,249,251,0.95)'
                      : '0 6px 22px rgba(0,85,165,0.42), 0 0 0 3.5px rgba(249,249,251,0.95)',
                  }}
                >
                  <LayoutGrid style={{ width: 23, height: 23, color: 'white', strokeWidth: isCat ? 2.4 : 2 }} />
                </motion.div>
                <span className="text-[10px] leading-none font-semibold"
                  style={{ color: isCat ? '#0055A5' : '#8E8E93' }}>
                  Shop
                </span>
              </motion.button>
            </div>
          </div>

          {/* Right tabs */}
          {RIGHT_TABS.map(tab => <TabButton key={tab.id} tab={tab} />)}

        </div>
      </div>

      {/* ── Mode-switch branded splash ── */}
      <AnimatePresence>
        {splashMode && (
          <motion.div
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-5"
            style={{
              background: splashMode === 'business'
                ? 'linear-gradient(145deg, #0A1628 0%, #0D2137 50%, #0A1E35 100%)'
                : 'linear-gradient(145deg, #003B73 0%, #0055A5 60%, #0077CC 100%)',
            }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
          >
            {/* Logo */}
            <motion.div
              className="w-20 h-20 rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 320, damping: 24 }}
            >
              <img src="/logo.jpeg" alt="Nandini" className="w-full h-full object-cover" />
            </motion.div>

            {/* Text */}
            <motion.div
              className="text-center"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white font-bold tracking-[-0.5px]"
                style={{ fontSize: splashMode === 'business' ? 24 : 26 }}>
                Nandini Daily
                {splashMode === 'business' && (
                  <span className="block text-[18px] mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Business
                  </span>
                )}
              </p>
              <p className="text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {splashMode === 'business'
                  ? 'Your daily supply partner'
                  : 'Fresh dairy, every morning'}
              </p>
            </motion.div>

            {/* Mode badge */}
            <motion.div
              className="px-4 py-2 rounded-full"
              style={{
                background: splashMode === 'business'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(255,255,255,0.15)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[1px]"
                style={{ color: 'rgba(255,255,255,0.65)' }}>
                {splashMode === 'business' ? '🏢 Business Mode' : '🏠 Individual Mode'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
