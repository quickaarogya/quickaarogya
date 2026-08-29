import type { Metadata, Viewport } from 'next';
import './globals.css';
import MobileNav from '../components/layout/MobileNav';
import MobileHeader from '../components/layout/MobileHeader';
import DesktopHeader from '../components/layout/DesktopHeader';
import SosBanner from '../components/layout/SosBanner';
import AppModeFloatingSwitch from '../components/layout/AppModeFloatingSwitch';
import CartTopAlert from '../components/cart/CartTopAlert';
import QueryProvider from '../lib/query-provider';

export const metadata: Metadata = {
  title: 'Quick Aarogya | Unified Family Health & Care Management Platform',
  description: 'Production-grade healthcare platform for doctor discovery, medication tracking, prescription vaults, diagnostic bookings, family caregiver management, and emergency response.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' }
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/logo.png' }
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="bg-[#F6F8FC] ambient-glow-mesh text-slate-900 antialiased min-h-screen relative selection:bg-[#026dd9]/20 selection:text-[#026dd9]">
        {/* Subtle Ambient Background Mesh Glowing Orbs */}
        <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none z-0" />
        <div className="fixed top-1/3 -right-32 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none z-0" />
        <div className="fixed -bottom-32 left-1/3 w-96 h-96 rounded-full bg-rose-400/8 blur-3xl pointer-events-none z-0" />

        <QueryProvider>
          {/* Global SOS Emergency Alert Broadcast */}
          <SosBanner />

          {/* Mobile Top Header (hidden on lg) */}
          <MobileHeader />

          {/* Desktop Full-Width E-Commerce Top Header (visible on lg) */}
          <DesktopHeader />

          {/* Main Layout Container (Full Width Consumer Storefront) */}
          <div className="flex flex-col min-h-screen relative z-10">
            {/* Scrollable Page Content with Safe Area Bottom Padding on Mobile */}
            <main className="flex-1 w-full pb-[calc(7.5rem+env(safe-area-inset-bottom))] lg:pb-12">
              {children}
            </main>
          </div>

          {/* Global Dismissible Top Cart Alert Toast */}
          <CartTopAlert />

          {/* Dual-App Mode Floating Pill Switcher (Appointments <-> Pharma) */}
          <AppModeFloatingSwitch />

          {/* Mobile Fixed Core Navigation Bar (hidden on lg) */}
          <MobileNav />
        </QueryProvider>
      </body>
    </html>
  );
}

