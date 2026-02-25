import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useApp } from '../context/AppContext'

const OTP_LENGTH = 6
const RESEND_TIMER = 30

export default function OTPScreen() {
  const navigate = useNavigate()
  const { phone } = useApp()
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [timer, setTimer] = useState(RESEND_TIMER)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const maskedPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5, 8)}XX`
    : '+91 XXXXXXXXXX'

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(t => t - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [timer])

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[idx] = digit
    setOtp(newOtp)
    setError('')

    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus()
    }

    // Auto-verify when all filled
    if (digit && idx === OTP_LENGTH - 1 && newOtp.every(d => d !== '')) {
      verifyOTP(newOtp)
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (otp[idx] === '' && idx > 0) {
        const newOtp = [...otp]
        newOtp[idx - 1] = ''
        setOtp(newOtp)
        inputRefs.current[idx - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[idx] = ''
        setOtp(newOtp)
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) {
      const newOtp = pasted.split('')
      setOtp(newOtp)
      inputRefs.current[OTP_LENGTH - 1]?.focus()
      verifyOTP(newOtp)
    }
  }

  const verifyOTP = async (digits: string[]) => {
    const code = digits.join('')
    if (code.length < OTP_LENGTH) return
    setVerifying(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    setVerifying(false)
    // Accept any 6-digit OTP for demo
    navigate('/app/home')
  }

  const handleVerify = () => {
    if (otp.every(d => d !== '')) verifyOTP(otp)
  }

  const handleResend = () => {
    setTimer(RESEND_TIMER)
    setOtp(Array(OTP_LENGTH).fill(''))
    setError('')
    inputRefs.current[0]?.focus()
  }

  const filled = otp.filter(d => d !== '').length
  const isComplete = filled === OTP_LENGTH

  return (
    <PageTransition>
      <div className="screen bg-white">
        {/* Navigation bar */}
        <div className="safe-top flex items-center px-4 pb-2 pt-4">
          <button
            onClick={() => navigate('/login')}
            className="w-10 h-10 rounded-full flex items-center justify-center
                       active:bg-ios-gray-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-brand-blue" />
          </button>
        </div>

        <div className="flex-1 flex flex-col px-6 pt-4 pb-6 overflow-y-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {/* Shield icon */}
            <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-brand-blue" />
            </div>

            <h1 className="text-[28px] font-bold text-[#1C1C1E] tracking-[-0.5px] mb-2">
              Verify OTP
            </h1>
            <p className="text-[15px] text-ios-gray-1 leading-relaxed">
              We've sent a 6-digit code to
            </p>
            <p className="text-[15px] font-semibold text-brand-blue">
              {maskedPhone}
            </p>
          </motion.div>

          {/* OTP inputs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between gap-2 mb-3" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el }}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className={`otp-box ${digit ? 'filled' : ''}`}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full bg-ios-gray-5 overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full bg-brand-blue"
                animate={{ width: `${(filled / OTP_LENGTH) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[13px] text-ios-red mt-1"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* Resend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between mt-4"
          >
            <p className="text-[14px] text-ios-gray-1">Didn't receive the code?</p>
            {timer > 0 ? (
              <p className="text-[14px] font-semibold text-ios-gray-1">
                Resend in {timer}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-[14px] font-semibold text-brand-blue active:opacity-60"
              >
                Resend OTP
              </button>
            )}
          </motion.div>

          {/* Demo hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 px-4 py-3 rounded-2xl bg-ios-gray-6"
          >
            <p className="text-[13px] text-ios-gray-1">
              <span className="font-semibold text-[#1C1C1E]">Demo:</span> Enter any 6 digits to continue
            </p>
          </motion.div>

          <div className="flex-1" />

          {/* Verify button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleVerify}
              disabled={!isComplete || verifying}
              className="ios-button-primary relative"
            >
              {verifying ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify & Continue'
              )}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full text-center text-[14px] text-ios-gray-1 font-medium mt-3 py-2"
            >
              Change Number
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
