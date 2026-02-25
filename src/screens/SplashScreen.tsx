import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2800)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="screen" style={{
      background: 'linear-gradient(160deg, #003B73 0%, #0055A5 45%, #0077CC 100%)',
    }}>
      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full"
          style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="absolute top-1/3 -left-16 w-48 h-48 rounded-full"
          style={{ background: 'rgba(255,255,255,0.03)' }} />
        <div className="absolute -bottom-16 right-8 w-80 h-80 rounded-full"
          style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-8"
        >
          <div className="w-28 h-28 rounded-[32px] overflow-hidden"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.2)' }}>
            <img
              src="/logo.jpeg"
              alt="Nandini Daily"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-[36px] font-bold text-white tracking-[-1px] leading-none mb-2">
            Nandini Daily
          </h1>
          <p className="text-[16px] font-medium tracking-[0.5px]"
            style={{ color: 'rgba(255,255,255,0.65)' }}>
            Farm Fresh. Delivered Daily.
          </p>
        </motion.div>

        {/* Tagline chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex gap-2 mt-6"
        >
          {['🥛 Pure Milk', '🌿 Organic', '🚚 On Time'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pb-16 flex flex-col items-center gap-4"
      >
        {/* Animated dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Karnataka Milk Federation
        </p>
      </motion.div>
    </div>
  )
}
