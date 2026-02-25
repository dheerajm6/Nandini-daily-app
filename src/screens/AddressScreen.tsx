import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Home, Briefcase, MapPin, ChevronRight, Plus } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useApp } from '../context/AppContext'

type AddressType = 'home' | 'work' | 'other'

const ADDRESS_TYPES = [
  { id: 'home' as AddressType, label: 'Home', icon: Home, color: '#007AFF', bg: '#E8F4FF' },
  { id: 'work' as AddressType, label: 'Work', icon: Briefcase, color: '#FF9500', bg: '#FFF4E5' },
  { id: 'other' as AddressType, label: 'Other', icon: MapPin, color: '#34C759', bg: '#E6F9EC' },
]

export default function AddressScreen() {
  const navigate = useNavigate()
  const { city, setAddress } = useApp()
  const [selected, setSelected] = useState<AddressType>('home')
  const [flat, setFlat] = useState('')
  const [building, setBuilding] = useState('')
  const [street, setStreet] = useState('')
  const [pincode, setPincode] = useState('')

  const isValid = flat.trim() && street.trim() && pincode.length === 6

  const handleContinue = () => {
    if (!isValid) return
    setAddress({ type: selected, flat, building, street, city, pincode })
    navigate('/delivery-time')
  }

  return (
    <PageTransition>
      <div className="screen bg-ios-gray-6">
        {/* Nav bar */}
        <div className="bg-white safe-top px-4 pb-3 pt-4 flex items-center gap-3"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => navigate('/location')}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-ios-gray-6"
          >
            <ArrowLeft className="w-5 h-5 text-brand-blue" />
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.3px]">Delivery Address</h1>
            <p className="text-[12px] text-ios-gray-1">Where should we drop your order?</p>
          </div>
          <div className="text-[13px] font-semibold text-ios-gray-1">3 of 5</div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
          {/* Address type selector */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-[0.6px] mb-2 ml-1">
              Address Type
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ADDRESS_TYPES.map((type) => {
                const Icon = type.icon
                const isActive = selected === type.id
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelected(type.id)}
                    className="ios-card flex flex-col items-center gap-2 py-4 px-2
                               active:scale-[0.97] transition-transform"
                    style={{
                      border: isActive ? `1.5px solid ${type.color}` : '1.5px solid transparent',
                      background: isActive ? type.bg : 'white',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: isActive ? `${type.color}20` : '#F2F2F7' }}>
                      <Icon className="w-5 h-5" style={{ color: isActive ? type.color : '#8E8E93' }} />
                    </div>
                    <span className={`text-[13px] font-semibold ${isActive ? 'text-[#1C1C1E]' : 'text-ios-gray-1'}`}>
                      {type.label}
                    </span>
                    {isActive && (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: type.color }}>
                        <span className="text-white text-[8px] font-bold">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Address form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="ios-card p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-brand-blue" />
              <p className="text-[15px] font-semibold text-[#1C1C1E]">
                Add {ADDRESS_TYPES.find(t => t.id === selected)?.label} Address
              </p>
            </div>

            <div className="space-y-3">
              {/* Flat/House */}
              <div>
                <label className="block text-[12px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-1.5">
                  Flat / House No. *
                </label>
                <input
                  type="text"
                  value={flat}
                  onChange={e => setFlat(e.target.value)}
                  placeholder="e.g. 12B, Flat 304"
                  className="ios-input"
                />
              </div>

              {/* Building */}
              <div>
                <label className="block text-[12px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-1.5">
                  Building / Society
                </label>
                <input
                  type="text"
                  value={building}
                  onChange={e => setBuilding(e.target.value)}
                  placeholder="e.g. Prestige Apartments"
                  className="ios-input"
                />
              </div>

              {/* Street */}
              <div>
                <label className="block text-[12px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-1.5">
                  Street / Locality *
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="e.g. MG Road, Koramangala"
                  className="ios-input"
                />
              </div>

              {/* City + Pincode row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[12px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-1.5">
                    City
                  </label>
                  <div className="ios-input flex items-center" style={{ background: '#F9F9FB', color: '#1C1C1E' }}>
                    <span className="text-[15px] font-medium text-ios-gray-1">{city || 'Bengaluru'}</span>
                  </div>
                </div>
                <div style={{ width: 110 }}>
                  <label className="block text-[12px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="560001"
                    className="ios-input"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(0,85,165,0.06)', border: '1px solid rgba(0,85,165,0.12)' }}
          >
            <p className="text-[13px] text-brand-blue leading-relaxed">
              <span className="font-semibold">💡 Tip:</span> Delivery is done between 5–7 AM. Make sure someone is available or leave delivery instructions.
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 py-3 bg-white safe-bottom"
          style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
        >
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className="ios-button-primary"
          >
            Save & Continue
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
