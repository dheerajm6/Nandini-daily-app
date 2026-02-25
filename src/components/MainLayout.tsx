import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, RefreshCw, Wallet, Package, User } from 'lucide-react'
import { motion } from 'framer-motion'

const TABS = [
  { id: 'home',          label: 'Home',          icon: Home,       path: '/app/home' },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw,  path: '/app/subscriptions' },
  { id: 'wallet',        label: 'Wallet',         icon: Wallet,     path: '/app/wallet' },
  { id: 'orders',        label: 'Orders',         icon: Package,    path: '/app/orders' },
  { id: 'account',       label: 'Account',        icon: User,       path: '/app/account' },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeTab = TABS.find(t => location.pathname === t.path)?.id || 'home'

  return (
    <div className="screen bg-ios-gray-6">
      {/* Page content */}
      <div className="flex-1 overflow-hidden relative" style={{ paddingBottom: 83 }}>
        <Outlet />
      </div>

      {/* iOS Bottom Tab Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(249,249,251,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '0.5px solid rgba(0,0,0,0.12)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex items-stretch h-[49px]">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="flex-1 flex flex-col items-center justify-center gap-[3px]
                           active:opacity-60 transition-opacity duration-100"
              >
                {/* Icon with active dot indicator */}
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.95,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Icon
                      className="transition-colors duration-200"
                      style={{
                        width: 22,
                        height: 22,
                        color: isActive ? '#0055A5' : '#8E8E93',
                        strokeWidth: isActive ? 2.2 : 1.8,
                      }}
                    />
                  </motion.div>
                </div>

                {/* Label */}
                <span
                  className="text-[10px] font-medium leading-none transition-colors duration-200"
                  style={{
                    color: isActive ? '#0055A5' : '#8E8E93',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
