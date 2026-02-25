import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider } from './context/AppContext'

// Onboarding screens
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import OTPScreen from './screens/OTPScreen'

// Main app layout
import MainLayout from './components/MainLayout'

// Tab screens
import HomeScreen from './screens/main/HomeScreen'
import SubscriptionsScreen from './screens/main/SubscriptionsScreen'
import WalletScreen from './screens/main/WalletScreen'
import OrdersScreen from './screens/main/OrdersScreen'
import AccountScreen from './screens/main/AccountScreen'
import CategoriesScreen from './screens/main/CategoriesScreen'
import ProductListingScreen from './screens/main/ProductListingScreen'
import InsightsScreen from './screens/main/InsightsScreen'

function AnimatedRoutes() {
  const location = useLocation()

  // Only animate onboarding screens
  const isOnboarding = ['/splash', '/login', '/otp'].includes(location.pathname)

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isOnboarding ? (
        <Routes location={location} key={location.pathname}>
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/otp" element={<OTPScreen />} />
        </Routes>
      ) : (
        <Routes location={location} key="main">
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="/app/home" replace />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="subscriptions" element={<SubscriptionsScreen />} />
            <Route path="wallet" element={<WalletScreen />} />
            <Route path="orders" element={<OrdersScreen />} />
            <Route path="account" element={<AccountScreen />} />
            <Route path="categories" element={<CategoriesScreen />} />
            <Route path="products/:category" element={<ProductListingScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex items-center justify-center w-full h-screen bg-[#1C1C1E]">
          <div className="app-container shadow-2xl">
            <AnimatedRoutes />
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
