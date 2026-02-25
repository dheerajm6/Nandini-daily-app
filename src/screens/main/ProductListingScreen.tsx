import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, Plus, Minus } from 'lucide-react'

// ── Categories (same as CategoriesScreen) ───────────────────────────────────
const CATEGORIES = [
  { id: 'milk',            name: 'Milk',              file: 'milk.png',                 bg: '#EBF5FF' },
  { id: 'curd',            name: 'Curd',              file: 'curd.png',                 bg: '#FFFBEB' },
  { id: 'ghee',            name: 'Ghee',              file: 'ghee.png',                 bg: '#FFF7E6' },
  { id: 'butter',          name: 'Butter',            file: 'butter.png',               bg: '#FFF3E0' },
  { id: 'paneer',          name: 'Paneer & Cheese',   file: 'Paneer&Cheese.png',        bg: '#FFF0E6' },
  { id: 'flavoured-milk',  name: 'Flavoured Milk',    file: 'Flavoured Milk.png',       bg: '#F3EEFF' },
  { id: 'ice-creams',      name: 'Ice Creams',        file: 'Ice Creams.png',           bg: '#FFF0F7' },
  { id: 'sweets',          name: 'Sweets',            file: 'sweets.png',               bg: '#FFE9EE' },
  { id: 'chocolates',      name: 'Chocolates',        file: 'chocolates.png',           bg: '#FBF0E8' },
  { id: 'bakery',          name: 'Bakery',            file: 'bakery.png',               bg: '#FEFBF0' },
  { id: 'namkeen',         name: 'Namkeen',           file: 'Namkeen.png',              bg: '#F0FFF4' },
  { id: 'rusk',            name: 'Rusk & Cookies',    file: 'Rusk&Cookies.png',         bg: '#FFFDE6' },
  { id: 'instant-mix',     name: 'Instant Mix',       file: 'Instant mix.png',          bg: '#E8F7F7' },
  { id: 'milk-powder',     name: 'Milk Powder',       file: 'Milk-powder.png',          bg: '#F5F5FF' },
  { id: 'soda',            name: 'Soda Drink',        file: 'Soda Drink.png',           bg: '#E6FBFF' },
  { id: 'good-life',       name: 'Good Life',         file: 'nandini-goodlife.png',     bg: '#E8F7EE' },
  { id: 'buttermilk',      name: 'Buttermilk & Lassi',file: 'butter milk & lassi.png',  bg: '#F0FBF4' },
  { id: 'merchandise',     name: 'Merchandise',       file: 'Merchandise.png',          bg: '#F0F0FF' },
]

// ── Product mock data per category ──────────────────────────────────────────
interface Product {
  id: string
  name: string
  variant: string
  price: number
  gradient: [string, string]
  emoji: string
  image?: string
}

const PRODUCTS: Record<string, Product[]> = {
  milk: [
    { id: 'm1', name: 'Nandini Shubham Milk',          variant: '500 ml',   price: 26,  gradient: ['#4facfe','#00f2fe'], emoji: '🥛' },
    { id: 'm2', name: 'Nandini Special Toned Milk',    variant: '500 ml',   price: 24,  gradient: ['#4facfe','#00f2fe'], emoji: '🥛' },
    { id: 'm3', name: 'Nandini Homogenised Toned Milk',variant: '500 ml',   price: 22,  gradient: ['#43e97b','#38f9d7'], emoji: '🥛' },
    { id: 'm4', name: 'Nandini Samrudhi Full Cream',   variant: '1 Litre',  price: 51,  gradient: ['#a18cd1','#fbc2eb'], emoji: '🥛' },
    { id: 'm5', name: 'Nandini Pasteurized Toned Milk',variant: '500 ml',   price: 22,  gradient: ['#e0c3fc','#8ec5fc'], emoji: '🥛' },
    { id: 'm6', name: 'Pasteurised Cow Milk (A2)',     variant: '500 ml',   price: 30,  gradient: ['#96fbc4','#f9f586'], emoji: '🐄' },
  ],
  curd: [
    { id: 'c1', name: 'Nandini Fresh Curd',            variant: '500 g',    price: 30,  gradient: ['#f7971e','#ffd200'], emoji: '🍶' },
  ],
  ghee: [
    { id: 'g1', name: 'Nandini Pure Ghee',             variant: '500 ml',   price: 280, gradient: ['#ffd89b','#ff9a44'], emoji: '✨' },
    { id: 'g2', name: 'Nandini Ghee',                  variant: '200 ml Pouch', price: 141, gradient: ['#ffd89b','#ff9a44'], emoji: '✨' },
    { id: 'g3', name: 'Nandini Ghee',                  variant: '200 ml Pet Jar', price: 151, gradient: ['#f7971e','#ffd200'], emoji: '✨' },
    { id: 'g4', name: 'Nandini Ghee',                  variant: '500 ml Pet Jar', price: 325, gradient: ['#ffecd2','#fcb69f'], emoji: '✨' },
    { id: 'g5', name: 'Nandini Ghee',                  variant: '1 Ltr Pouch',    price: 630, gradient: ['#f7971e','#ffd200'], emoji: '✨' },
    { id: 'g6', name: 'Nandini Ghee',                  variant: '1 Ltr Pet Jar',  price: 650, gradient: ['#ffd89b','#ff9a44'], emoji: '✨' },
  ],
  butter: [
    { id: 'b1', name: 'Nandini Butter',                variant: '100 g',    price: 50,  gradient: ['#f093fb','#f5576c'], emoji: '🧈' },
    { id: 'b2', name: 'Nandini Salted Butter',         variant: '10 g',     price: 5,   gradient: ['#ffd89b','#ff9a44'], emoji: '🧈' },
    { id: 'b3', name: 'Nandini Salted Butter',         variant: '100 g',    price: 50,  gradient: ['#f093fb','#f5576c'], emoji: '🧈' },
    { id: 'b4', name: 'Nandini Salted Butter',         variant: '500 g',    price: 250, gradient: ['#ff758c','#ff7eb3'], emoji: '🧈' },
    { id: 'b5', name: 'Nandini Unsalted Butter',       variant: '500 g',    price: 265, gradient: ['#ffeaa7','#dfe6e9'], emoji: '🧈' },
  ],
  paneer: [
    { id: 'p1', name: 'Nandini Paneer',                variant: '200 g',    price: 100, gradient: ['#84fab0','#8fd3f4'], emoji: '🧀' },
    { id: 'p2', name: 'Nandini Paneer',                variant: '500 g',    price: 220, gradient: ['#84fab0','#8fd3f4'], emoji: '🧀' },
    { id: 'p3', name: 'Nandini Paneer',                variant: '1 kg',     price: 425, gradient: ['#a8edea','#fed6e3'], emoji: '🧀' },
    { id: 'p4', name: 'Cheese Spread',                 variant: '100 g',    price: 75,  gradient: ['#96fbc4','#f9f586'], emoji: '🧀' },
    { id: 'p5', name: 'Mozzarella Cheese',             variant: '200 g',    price: 120, gradient: ['#ffecd2','#fcb69f'], emoji: '🧀' },
    { id: 'p6', name: 'Nandini Cheddar Cheese Block',  variant: '1 kg',     price: 510, gradient: ['#f7971e','#ffd200'], emoji: '🧀' },
    { id: 'p7', name: 'Khova',                         variant: '250 g',    price: 120, gradient: ['#fbc2eb','#a18cd1'], emoji: '🍮' },
  ],
  'flavoured-milk': [
    { id: 'fl1', name: 'Kesar Badam Flavored Milk',   variant: '180 ml',   price: 25,  gradient: ['#ffecd2','#fcb69f'], emoji: '🌰' },
    { id: 'fl2', name: 'Pista Flavored Milk',         variant: '180 ml',   price: 25,  gradient: ['#84fab0','#8fd3f4'], emoji: '🌿' },
    { id: 'fl3', name: 'Strawberry Flavored Milk',    variant: '180 ml',   price: 25,  gradient: ['#ff758c','#ff7eb3'], emoji: '🍓' },
    { id: 'fl4', name: 'Banana Milkshake',            variant: '180 ml',   price: 30,  gradient: ['#f7971e','#ffd200'], emoji: '🍌' },
    { id: 'fl5', name: 'Vanilla Milkshake',           variant: '180 ml',   price: 30,  gradient: ['#fbc2eb','#a18cd1'], emoji: '🍦' },
    { id: 'fl6', name: 'Chocolate Milkshake',         variant: '180 ml',   price: 30,  gradient: ['#3d0000','#8b4513'], emoji: '🍫' },
  ],
  'ice-creams': [
    { id: 'ic1', name: 'Vanilla Ice Cream',           variant: '750 ml',   price: 150, gradient: ['#ffecd2','#fcb69f'], emoji: '🍦' },
    { id: 'ic2', name: 'Chocolate Ice Cream Cone',    variant: '100 ml',   price: 40,  gradient: ['#3d0000','#8b4513'], emoji: '🍦' },
  ],
  sweets: [
    { id: 'sw1',  name: 'Mysore Pak',                 variant: '250 g',    price: 180, gradient: ['#ffd89b','#ff9a44'], emoji: '🍯' },
    { id: 'sw2',  name: 'Mysorepak',                  variant: '25 g',     price: 15,  gradient: ['#ffd89b','#ff9a44'], emoji: '🍯' },
    { id: 'sw3',  name: 'Mysorepak',                  variant: '100 g',    price: 60,  gradient: ['#ffd89b','#ff9a44'], emoji: '🍯' },
    { id: 'sw4',  name: 'Mysorepak',                  variant: '500 g',    price: 280, gradient: ['#ffd89b','#ff9a44'], emoji: '🍯' },
    { id: 'sw5',  name: 'Dharwad Peda',               variant: '250 g',    price: 125, gradient: ['#f7971e','#ffd200'], emoji: '🍬' },
    { id: 'sw6',  name: 'Dharwad Peda Premium',       variant: '250 g',    price: 220, gradient: ['#f7971e','#ffd200'], emoji: '🍬' },
    { id: 'sw7',  name: 'Elaichi Peda',               variant: '250 g',    price: 150, gradient: ['#fbc2eb','#a18cd1'], emoji: '🍬' },
    { id: 'sw8',  name: 'Jaggery Peda',               variant: '200 g',    price: 125, gradient: ['#96fbc4','#f9f586'], emoji: '🍬' },
    { id: 'sw9',  name: 'Milk Peda',                  variant: '250 g',    price: 140, gradient: ['#ffecd2','#fcb69f'], emoji: '🍬' },
    { id: 'sw10', name: 'Gulab Jamoon',                variant: '500 g',    price: 120, gradient: ['#ff758c','#ff7eb3'], emoji: '🍡' },
    { id: 'sw11', name: 'Rossogolla',                  variant: '500 g',    price: 150, gradient: ['#fbc2eb','#a18cd1'], emoji: '🍡' },
    { id: 'sw12', name: 'Rasakadam',                   variant: '200 g',    price: 140, gradient: ['#ff758c','#ff7eb3'], emoji: '🍡' },
    { id: 'sw13', name: 'Badam Burfi',                 variant: '250 g',    price: 210, gradient: ['#ffecd2','#fcb69f'], emoji: '🍮' },
    { id: 'sw14', name: 'Cashew Burfi',                variant: '250 g',    price: 225, gradient: ['#ffd89b','#ff9a44'], emoji: '🍮' },
    { id: 'sw15', name: 'Chocolate Burfi',             variant: '250 g',    price: 145, gradient: ['#3d0000','#8b4513'], emoji: '🍮' },
    { id: 'sw16', name: 'Coconut Burfi',               variant: '200 g',    price: 130, gradient: ['#84fab0','#8fd3f4'], emoji: '🍮' },
    { id: 'sw17', name: 'Dry Fruits Burfi',            variant: '250 g',    price: 225, gradient: ['#f7971e','#ffd200'], emoji: '🍮' },
    { id: 'sw18', name: 'Special Milk Burfi',          variant: '200 g',    price: 110, gradient: ['#fbc2eb','#a18cd1'], emoji: '🍮' },
    { id: 'sw19', name: 'Nandini Peanut Burfi',        variant: '200 g',    price: 100, gradient: ['#96fbc4','#f9f586'], emoji: '🍮' },
    { id: 'sw20', name: 'Besan Ladoo',                 variant: '200 g',    price: 120, gradient: ['#ffd89b','#ff9a44'], emoji: '🟤' },
    { id: 'sw21', name: 'Godhi Laddu',                 variant: '250 g',    price: 115, gradient: ['#f7971e','#ffd200'], emoji: '🟤' },
    { id: 'sw22', name: 'Kaju Katli',                  variant: '200 g',    price: 220, gradient: ['#ffecd2','#fcb69f'], emoji: '🍮' },
    { id: 'sw23', name: 'Peanut Chikki',               variant: '100 g',    price: 45,  gradient: ['#ffd89b','#ff9a44'], emoji: '🍬' },
    { id: 'sw24', name: 'Ullas Gulla',                 variant: '200 g',    price: 100, gradient: ['#84fab0','#8fd3f4'], emoji: '🍡' },
    { id: 'sw25', name: 'Vermicelli Payasa Mix',       variant: '150 g',    price: 70,  gradient: ['#fbc2eb','#a18cd1'], emoji: '🍜' },
  ],
  chocolates: [
    { id: 'ch1', name: 'GL Almond Milk Choco',         variant: '18 g',     price: 20,  gradient: ['#3d0000','#8b4513'], emoji: '🍫' },
    { id: 'ch2', name: 'GL Crispy Milk Choco',         variant: '18 g',     price: 20,  gradient: ['#3d0000','#8b4513'], emoji: '🍫' },
    { id: 'ch3', name: 'GL Delish Milk Choco',         variant: '50 g',     price: 30,  gradient: ['#2d3436','#636e72'], emoji: '🍫' },
    { id: 'ch4', name: 'GL Orange Milk Choco',         variant: '18 g',     price: 20,  gradient: ['#f7971e','#ffd200'], emoji: '🍫' },
    { id: 'ch5', name: 'GL Rich Milk Chocolate',       variant: '36 g',     price: 30,  gradient: ['#3d0000','#8b4513'], emoji: '🍫' },
    { id: 'ch6', name: 'GL Raisins & Nuts Choco',      variant: '18 g',     price: 20,  gradient: ['#2d3436','#636e72'], emoji: '🍫' },
    { id: 'ch7', name: 'GL Raisins & Nuts Choco',      variant: '38 g',     price: 30,  gradient: ['#2d3436','#636e72'], emoji: '🍫' },
  ],
  bakery: [],
  namkeen: [
    { id: 'nk1',  name: 'Nandini Benne Murukku',       variant: '30 g',     price: 10,  gradient: ['#f7971e','#ffd200'], emoji: '🌀' },
    { id: 'nk2',  name: 'Nandini Benne Murukku',       variant: '180 g',    price: 60,  gradient: ['#f7971e','#ffd200'], emoji: '🌀' },
    { id: 'nk3',  name: 'Nandini Paneer Murukku',      variant: '180 g',    price: 75,  gradient: ['#ffecd2','#fcb69f'], emoji: '🌀' },
    { id: 'nk4',  name: 'Nandini Bombay Mixture',      variant: '30 g',     price: 10,  gradient: ['#ffd89b','#ff9a44'], emoji: '🥨' },
    { id: 'nk5',  name: 'Nandini Bombay Mixture',      variant: '180 g',    price: 60,  gradient: ['#ffd89b','#ff9a44'], emoji: '🥨' },
    { id: 'nk6',  name: 'Nandini Khara Boondi',        variant: '30 g',     price: 10,  gradient: ['#f7971e','#ffd200'], emoji: '🟡' },
    { id: 'nk7',  name: 'Nandini Khara Boondi',        variant: '180 g',    price: 60,  gradient: ['#f7971e','#ffd200'], emoji: '🟡' },
    { id: 'nk8',  name: 'Nandini Masala Kodubale',     variant: '30 g',     price: 10,  gradient: ['#ffecd2','#fcb69f'], emoji: '🌀' },
    { id: 'nk9',  name: 'Nandini Masala Kodubale',     variant: '180 g',    price: 60,  gradient: ['#ffecd2','#fcb69f'], emoji: '🌀' },
    { id: 'nk10', name: 'Paneer Nippattu',             variant: '40 g',     price: 25,  gradient: ['#96fbc4','#f9f586'], emoji: '🥐' },
  ],
  rusk: [
    { id: 'r1', name: 'Sweet n Salt Cookies',          variant: '200 g',    price: 60,  gradient: ['#ffecd2','#fcb69f'], emoji: '🍪' },
  ],
  'instant-mix': [
    { id: 'im1', name: 'Vermicelli Payasa Mix',        variant: '150 g',    price: 70,  gradient: ['#fbc2eb','#a18cd1'], emoji: '🍜' },
  ],
  'milk-powder': [
    { id: 'mp1', name: 'Skimmed Milk Powder',          variant: '500 g',    price: 200, gradient: ['#e0c3fc','#8ec5fc'], emoji: '🥛' },
    { id: 'mp2', name: 'Badam Milk Mix',               variant: '200 g',    price: 150, gradient: ['#ffecd2','#fcb69f'], emoji: '🌰' },
  ],
  soda: [],
  'good-life': [
    { id: 'gl1',  name: 'GL Almond Milk Choco',        variant: '18 g',     price: 20,  gradient: ['#3d0000','#8b4513'], emoji: '🍫' },
    { id: 'gl2',  name: 'GL Crispy Milk Choco',        variant: '18 g',     price: 20,  gradient: ['#3d0000','#8b4513'], emoji: '🍫' },
    { id: 'gl3',  name: 'GL Delish Milk Choco',        variant: '50 g',     price: 30,  gradient: ['#2d3436','#636e72'], emoji: '🍫' },
    { id: 'gl4',  name: 'GL Orange Milk Choco',        variant: '18 g',     price: 20,  gradient: ['#f7971e','#ffd200'], emoji: '🍫' },
    { id: 'gl5',  name: 'GL Rich Milk Chocolate',      variant: '36 g',     price: 30,  gradient: ['#3d0000','#8b4513'], emoji: '🍫' },
    { id: 'gl6',  name: 'GL Raisins & Nuts Choco',     variant: '18 g',     price: 20,  gradient: ['#2d3436','#636e72'], emoji: '🍫' },
    { id: 'gl7',  name: 'GL Raisins & Nuts Choco',     variant: '38 g',     price: 30,  gradient: ['#2d3436','#636e72'], emoji: '🍫' },
    { id: 'gl8',  name: 'GL Energy Bar',               variant: '12 g',     price: 10,  gradient: ['#84fab0','#8fd3f4'], emoji: '⚡' },
    { id: 'gl9',  name: 'GL Energy Bar',               variant: '22 g',     price: 15,  gradient: ['#84fab0','#8fd3f4'], emoji: '⚡' },
    { id: 'gl10', name: 'GL Energy Zesty Fruit',       variant: '12 g',     price: 10,  gradient: ['#f7971e','#ffd200'], emoji: '🍊' },
    { id: 'gl11', name: 'GL Energy Zesty Fruit',       variant: '22 g',     price: 15,  gradient: ['#f7971e','#ffd200'], emoji: '🍊' },
    { id: 'gl12', name: 'GL Rich Bar Caramel',         variant: '12 g',     price: 6,   gradient: ['#ffd89b','#ff9a44'], emoji: '🍬' },
    { id: 'gl13', name: 'GL Rich Bar Caramel',         variant: '22 g',     price: 10,  gradient: ['#ffd89b','#ff9a44'], emoji: '🍬' },
    { id: 'gl14', name: 'GL Rich Bar Caramel',         variant: '45 g',     price: 25,  gradient: ['#ffd89b','#ff9a44'], emoji: '🍬' },
  ],
  buttermilk: [
    { id: 'bl1', name: 'Spiced Buttermilk',            variant: '200 ml',   price: 10,  gradient: ['#a1ffce','#faffd1'], emoji: '🥛' },
  ],
  merchandise: [
    { id: 'mr1', name: 'Brass Tumbler',               variant: 'Nandini Edition',   price: 349, gradient: ['#f7971e','#ffd200'], emoji: '🥛', image: '/Product%20Images/Marchandise/Brass%20Tumbler.png'               },
    { id: 'mr2', name: 'Nandini Coffee Mug',          variant: '1 pc',              price: 149, gradient: ['#f093fb','#f5576c'], emoji: '☕', image: '/Product%20Images/Marchandise/Ceramic%20Mug.png'                 },
    { id: 'mr3', name: 'Nandini Eco Tote Bag',        variant: '1 pc',              price: 150, gradient: ['#43e97b','#38f9d7'], emoji: '👜', image: '/Product%20Images/Marchandise/Door%20Hanging%20Cotton%20Bag.png' },
    { id: 'mr4', name: 'Door Hanging Insulated Bag',  variant: 'Keeps fresh longer', price: 299, gradient: ['#4facfe','#00f2fe'], emoji: '🧊', image: '/Product%20Images/Marchandise/Door%20Hanging%20Insulated%20Bag.png'},
    { id: 'mr5', name: 'Nandini Water Bottle',        variant: '1 pc',              price: 299, gradient: ['#4facfe','#00f2fe'], emoji: '🍶' },
    { id: 'mr6', name: 'Nandini T-Shirt',             variant: '1 pc',              price: 199, gradient: ['#43e97b','#38f9d7'], emoji: '👕' },
    { id: 'mr7', name: 'Nandini Apron',               variant: '1 pc',              price: 99,  gradient: ['#a18cd1','#fbc2eb'], emoji: '👘' },
    { id: 'mr8', name: 'Nandini Cap',                 variant: '1 pc',              price: 129, gradient: ['#4facfe','#00f2fe'], emoji: '🧢' },
  ],
}

// ── Add button with qty toggle ───────────────────────────────────────────────
function AddButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(0)

  if (qty === 0) {
    return (
      <button
        onClick={() => setQty(1)}
        className="w-full py-2 rounded-xl border-2 text-[13px] font-bold tracking-[0.2px]
                   active:scale-95 transition-transform bg-white"
        style={{ borderColor: '#0055A5', color: '#0055A5' }}
      >
        Add
      </button>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="flex items-center justify-between rounded-xl overflow-hidden"
      style={{ background: '#0055A5' }}
    >
      <button
        onClick={() => setQty(q => Math.max(0, q - 1))}
        className="w-9 h-9 flex items-center justify-center active:opacity-70"
      >
        <Minus className="w-4 h-4 text-white stroke-[2.5]" />
      </button>
      <span className="text-[14px] font-bold text-white">{qty}</span>
      <button
        onClick={() => setQty(q => q + 1)}
        className="w-9 h-9 flex items-center justify-center active:opacity-70"
      >
        <Plus className="w-4 h-4 text-white stroke-[2.5]" />
      </button>
    </motion.div>
  )
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function ProductListingScreen() {
  const navigate = useNavigate()
  const { category = 'milk' } = useParams()
  const [activeCategory, setActiveCategory] = useState(category)
  const rightPanelRef = useRef<HTMLDivElement>(null)

  const activeCat = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0]
  const products = PRODUCTS[activeCategory] || []

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id)
    rightPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        className="flex items-center gap-2 px-3 safe-top pb-3 pt-4 bg-white flex-shrink-0"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.07)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:bg-ios-gray-6"
        >
          <ArrowLeft className="w-5 h-5 text-[#1C1C1E]" />
        </button>
        <h1 className="flex-1 text-[17px] font-bold text-[#1C1C1E] tracking-[-0.3px] text-center">
          All Categories
        </h1>
        <button className="w-9 h-9 rounded-full flex items-center justify-center active:bg-ios-gray-6">
          <Search className="w-5 h-5 text-[#1C1C1E]" />
        </button>
      </div>

      {/* Body — left sidebar + right panel */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ── */}
        <div
          className="flex-shrink-0 overflow-y-auto bg-[#F7F7F7]"
          style={{
            width: 90,
            borderRight: '1px solid #EBEBEB',
            paddingBottom: 'calc(83px + 8px)',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className="relative w-full flex flex-col items-center py-3 px-2 gap-1.5"
                style={{
                  background: isActive ? '#FFFFFF' : 'transparent',
                  borderLeft: isActive ? '3px solid #0055A5' : '3px solid transparent',
                }}
              >
                {/* Circle image */}
                <div
                  className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{
                    background: cat.bg,
                    border: isActive ? '2px solid #0055A5' : '2px solid transparent',
                  }}
                >
                  <img
                    src={`/category%20images/${cat.file.replace(/ /g, '%20')}`}
                    alt={cat.name}
                    className="w-[80%] h-[80%] object-contain"
                  />
                </div>
                {/* Name */}
                <p
                  className="text-[10px] font-semibold text-center leading-tight w-full"
                  style={{ color: isActive ? '#0055A5' : '#555' }}
                >
                  {cat.name}
                </p>
              </button>
            )
          })}
        </div>

        {/* ── Right panel ── */}
        <div
          ref={rightPanelRef}
          className="flex-1 overflow-y-auto bg-white"
          style={{ paddingBottom: 'calc(83px + 16px)' }}
        >
          {/* Category heading */}
          <div className="px-3 pt-3 pb-2">
            <h2 className="text-[15px] font-bold" style={{ color: '#0055A5' }}>
              {activeCat.name} Products
            </h2>
          </div>

          {/* Products 2-col grid */}
          <div className="grid grid-cols-2 gap-px bg-[#F0F0F0] border-t border-[#F0F0F0]">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white px-3 pt-3 pb-4 flex flex-col"
              >
                {/* Product image area */}
                <div
                  className="w-full rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden"
                  style={{
                    aspectRatio: '1 / 1',
                    background: `linear-gradient(135deg, ${product.gradient[0]}22, ${product.gradient[1]}44)`,
                  }}
                >
                  {product.image
                    ? <img src={product.image} alt={product.name}
                        className="w-full h-full object-contain p-2" />
                    : <span className="text-[52px]">{product.emoji}</span>
                  }
                </div>

                {/* Variant */}
                <p className="text-[11px] text-[#888] mb-0.5">{product.variant}</p>

                {/* Name */}
                <p className="text-[13px] font-semibold text-[#1C1C1E] leading-tight mb-1.5 flex-1">
                  {product.name}
                </p>

                {/* Price */}
                <p className="text-[15px] font-bold text-[#1C1C1E] mb-2">
                  ₹{product.price}
                </p>

                {/* Add button */}
                <AddButton product={product} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  )
}
