import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useApp } from '../context/AppContext'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { setPhone } = useApp()
  const [number, setNumber] = useState('')
  const [focused, setFocused] = useState(false)

  const isValid = number.length === 10

  const handleContinue = () => {
    if (!isValid) return
    setPhone(number)
    navigate('/otp')
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
    setNumber(val)
  }

  return (
    <PageTransition>
      <div className="screen bg-white">
        {/* Header gradient */}
        <div className="relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #003B73 0%, #0055A5 100%)' }}>
          <div className="safe-top px-6 pb-10 pt-6 relative z-10">
            {/* Mini logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-14 h-14 rounded-2xl overflow-hidden mb-6"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
            >
              <img src="/logo.jpeg" alt="Nandini Daily" className="w-full h-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-[28px] font-bold text-white tracking-[-0.5px] leading-tight mb-1">
                Welcome to
              </h1>
              <h1 className="text-[28px] font-bold text-white tracking-[-0.5px] leading-tight">
                Nandini Daily
              </h1>
              <p className="text-[15px] mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Enter your mobile number to get started
              </p>
            </motion.div>
          </div>

          {/* Wave shape */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white"
            style={{ borderRadius: '24px 24px 0 0' }} />
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col px-6 pt-8 pb-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-[13px] font-semibold text-ios-gray-1 uppercase tracking-[0.6px] mb-2 ml-1">
              Mobile Number
            </label>

            {/* Phone input */}
            <div
              className="flex items-center h-[56px] rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: focused ? 'white' : '#F9F9FB',
                border: focused ? '1.5px solid #0055A5' : '1.5px solid #E5E5EA',
                boxShadow: focused ? '0 0 0 4px rgba(0, 85, 165, 0.1)' : 'none',
              }}
            >
              {/* Country code */}
              <div className="flex items-center gap-2 px-4 h-full border-r border-ios-gray-4">
                <span className="text-[20px] leading-none">🇮🇳</span>
                <span className="text-[17px] font-semibold text-[#1C1C1E]">+91</span>
              </div>

              {/* Number input */}
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={number}
                onChange={handleInput}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter 10-digit number"
                className="flex-1 h-full px-4 text-[17px] font-medium text-[#1C1C1E]
                           placeholder:text-ios-gray-3 outline-none bg-transparent"
                autoFocus
              />

              {/* Clear button */}
              {number.length > 0 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setNumber('')}
                  className="mr-4 w-5 h-5 rounded-full bg-ios-gray-3 flex items-center justify-center"
                >
                  <span className="text-white text-[12px] font-bold leading-none">×</span>
                </motion.button>
              )}
            </div>

            {/* Number indicator */}
            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-[13px] text-ios-gray-1">
                {number.length > 0 && number.length < 10
                  ? `${10 - number.length} more digits needed`
                  : isValid ? '✓ Valid number' : 'We\'ll send an OTP to verify'}
              </p>
              <p className={`text-[13px] font-medium ${number.length === 10 ? 'text-ios-green' : 'text-ios-gray-1'}`}>
                {number.length}/10
              </p>
            </div>
          </motion.div>

          {/* Quick examples (demo) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6"
          >
            <p className="text-[13px] text-ios-gray-1 mb-3 ml-1">Try with demo number:</p>
            <button
              onClick={() => setNumber('9876543210')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-light"
            >
              <span className="text-[14px] text-brand-blue font-medium">9876 543 210</span>
              <ChevronRight className="w-3.5 h-3.5 text-brand-blue opacity-60" />
            </button>
          </motion.div>

          <div className="flex-1" />

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className="ios-button-primary"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>

            {/* Terms */}
            <p className="text-center text-[12px] text-ios-gray-1 mt-4 leading-relaxed">
              By continuing, you agree to our{' '}
              <span className="text-brand-blue font-medium">Terms of Service</span>
              {' '}and{' '}
              <span className="text-brand-blue font-medium">Privacy Policy</span>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
