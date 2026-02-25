import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Star, ChevronRight, Check } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useApp } from '../context/AppContext'

const TIME_SLOTS = [
  {
    id: '5-7',
    label: 'Early Morning',
    time: '5:00 AM – 7:00 AM',
    desc: 'Fresh at dawn, before your day begins',
    emoji: '🌅',
    popular: true,
    color: '#FF9500',
    bg: '#FFF4E5',
  },
  {
    id: '7-9',
    label: 'Morning',
    time: '7:00 AM – 9:00 AM',
    desc: 'Perfect for breakfast time deliveries',
    emoji: '☀️',
    popular: false,
    color: '#007AFF',
    bg: '#E8F4FF',
  },
  {
    id: 'custom',
    label: 'Custom Time',
    time: 'You choose',
    desc: 'Set your preferred delivery window',
    emoji: '⚙️',
    popular: false,
    color: '#5856D6',
    bg: '#F0EFFF',
  },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DeliveryTimeScreen() {
  const navigate = useNavigate()
  const { setDeliveryTime, setDeliveryDays } = useApp()
  const [selectedSlot, setSelectedSlot] = useState('5-7')
  const [customTime, setCustomTime] = useState('06:00')
  const [selectedDays, setSelectedDays] = useState(new Set(DAYS))

  const toggleDay = (day: string) => {
    setSelectedDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) {
        if (next.size > 1) next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
  }

  const selectAll = () => setSelectedDays(new Set(DAYS))
  const selectWeekdays = () => setSelectedDays(new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']))

  const handleContinue = () => {
    const slot = TIME_SLOTS.find(s => s.id === selectedSlot)
    const timeLabel = selectedSlot === 'custom' ? customTime : slot?.time || ''
    setDeliveryTime(timeLabel)
    setDeliveryDays([...selectedDays])
    navigate('/products')
  }

  return (
    <PageTransition>
      <div className="screen bg-ios-gray-6">
        {/* Nav bar */}
        <div className="bg-white safe-top px-4 pb-3 pt-4 flex items-center gap-3"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => navigate('/address')}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-ios-gray-6"
          >
            <ArrowLeft className="w-5 h-5 text-brand-blue" />
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.3px]">Delivery Time</h1>
            <p className="text-[12px] text-ios-gray-1">When should we arrive?</p>
          </div>
          <div className="text-[13px] font-semibold text-ios-gray-1">4 of 5</div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
          {/* Time slot selection */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-[0.6px] mb-2 ml-1">
              Delivery Window
            </p>

            <div className="space-y-2">
              {TIME_SLOTS.map((slot, i) => {
                const isActive = selectedSlot === slot.id
                return (
                  <motion.button
                    key={slot.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    onClick={() => setSelectedSlot(slot.id)}
                    className="w-full ios-card flex items-center gap-4 active:scale-[0.98] transition-transform"
                    style={{
                      border: isActive ? `1.5px solid ${slot.color}` : '1.5px solid transparent',
                      background: isActive ? slot.bg : 'white',
                    }}
                  >
                    {/* Emoji */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[24px]"
                      style={{ background: isActive ? `${slot.color}18` : '#F2F2F7' }}>
                      {slot.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`text-[15px] font-semibold ${isActive ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]'}`}>
                          {slot.label}
                        </span>
                        {slot.popular && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: '#FFF1D6', color: '#FF9500' }}>
                            <Star className="w-2.5 h-2.5 fill-current" />
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] font-medium" style={{ color: isActive ? slot.color : '#8E8E93' }}>
                        {slot.time}
                      </p>
                      <p className="text-[12px] text-ios-gray-1 mt-0.5">{slot.desc}</p>
                    </div>

                    {/* Radio */}
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: isActive ? slot.color : '#C7C7CC',
                        background: isActive ? slot.color : 'transparent',
                      }}>
                      {isActive && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Custom time picker */}
            {selectedSlot === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 ios-card"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-blue" />
                  <p className="text-[14px] font-medium text-[#1C1C1E]">Select time</p>
                  <input
                    type="time"
                    value={customTime}
                    onChange={e => setCustomTime(e.target.value)}
                    className="ml-auto text-[16px] font-semibold text-brand-blue outline-none border-none bg-transparent"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Delivery days */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-[0.6px] ml-1">
                Delivery Days
              </p>
              <div className="flex gap-2">
                <button onClick={selectWeekdays}
                  className="text-[12px] font-medium text-brand-blue active:opacity-60">
                  Weekdays
                </button>
                <span className="text-ios-gray-3">|</span>
                <button onClick={selectAll}
                  className="text-[12px] font-medium text-brand-blue active:opacity-60">
                  All Days
                </button>
              </div>
            </div>

            <div className="ios-card">
              <div className="flex justify-between gap-1">
                {DAYS.map((day) => {
                  const active = selectedDays.has(day)
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl
                                 active:scale-[0.92] transition-transform"
                      style={{
                        background: active ? '#0055A5' : '#F2F2F7',
                      }}
                    >
                      <span className={`text-[11px] font-semibold ${active ? 'text-white' : 'text-ios-gray-1'}`}>
                        {day.charAt(0)}
                      </span>
                      {active && <div className="w-1 h-1 rounded-full bg-white opacity-60" />}
                    </button>
                  )
                })}
              </div>
              <p className="text-[12px] text-ios-gray-1 mt-3 text-center">
                {selectedDays.size === 7
                  ? 'Delivering every day 🎉'
                  : `Delivering ${selectedDays.size} days a week`}
              </p>
            </div>
          </motion.div>

          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="ios-card"
            style={{ background: 'linear-gradient(135deg, #003B73, #0055A5)' }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.5px] mb-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              Delivery Summary
            </p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[20px]">
                {TIME_SLOTS.find(s => s.id === selectedSlot)?.emoji}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-white">
                  {selectedSlot === 'custom' ? customTime : TIME_SLOTS.find(s => s.id === selectedSlot)?.time}
                </p>
                <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {selectedDays.size} days / week · {[...selectedDays].slice(0, 3).join(', ')}{selectedDays.size > 3 ? '...' : ''}
                </p>
              </div>
            </div>
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
          <button onClick={handleContinue} className="ios-button-primary">
            Choose Products
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
