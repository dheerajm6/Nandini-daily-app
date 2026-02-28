# Nandini Daily App - CLAUDE.md

## Project Overview
A mobile-first React PWA for Nandini dairy product subscriptions and orders, styled as an iOS app. Also supports Android APK export via Capacitor.

## Stack
- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS 3** — custom iOS design system
- **Framer Motion** — page transitions and animations
- **React Router v6** — client-side routing
- **Lucide React** — icons
- **Leaflet / React Leaflet** — map-based address picker
- **Capacitor 8** — Android APK export

## Dev Commands
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
npm run cap:sync     # Build + sync to Android
npm run cap:open     # Open Android Studio
npm run cap:run      # Run on Android device/emulator
```

## Project Structure
```
/
├── public/logo.jpeg              # Brand logo
├── android/                      # Capacitor Android project
├── src/
│   ├── App.tsx                   # Router + AnimatePresence wrapper
│   ├── index.css                 # Tailwind + custom iOS component classes
│   ├── context/AppContext.tsx    # Global state (phone, address, cart, etc.)
│   ├── components/
│   │   ├── MainLayout.tsx        # Bottom tab nav shell for main app
│   │   └── PageTransition.tsx    # iOS-style slide transition wrapper
│   └── screens/
│       ├── SplashScreen.tsx      # Animated splash, 2.8s auto-nav
│       ├── LoginScreen.tsx       # Phone input + +91 country code
│       ├── OTPScreen.tsx         # 6-box OTP, auto-submit
│       ├── LocationScreen.tsx    # GPS + city picker (Karnataka cities)
│       ├── AddressScreen.tsx     # Home/Work/Other + address form
│       ├── DeliveryTimeScreen.tsx# Time slot + day selection
│       ├── ProductsScreen.tsx    # 8 Nandini products, cart
│       ├── SuccessScreen.tsx     # Confetti + order summary
│       └── main/                 # Main app tabs (post-onboarding)
│           ├── HomeScreen.tsx
│           ├── ProductListingScreen.tsx
│           ├── OrdersScreen.tsx
│           ├── SubscriptionsScreen.tsx
│           ├── WalletScreen.tsx
│           ├── InsightsScreen.tsx
│           ├── CategoriesScreen.tsx
│           └── AccountScreen.tsx
```

## App Flow
**Onboarding:** Splash → Login → OTP → Location → Address → DeliveryTime → Products → Success

**Main App (tabs):** Home | Categories | Orders | Subscriptions | Wallet | Insights | Account

## Design System
- Font: `system-ui / -apple-system` (SF Pro on iOS)
- Brand blue: `#0055A5`, deep: `#003B73`
- iOS background: `#F2F2F7`, surface: `#FFFFFF`
- iOS gray scale (1–6) defined in `tailwind.config.js`
- Custom utility classes: `.ios-button-primary`, `.ios-input`, `.ios-card`, `.screen`, `.app-container`
- App container: max-width 430px, centered on desktop, full-width on mobile

## Key Features
- Subscription management (Hold, Vacation Mode, End Subscription)
- Map-based address picker (Leaflet)
- Cart and order management
- Wallet screen
- Insights/analytics screen
- Capacitor Android build support

## Products
8 Nandini dairy products: Full Cream Milk, Toned Milk, Double Toned Milk, Curd, Butter, Ghee, Paneer, Skim Milk
