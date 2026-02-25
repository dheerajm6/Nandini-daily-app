import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, MapPin, Clock, Calendar, ShoppingBag, Home } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useApp } from '../context/AppContext'

export default function SuccessScreen() {
  const navigate = useNavigate()
  const { phone, city, address, deliveryTime, deliveryDays, cart, totalPrice, totalItems } = useApp()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowConfetti(true), 400)
  }, [])

  const addressLine = address
    ? `${address.flat}${address.building ? ', ' + address.building : ''}, ${address.street}`
    : 'Address saved'

  return (
    <PageTransition>
      <div className="screen bg-ios-gray-6 overflow-hidden">
        {/* Confetti particles */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  background: ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#0055A5'][i % 6],
                  rotate: `${Math.random() * 360}deg`,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  rotate: [0, Math.random() > 0.5 ? 360 : -360],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 1.5,
                  delay: Math.random() * 0.8,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>
        )}

        {/* Success illustration */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
          {/* Checkmark circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="mb-6 relative"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #28A745, #34C759)' ,
                       boxShadow: '0 8px 32px rgba(52, 199, 89, 0.4)' }}>
              <motion.div
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Check className="w-12 h-12 text-white stroke-[3]" />
              </motion.div>
            </div>

            {/* Pulse rings */}
            {[1, 2].map(ring => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border-2 border-green-400"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.8 + ring * 0.4, opacity: 0 }}
                transition={{ delay: 0.4 + ring * 0.2, duration: 0.8 }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-[30px] font-bold text-[#1C1C1E] tracking-[-0.5px] mb-2">
              You're all set! 🎉
            </h1>
            <p className="text-[16px] text-ios-gray-1 leading-relaxed">
              Your Nandini Daily subscription<br />has been started successfully.
            </p>
          </motion.div>

          {/* Order summary card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full ios-card mb-4"
          >
            <p className="text-[12px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-3">
              Subscription Summary
            </p>

            <div className="space-y-3">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center">
                  <span className="text-[14px]">📱</span>
                </div>
                <div>
                  <p className="text-[11px] text-ios-gray-1">Account</p>
                  <p className="text-[14px] font-semibold text-[#1C1C1E]">+91 {phone}</p>
                </div>
              </div>

              <div className="h-px bg-ios-gray-5" />

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-[11px] text-ios-gray-1">Delivery Address</p>
                  <p className="text-[14px] font-semibold text-[#1C1C1E] leading-tight">{addressLine}</p>
                  <p className="text-[12px] text-ios-gray-1">{city}</p>
                </div>
              </div>

              <div className="h-px bg-ios-gray-5" />

              {/* Time */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center">
                  <Clock className="w-4 h-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-[11px] text-ios-gray-1">Delivery Time</p>
                  <p className="text-[14px] font-semibold text-[#1C1C1E]">{deliveryTime}</p>
                </div>
              </div>

              <div className="h-px bg-ios-gray-5" />

              {/* Days */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-[11px] text-ios-gray-1">Delivery Days</p>
                  <p className="text-[14px] font-semibold text-[#1C1C1E]">
                    {deliveryDays.length === 7 ? 'Every day' : deliveryDays.join(', ')}
                  </p>
                </div>
              </div>

              <div className="h-px bg-ios-gray-5" />

              {/* Products */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 text-brand-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-ios-gray-1 mb-1">Products ({totalItems} items)</p>
                  <div className="space-y-0.5">
                    {cart.map(p => (
                      <div key={p.id} className="flex justify-between">
                        <span className="text-[13px] text-[#1C1C1E]">{p.name} × {p.quantity}</span>
                        <span className="text-[13px] font-medium text-[#1C1C1E]">₹{p.price * p.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-ios-gray-5 flex justify-between">
                    <span className="text-[14px] font-semibold text-[#1C1C1E]">Daily Total</span>
                    <span className="text-[14px] font-bold text-brand-blue">₹{totalPrice}/day</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Starts tomorrow badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl mb-6"
            style={{ background: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.25)' }}
          >
            <span className="text-[16px]">🌅</span>
            <p className="text-[13px] font-semibold text-green-700">
              First delivery starts tomorrow morning
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="px-4 py-3 bg-white safe-bottom"
          style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
        >
          <button
            onClick={() => navigate('/splash')}
            className="ios-button-primary"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
