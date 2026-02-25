import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, ShoppingBag, Plus, Minus, Star } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useApp } from '../context/AppContext'

interface Product {
  id: number
  name: string
  variant: string
  price: number
  unit: string
  emoji: string
  gradient: [string, string]
  badge?: string
  desc: string
  category: string
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Full Cream Milk',
    variant: '1 Litre',
    price: 68,
    unit: '/day',
    emoji: '🥛',
    gradient: ['#4facfe', '#00f2fe'],
    badge: 'Best Seller',
    desc: 'Rich & creamy full fat milk',
    category: 'milk',
  },
  {
    id: 2,
    name: 'Toned Milk',
    variant: '500 ml',
    price: 29,
    unit: '/day',
    emoji: '🥛',
    gradient: ['#43e97b', '#38f9d7'],
    desc: 'Light & healthy everyday milk',
    category: 'milk',
  },
  {
    id: 3,
    name: 'Double Toned',
    variant: '1 Litre',
    price: 55,
    unit: '/day',
    emoji: '🥛',
    gradient: ['#a18cd1', '#fbc2eb'],
    desc: 'Low fat, high nutrition milk',
    category: 'milk',
  },
  {
    id: 4,
    name: 'Fresh Curd',
    variant: '400 g',
    price: 38,
    unit: '/day',
    emoji: '🍶',
    gradient: ['#f7971e', '#ffd200'],
    badge: 'Fresh Daily',
    desc: 'Set curd, silky smooth texture',
    category: 'curd',
  },
  {
    id: 5,
    name: 'Table Butter',
    variant: '100 g',
    price: 55,
    unit: '/2 days',
    emoji: '🧈',
    gradient: ['#f093fb', '#f5576c'],
    desc: 'Creamy Nandini cultured butter',
    category: 'butter',
  },
  {
    id: 6,
    name: 'Nandini Ghee',
    variant: '500 ml',
    price: 285,
    unit: '/week',
    emoji: '✨',
    gradient: ['#ffd89b', '#ff9a44'],
    badge: 'Premium',
    desc: 'Pure cow ghee, rich aroma',
    category: 'ghee',
  },
  {
    id: 7,
    name: 'Fresh Paneer',
    variant: '200 g',
    price: 75,
    unit: '/day',
    emoji: '🧀',
    gradient: ['#84fab0', '#8fd3f4'],
    desc: 'Soft, fresh-made paneer cubes',
    category: 'paneer',
  },
  {
    id: 8,
    name: 'Skim Milk',
    variant: '1 Litre',
    price: 52,
    unit: '/day',
    emoji: '💧',
    gradient: ['#e0c3fc', '#8ec5fc'],
    desc: 'Zero fat, protein-rich milk',
    category: 'milk',
  },
]

const CATEGORIES = ['All', 'Milk', 'Curd', 'Butter', 'Ghee', 'Paneer']

export default function ProductsScreen() {
  const navigate = useNavigate()
  const { cart, updateCart, totalItems, totalPrice } = useApp()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const getQty = (id: number) => cart.find(p => p.id === id)?.quantity || 0

  const increment = (product: Product) => {
    const qty = getQty(product.id)
    updateCart({ ...product, quantity: qty + 1 })
  }

  const decrement = (product: Product) => {
    const qty = getQty(product.id)
    if (qty > 0) updateCart({ ...product, quantity: qty - 1 })
  }

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || p.category === activeCategory.toLowerCase()
    return matchSearch && matchCat
  })

  const handleSubscribe = () => {
    if (totalItems > 0) navigate('/success')
  }

  return (
    <PageTransition>
      <div className="screen bg-ios-gray-6">
        {/* Nav bar */}
        <div className="bg-white safe-top px-4 pb-2 pt-4"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/delivery-time')}
              className="w-10 h-10 rounded-full flex items-center justify-center active:bg-ios-gray-6"
            >
              <ArrowLeft className="w-5 h-5 text-brand-blue" />
            </button>
            <div className="flex-1">
              <h1 className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.3px]">Choose Products</h1>
              <p className="text-[12px] text-ios-gray-1">Select for your daily subscription</p>
            </div>
            <div className="text-[13px] font-semibold text-ios-gray-1">5 of 5</div>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ios-gray-2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-ios-gray-6 text-[14px]
                         text-[#1C1C1E] placeholder:text-ios-gray-2 outline-none"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium
                           transition-all duration-200 active:scale-[0.95]"
                style={{
                  background: activeCategory === cat ? '#0055A5' : '#F2F2F7',
                  color: activeCategory === cat ? 'white' : '#8E8E93',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product, i) => {
              const qty = getQty(product.id)
              const [from, to] = product.gradient
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, ease: [0.34, 1.3, 0.64, 1] }}
                  className="ios-card overflow-hidden p-0"
                  style={{
                    border: qty > 0 ? '1.5px solid #0055A5' : '1.5px solid transparent',
                  }}
                >
                  {/* Product card top (gradient) */}
                  <div className="relative h-28 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full
                                      text-[9px] font-bold text-white"
                        style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}>
                        {product.badge}
                      </div>
                    )}

                    {/* Selected indicator */}
                    {qty > 0 && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white
                                      flex items-center justify-center"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        <div className="w-3 h-3 rounded-full bg-brand-blue" />
                      </div>
                    )}

                    <span className="text-[40px]">{product.emoji}</span>
                  </div>

                  {/* Product info */}
                  <div className="p-3">
                    <h3 className="text-[13px] font-semibold text-[#1C1C1E] leading-tight mb-0.5">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-ios-gray-1 mb-1">{product.variant}</p>
                    <p className="text-[11px] text-ios-gray-2 mb-2 leading-tight">{product.desc}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[15px] font-bold text-[#1C1C1E]">₹{product.price}</span>
                        <span className="text-[11px] text-ios-gray-1">{product.unit}</span>
                      </div>

                      {/* Qty control */}
                      {qty === 0 ? (
                        <button
                          onClick={() => increment(product)}
                          className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center
                                     active:scale-90 transition-transform"
                        >
                          <Plus className="w-4 h-4 text-white stroke-[2.5]" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => decrement(product)}
                            className="w-6 h-6 rounded-full bg-ios-gray-5 flex items-center justify-center
                                       active:scale-90 transition-transform"
                          >
                            <Minus className="w-3.5 h-3.5 text-[#1C1C1E] stroke-[2.5]" />
                          </button>
                          <motion.span
                            key={qty}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="text-[14px] font-bold text-brand-blue w-5 text-center"
                          >
                            {qty}
                          </motion.span>
                          <button
                            onClick={() => increment(product)}
                            className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center
                                       active:scale-90 transition-transform"
                          >
                            <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-[40px] mb-3">🔍</span>
              <p className="text-[15px] font-semibold text-[#1C1C1E] mb-1">No products found</p>
              <p className="text-[13px] text-ios-gray-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Bottom CTA bar */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="px-4 py-3 bg-white safe-bottom"
              style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}
            >
              <button
                onClick={handleSubscribe}
                className="ios-button-primary flex items-center justify-between px-5"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>{totalItems} item{totalItems > 1 ? 's' : ''} selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>₹{totalPrice}/day</span>
                  <span className="opacity-70 ml-1">→</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* If nothing selected, show persistent minimal CTA */}
        {totalItems === 0 && (
          <div className="px-4 py-3 bg-white safe-bottom"
            style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
            <button disabled className="ios-button-primary">
              Add products to subscribe
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
