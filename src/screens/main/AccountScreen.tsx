import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  User, MapPin, Bell, Shield, HelpCircle,
  Star, LogOut, ChevronRight, Phone, Gift
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const MENU_SECTIONS = [
  {
    title: 'My Account',
    items: [
      { icon: User,    label: 'Personal Details',    sub: 'Name, email, phone',         color: '#007AFF' },
      { icon: MapPin,  label: 'Saved Addresses',     sub: 'Home, work & other',          color: '#34C759' },
      { icon: Phone,   label: 'Change Number',       sub: 'Update mobile number',        color: '#FF9500' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell,   label: 'Notifications',        sub: 'Delivery alerts, offers',     color: '#5856D6' },
      { icon: Gift,   label: 'Offers & Referrals',   sub: 'Earn rewards',                color: '#FF2D55' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support',   sub: 'FAQs, chat, call',            color: '#007AFF' },
      { icon: Star,       label: 'Rate the App',     sub: 'Share your feedback',         color: '#FF9500' },
      { icon: Shield,     label: 'Privacy Policy',   sub: 'How we protect your data',    color: '#34C759' },
    ],
  },
]

export default function AccountScreen() {
  const navigate = useNavigate()
  const { phone } = useApp()

  const handleLogout = () => navigate('/login')

  return (
    <div className="h-full overflow-y-auto bg-ios-gray-6">
      {/* Header */}
      <div className="bg-white safe-top px-5 pb-4 pt-4"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-[-0.4px]">Account</h1>
      </div>

      <div className="px-4 pt-4 pb-6">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="ios-card flex items-center gap-4 mb-6"
        >
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #003B73, #0077CC)' }}>
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-[18px] font-bold text-[#1C1C1E] leading-tight">Nandini User</h2>
            <p className="text-[14px] text-ios-gray-1">+91 {phone || 'XXXXXXXXXX'}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-ios-green" />
              <span className="text-[12px] font-medium text-ios-green">Active Member</span>
            </div>
          </div>

          <button className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-brand-blue" />
          </button>
        </motion.div>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
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
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-ios-gray-6
                               transition-colors text-left"
                    style={{
                      borderBottom: ii < section.items.length - 1
                        ? '0.5px solid #E5E5EA'
                        : 'none',
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}18` }}>
                      <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold text-[#1C1C1E] leading-tight">{item.label}</p>
                      <p className="text-[12px] text-ios-gray-1">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ios-gray-3 flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          </motion.div>
        ))}

        {/* App version */}
        <p className="text-center text-[12px] text-ios-gray-2 mb-4">
          Nandini Daily v1.0.0 · Karnataka Milk Federation
        </p>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2
                     active:scale-[0.98] transition-transform"
          style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)' }}
        >
          <LogOut className="w-4.5 h-4.5 text-ios-red" style={{ width: 18, height: 18 }} />
          <span className="text-[15px] font-semibold text-ios-red">Log Out</span>
        </motion.button>
      </div>
    </div>
  )
}
