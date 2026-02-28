import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, Plus, Minus, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// ── Categories ────────────────────────────────────────────────────────────────
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

// ── Generic product (all non-milk categories) ────────────────────────────────
interface Product {
  id: string
  name: string
  variant: string
  price: number
  gradient: [string, string]
  emoji: string
  image?: string
}

// ── Milk sub-categories ───────────────────────────────────────────────────────
const MILK_SUBCATS = [
  { id: 'all',      label: 'All',        emoji: '🥛' },
  { id: 'toned',    label: 'Toned',      emoji: '💧' },
  { id: 'cream',    label: 'Full Cream', emoji: '🍦' },
  { id: 'cow',      label: 'Desi Cow',   emoji: '🐄' },
  { id: 'buffalo',  label: 'Buffalo',    emoji: '🐃' },
  { id: 'protein',  label: 'Protein',    emoji: '💪' },
]

// ── Milk-specific product ────────────────────────────────────────────────────
interface MilkProduct {
  id: string
  name: string
  emoji: string
  badge: string
  badgeColor: string
  badgeBg: string
  /** 1–5, drives fat level signal bars (1=lowest, 5=highest) */
  fatLevel: number
  fat: string
  snf: string
  subcat: string
  description: string
  bestFor: string[]
  gradient: [string, string]
  sizes: { label: string; price: number }[]
}

// ── Milk products ─────────────────────────────────────────────────────────────
const MILK_PRODUCTS: MilkProduct[] = [
  {
    id: 'mk1', subcat: 'toned',
    name: 'Nandini Pasteurized Toned Milk',
    emoji: '🥛', badge: 'TONED', badgeColor: '#007AFF', badgeBg: 'rgba(0,122,255,0.12)',
    fatLevel: 2, fat: '3.0%', snf: '8.5%',
    description: 'The everyday milk of Karnataka households. Pasteurized fresh and packed for consistent quality every morning, rain or shine.',
    bestFor: ['Chai & Coffee', 'Daily Cooking', 'Cereal'],
    gradient: ['#4facfe', '#00f2fe'],
    sizes: [{ label: '500 ml', price: 22 }, { label: '1 Litre', price: 44 }],
  },
  {
    id: 'mk2', subcat: 'toned',
    name: 'Nandini Double Toned Milk',
    emoji: '🥛', badge: 'LOW FAT', badgeColor: '#34C759', badgeBg: 'rgba(52,199,89,0.12)',
    fatLevel: 1, fat: '1.5%', snf: '9.0%',
    description: 'Half the fat, full nutrition. Ideal for health-conscious families who want to watch daily fat intake without giving up dairy.',
    bestFor: ['Diet Meals', 'Smoothies', 'Drinking'],
    gradient: ['#a8edea', '#fed6e3'],
    sizes: [{ label: '500 ml', price: 20 }, { label: '1 Litre', price: 38 }],
  },
  {
    id: 'mk3', subcat: 'cow',
    name: 'Nandini Homogeneous Cow Pure Milk',
    emoji: '🐄', badge: 'COW MILK', badgeColor: '#2E7D32', badgeBg: 'rgba(46,125,50,0.12)',
    fatLevel: 2, fat: '3.5%', snf: '8.5%',
    description: 'Pure cow milk, homogenized for consistent creaminess in every sip. Natural, wholesome and closest to what nature intended.',
    bestFor: ['Drinking Pure', 'Curd Making', 'Chai'],
    gradient: ['#84fab0', '#8fd3f4'],
    sizes: [{ label: '500 ml', price: 30 }, { label: '1 Litre', price: 58 }],
  },
  {
    id: 'mk4', subcat: 'cream',
    name: 'Nandini Samruddi Pasteurized Full Cream Milk',
    emoji: '🥛', badge: 'FULL CREAM', badgeColor: '#E65100', badgeBg: 'rgba(255,149,0,0.15)',
    fatLevel: 4, fat: '6.0%', snf: '9.0%',
    description: "Rich, creamy and full-bodied. The gold standard for households that don't compromise on taste or tradition. Every sip is indulgent.",
    bestFor: ['Kheer & Sweets', 'Thick Curd', 'Rich Coffee'],
    gradient: ['#f6d365', '#fda085'],
    sizes: [{ label: '500 ml', price: 27 }, { label: '1 Litre', price: 52 }],
  },
  {
    id: 'mk5', subcat: 'toned',
    name: 'Nandini Special Toned Milk',
    emoji: '🥛', badge: 'TONED', badgeColor: '#007AFF', badgeBg: 'rgba(0,122,255,0.12)',
    fatLevel: 2, fat: '3.0%', snf: '8.5%',
    description: 'Specially processed toned milk with uniform quality guaranteed. Consistent taste and nutrition — every single morning.',
    bestFor: ['Chai & Coffee', 'Everyday Cooking'],
    gradient: ['#89f7fe', '#66a6ff'],
    sizes: [{ label: '500 ml', price: 24 }, { label: '1 Litre', price: 46 }],
  },
  {
    id: 'mk6', subcat: 'cream',
    name: 'Nandini Shubham Gold Milk',
    emoji: '🥛', badge: 'GOLD', badgeColor: '#B8860B', badgeBg: 'rgba(184,134,11,0.12)',
    fatLevel: 3, fat: '4.5%', snf: '8.5%',
    description: 'Premium standardized milk with a golden richness. More nourishing than regular toned, lighter than full cream — the sweet spot for everyday indulgence.',
    bestFor: ['Morning Drink', 'Coffee', 'Curd Making'],
    gradient: ['#ffd89b', '#ff9a44'],
    sizes: [{ label: '500 ml', price: 27 }, { label: '1 Litre', price: 52 }],
  },
  {
    id: 'mk7', subcat: 'cow',
    name: 'Nandini Desi Cow Milk',
    emoji: '🐄', badge: 'DESI COW', badgeColor: '#2E7D32', badgeBg: 'rgba(46,125,50,0.12)',
    fatLevel: 2, fat: '3.5%', snf: '8.5%',
    description: 'From indigenous Desi cows — natural, wholesome and closest to how milk was meant to be. Preferred for Ayurvedic use and pure drinking.',
    bestFor: ['Drinking Pure', 'Ayurvedic Use', 'Children'],
    gradient: ['#96fbc4', '#f9f586'],
    sizes: [{ label: '500 ml', price: 32 }, { label: '1 Litre', price: 62 }],
  },
  {
    id: 'mk8', subcat: 'toned',
    name: 'Nandini Homogeneous Toned Milk',
    emoji: '🥛', badge: 'TONED', badgeColor: '#5856D6', badgeBg: 'rgba(88,86,214,0.12)',
    fatLevel: 2, fat: '3.0%', snf: '8.5%',
    description: 'Toned milk put through homogenization for smooth, even consistency in every glass. No cream separation, perfect texture every time.',
    bestFor: ['Chai & Coffee', 'Cooking', 'Baking'],
    gradient: ['#e0c3fc', '#8ec5fc'],
    sizes: [{ label: '500 ml', price: 22 }, { label: '1 Litre', price: 42 }],
  },
  {
    id: 'mk9', subcat: 'cream',
    name: 'Nandini Shubham Pasteurized Homogeneous Standardized Milk',
    emoji: '🥛', badge: 'STANDARDIZED', badgeColor: '#5856D6', badgeBg: 'rgba(88,86,214,0.12)',
    fatLevel: 3, fat: '4.5%', snf: '8.5%',
    description: 'Premium standardized milk, homogenized for consistent richness. The all-rounder — great in chai, coffee, curd or straight from the glass.',
    bestFor: ['All-Purpose', 'Curd Making', 'Tea & Coffee'],
    gradient: ['#4facfe', '#a18cd1'],
    sizes: [{ label: '500 ml', price: 26 }, { label: '1 Litre', price: 50 }],
  },
  {
    id: 'mk10', subcat: 'buffalo',
    name: 'Nandini Buffalo Milk',
    emoji: '🐃', badge: 'BUFFALO', badgeColor: '#E0E0E0', badgeBg: 'rgba(255,255,255,0.15)',
    fatLevel: 5, fat: '6.5%', snf: '9.0%',
    description: 'Naturally thick and supremely rich. Buffalo milk makes the creamiest curd, densest kheer and most indulgent traditional sweets.',
    bestFor: ['Curd & Lassi', 'Kheer & Halwa', 'Sweets Making'],
    gradient: ['#434343', '#1a1a1a'],
    sizes: [{ label: '500 ml', price: 30 }, { label: '1 Litre', price: 58 }],
  },
  {
    id: 'mk11', subcat: 'toned',
    name: 'Nandini Santrupri Milk',
    emoji: '🥛', badge: 'TONED', badgeColor: '#007AFF', badgeBg: 'rgba(0,122,255,0.12)',
    fatLevel: 2, fat: '3.0%', snf: '8.5%',
    description: 'Wholesome, reliable milk for the everyday family. Nandini quality you can count on, delivered fresh to your doorstep every single day.',
    bestFor: ['Daily Use', 'Cooking', 'Chai'],
    gradient: ['#d4d4d4', '#a8a8a8'],
    sizes: [{ label: '500 ml', price: 20 }, { label: '1 Litre', price: 38 }],
  },
  {
    id: 'mk12', subcat: 'protein',
    name: 'Nandini N-Pro Milk',
    emoji: '💪', badge: 'HIGH PROTEIN', badgeColor: '#6a11cb', badgeBg: 'rgba(106,17,203,0.15)',
    fatLevel: 2, fat: '3.0%', snf: '9.5%',
    description: 'Protein-enriched milk engineered for the active lifestyle. More protein per glass, same great Nandini taste. Your gym partner in a pack.',
    bestFor: ['Post-Workout', 'Growing Kids', 'Fitness Goals'],
    gradient: ['#6a11cb', '#2575fc'],
    sizes: [{ label: '500 ml', price: 36 }, { label: '1 Litre', price: 70 }],
  },
]

// ── All other category products ──────────────────────────────────────────────
const PRODUCTS: Record<string, Product[]> = {
  milk: [],   // handled by MILK_PRODUCTS
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
    { id: 'mr1', name: 'Brass Tumbler',               variant: 'Nandini Edition',    price: 349, gradient: ['#f7971e','#ffd200'], emoji: '🥛', image: '/Product%20Images/Marchandise/Brass%20Tumbler.png'                },
    { id: 'mr2', name: 'Nandini Coffee Mug',          variant: '1 pc',               price: 149, gradient: ['#f093fb','#f5576c'], emoji: '☕', image: '/Product%20Images/Marchandise/Ceramic%20Mug.png'                  },
    { id: 'mr3', name: 'Nandini Eco Tote Bag',        variant: '1 pc',               price: 150, gradient: ['#43e97b','#38f9d7'], emoji: '👜', image: '/Product%20Images/Marchandise/Door%20Hanging%20Cotton%20Bag.png'  },
    { id: 'mr4', name: 'Door Hanging Insulated Bag',  variant: 'Keeps fresh longer',  price: 299, gradient: ['#4facfe','#00f2fe'], emoji: '🧊', image: '/Product%20Images/Marchandise/Door%20Hanging%20Insulated%20Bag.png'},
  ],
}

// ── Fat spectrum bar (used in detail sheet) ───────────────────────────────────
function FatSpectrum({ fatLevel, fat }: { fatLevel: number; fat: string }) {
  const pct = ((fatLevel - 1) / 4) * 100
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <p className="text-[10px] font-semibold" style={{ color: '#8E8E93' }}>Lighter</p>
        <p className="text-[10px] font-semibold" style={{ color: '#8E8E93' }}>Rich & Creamy</p>
      </div>
      <div className="relative h-2.5 rounded-full"
        style={{ background: 'linear-gradient(90deg, #a8edea 0%, #4facfe 30%, #ffd89b 65%, #fda085 100%)' }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-[2.5px] border-[#0055A5]"
          style={{ left: `calc(${pct}% - 10px)`, boxShadow: '0 1px 6px rgba(0,0,0,0.18)' }}
        />
      </div>
      <p className="text-[12px] font-bold text-center mt-2" style={{ color: '#1C1C1E' }}>
        {fat} fat
      </p>
    </div>
  )
}

// ── Generic add button (non-milk) ─────────────────────────────────────────────
function AddButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(0)
  if (qty === 0) {
    return (
      <button
        onClick={() => setQty(1)}
        className="w-full py-2 rounded-xl border-2 text-[13px] font-bold active:scale-95 transition-transform bg-white"
        style={{ borderColor: '#0055A5', color: '#0055A5' }}
      >
        Add
      </button>
    )
  }
  return (
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
      className="flex items-center justify-between rounded-xl overflow-hidden"
      style={{ background: '#0055A5' }}>
      <button onClick={() => setQty(q => Math.max(0, q - 1))}
        className="w-9 h-9 flex items-center justify-center active:opacity-70">
        <Minus className="w-4 h-4 text-white stroke-[2.5]" />
      </button>
      <span className="text-[14px] font-bold text-white">{qty}</span>
      <button onClick={() => setQty(q => q + 1)}
        className="w-9 h-9 flex items-center justify-center active:opacity-70">
        <Plus className="w-4 h-4 text-white stroke-[2.5]" />
      </button>
    </motion.div>
  )
}

// ── Milk card (2-col grid) ────────────────────────────────────────────────────
function MilkCard({ product, onOpen }: { product: MilkProduct; onOpen: () => void }) {
  const [sizeIdx, setSizeIdx] = useState(0)
  const [qty, setQty] = useState(0)
  const size = product.sizes[sizeIdx]
  const isDark = product.subcat === 'buffalo'

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
      onClick={onOpen}
    >
      {/* Visual area */}
      <div className="relative w-full overflow-hidden" style={{
        aspectRatio: '1 / 1',
        background: `linear-gradient(145deg, ${product.gradient[0]}70, ${product.gradient[1]}BB)`,
      }}>
        {/* Badge top-left */}
        <div className="absolute top-2.5 left-2.5 px-2 py-[3px] rounded-full"
          style={{ background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.82)', backdropFilter: 'blur(6px)' }}>
          <p className="text-[8px] font-bold leading-none tracking-wide"
            style={{ color: isDark ? '#E0E0E0' : product.badgeColor }}>
            {product.badge}
          </p>
        </div>


        {/* Emoji centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontSize: 42 }}>{product.emoji}</span>
        </div>

        {/* Full cream gold bottom edge */}
        {product.subcat === 'cream' && product.badge === 'FULL CREAM' && (
          <div className="absolute inset-x-0 bottom-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, #ffd700, #ffaa00, #ffd700)' }} />
        )}
      </div>

      {/* Card body */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-2">
        {/* Name */}
        <p className="text-[11.5px] font-semibold text-[#1C1C1E] leading-tight" style={{ minHeight: 28 }}>
          {product.name.replace('Nandini ', '')}
        </p>

        {/* Fat info chip */}
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-[2px] rounded-md text-[9px] font-bold"
            style={{ background: product.badgeBg, color: product.badgeColor }}>
            Fat {product.fat}
          </span>
          <span className="text-[9px] font-medium" style={{ color: '#AEAEB2' }}>
            SNF {product.snf}
          </span>
        </div>

        {/* Size chips */}
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          {product.sizes.map((s, i) => (
            <button key={i}
              className="flex-1 py-1.5 rounded-lg text-[10.5px] font-bold transition-colors"
              style={{
                background: sizeIdx === i ? '#0055A5' : '#F2F2F7',
                color: sizeIdx === i ? 'white' : '#636366',
              }}
              onClick={() => setSizeIdx(i)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Price + add */}
        <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <p className="text-[15px] font-bold text-[#1C1C1E]">₹{size.price}</p>
          {qty === 0 ? (
            <button
              className="px-3 py-1.5 rounded-xl border-2 text-[12px] font-bold active:scale-95 transition-transform"
              style={{ borderColor: '#0055A5', color: '#0055A5' }}
              onClick={() => setQty(1)}
            >
              Add
            </button>
          ) : (
            <div className="flex items-center rounded-xl overflow-hidden" style={{ background: '#0055A5' }}>
              <button className="w-7 h-7 flex items-center justify-center active:opacity-70"
                onClick={() => setQty(q => Math.max(0, q - 1))}>
                <Minus className="w-3 h-3 text-white stroke-[2.5]" />
              </button>
              <span className="text-[13px] font-bold text-white px-0.5">{qty}</span>
              <button className="w-7 h-7 flex items-center justify-center active:opacity-70"
                onClick={() => setQty(q => q + 1)}>
                <Plus className="w-3 h-3 text-white stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Milk detail sheet ─────────────────────────────────────────────────────────
function MilkDetailSheet({ product, onClose }: { product: MilkProduct; onClose: () => void }) {
  const [sizeIdx, setSizeIdx] = useState(0)
  const [qty, setQty] = useState(0)
  const size = product.sizes[sizeIdx]

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />

      {/* Sheet */}
      <motion.div
        className="relative bg-white rounded-t-3xl overflow-hidden"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: '#D1D1D6' }} />
        </div>

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
          style={{ background: 'rgba(120,120,128,0.16)' }}>
          <X className="w-4 h-4" style={{ color: '#3C3C43' }} />
        </button>

        {/* Hero visual */}
        <div className="relative mx-4 rounded-3xl overflow-hidden mb-4" style={{
          height: 180,
          background: `linear-gradient(145deg, ${product.gradient[0]}80, ${product.gradient[1]}CC)`,
        }}>
          {/* Badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/80"
            style={{ backdropFilter: 'blur(6px)' }}>
            <p className="text-[11px] font-bold" style={{ color: product.badgeColor }}>
              {product.badge}
            </p>
          </div>

          {/* Fat + SNF stats bottom-right */}
          <div className="absolute bottom-3 right-3 flex gap-3">
            {[{ label: 'Fat', val: product.fat }, { label: 'SNF', val: product.snf }].map(s => (
              <div key={s.label} className="text-right">
                <p className="text-[8px] font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</p>
                <p className="text-[14px] font-bold text-white leading-tight">{s.val}</p>
              </div>
            ))}
          </div>

          {/* Large emoji */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: 80 }}>{product.emoji}</span>
          </div>

          {/* Full cream gold edge */}
          {product.badge === 'FULL CREAM' && (
            <div className="absolute inset-x-0 bottom-0 h-[3px]"
              style={{ background: 'linear-gradient(90deg, #ffd700, #ffaa00, #ffd700)' }} />
          )}
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-8">
          <p className="text-[19px] font-bold text-[#1C1C1E] leading-snug mb-2">
            {product.name}
          </p>
          <p className="text-[13px] leading-relaxed mb-5" style={{ color: '#636366' }}>
            {product.description}
          </p>

          {/* Fat spectrum */}
          <div className="mb-5 px-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.8px] mb-3"
              style={{ color: '#8E8E93' }}>
              Richness Level
            </p>
            <FatSpectrum fatLevel={product.fatLevel} fat={product.fat} />
          </div>

          {/* Best for */}
          <p className="text-[10px] font-bold uppercase tracking-[0.8px] mb-2"
            style={{ color: '#8E8E93' }}>
            Best for
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {product.bestFor.map((b, i) => (
              <div key={i} className="px-3 py-1.5 rounded-full"
                style={{
                  background: product.badgeBg,
                  border: `1px solid ${product.badgeColor}25`,
                }}>
                <p className="text-[12px] font-semibold" style={{ color: product.badgeColor }}>{b}</p>
              </div>
            ))}
          </div>

          {/* Pack size selector */}
          <p className="text-[10px] font-bold uppercase tracking-[0.8px] mb-2"
            style={{ color: '#8E8E93' }}>
            Pack Size
          </p>
          <div className="flex gap-3 mb-5">
            {product.sizes.map((s, i) => (
              <button key={i}
                className="flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all"
                style={{
                  background: sizeIdx === i ? '#0055A5' : '#F2F2F7',
                  border: sizeIdx === i ? 'none' : '1.5px solid #E5E5EA',
                }}
                onClick={() => setSizeIdx(i)}
              >
                <p className="text-[14px] font-bold"
                  style={{ color: sizeIdx === i ? 'white' : '#1C1C1E' }}>
                  {s.label}
                </p>
                <p className="text-[12px] font-semibold"
                  style={{ color: sizeIdx === i ? 'rgba(255,255,255,0.7)' : '#8E8E93' }}>
                  ₹{s.price}
                </p>
              </button>
            ))}
          </div>

          {/* Add to cart */}
          {qty === 0 ? (
            <button
              className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{ background: '#0055A5', boxShadow: '0 4px 16px rgba(0,85,165,0.3)' }}
              onClick={() => setQty(1)}
            >
              <p className="text-[16px] font-bold text-white">Add to Cart — ₹{size.price}</p>
            </button>
          ) : (
            <div className="flex items-center h-14 rounded-2xl overflow-hidden"
              style={{ background: '#0055A5', boxShadow: '0 4px 16px rgba(0,85,165,0.3)' }}>
              <button className="w-14 h-14 flex items-center justify-center active:opacity-70"
                onClick={() => setQty(q => Math.max(0, q - 1))}>
                <Minus className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {qty} × ₹{size.price}
                </p>
                <p className="text-[18px] font-bold text-white leading-tight">₹{qty * size.price}</p>
              </div>
              <button className="w-14 h-14 flex items-center justify-center active:opacity-70"
                onClick={() => setQty(q => q + 1)}>
                <Plus className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ProductListingScreen() {
  const navigate  = useNavigate()
  const { category = 'milk' } = useParams()
  const { userMode, enabledCategories } = useApp()
  const [activeCategory, setActiveCategory] = useState(category)
  const [openMilk, setOpenMilk] = useState<MilkProduct | null>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)

  const [milkSubcat, setMilkSubcat] = useState('all')

  const activeCat   = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0]
  const products    = PRODUCTS[activeCategory] || []
  const isMilk      = activeCategory === 'milk'
  const visibleMilk = milkSubcat === 'all'
    ? MILK_PRODUCTS
    : MILK_PRODUCTS.filter(p => p.subcat === milkSubcat)

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id)
    setOpenMilk(null)
    setMilkSubcat('all')
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
      <div className="flex items-center gap-2 px-3 safe-top pb-3 pt-4 bg-white flex-shrink-0"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.07)' }}>
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:bg-ios-gray-6">
          <ArrowLeft className="w-5 h-5 text-[#1C1C1E]" />
        </button>
        <h1 className="flex-1 text-[17px] font-bold text-[#1C1C1E] tracking-[-0.3px] text-center">
          All Categories
        </h1>
        <button className="w-9 h-9 rounded-full flex items-center justify-center active:bg-ios-gray-6">
          <Search className="w-5 h-5 text-[#1C1C1E]" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar */}
        <div className="flex-shrink-0 overflow-y-auto bg-[#F7F7F7]"
          style={{ width: 90, borderRight: '1px solid #EBEBEB', paddingBottom: 'calc(83px + 8px)' }}>
          {(userMode === 'business' ? CATEGORIES.filter(c => enabledCategories.includes(c.id)) : CATEGORIES).map(cat => {
            const isActive = cat.id === activeCategory
            return (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                className="relative w-full flex flex-col items-center py-3 px-2 gap-1.5"
                style={{
                  background: isActive ? '#FFFFFF' : 'transparent',
                  borderLeft: isActive ? '3px solid #0055A5' : '3px solid transparent',
                }}>
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{
                    background: cat.bg,
                    border: isActive ? '2px solid #0055A5' : '2px solid transparent',
                  }}>
                  <img
                    src={`/category%20images/${cat.file.replace(/ /g, '%20')}`}
                    alt={cat.name}
                    className="w-[80%] h-[80%] object-contain"
                  />
                </div>
                <p className="text-[10px] font-semibold text-center leading-tight w-full"
                  style={{ color: isActive ? '#0055A5' : '#555' }}>
                  {cat.name}
                </p>
              </button>
            )
          })}
        </div>

        {/* Right panel */}
        <div ref={rightPanelRef} className="flex-1 overflow-y-auto bg-white"
          style={{ paddingBottom: 'calc(83px + 16px)' }}>

          {/* Category heading */}
          <div className="px-4 pt-3 pb-2">
            <h2 className="text-[15px] font-bold" style={{ color: '#0055A5' }}>
              {activeCat.name}
            </h2>
            {isMilk && (
              <p className="text-[11px] mt-0.5" style={{ color: '#8E8E93' }}>
                Tap any card for full details
              </p>
            )}
          </div>

          {/* Milk sub-category pills */}
          {isMilk && (
            <div className="flex gap-2 px-4 pb-3 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}>
              {MILK_SUBCATS.map(s => {
                const active = milkSubcat === s.id
                const count  = s.id === 'all'
                  ? MILK_PRODUCTS.length
                  : MILK_PRODUCTS.filter(p => p.subcat === s.id).length
                return (
                  <button key={s.id}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[12px] font-semibold transition-all"
                    style={{
                      background: active ? '#0055A5' : '#F2F2F7',
                      color: active ? 'white' : '#636366',
                    }}
                    onClick={() => setMilkSubcat(s.id)}
                  >
                    <span style={{ fontSize: 13 }}>{s.emoji}</span>
                    {s.label}
                    <span className="text-[10px] font-bold opacity-60">{count}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Grid */}
          {isMilk ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={milkSubcat}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-2 gap-3 px-3 pb-3"
              >
                {visibleMilk.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}>
                    <MilkCard product={p} onOpen={() => setOpenMilk(p)} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="grid grid-cols-2 gap-px bg-[#F0F0F0] border-t border-[#F0F0F0]">
              {products.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white px-3 pt-3 pb-4 flex flex-col">
                  <div className="w-full rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden"
                    style={{
                      aspectRatio: '1 / 1',
                      background: `linear-gradient(135deg, ${p.gradient[0]}22, ${p.gradient[1]}44)`,
                    }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" />
                      : <span className="text-[52px]">{p.emoji}</span>
                    }
                  </div>
                  <p className="text-[11px] text-[#888] mb-0.5">{p.variant}</p>
                  <p className="text-[13px] font-semibold text-[#1C1C1E] leading-tight mb-1.5 flex-1">
                    {p.name}
                  </p>
                  <p className="text-[15px] font-bold text-[#1C1C1E] mb-2">₹{p.price}</p>
                  <AddButton product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Milk detail sheet */}
      <AnimatePresence>
        {openMilk && (
          <MilkDetailSheet
            key={openMilk.id}
            product={openMilk}
            onClose={() => setOpenMilk(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
