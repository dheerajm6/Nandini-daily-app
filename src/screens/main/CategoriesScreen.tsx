import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const ALL_CATEGORIES = [
  { id: 'milk',           name: 'Milk',               file: 'milk.png',                 bg: '#EBF5FF' },
  { id: 'curd',           name: 'Curd',               file: 'curd.png',                 bg: '#FFFBEB' },
  { id: 'ghee',           name: 'Ghee',               file: 'ghee.png',                 bg: '#FFF7E6' },
  { id: 'butter',         name: 'Butter',             file: 'butter.png',               bg: '#FFF3E0' },
  { id: 'paneer',         name: 'Paneer & Cheese',    file: 'Paneer&Cheese.png',        bg: '#FFF0E6' },
  { id: 'flavoured-milk', name: 'Flavoured Milk',     file: 'Flavoured Milk.png',       bg: '#F3EEFF' },
  { id: 'ice-creams',     name: 'Ice Creams',         file: 'Ice Creams.png',           bg: '#FFF0F7' },
  { id: 'sweets',         name: 'Sweets',             file: 'sweets.png',               bg: '#FFE9EE' },
  { id: 'chocolates',     name: 'Chocolates',         file: 'chocolates.png',           bg: '#FBF0E8' },
  { id: 'bakery',         name: 'Bakery',             file: 'bakery.png',               bg: '#FEFBF0' },
  { id: 'namkeen',        name: 'Namkeen',            file: 'Namkeen.png',              bg: '#F0FFF4' },
  { id: 'rusk',           name: 'Rusk & Cookies',     file: 'Rusk&Cookies.png',         bg: '#FFFDE6' },
  { id: 'instant-mix',    name: 'Instant Mix',        file: 'Instant mix.png',          bg: '#E8F7F7' },
  { id: 'milk-powder',    name: 'Milk Powder',        file: 'Milk-powder.png',          bg: '#F5F5FF' },
  { id: 'soda',           name: 'Soda Drink',         file: 'Soda Drink.png',           bg: '#E6FBFF' },
  { id: 'good-life',      name: 'Good Life',          file: 'nandini-goodlife.png',     bg: '#E8F7EE' },
  { id: 'buttermilk',     name: 'Buttermilk & Lassi', file: 'butter milk & lassi.png',  bg: '#F0FBF4' },
  { id: 'merchandise',    name: 'Merchandise',        file: 'Merchandise.png',          bg: '#F0F0FF' },
]

export default function CategoriesScreen() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="absolute inset-0 bg-white z-10 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 safe-top pb-3 pt-4 bg-white flex-shrink-0"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}
      >
        <button
          onClick={() => navigate('/app/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center active:bg-ios-gray-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-brand-blue" />
        </button>
        <h1 className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.3px]">All Categories</h1>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: 'calc(83px + 16px)' }}>
        <div className="grid grid-cols-3 gap-3">
          {ALL_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, ease: [0.34, 1.3, 0.64, 1] }}
              onClick={() => navigate(`/app/products/${cat.id}`)}
              className="flex flex-col items-center gap-2 active:opacity-70 transition-opacity"
            >
              <div
                className="w-full aspect-square rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ background: cat.bg }}
              >
                <img
                  src={`/category%20images/${cat.file.replace(/ /g, '%20')}`}
                  alt={cat.name}
                  className="w-[72%] h-[72%] object-contain"
                />
              </div>
              <p className="text-[12px] font-semibold text-[#1C1C1E] text-center leading-tight">
                {cat.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
