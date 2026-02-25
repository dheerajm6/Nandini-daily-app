import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Plus, MapPin, Check, X, ArrowLeft, Minus,
  Pause, Play, Trash2, ShoppingBag, Zap, RefreshCw,
  Navigation, MoreHorizontal, Palmtree, PauseCircle,
  XCircle, RotateCcw, CalendarRange,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────────────── */
interface SubProduct {
  id: string; name: string; variant: string
  price: number; emoji: string
  qty: number; frequency: string; paused: boolean
}

type AddrStatus = 'active' | 'on_hold' | 'vacation' | 'ended'

interface Address {
  id: string; nickname: string; houseNo: string; line1: string; city: string
  pincode: string; lat?: number; lng?: number
  planActive: boolean; planDaysLeft: number
  status: AddrStatus
  vacationFrom?: string   // ISO date "YYYY-MM-DD"
  vacationTo?: string
  endReason?: string
  products: SubProduct[]
}

interface BasketItem {
  prodId: string; name: string; variant: string
  price: number; emoji: string; freq: string; freqLabel: string; tip: string
}

interface PickedAddr { line1: string; city: string; pincode: string }

/* ─── Constants ──────────────────────────────────────────────────────── */
const FREQ_OPTS = [
  { id: 'daily',   label: 'Every Day',     sub: '30× per month' },
  { id: 'every2',  label: 'Every 2 Days',  sub: '15× per month' },
  { id: 'every3',  label: 'Every 3 Days',  sub: '10× per month' },
  { id: 'weekly',  label: 'Once a Week',   sub: '4× per month'  },
  { id: 'every15', label: 'Every 15 Days', sub: '2× per month'  },
  { id: 'monthly', label: 'Once a Month',  sub: '1× per month'  },
]
const FREQ_MULT: Record<string, number>  = { daily:30, every2:15, every3:10, weekly:4, every15:2, monthly:1 }
const FREQ_SHORT: Record<string, string> = { daily:'Daily', every2:'Alt days', every3:'Every 3d', weekly:'Weekly', every15:'Every 15d', monthly:'Monthly' }

const SUB_CATS = [
  { id: 'milk',           name: 'Milk',           bg: '#EBF5FF', emoji: '🥛' },
  { id: 'curd',           name: 'Curd',           bg: '#FFFBEB', emoji: '🍶' },
  { id: 'ghee',           name: 'Ghee',           bg: '#FFF7E6', emoji: '✨' },
  { id: 'butter',         name: 'Butter',         bg: '#FFF3E0', emoji: '🧈' },
  { id: 'paneer',         name: 'Paneer',         bg: '#FFF0E6', emoji: '🧀' },
  { id: 'buttermilk',     name: 'Buttermilk',     bg: '#F0FBF4', emoji: '🧋' },
  { id: 'flavoured-milk', name: 'Flavoured Milk', bg: '#F3EEFF', emoji: '🌟' },
  { id: 'milk-powder',    name: 'Milk Powder',    bg: '#F5F5FF', emoji: '🫙' },
  { id: 'namkeen',        name: 'Namkeen',        bg: '#F0FFF4', emoji: '🥨' },
]

const SUB_PRODS: Record<string, {id:string;name:string;variant:string;price:number;emoji:string}[]> = {
  milk: [
    {id:'m1',name:'Nandini Shubham Milk',          variant:'500 ml',        price:26, emoji:'🥛'},
    {id:'m2',name:'Nandini Special Toned Milk',    variant:'500 ml',        price:24, emoji:'🥛'},
    {id:'m3',name:'Nandini Homogenised Toned Milk',variant:'500 ml',        price:22, emoji:'🥛'},
    {id:'m4',name:'Nandini Samrudhi Full Cream',   variant:'1 Litre',       price:51, emoji:'🥛'},
    {id:'m5',name:'Nandini Pasteurized Toned Milk',variant:'500 ml',        price:22, emoji:'🥛'},
    {id:'m6',name:'Pasteurised Cow Milk (A2)',     variant:'500 ml',        price:30, emoji:'🐄'},
  ],
  curd:          [{id:'c1', name:'Nandini Fresh Curd',        variant:'500 g',         price:30, emoji:'🍶'}],
  ghee: [
    {id:'g1',name:'Nandini Pure Ghee',   variant:'500 ml',          price:280,emoji:'✨'},
    {id:'g2',name:'Nandini Ghee',        variant:'200 ml Pouch',    price:141,emoji:'✨'},
    {id:'g3',name:'Nandini Ghee',        variant:'500 ml Pet Jar',  price:325,emoji:'✨'},
    {id:'g4',name:'Nandini Ghee',        variant:'1 Ltr Pouch',     price:630,emoji:'✨'},
  ],
  butter: [
    {id:'b1',name:'Nandini Butter',         variant:'100 g', price:50, emoji:'🧈'},
    {id:'b2',name:'Nandini Salted Butter',  variant:'500 g', price:250,emoji:'🧈'},
    {id:'b3',name:'Nandini Unsalted Butter',variant:'500 g', price:265,emoji:'🧈'},
  ],
  paneer: [
    {id:'p1',name:'Nandini Paneer',variant:'200 g',price:100,emoji:'🧀'},
    {id:'p2',name:'Nandini Paneer',variant:'500 g',price:220,emoji:'🧀'},
    {id:'p3',name:'Nandini Paneer',variant:'1 kg', price:425,emoji:'🧀'},
  ],
  buttermilk:      [{id:'bm1',name:'Spiced Buttermilk',       variant:'200 ml',price:10, emoji:'🧋'}],
  'flavoured-milk': [
    {id:'fl1',name:'Kesar Badam Flavored Milk',variant:'180 ml',price:25,emoji:'🌰'},
    {id:'fl2',name:'Strawberry Flavored Milk', variant:'180 ml',price:25,emoji:'🍓'},
    {id:'fl3',name:'Banana Milkshake',         variant:'180 ml',price:30,emoji:'🍌'},
  ],
  'milk-powder': [
    {id:'mp1',name:'Skimmed Milk Powder',variant:'500 g',price:200,emoji:'🫙'},
    {id:'mp2',name:'Badam Milk Mix',     variant:'200 g',price:150,emoji:'🌰'},
  ],
  namkeen: [
    {id:'n1',name:'Benne Murukku',variant:'170 g',price:40,emoji:'🥨'},
    {id:'n2',name:'Khara Boondi', variant:'150 g',price:30,emoji:'🥜'},
  ],
}

const BASKET_MAP: Record<string, BasketItem[]> = {
  milk: [
    {prodId:'c1',name:'Fresh Curd',   variant:'500 g', price:30, emoji:'🍶',freq:'every3', freqLabel:'Every 3 days', tip:'Great with parathas & rice'},
    {prodId:'b1',name:'Butter',       variant:'100 g', price:50, emoji:'🧈',freq:'every2', freqLabel:'Every 2 days', tip:'Perfect for morning toast'},
    {prodId:'p1',name:'Paneer',       variant:'200 g', price:100,emoji:'🧀',freq:'every15',freqLabel:'Every 15 days',tip:'For curries & grilling'},
  ],
  curd: [
    {prodId:'m1',name:'Shubham Milk', variant:'500 ml',price:26, emoji:'🥛',freq:'daily',  freqLabel:'Daily',        tip:'Start your mornings right'},
    {prodId:'b1',name:'Butter',       variant:'100 g', price:50, emoji:'🧈',freq:'every2', freqLabel:'Every 2 days', tip:'Pairs beautifully with curd'},
    {prodId:'g1',name:'Pure Ghee',    variant:'500 ml',price:280,emoji:'✨',freq:'every15',freqLabel:'Every 15 days',tip:'Lasts a family of 4 perfectly'},
  ],
  ghee: [
    {prodId:'m1',name:'Shubham Milk', variant:'500 ml',price:26, emoji:'🥛',freq:'daily',  freqLabel:'Daily',        tip:'Essential daily nutrition'},
    {prodId:'c1',name:'Fresh Curd',   variant:'500 g', price:30, emoji:'🍶',freq:'every3', freqLabel:'Every 3 days', tip:'Probiotic goodness'},
    {prodId:'p1',name:'Paneer',       variant:'200 g', price:100,emoji:'🧀',freq:'every15',freqLabel:'Every 15 days',tip:'Protein for the family'},
  ],
  butter: [
    {prodId:'m1',name:'Shubham Milk', variant:'500 ml',price:26, emoji:'🥛',freq:'daily',  freqLabel:'Daily',        tip:'The classic combo'},
    {prodId:'c1',name:'Fresh Curd',   variant:'500 g', price:30, emoji:'🍶',freq:'every3', freqLabel:'Every 3 days', tip:'For raita & lassi'},
  ],
  paneer: [
    {prodId:'g1',name:'Pure Ghee',    variant:'500 ml',price:280,emoji:'✨',freq:'every15',freqLabel:'Every 15 days',tip:'Cooking essentials duo'},
    {prodId:'c1',name:'Fresh Curd',   variant:'500 g', price:30, emoji:'🍶',freq:'every3', freqLabel:'Every 3 days', tip:'For raita & sides'},
    {prodId:'m1',name:'Shubham Milk', variant:'500 ml',price:26, emoji:'🥛',freq:'daily',  freqLabel:'Daily',        tip:'Complete your dairy basket'},
  ],
}

const NICKNAME_CHIPS = ['🏠 Home', '👴 Parents', '💒 In-Laws', '🏢 Office']

const INIT_ADDRESSES: Address[] = [
  {
    id: 'a1', nickname: 'Home', houseNo: 'No. 42', line1: '3rd Cross, Indiranagar',
    city: 'Bengaluru', pincode: '560038',
    lat: 12.9784, lng: 77.6408,
    planActive: true, planDaysLeft: 18, status: 'active' as AddrStatus,
    products: [
      {id:'sp1',name:'Nandini Shubham Milk',variant:'500 ml',price:26, emoji:'🥛',qty:2,frequency:'daily',  paused:false},
      {id:'sp2',name:'Nandini Fresh Curd',  variant:'500 g', price:30, emoji:'🍶',qty:1,frequency:'every3', paused:false},
      {id:'sp3',name:'Nandini Pure Ghee',   variant:'500 ml',price:280,emoji:'✨',qty:1,frequency:'every15',paused:true },
    ],
  },
]

/* ─── Map sub-components ─────────────────────────────────────────────── */
// Captures map instance via hook (must be inside MapContainer)
function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap()
  useEffect(() => { mapRef.current = map }, [map, mapRef])
  return null
}

// Handles tap-to-place on map
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onClick(e.latlng.lat, e.latlng.lng) } })
  return null
}

/* ─── Map Picker ─────────────────────────────────────────────────────── */
const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946]

function MapPickerView({ onPick }: { onPick: (lat: number, lng: number, addr: PickedAddr) => void }) {
  const [pos, setPos]               = useState<[number, number]>(BENGALURU_CENTER)
  const [geocoding, setGeocoding]   = useState(false)
  const [locating, setLocating]     = useState(false)
  const [fetchedLabel, setFetched]  = useState<string | null>(null)
  const [fetchError, setFetchError] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  // Custom blue teardrop pin
  const pinIcon = useMemo(() => L.divIcon({
    html: `
      <div style="position:relative;width:28px;height:36px;filter:drop-shadow(0 3px 6px rgba(0,85,165,0.45))">
        <div style="width:28px;height:28px;background:#0055A5;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);border:3px solid white"></div>
        <div style="position:absolute;top:10px;left:50%;transform:translateX(-50%);
          width:8px;height:8px;border-radius:50%;background:white"></div>
      </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    className: '',
  }), [])

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setGeocoding(true)
    setFetchError(false)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        { headers: { 'User-Agent': 'NandiniDailyApp/1.0' } }
      )
      const data = await res.json()
      const a = data.address ?? {}
      const parts = [a.road, a.neighbourhood || a.suburb || a.quarter].filter(Boolean)
      const result: PickedAddr = {
        line1:   parts.join(', '),
        city:    a.city || a.town || a.village || a.state_district || '',
        pincode: a.postcode || '',
      }
      setFetched([result.line1, result.city, result.pincode].filter(Boolean).join('  ·  '))
      onPick(lat, lng, result)
    } catch {
      setFetchError(true)
      setFetched('Could not fetch address — fill fields below manually')
    }
    setGeocoding(false)
  }, [onPick])

  const handleMapClick = (lat: number, lng: number) => {
    setPos([lat, lng])
    reverseGeocode(lat, lng)
  }

  const locateMe = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        setPos([lat, lng])
        mapRef.current?.flyTo([lat, lng], 17, { duration: 1 })
        reverseGeocode(lat, lng)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="mb-4">
      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: 240 }}>
        <MapContainer
          center={pos}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapRefCapture mapRef={mapRef} />
          <MapClickHandler onClick={handleMapClick} />
          <Marker
            position={pos}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend(e) {
                const ll = e.target.getLatLng()
                handleMapClick(ll.lat, ll.lng)
              },
            }}
          />
        </MapContainer>

        {/* Hint overlay (shown before any interaction) */}
        {!fetchedLabel && !geocoding && (
          <div
            className="absolute inset-x-0 top-3 flex justify-center pointer-events-none z-[999]"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#1C1C1E]"
              style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
              <MapPin className="w-3 h-3 text-[#0055A5]" />
              Tap the map or drag the pin to pick your location
            </div>
          </div>
        )}

        {/* Geocoding spinner */}
        {geocoding && (
          <div className="absolute inset-x-0 top-3 flex justify-center z-[1000]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <RefreshCw className="w-3.5 h-3.5 text-[#0055A5] animate-spin" />
              <span className="text-[11px] font-semibold text-[#0055A5]">Fetching address…</span>
            </div>
          </div>
        )}

        {/* Locate Me button */}
        <button
          onClick={locateMe}
          disabled={locating || geocoding}
          className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-[12px] font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-60"
          style={{ background: '#0055A5' }}
        >
          <Navigation className="w-3.5 h-3.5" />
          {locating ? 'Locating…' : 'Locate Me'}
        </button>

        {/* Attribution (tiny) */}
        <div className="absolute bottom-1 left-2 z-[999] text-[9px] text-[#666] pointer-events-none">
          © OpenStreetMap
        </div>
      </div>

      {/* Fetched address pill */}
      <AnimatePresence>
        {fetchedLabel && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 mt-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: fetchError ? '#FFF3E0' : '#E8F8EF' }}
          >
            {fetchError
              ? <span className="text-[14px] flex-shrink-0 mt-0.5">⚠️</span>
              : <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00C853' }} />
            }
            <p className={`text-[12px] leading-snug ${fetchError ? 'text-[#8B4000]' : 'text-[#1C6E3D]'}`}>
              {fetchedLabel}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Sheet types ────────────────────────────────────────────────────── */
type SheetType  = 'addAddress' | 'activatePlan' | 'addProduct' | 'manage' | null
type AddStep    = 'cat' | 'products' | 'freq' | 'basket' | 'bag'
type ManageStep = 'options' | 'vacation' | 'hold' | 'end'

const END_REASONS = [
  'Moving to another city',
  'Taking a break / Travel',
  'Product quality issue',
  'Delivery not on time',
  'Too expensive',
  'Other',
]

const todayISO = () => new Date().toISOString().split('T')[0]
const vacDays  = (from: string, to: string) => {
  if (!from || !to) return 0
  return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1)
}
const fmtDate  = (iso: string) => iso
  ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : ''

/* ─── Screen ─────────────────────────────────────────────────────────── */
export default function SubscriptionsScreen() {
  const [addresses, setAddresses]     = useState<Address[]>(INIT_ADDRESSES)
  const [sheet, setSheet]             = useState<SheetType>(null)
  const [activeId, setActiveId]       = useState<string | null>(null)
  const [addStep, setAddStep]         = useState<AddStep>('cat')
  const [selCat, setSelCat]           = useState<string | null>(null)
  const [selProd, setSelProd]         = useState<{id:string;name:string;variant:string;price:number;emoji:string} | null>(null)
  const [selFreq, setSelFreq]         = useState('daily')
  const [selQty, setSelQty]           = useState(1)
  const [bagOffered, setBagOffered]   = useState(false)
  const [bagAdded, setBagAdded]       = useState(false)
  const [basketAdded, setBasketAdded] = useState<Set<string>>(new Set())
  const [addrForm, setAddrForm]       = useState({ nickname: '', houseNo: '', line1: '', city: '', pincode: '' })
  const [addrCoords, setAddrCoords]   = useState<{lat:number;lng:number} | null>(null)
  const [addrError, setAddrError]     = useState('')
  // Manage sheet
  const [manageStep, setManageStep]   = useState<ManageStep>('options')
  const [vacFrom, setVacFrom]         = useState('')
  const [vacTo, setVacTo]             = useState('')
  const [endReason, setEndReason]     = useState('')

  /* ── helpers ─────────────────────────────────── */
  const monthlyEst = (products: SubProduct[]) =>
    products.reduce((s, p) => s + p.price * p.qty * (FREQ_MULT[p.frequency] ?? 30), 0)

  const injectProd = (name: string, variant: string, price: number, emoji: string, qty: number, freq: string) => {
    setAddresses(prev => prev.map(a =>
      a.id === activeId
        ? { ...a, products: [...a.products, { id: `sp${Date.now()}${Math.random().toString(36).slice(2)}`, name, variant, price, emoji, qty, frequency: freq, paused: false }] }
        : a
    ))
  }

  const closeSheet = () => {
    setSheet(null); setActiveId(null)
    setAddStep('cat'); setSelCat(null); setSelProd(null)
    setSelFreq('daily'); setSelQty(1); setBasketAdded(new Set())
    setAddrError(''); setAddrCoords(null)
    setAddrForm({ nickname: '', houseNo: '', line1: '', city: '', pincode: '' })
    setManageStep('options'); setVacFrom(''); setVacTo(''); setEndReason('')
  }

  const updateAddr = (id: string, patch: Partial<Address>) =>
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a))

  /* ── Manage actions ─────────────────────────────────── */
  const openManage = (addrId: string) => {
    setActiveId(addrId); setManageStep('options'); setSheet('manage')
  }

  const handleHold = () => {
    updateAddr(activeId!, { status: 'on_hold' })
    closeSheet()
  }

  const handleResume = (addrId: string) => {
    updateAddr(addrId, { status: 'active', vacationFrom: undefined, vacationTo: undefined })
  }

  const handleSetVacation = () => {
    if (!vacFrom || !vacTo || vacFrom >= vacTo) return
    const days = vacDays(vacFrom, vacTo)
    updateAddr(activeId!, {
      status: 'vacation',
      vacationFrom: vacFrom,
      vacationTo: vacTo,
      planDaysLeft: (addresses.find(a => a.id === activeId)?.planDaysLeft ?? 0) + days,
    })
    closeSheet()
  }

  const handleCancelVacation = (addrId: string) => {
    const addr = addresses.find(a => a.id === addrId)
    if (!addr) return
    const days = vacDays(addr.vacationFrom ?? '', addr.vacationTo ?? '')
    updateAddr(addrId, {
      status: 'active',
      vacationFrom: undefined,
      vacationTo: undefined,
      planDaysLeft: Math.max(0, (addr.planDaysLeft ?? 0) - days),
    })
  }

  const handleEndSubscription = () => {
    updateAddr(activeId!, {
      status: 'ended',
      planActive: false,
      products: [],
      endReason: endReason || 'Not specified',
    })
    closeSheet()
  }

  /* ── actions ─────────────────────────────────── */
  const handleActivatePlan = () => {
    setAddresses(prev => prev.map(a => a.id === activeId ? { ...a, planActive: true, planDaysLeft: 30 } : a))
    setAddStep('cat')
    setSheet('addProduct')
  }

  const handleAddAddress = () => {
    if (!addrForm.nickname.trim() || !addrForm.houseNo.trim()) {
      setAddrError('Nickname and house/flat number are required')
      return
    }
    if (!addrForm.city.trim()) {
      setAddrError('Please pick a location on the map or enter the city')
      return
    }
    setAddresses(prev => [...prev, {
      id: `a${Date.now()}`,
      nickname: addrForm.nickname.trim(),
      houseNo:  addrForm.houseNo.trim(),
      line1:    addrForm.line1.trim(),
      city:     addrForm.city.trim(),
      pincode:  addrForm.pincode.trim(),
      lat: addrCoords?.lat,
      lng: addrCoords?.lng,
      planActive: false, planDaysLeft: 0, status: 'active' as AddrStatus, products: [],
    }])
    closeSheet()
  }

  const handleMapPick = useCallback((lat: number, lng: number, addr: PickedAddr) => {
    setAddrCoords({ lat, lng })
    setAddrForm(f => ({
      ...f,
      line1:   addr.line1 || f.line1,
      city:    addr.city   || f.city,
      pincode: addr.pincode || f.pincode,
    }))
  }, [])

  const handleConfirmProduct = () => {
    if (!selProd || !activeId) return
    const addr = addresses.find(a => a.id === activeId)
    const isFirst = addr?.products.length === 0
    injectProd(selProd.name, selProd.variant, selProd.price, selProd.emoji, selQty, selFreq)
    if (isFirst && selCat && BASKET_MAP[selCat]) {
      setAddStep('basket')
    } else if (!bagOffered) {
      setAddStep('bag'); setBagOffered(true)
    } else {
      closeSheet()
    }
  }

  const quickAddBasket = (item: BasketItem) => {
    if (basketAdded.has(item.prodId)) return
    injectProd(item.name, item.variant, item.price, item.emoji, 1, item.freq)
    setBasketAdded(prev => new Set([...prev, item.prodId]))
  }

  const doneBasket = () => {
    if (!bagOffered) { setAddStep('bag'); setBagOffered(true) }
    else { closeSheet() }
  }

  const togglePause = (addrId: string, prodId: string) =>
    setAddresses(prev => prev.map(a => a.id === addrId
      ? { ...a, products: a.products.map(p => p.id === prodId ? { ...p, paused: !p.paused } : p) }
      : a
    ))

  const removeProd = (addrId: string, prodId: string) =>
    setAddresses(prev => prev.map(a => a.id === addrId
      ? { ...a, products: a.products.filter(p => p.id !== prodId) }
      : a
    ))

  /* ── sheet utils ─────────────────────────────── */
  const sheetTitle = (): string => {
    if (sheet === 'addAddress')   return 'Add Delivery Address'
    if (sheet === 'activatePlan') return 'Delivery Plan'
    if (sheet === 'manage') {
      const nick = addresses.find(a => a.id === activeId)?.nickname ?? ''
      if (manageStep === 'options')  return `Manage · ${nick}`
      if (manageStep === 'vacation') return 'Vacation Mode'
      if (manageStep === 'hold')     return 'Hold Plan'
      if (manageStep === 'end')      return 'End Subscription'
    }
    if (sheet === 'addProduct') {
      if (addStep === 'cat')      return 'Choose Category'
      if (addStep === 'products') return SUB_CATS.find(c => c.id === selCat)?.name ?? 'Products'
      if (addStep === 'freq')     return 'Set Delivery Schedule'
      if (addStep === 'basket')   return 'Complete Your Basket'
      if (addStep === 'bag')      return 'One Last Thing'
    }
    return ''
  }

  const sheetBack = () => {
    if (sheet === 'manage' && manageStep !== 'options') {
      setManageStep('options')
    } else if (sheet === 'addProduct') {
      if (addStep === 'products') { setAddStep('cat'); setSelCat(null) }
      else if (addStep === 'freq') { setAddStep('products'); setSelProd(null) }
      else closeSheet()
    } else {
      closeSheet()
    }
  }

  const canGoBack = (sheet === 'manage' && manageStep !== 'options')
    || (sheet === 'addProduct' && (addStep === 'products' || addStep === 'freq'))
  const stepIndex: Record<AddStep, number> = { cat: 0, products: 1, freq: 2, basket: 3, bag: 3 }

  /* ─────────────────────────────────────────────────────────────────── */
  return (
    <div className="relative h-full">

      {/* ── Scrollable main ─────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-y-auto bg-[#F2F2F7]">

        {/* Header */}
        <div className="bg-white safe-top px-5 pb-4 pt-4" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-[-0.4px]">Subscriptions</h1>
              <p className="text-[13px] text-[#8E8E93]">
                {addresses.length === 0
                  ? 'Set up daily deliveries'
                  : `${addresses.length} address${addresses.length > 1 ? 'es' : ''} · ${addresses.reduce((s, a) => s + a.products.length, 0)} products`}
              </p>
            </div>
            <button
              onClick={() => setSheet('addAddress')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white text-[13px] font-semibold active:opacity-80"
              style={{ background: '#0055A5' }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Address
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4" style={{ paddingBottom: 'calc(83px + 24px)' }}>

          {/* Empty state */}
          {addresses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #0055A5, #4facfe)' }} />
              <div className="px-6 py-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-4xl" style={{ background: '#EBF5FF' }}>
                  🥛
                </div>
                <h2 className="text-[20px] font-bold text-[#1C1C1E] mb-1.5 tracking-[-0.3px]">Start your daily routine</h2>
                <p className="text-[14px] text-[#8E8E93] leading-relaxed mb-6 max-w-[260px]">
                  Fresh Nandini products delivered to your door every morning — automatically.
                </p>
                <div className="w-full rounded-xl p-4 mb-6 text-left space-y-3" style={{ background: '#F8FAFF' }}>
                  {[
                    { icon: '📍', t: 'Pin your address on map',    s: 'GPS auto-fills address & pincode' },
                    { icon: '🛒', t: 'Pick products & frequency',  s: 'Milk daily, Ghee every 15 days…'  },
                    { icon: '🚴', t: 'Fresh delivery every day',   s: 'Before 7 AM, right at your door'  },
                  ].map(step => (
                    <div key={step.t} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] flex-shrink-0" style={{ background: '#EBF5FF' }}>
                        {step.icon}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#1C1C1E]">{step.t}</p>
                        <p className="text-[11px] text-[#8E8E93]">{step.s}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSheet('addAddress')}
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] active:opacity-85"
                  style={{ background: 'linear-gradient(135deg, #0055A5, #0077CC)' }}
                >
                  Add Your First Address
                </button>
                <p className="text-[11px] text-[#AEAEB2] mt-3">₹99/month per address · ₹3 per delivery</p>
              </div>
            </motion.div>
          )}

          {/* Address cards */}
          {addresses.map((addr, i) => {
            const est         = monthlyEst(addr.products)
            const pausedCount = addr.products.filter(p => p.paused).length
            const isHeld      = addr.status === 'on_hold'
            const isVacation  = addr.status === 'vacation'
            const isEnded     = addr.status === 'ended'
            const isActive    = addr.status === 'active'
            const topBarBg    = isEnded   ? '#E0E0E0'
                              : isHeld    ? 'linear-gradient(90deg,#F59E0B,#FCD34D)'
                              : isVacation? 'linear-gradient(90deg,#06B6D4,#22D3EE)'
                              : addr.planActive ? 'linear-gradient(90deg,#0055A5,#4facfe)'
                              : '#E0E0E0'

            return (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', opacity: isEnded ? 0.75 : 1 }}
              >
                <div className="h-1" style={{ background: topBarBg }} />

                {/* Card header */}
                <div className="flex items-start gap-3 px-4 pt-3.5 pb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: isVacation ? '#E0F7FA' : isHeld ? '#FFF8E1' : addr.planActive ? '#EBF5FF' : '#F2F2F7' }}>
                    <MapPin className="w-[18px] h-[18px]"
                      style={{ color: isVacation ? '#06B6D4' : isHeld ? '#F59E0B' : addr.planActive ? '#0055A5' : '#8E8E93' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[16px] font-bold text-[#1C1C1E]">{addr.nickname}</p>
                      {isEnded   && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F2F2F7] text-[#8E8E93]">Ended</span>}
                      {isHeld    && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:'#FFF8E1',color:'#B45309' }}>On Hold</span>}
                      {isVacation&& <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:'#E0F7FA',color:'#0891B2' }}>Vacation</span>}
                      {isActive && addr.planActive && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:'#EBF5FF',color:'#0055A5' }}>{addr.planDaysLeft}d left</span>}
                      {!addr.planActive && !isEnded && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F2F2F7] text-[#8E8E93]">No plan</span>}
                      {pausedCount > 0 && isActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:'#FFF3E0',color:'#E65100' }}>
                          {pausedCount} paused
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#8E8E93] truncate">
                      {addr.houseNo ? `${addr.houseNo}, ` : ''}{addr.line1 ? `${addr.line1}, ` : ''}{addr.city}{addr.pincode ? ` – ${addr.pincode}` : ''}
                    </p>
                  </div>
                  {/* ⋯ manage menu — only when plan is active and not ended */}
                  {addr.planActive && !isEnded && (
                    <button
                      onClick={() => openManage(addr.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 active:bg-[#F2F2F7]"
                    >
                      <MoreHorizontal className="w-4 h-4 text-[#8E8E93]" />
                    </button>
                  )}
                </div>

                {/* ── Status banners ── */}
                {isHeld && (
                  <div className="mx-4 mb-3 px-4 py-3 rounded-xl flex items-center gap-3"
                    style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <PauseCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#D97706' }} />
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#92400E]">Deliveries on hold</p>
                      <p className="text-[11px] text-[#B45309]">Your plan days are frozen — resume anytime</p>
                    </div>
                    <button onClick={() => handleResume(addr.id)}
                      className="px-3 py-1.5 rounded-full text-[12px] font-bold text-white active:opacity-80"
                      style={{ background: '#D97706' }}>
                      Resume
                    </button>
                  </div>
                )}

                {isVacation && addr.vacationFrom && addr.vacationTo && (
                  <div className="mx-4 mb-3 px-4 py-3 rounded-xl" style={{ background: '#E0F7FA', border: '1px solid #A5F3FC' }}>
                    <div className="flex items-start gap-3">
                      <Palmtree className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0891B2' }} />
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold" style={{ color: '#0C4A6E' }}>Vacation mode active</p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#0891B2' }}>
                          {fmtDate(addr.vacationFrom)} → {fmtDate(addr.vacationTo)}
                          <span className="ml-1.5 font-bold">· {vacDays(addr.vacationFrom, addr.vacationTo)} days</span>
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#0891B2' }}>
                          Auto-resumes · {vacDays(addr.vacationFrom, addr.vacationTo)}d added to your plan
                        </p>
                      </div>
                      <button onClick={() => handleCancelVacation(addr.id)}
                        className="text-[11px] font-bold px-2.5 py-1.5 rounded-full active:opacity-70"
                        style={{ background: '#BAE6FD', color: '#0369A1' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {isEnded && (
                  <div className="mx-4 mb-3 px-4 py-3 rounded-xl flex items-center gap-3"
                    style={{ background: '#F9F9F9', border: '1px dashed #D0D0D0' }}>
                    <XCircle className="w-5 h-5 flex-shrink-0 text-[#AEAEB2]" />
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#8E8E93]">Subscription ended</p>
                      {addr.endReason && <p className="text-[11px] text-[#AEAEB2]">Reason: {addr.endReason}</p>}
                    </div>
                    <button onClick={() => { setActiveId(addr.id); setSheet('activatePlan') }}
                      className="px-3 py-1.5 rounded-full text-[12px] font-bold text-white active:opacity-80"
                      style={{ background: '#0055A5' }}>
                      Reactivate
                    </button>
                  </div>
                )}

                {/* Plan not active (never activated) */}
                {!addr.planActive && !isEnded && (
                  <div className="px-4 pb-4">
                    <div className="rounded-xl p-3 mb-3" style={{ background: '#F5F5FF', border: '1.5px dashed #C0C0E0' }}>
                      <p className="text-[13px] text-[#5C5C8A] text-center leading-relaxed">
                        Activate a ₹99/month plan to start subscribing products at this address
                      </p>
                    </div>
                    <button
                      onClick={() => { setActiveId(addr.id); setSheet('activatePlan') }}
                      className="w-full py-2.5 rounded-xl text-white text-[14px] font-semibold active:opacity-85"
                      style={{ background: '#0055A5' }}
                    >
                      Activate Plan · ₹99/mo
                    </button>
                  </div>
                )}

                {/* Plan active — products + footer */}
                {addr.planActive && !isEnded && (
                  <div style={{ opacity: isHeld || isVacation ? 0.5 : 1 }}>
                    <div className="h-px mx-4 bg-[#F2F2F7]" />
                    {addr.products.length > 0 && (
                      <div className="px-4 py-3 space-y-3">
                        {addr.products.map(prod => (
                          <div key={prod.id} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
                              style={{ background: '#F5F5F5', opacity: prod.paused ? 0.4 : 1 }}>
                              {prod.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className={`text-[13px] font-semibold truncate ${prod.paused ? 'text-[#AEAEB2]' : 'text-[#1C1C1E]'}`}>{prod.name}</p>
                                {prod.paused && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FFE5E5] text-[#CC0000] flex-shrink-0">PAUSED</span>}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-[#8E8E93]">{prod.variant} ×{prod.qty}</span>
                                <span className="text-[10px] text-[#C7C7CC]">·</span>
                                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: '#EBF5FF', color: '#0055A5' }}>
                                  {FREQ_SHORT[prod.frequency]}
                                </span>
                              </div>
                            </div>
                            {isActive && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button onClick={() => togglePause(addr.id, prod.id)}
                                  className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90"
                                  style={{ background: prod.paused ? '#EBF5FF' : '#F2F2F7' }}>
                                  {prod.paused ? <Play className="w-3 h-3" style={{ color: '#0055A5' }} /> : <Pause className="w-3 h-3 text-[#8E8E93]" />}
                                </button>
                                <button onClick={() => removeProd(addr.id, prod.id)}
                                  className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90"
                                  style={{ background: '#FFF0F0' }}>
                                  <Trash2 className="w-3 h-3" style={{ color: '#FF3B30' }} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {addr.products.length === 0 && (
                      <div className="mx-4 my-3 rounded-xl p-4 text-center" style={{ background: '#F8F9FF' }}>
                        <p className="text-[13px] font-medium text-[#5C5C8A]">No products yet</p>
                        <p className="text-[11px] text-[#AEAEB2] mt-0.5">Add your first product to begin daily deliveries</p>
                      </div>
                    )}
                    {isActive && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-[#F2F2F7]">
                        <div>
                          <p className="text-[10px] text-[#AEAEB2] uppercase tracking-wide">Est. monthly</p>
                          <p className="text-[15px] font-bold text-[#1C1C1E]">
                            ₹{(99 + est).toLocaleString('en-IN')}<span className="text-[11px] font-normal text-[#8E8E93]"> /mo</span>
                          </p>
                          {est > 0 && <p className="text-[10px] text-[#AEAEB2]">₹99 plan + ₹{est.toLocaleString('en-IN')} products</p>}
                        </div>
                        <button
                          onClick={() => { setActiveId(addr.id); setAddStep('cat'); setSheet('addProduct') }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold active:opacity-75"
                          style={{ background: '#EBF5FF', color: '#0055A5' }}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          Add Product
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}

          {/* Tip card */}
          {addresses.length > 0 && addresses.every(a => a.products.length === 0 && a.planActive) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,#0055A5,#0099CC)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white">Build your basket</p>
                  <p className="text-[12px] text-white/75 mt-0.5 leading-relaxed">
                    Start with Milk daily, then we'll suggest Curd, Ghee, Butter — all at the right frequency for your family.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Bottom Sheet ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              className="absolute inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.45)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { if (!['basket','bag'].includes(addStep)) closeSheet() }}
            />
            <motion.div
              className="absolute bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl flex flex-col"
              style={{ maxHeight: '92vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              {/* Handle */}
              <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#E0E0E0]" />
              </div>

              {/* Sheet header */}
              <div className="flex-shrink-0 flex items-center gap-3 px-4 pb-3 pt-1">
                {canGoBack
                  ? <button onClick={sheetBack} className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F2F2F7]">
                      <ArrowLeft className="w-4 h-4 text-[#1C1C1E]" />
                    </button>
                  : <div className="w-8" />
                }
                <h2 className="text-[17px] font-bold text-[#1C1C1E] flex-1 text-center">{sheetTitle()}</h2>
                <button onClick={closeSheet} className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F2F2F7]">
                  <X className="w-4 h-4 text-[#1C1C1E]" />
                </button>
              </div>

              {/* Progress dots */}
              {sheet === 'addProduct' && !['basket','bag'].includes(addStep) && (
                <div className="flex-shrink-0 flex justify-center gap-1.5 pb-3">
                  {[0,1,2].map(i => (
                    <div key={i} className="h-1.5 rounded-full transition-all duration-300"
                      style={{ width: i === stepIndex[addStep] ? 20 : 6, background: i <= stepIndex[addStep] ? '#0055A5' : '#E0E0E0' }} />
                  ))}
                </div>
              )}

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">

                  {/* ── Manage: Options ── */}
                  {sheet === 'manage' && manageStep === 'options' && (
                    <motion.div key="manage-options"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      className="px-4 pb-8"
                    >
                      {(() => {
                        const addr = addresses.find(a => a.id === activeId)
                        if (!addr) return null
                        return (
                          <>
                            {/* Address summary pill */}
                            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5" style={{ background: '#F8F8F8' }}>
                              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#0055A5' }} />
                              <div className="min-w-0">
                                <p className="text-[13px] font-bold text-[#1C1C1E]">{addr.nickname}</p>
                                <p className="text-[11px] text-[#8E8E93] truncate">{addr.city}{addr.pincode ? ` – ${addr.pincode}` : ''}</p>
                              </div>
                              <div className="ml-auto flex-shrink-0">
                                <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: '#EBF5FF', color: '#0055A5' }}>
                                  {addr.planDaysLeft}d left
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2.5">
                              {/* Vacation Mode */}
                              <button
                                onClick={() => setManageStep('vacation')}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
                                style={{ background: '#E0F7FA' }}
                              >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#BAE6FD' }}>
                                  <Palmtree className="w-5 h-5" style={{ color: '#0369A1' }} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[15px] font-bold text-[#0C4A6E]">Vacation Mode</p>
                                  <p className="text-[12px] mt-0.5" style={{ color: '#0891B2' }}>Pause for a date range · paused days carry forward</p>
                                </div>
                                <CalendarRange className="w-4 h-4 text-[#0891B2] flex-shrink-0" />
                              </button>

                              {/* Hold Plan */}
                              <button
                                onClick={() => setManageStep('hold')}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
                                style={{ background: '#FFFBEB' }}
                              >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FDE68A' }}>
                                  <PauseCircle className="w-5 h-5" style={{ color: '#92400E' }} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[15px] font-bold text-[#78350F]">Hold Plan</p>
                                  <p className="text-[12px] mt-0.5 text-[#B45309]">Pause indefinitely · plan days freeze · resume anytime</p>
                                </div>
                                <Pause className="w-4 h-4 text-[#B45309] flex-shrink-0" />
                              </button>

                              {/* End Subscription */}
                              <button
                                onClick={() => setManageStep('end')}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
                                style={{ background: '#FFF5F5' }}
                              >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                                  <XCircle className="w-5 h-5 text-[#DC2626]" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[15px] font-bold text-[#991B1B]">End Subscription</p>
                                  <p className="text-[12px] mt-0.5 text-[#EF4444]">Cancel · unused days credited to wallet (₹3/day)</p>
                                </div>
                                <Trash2 className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
                              </button>
                            </div>
                          </>
                        )
                      })()}
                    </motion.div>
                  )}

                  {/* ── Manage: Vacation ── */}
                  {sheet === 'manage' && manageStep === 'vacation' && (
                    <motion.div key="manage-vacation"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }} className="px-4 pb-8"
                    >
                      <div className="rounded-2xl p-4 mb-5 text-center" style={{ background: 'linear-gradient(135deg,#E0F7FA,#BAE6FD)' }}>
                        <div className="text-[48px] mb-1">🏖️</div>
                        <p className="text-[15px] font-bold text-[#0C4A6E]">Going somewhere?</p>
                        <p className="text-[12px] text-[#0891B2] mt-1 leading-relaxed">
                          Pause deliveries for your trip. Every paused day is automatically added back to your plan.
                        </p>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <label className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">Leaving on</label>
                          <input
                            type="date"
                            value={vacFrom}
                            min={todayISO()}
                            onChange={e => { setVacFrom(e.target.value); if (vacTo && e.target.value >= vacTo) setVacTo('') }}
                            className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F2F2F7] text-[15px] text-[#1C1C1E] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">Returning on</label>
                          <input
                            type="date"
                            value={vacTo}
                            min={vacFrom || todayISO()}
                            onChange={e => setVacTo(e.target.value)}
                            className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F2F2F7] text-[15px] text-[#1C1C1E] outline-none"
                          />
                        </div>
                      </div>

                      {vacFrom && vacTo && vacFrom < vacTo && (() => {
                        const days = vacDays(vacFrom, vacTo)
                        const addr = addresses.find(a => a.id === activeId)
                        const newDaysLeft = (addr?.planDaysLeft ?? 0) + days
                        return (
                          <div className="px-4 py-3 rounded-xl mb-5" style={{ background: '#E0F7FA' }}>
                            <div className="flex justify-between mb-1">
                              <span className="text-[13px] text-[#0891B2]">Paused days</span>
                              <span className="text-[13px] font-bold text-[#0369A1]">{days} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[13px] text-[#0891B2]">Plan days after return</span>
                              <span className="text-[13px] font-bold text-[#0369A1]">{newDaysLeft} days</span>
                            </div>
                            <p className="text-[11px] text-[#0891B2] mt-1.5">
                              Deliveries auto-resume on {fmtDate(vacTo)}
                            </p>
                          </div>
                        )
                      })()}

                      <button
                        onClick={handleSetVacation}
                        disabled={!vacFrom || !vacTo || vacFrom >= vacTo}
                        className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] active:opacity-85 disabled:opacity-40"
                        style={{ background: 'linear-gradient(135deg,#0891B2,#06B6D4)' }}
                      >
                        Set Vacation Mode
                      </button>
                    </motion.div>
                  )}

                  {/* ── Manage: Hold ── */}
                  {sheet === 'manage' && manageStep === 'hold' && (
                    <motion.div key="manage-hold"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }} className="px-4 pb-8"
                    >
                      <div className="rounded-2xl p-5 mb-5 text-center" style={{ background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)' }}>
                        <div className="text-[48px] mb-1">⏸️</div>
                        <p className="text-[15px] font-bold text-[#78350F]">Hold your plan</p>
                        <p className="text-[13px] text-[#B45309] mt-1 leading-relaxed">
                          Pause all deliveries at <strong>{addresses.find(a=>a.id===activeId)?.nickname}</strong> until you're ready to resume.
                        </p>
                      </div>

                      <div className="space-y-2.5 mb-6">
                        {[
                          { icon:'❄️', t:'Plan days are frozen',        s:'No days counted during the hold'  },
                          { icon:'📦', t:'All products saved',          s:'Schedule & quantities unchanged'  },
                          { icon:'▶️', t:'Resume with one tap',         s:'Deliveries restart next morning'  },
                        ].map(p => (
                          <div key={p.t} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: '#FFFBEB' }}>
                            <span className="text-[18px] flex-shrink-0">{p.icon}</span>
                            <div>
                              <p className="text-[13px] font-semibold text-[#78350F]">{p.t}</p>
                              <p className="text-[11px] text-[#B45309]">{p.s}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleHold}
                        className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] active:opacity-85"
                        style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
                      >
                        Hold Plan
                      </button>
                      <button onClick={() => setManageStep('options')}
                        className="w-full py-3 text-[14px] font-semibold text-[#8E8E93] mt-1 active:opacity-70">
                        Cancel
                      </button>
                    </motion.div>
                  )}

                  {/* ── Manage: End ── */}
                  {sheet === 'manage' && manageStep === 'end' && (() => {
                    const addr = addresses.find(a => a.id === activeId)
                    const credit = (addr?.planDaysLeft ?? 0) * 3
                    return (
                      <motion.div key="manage-end"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.18 }} className="px-4 pb-8"
                      >
                        {/* Refund preview */}
                        <div className="rounded-2xl p-4 mb-5" style={{ background: '#FFF5F5', border: '1.5px solid #FCA5A5' }}>
                          <div className="flex items-center gap-3 mb-3">
                            <XCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
                            <p className="text-[14px] font-bold text-[#991B1B]">Before you go</p>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-[#FCA5A5]">
                            <span className="text-[13px] text-[#EF4444]">Remaining delivery days</span>
                            <span className="text-[14px] font-bold text-[#991B1B]">{addr?.planDaysLeft ?? 0} days</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-[13px] text-[#EF4444]">Wallet credit (₹3/day)</span>
                            <span className="text-[16px] font-black text-[#16A34A]">+₹{credit}</span>
                          </div>
                          <p className="text-[11px] text-[#EF4444] mt-1">
                            ₹{credit} will be added to your Delivery Wallet
                          </p>
                        </div>

                        {/* Reason */}
                        <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2.5">Why are you leaving? <span className="font-normal text-[#8E8E93]">(optional)</span></p>
                        <div className="space-y-2 mb-6">
                          {END_REASONS.map(reason => (
                            <button key={reason}
                              onClick={() => setEndReason(reason)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors text-left active:scale-[0.98]"
                              style={{
                                borderColor: endReason === reason ? '#EF4444' : 'transparent',
                                background:  endReason === reason ? '#FFF5F5' : '#F8F8F8',
                              }}
                            >
                              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                style={{ borderColor: endReason === reason ? '#EF4444' : '#C7C7CC' }}>
                                {endReason === reason && <div className="w-2 h-2 rounded-full bg-[#EF4444]" />}
                              </div>
                              <p className="text-[14px] font-medium text-[#1C1C1E]">{reason}</p>
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={handleEndSubscription}
                          className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] active:opacity-85"
                          style={{ background: 'linear-gradient(135deg,#DC2626,#EF4444)' }}
                        >
                          End Subscription{credit > 0 ? ` · ₹${credit} to wallet` : ''}
                        </button>
                        <button onClick={() => setManageStep('options')}
                          className="w-full py-3 text-[14px] font-semibold text-[#8E8E93] mt-1 active:opacity-70">
                          Cancel
                        </button>
                      </motion.div>
                    )
                  })()}

                  {/* ── Add Address ── */}
                  {sheet === 'addAddress' && (
                    <motion.div key="addAddress"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      className="px-4 pb-8"
                    >
                      {/* Map picker */}
                      <MapPickerView onPick={handleMapPick} />

                      {/* Nickname chips */}
                      <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2">Label this address</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {NICKNAME_CHIPS.map(chip => {
                          const label = chip.replace(/^[^\s]+ /, '')
                          const isActive = addrForm.nickname === label
                          return (
                            <button key={chip}
                              onClick={() => setAddrForm(f => ({ ...f, nickname: label }))}
                              className="px-3.5 py-2 rounded-full text-[13px] font-semibold border-2 transition-colors"
                              style={{
                                background:  isActive ? '#0055A5' : '#F2F2F7',
                                color:       isActive ? '#fff'     : '#1C1C1E',
                                borderColor: isActive ? '#0055A5' : 'transparent',
                              }}
                            >
                              {chip}
                            </button>
                          )
                        })}
                      </div>

                      {/* Fields */}
                      <div className="space-y-3">

                        {/* Nickname */}
                        <div>
                          <label className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">Label</label>
                          <input
                            value={addrForm.nickname}
                            onChange={e => setAddrForm(f => ({ ...f, nickname: e.target.value }))}
                            placeholder="e.g. Home, Parents, In-Laws"
                            className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F2F2F7] text-[15px] text-[#1C1C1E] outline-none placeholder:text-[#AEAEB2]"
                          />
                        </div>

                        {/* House No — always manual */}
                        <div>
                          <label className="text-[12px] font-semibold text-[#1C1C1E] uppercase tracking-wide">
                            House No / Flat / Apartment <span className="text-[#FF3B30]">*</span>
                          </label>
                          <input
                            value={addrForm.houseNo}
                            onChange={e => setAddrForm(f => ({ ...f, houseNo: e.target.value }))}
                            placeholder="e.g. 42, Flat 3B, Prestige Towers"
                            className="mt-1.5 w-full px-4 py-3 rounded-xl text-[15px] text-[#1C1C1E] outline-none placeholder:text-[#AEAEB2]"
                            style={{ background: '#FFF8E1', border: '1.5px solid #FFD54F' }}
                          />
                          <p className="text-[11px] text-[#8E8E93] mt-1 ml-1">Enter manually — GPS cannot detect your exact flat/unit</p>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-2 py-1">
                          <div className="flex-1 h-px bg-[#F2F2F7]" />
                          <p className="text-[11px] font-semibold text-[#AEAEB2] uppercase tracking-wide">Auto-filled from map</p>
                          <div className="flex-1 h-px bg-[#F2F2F7]" />
                        </div>

                        {/* Street & Area — auto-filled, editable */}
                        <div>
                          <label className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">Street & Area</label>
                          <input
                            value={addrForm.line1}
                            onChange={e => setAddrForm(f => ({ ...f, line1: e.target.value }))}
                            placeholder="Pick location on map above"
                            className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F2F2F7] text-[15px] text-[#1C1C1E] outline-none placeholder:text-[#AEAEB2]"
                          />
                        </div>

                        {/* City + Pincode side by side — auto-filled */}
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">City</label>
                            <input
                              value={addrForm.city}
                              onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))}
                              placeholder="Bengaluru"
                              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F2F2F7] text-[15px] text-[#1C1C1E] outline-none placeholder:text-[#AEAEB2]"
                            />
                          </div>
                          <div style={{ width: 110 }}>
                            <label className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">Pincode</label>
                            <input
                              value={addrForm.pincode}
                              onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value }))}
                              placeholder="560038"
                              maxLength={6}
                              inputMode="numeric"
                              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F2F2F7] text-[15px] text-[#1C1C1E] outline-none placeholder:text-[#AEAEB2]"
                            />
                          </div>
                        </div>
                      </div>

                      {addrError && <p className="text-[12px] text-[#FF3B30] mt-2">{addrError}</p>}

                      <button
                        onClick={handleAddAddress}
                        className="mt-5 w-full py-3.5 rounded-xl text-white font-semibold text-[15px] active:opacity-85"
                        style={{ background: 'linear-gradient(135deg,#0055A5,#0077CC)' }}
                      >
                        {addrCoords ? 'Save Address' : 'Add Address'}
                      </button>
                      <p className="text-[11px] text-[#AEAEB2] text-center mt-3">
                        Each address has a separate ₹99/month delivery plan
                      </p>
                    </motion.div>
                  )}

                  {/* ── Activate Plan ── */}
                  {sheet === 'activatePlan' && (
                    <motion.div key="activatePlan"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      className="px-4 pb-8"
                    >
                      <div className="rounded-2xl p-5 mb-4 text-center" style={{ background: 'linear-gradient(135deg,#0055A5,#0099CC)' }}>
                        <p className="text-[13px] text-white/70 mb-0.5">Nandini Daily</p>
                        <p className="text-[42px] font-black text-white tracking-tight leading-none">₹99</p>
                        <p className="text-[14px] text-white/80 mt-1">per month</p>
                        <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/20">
                          <p className="text-[12px] text-white font-semibold">30 deliveries included · ₹3 each</p>
                        </div>
                      </div>
                      <div className="space-y-2.5 mb-5">
                        {[
                          { icon:'📦', t:'30 deliveries per month',  s:"That's just ₹3 per delivery" },
                          { icon:'🔄', t:'Unused days carry forward', s:'Going on vacation? No waste'  },
                          { icon:'➕', t:'Add items for free',        s:'Same delivery, no extra charge'},
                          { icon:'⏸️', t:'Pause anytime',            s:'Per product or full plan'     },
                          { icon:'🎯', t:'Flexible frequencies',      s:'Daily, alternate, weekly…'    },
                        ].map(p => (
                          <div key={p.t} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: '#F8F8F8' }}>
                            <span className="text-[18px] flex-shrink-0 mt-0.5">{p.icon}</span>
                            <div>
                              <p className="text-[13px] font-semibold text-[#1C1C1E]">{p.t}</p>
                              <p className="text-[11px] text-[#8E8E93]">{p.s}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={handleActivatePlan}
                        className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] active:opacity-85"
                        style={{ background: 'linear-gradient(135deg,#0055A5,#0077CC)' }}>
                        Activate Plan · ₹99
                      </button>
                      <p className="text-[11px] text-[#AEAEB2] text-center mt-2.5">Next step: choose your products</p>
                    </motion.div>
                  )}

                  {/* ── Category ── */}
                  {sheet === 'addProduct' && addStep === 'cat' && (
                    <motion.div key="cat"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }} className="px-4 pb-8"
                    >
                      <p className="text-[12px] text-[#8E8E93] mb-3">What would you like to subscribe to?</p>
                      <div className="grid grid-cols-3 gap-3">
                        {SUB_CATS.map((cat, i) => (
                          <motion.button key={cat.id}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03, ease: [0.34,1.3,0.64,1] }}
                            onClick={() => { setSelCat(cat.id); setAddStep('products') }}
                            className="flex flex-col items-center gap-2 active:opacity-70"
                          >
                            <div className="w-full aspect-square rounded-2xl flex items-center justify-center text-[34px]" style={{ background: cat.bg }}>
                              {cat.emoji}
                            </div>
                            <p className="text-[12px] font-semibold text-[#1C1C1E] text-center leading-tight">{cat.name}</p>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Products ── */}
                  {sheet === 'addProduct' && addStep === 'products' && selCat && (
                    <motion.div key="products"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }} className="px-4 pb-8"
                    >
                      <p className="text-[12px] text-[#8E8E93] mb-3">Tap a product to set the schedule</p>
                      <div className="space-y-2">
                        {(SUB_PRODS[selCat] ?? []).map((prod, i) => (
                          <motion.button key={prod.id}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            onClick={() => { setSelProd(prod); setSelFreq('daily'); setSelQty(1); setAddStep('freq') }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left active:scale-[0.98]"
                            style={{ background: '#F8F8F8' }}
                          >
                            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[22px] flex-shrink-0">{prod.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-semibold text-[#1C1C1E] leading-tight">{prod.name}</p>
                              <p className="text-[12px] text-[#8E8E93]">{prod.variant}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[14px] font-bold text-[#0055A5]">₹{prod.price}</p>
                              <p className="text-[10px] text-[#8E8E93]">per delivery</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Frequency & Qty ── */}
                  {sheet === 'addProduct' && addStep === 'freq' && selProd && (
                    <motion.div key="freq"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }} className="px-4 pb-8"
                    >
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl mb-5" style={{ background: '#F0F6FF' }}>
                        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[22px] flex-shrink-0">{selProd.emoji}</div>
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-[#1C1C1E]">{selProd.name}</p>
                          <p className="text-[12px] text-[#8E8E93]">{selProd.variant} · ₹{selProd.price}/delivery</p>
                        </div>
                      </div>

                      <p className="text-[13px] font-semibold text-[#1C1C1E] mb-3">Quantity per delivery</p>
                      <div className="flex items-center gap-4 mb-5">
                        <button onClick={() => setSelQty(q => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90"
                          style={{ background: selQty === 1 ? '#F2F2F7' : '#EBF5FF' }}>
                          <Minus className="w-4 h-4" style={{ color: selQty === 1 ? '#C7C7CC' : '#0055A5' }} />
                        </button>
                        <span className="text-[22px] font-bold text-[#1C1C1E] w-8 text-center">{selQty}</span>
                        <button onClick={() => setSelQty(q => Math.min(10, q + 1))}
                          className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90" style={{ background: '#EBF5FF' }}>
                          <Plus className="w-4 h-4 stroke-[2.5]" style={{ color: '#0055A5' }} />
                        </button>
                        <span className="text-[13px] text-[#8E8E93] ml-1">{selProd.variant} each delivery</span>
                      </div>

                      <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2.5">Delivery frequency</p>
                      <div className="space-y-2 mb-5">
                        {FREQ_OPTS.map(opt => (
                          <button key={opt.id} onClick={() => setSelFreq(opt.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors active:scale-[0.98]"
                            style={{ borderColor: selFreq === opt.id ? '#0055A5' : 'transparent', background: selFreq === opt.id ? '#EBF5FF' : '#F8F8F8' }}>
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                              style={{ borderColor: selFreq === opt.id ? '#0055A5' : '#C7C7CC' }}>
                              {selFreq === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0055A5]" />}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-[14px] font-semibold text-[#1C1C1E]">{opt.label}</p>
                            </div>
                            <p className="text-[11px] text-[#8E8E93]">{opt.sub}</p>
                          </button>
                        ))}
                      </div>

                      <div className="px-4 py-3 rounded-xl mb-4" style={{ background: '#F0F6FF' }}>
                        <div className="flex justify-between">
                          <span className="text-[13px] text-[#5C7A9A]">Monthly cost (this product)</span>
                          <span className="text-[14px] font-bold text-[#0055A5]">
                            ₹{(selProd.price * selQty * (FREQ_MULT[selFreq] ?? 30)).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8E8E93] mt-0.5">
                          ₹{selProd.price} × {selQty} qty × {FREQ_MULT[selFreq] ?? 30} deliveries
                        </p>
                      </div>

                      <button onClick={handleConfirmProduct}
                        className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] active:opacity-85"
                        style={{ background: 'linear-gradient(135deg,#0055A5,#0077CC)' }}>
                        Add to Subscription
                      </button>
                    </motion.div>
                  )}

                  {/* ── Basket Builder ── */}
                  {sheet === 'addProduct' && addStep === 'basket' && (
                    <motion.div key="basket"
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.22 }} className="px-4 pb-8"
                    >
                      <div className="flex items-center gap-3 p-3.5 rounded-xl mb-5" style={{ background: '#E8F8EF' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00C853' }}>
                          <Check className="w-4 h-4 text-white stroke-[2.5]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#1C1C1E]">{selProd?.name} added!</p>
                          <p className="text-[11px] text-[#4CAF50]">Now complete your daily basket</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-4" style={{ background: '#FFFBEB' }}>
                        <span className="text-[16px] flex-shrink-0">💡</span>
                        <p className="text-[12px] text-[#7A5C00] leading-relaxed">
                          {selCat === 'milk'   && 'Families of 4 typically subscribe to curd every 3 days and ghee every 15 days with daily milk.'}
                          {selCat === 'curd'   && 'Most curd subscribers also add daily milk and ghee every 15 days for a full pantry.'}
                          {selCat === 'ghee'   && 'Ghee subscribers often pair it with daily milk and paneer every 15 days.'}
                          {selCat === 'butter' && 'Butter + daily milk is a classic South Indian breakfast basket.'}
                          {selCat === 'paneer' && 'Paneer subscribers often add ghee every 15 days and curd every 3 days.'}
                          {!['milk','curd','ghee','butter','paneer'].includes(selCat ?? '') && 'Here are products families often subscribe to together.'}
                        </p>
                      </div>

                      <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2.5">Suggested additions</p>
                      <div className="space-y-2.5 mb-6">
                        {(selCat ? BASKET_MAP[selCat] ?? [] : []).map(item => {
                          const added = basketAdded.has(item.prodId)
                          return (
                            <div key={item.prodId} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                              style={{ background: added ? '#E8F8EF' : '#F8F8F8' }}>
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[20px] flex-shrink-0">{item.emoji}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-[#1C1C1E]">{item.name}</p>
                                <p className="text-[11px] text-[#8E8E93]">{item.variant} · {item.freqLabel} · ₹{item.price}/delivery</p>
                                <p className="text-[11px] text-[#0055A5] mt-0.5">{item.tip}</p>
                              </div>
                              <button onClick={() => quickAddBasket(item)}
                                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90"
                                style={{ background: added ? '#00C853' : '#EBF5FF' }}>
                                {added ? <Check className="w-4 h-4 text-white stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" style={{ color: '#0055A5' }} />}
                              </button>
                            </div>
                          )
                        })}
                      </div>

                      <button onClick={doneBasket}
                        className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] active:opacity-85"
                        style={{ background: 'linear-gradient(135deg,#0055A5,#0077CC)' }}>
                        {basketAdded.size > 0 ? `Done · ${basketAdded.size + 1} products added` : 'Done, looks good'}
                      </button>
                    </motion.div>
                  )}

                  {/* ── Insulated Bag ── */}
                  {sheet === 'addProduct' && addStep === 'bag' && (
                    <motion.div key="bag"
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.22 }} className="px-4 pb-8"
                    >
                      <div className="rounded-2xl p-6 text-center mb-5" style={{ background: 'linear-gradient(135deg,#E3F2FD,#BBDEFB)' }}>
                        <div className="text-[64px] mb-2">🧊</div>
                        <h3 className="text-[18px] font-bold text-[#0D47A1] mb-1">Keep it Fresh</h3>
                        <p className="text-[13px] text-[#1565C0] leading-relaxed">
                          Our insulated bag keeps products cold until 10 AM — even if you're not home.
                        </p>
                      </div>
                      <div className="space-y-2.5 mb-5">
                        {[
                          { icon:'❄️', t:'Stays cold for 3+ hours',        s:'Even on hot Karnataka mornings'   },
                          { icon:'🎁', t:'One-time purchase',               s:'Not a subscription, yours forever'},
                          { icon:'🚴', t:'Delivered with your first order', s:'No extra delivery charge'         },
                        ].map(f => (
                          <div key={f.t} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: '#F8FCFF' }}>
                            <span className="text-[18px] flex-shrink-0">{f.icon}</span>
                            <div>
                              <p className="text-[13px] font-semibold text-[#1C1C1E]">{f.t}</p>
                              <p className="text-[11px] text-[#8E8E93]">{f.s}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-3" style={{ background: '#F0F6FF' }}>
                        <div>
                          <p className="text-[12px] text-[#8E8E93]">Nandini Insulated Bag</p>
                          <p className="text-[20px] font-black text-[#0055A5]">₹299</p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-[#4facfe]" />
                      </div>
                      <button onClick={() => { setBagAdded(true); closeSheet() }}
                        className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] mb-2.5 active:opacity-85"
                        style={{ background: 'linear-gradient(135deg,#0055A5,#0077CC)' }}>
                        Add Bag · ₹299
                      </button>
                      <button onClick={closeSheet}
                        className="w-full py-3 text-[14px] font-semibold text-[#8E8E93] active:opacity-70">
                        No thanks, skip
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bag added toast */}
      <AnimatePresence>
        {bagAdded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 inset-x-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: '#1C1C1E', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
          >
            <span className="text-[18px]">🧊</span>
            <p className="text-[13px] font-semibold text-white flex-1">Insulated bag added to your first delivery!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
