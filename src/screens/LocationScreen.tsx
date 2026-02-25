import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Navigation, Search, ChevronRight, Loader2 } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useApp } from '../context/AppContext'

const CITIES = [
  { name: 'Bengaluru', emoji: '🏙️', state: 'Karnataka' },
  { name: 'Mysuru', emoji: '🏯', state: 'Karnataka' },
  { name: 'Hubballi', emoji: '🌆', state: 'Karnataka' },
  { name: 'Mangaluru', emoji: '🌊', state: 'Karnataka' },
  { name: 'Tumkuru', emoji: '🏘️', state: 'Karnataka' },
  { name: 'Shivamogga', emoji: '🌳', state: 'Karnataka' },
]

export default function LocationScreen() {
  const navigate = useNavigate()
  const { setCity } = useApp()
  const [detecting, setDetecting] = useState(false)
  const [detected, setDetected] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const handleDetect = async () => {
    setDetecting(true)
    // Simulate geolocation
    await new Promise(r => setTimeout(r, 2000))
    setDetecting(false)
    setDetected(true)
    setSelectedCity('Bengaluru')
    setCity('Bengaluru')
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setCity(city)
    setDetected(true)
  }

  const handleContinue = () => {
    if (selectedCity) navigate('/address')
  }

  const filtered = CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageTransition>
      <div className="screen bg-ios-gray-6">
        {/* Nav bar */}
        <div className="bg-white safe-top px-4 pb-3 pt-4 flex items-center gap-3"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => navigate('/otp')}
            className="w-10 h-10 rounded-full flex items-center justify-center
                       active:bg-ios-gray-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-brand-blue" />
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.3px]">
              Your Location
            </h1>
            <p className="text-[12px] text-ios-gray-1">
              Where should we deliver?
            </p>
          </div>
          <div className="text-[13px] font-semibold text-ios-gray-1">2 of 5</div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
          {/* Map illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="ios-card mb-4 overflow-hidden p-0"
            style={{ height: 160 }}
          >
            <div className="w-full h-full relative flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #E8F4F8 0%, #D4E9F4 50%, #C8E0F0 100%)',
              }}>
              {/* Map grid lines */}
              {[...Array(8)].map((_, i) => (
                <div key={`h-${i}`} className="absolute left-0 right-0 h-px"
                  style={{ top: `${(i + 1) * 20}px`, background: 'rgba(0,85,165,0.08)' }} />
              ))}
              {[...Array(6)].map((_, i) => (
                <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px"
                  style={{ left: `${(i + 1) * 60}px`, background: 'rgba(0,85,165,0.08)' }} />
              ))}

              {/* Streets */}
              <div className="absolute w-full h-2 bg-white opacity-40" style={{ top: '60px' }} />
              <div className="absolute w-full h-1.5 bg-white opacity-30" style={{ top: '110px' }} />
              <div className="absolute h-full w-2 bg-white opacity-40" style={{ left: '120px' }} />
              <div className="absolute h-full w-1.5 bg-white opacity-30" style={{ left: '240px' }} />

              {/* Pin */}
              <motion.div
                animate={detecting ? {
                  y: [0, -8, 0],
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="relative z-10"
              >
                <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center"
                  style={{ boxShadow: '0 4px 20px rgba(0,85,165,0.4)' }}>
                  <MapPin className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="w-4 h-1 rounded-full mx-auto mt-0.5"
                  style={{ background: 'rgba(0,85,165,0.2)' }} />
              </motion.div>

              {/* Radius ring */}
              {detected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: 0 }}
                  className="absolute w-12 h-12 rounded-full border-2 border-brand-blue"
                />
              )}

              {/* Location label */}
              {detected && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 left-0 right-0 text-center"
                >
                  <span className="inline-block px-3 py-1 rounded-full text-[12px] font-semibold text-brand-blue"
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
                    📍 {selectedCity}, Karnataka
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* GPS detect button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <button
              onClick={handleDetect}
              disabled={detecting}
              className="w-full flex items-center gap-3 px-5 h-[56px] rounded-2xl mb-3
                         active:scale-[0.98] transition-transform"
              style={{
                background: detected
                  ? 'linear-gradient(135deg, #28A745, #20C048)'
                  : 'linear-gradient(135deg, #003B73, #0055A5)',
                boxShadow: '0 4px 16px rgba(0,85,165,0.25)',
              }}
            >
              {detecting ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-[16px] font-semibold text-white">Detecting location...</span>
                </>
              ) : detected ? (
                <>
                  <Navigation className="w-5 h-5 text-white fill-white" />
                  <span className="text-[16px] font-semibold text-white">Location detected ✓</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5 text-white" />
                  <span className="text-[16px] font-semibold text-white">Use Current Location</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-ios-gray-4" />
            <span className="text-[13px] text-ios-gray-1 font-medium">or search city</span>
            <div className="flex-1 h-px bg-ios-gray-4" />
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-3"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ios-gray-1" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your city..."
              className="ios-input pl-11"
            />
          </motion.div>

          {/* City grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 gap-2"
          >
            {filtered.map((city, i) => (
              <motion.button
                key={city.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => handleCitySelect(city.name)}
                className="ios-card flex items-center gap-3 px-4 py-3 text-left
                           active:scale-[0.97] transition-transform"
                style={{
                  border: selectedCity === city.name
                    ? '1.5px solid #0055A5'
                    : '1.5px solid transparent',
                  background: selectedCity === city.name ? '#E8F1FB' : 'white',
                }}
              >
                <span className="text-[22px]">{city.emoji}</span>
                <div>
                  <p className={`text-[14px] font-semibold leading-tight ${
                    selectedCity === city.name ? 'text-brand-blue' : 'text-[#1C1C1E]'
                  }`}>{city.name}</p>
                  <p className="text-[11px] text-ios-gray-1">{city.state}</p>
                </div>
                {selectedCity === city.name && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
              </motion.button>
            ))}
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
            disabled={!selectedCity}
            className="ios-button-primary"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
