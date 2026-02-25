import { motion } from 'framer-motion'
import { Plus, RefreshCw, ChevronRight, Pause, Play } from 'lucide-react'

export default function SubscriptionsScreen() {
  return (
    <div className="h-full overflow-y-auto bg-ios-gray-6">
      {/* Header */}
      <div className="bg-white safe-top px-5 pb-4 pt-4"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-[-0.4px]">Subscriptions</h1>
            <p className="text-[13px] text-ios-gray-1">Manage your daily deliveries</p>
          </div>
          <button className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center">
            <Plus className="w-5 h-5 text-white stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6">
        {/* Empty state */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="ios-card flex flex-col items-center py-12 px-6 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mb-5">
            <RefreshCw className="w-10 h-10 text-brand-blue" />
          </div>
          <h2 className="text-[19px] font-bold text-[#1C1C1E] mb-2">No Active Subscriptions</h2>
          <p className="text-[14px] text-ios-gray-1 leading-relaxed mb-6">
            Start a subscription to get fresh Nandini products delivered to your door every day.
          </p>
          <button className="ios-button-primary" style={{ width: 'auto', paddingLeft: 24, paddingRight: 24 }}>
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </button>
        </motion.div>

        {/* What you can subscribe to */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-[0.5px] mb-2 ml-1">
            Available to subscribe
          </p>
          <div className="space-y-2">
            {[
              { name: 'Full Cream Milk 1L', price: '₹68/day', emoji: '🥛', tag: 'Most Popular' },
              { name: 'Toned Milk 500ml', price: '₹29/day', emoji: '🥛', tag: null },
              { name: 'Fresh Curd 400g', price: '₹38/day', emoji: '🍶', tag: 'Daily Fresh' },
              { name: 'Table Butter 100g', price: '₹55/2 days', emoji: '🧈', tag: null },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="ios-card flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px]"
                  style={{ background: '#F2F2F7' }}>
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-semibold text-[#1C1C1E]">{item.name}</p>
                    {item.tag && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: '#E8F1FB', color: '#0055A5' }}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-semibold text-brand-blue">{item.price}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-ios-gray-3" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
