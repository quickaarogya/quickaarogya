import {
  Home,
  Calendar,
  Pill,
  FolderHeart,
  Grid,
  Users,
  Store,
  FlaskConical,
  Receipt,
  AlertOctagon,
  Bell,
  User,
  Settings,
  Inbox,
  CalendarPlus,
  ShoppingCart,
  Menu,
  Stethoscope,
  Clock,
  Heart,
  Activity,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'teal' | 'danger' | 'warning';
  description?: string;
}

export interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

// 1. Doctors Mode Bottom Navigation Bar
export const doctorsMobileNavItems: NavItem[] = [
  { id: 'home', name: 'Home', href: '/', icon: Home },
  { id: 'find_doctors', name: 'Doctors', href: '/doctors', icon: Stethoscope },
  { id: 'appointments', name: 'My Tokens', href: '/appointments', icon: Clock },
  { id: 'menu', name: 'Menu', href: '/more', icon: Menu },
];

// 2. Pharma Mode Bottom Navigation Bar
export const pharmaMobileNavItems: NavItem[] = [
  { id: 'home', name: 'Home', href: '/', icon: Home },
  { id: 'shop', name: 'Shop', href: '/pharmacies', icon: Store },
  { id: 'cart', name: 'Cart', href: '/cart', icon: ShoppingCart },
  { id: 'menu', name: 'Menu', href: '/more', icon: Menu },
];

// 3. Care / Health Care Mode Bottom Navigation Bar
export const careMobileNavItems: NavItem[] = [
  { id: 'home', name: 'Health Hub', href: '/', icon: Activity },
  { id: 'medicines', name: 'My Meds', href: '/medicines', icon: Pill },
  { id: 'records', name: 'ABHA Vault', href: '/records', icon: FolderHeart },
  { id: 'family', name: 'Family', href: '/family', icon: Users },
];

// Backward Compatibility Aliases
export const appointmentsMobileNavItems: NavItem[] = doctorsMobileNavItems;
export const mobilePrimaryNavItems: NavItem[] = pharmaMobileNavItems;

// 4. Desktop Sidebar Sections
export const desktopSidebarSections: NavGroup[] = [
  {
    groupTitle: 'CLINICAL SERVICES',
    items: [
      { id: 'home', name: 'Home', href: '/', icon: Home },
      { id: 'doctors', name: 'Find Doctors', href: '/doctors', icon: Stethoscope },
      { id: 'appointments', name: 'Appointments', href: '/appointments', icon: Clock },
      { id: 'pharmacies', name: 'Quick Meds (10 Mins)', href: '/pharmacies', icon: Store },
      { id: 'labs', name: 'Diagnostic Labs', href: '/labs', icon: FlaskConical },
    ]
  },
  {
    groupTitle: 'HEALTH & RECORDS',
    items: [
      { id: 'medicines', name: 'Medication Regimen', href: '/medicines', icon: Pill },
      { id: 'records', name: 'Medical Documents Vault', href: '/records', icon: FolderHeart },
      { id: 'family', name: 'Family Caregiver Hub', href: '/family', icon: Users },
      { id: 'emergency', name: 'Emergency QR Profile', href: '/emergency', icon: AlertOctagon },
    ]
  },
  {
    groupTitle: 'FINANCE & ACCOUNT',
    items: [
      { id: 'cart', name: 'My Cart & Orders', href: '/cart', icon: ShoppingCart },
      { id: 'wishlist', name: 'Saved Wishlist', href: '/wishlist', icon: Heart },
      { id: 'expenses', name: 'Medical Expenses (80D)', href: '/expenses', icon: Receipt },
      { id: 'inbox', name: 'Health Inbox & Alerts', href: '/inbox', icon: Bell },
      { id: 'profile', name: 'Patient Profile', href: '/profile', icon: User },
      { id: 'settings', name: 'Settings & Consents', href: '/settings', icon: Settings },
    ]
  }
];

// 5. Mobile More Grouped Hub Navigation
export const moreMenuGroups: NavGroup[] = [
  {
    groupTitle: 'CARE & DISCOVERY',
    items: [
      {
        id: 'wishlist',
        name: 'Saved Doctors & Medicines Wishlist',
        href: '/wishlist',
        icon: Heart,
        description: 'Quick access to bookmarked specialists and chronic meds',
        badge: 'Saved',
        badgeType: 'danger'
      },
      {
        id: 'family',
        name: 'Family Caregiver Hub',
        href: '/family',
        icon: Users,
        description: 'Manage health & proxies for elderly parents and dependents',
        badge: '3 Managed',
        badgeType: 'teal'
      },
      {
        id: 'pharmacies',
        name: 'Nearby Pharmacies & Delivery',
        href: '/pharmacies',
        icon: Store,
        description: 'Order prescription medicines with express delivery'
      },
      {
        id: 'labs',
        name: 'Diagnostic Lab Tests',
        href: '/labs',
        icon: FlaskConical,
        description: 'Book home sample collection for blood & health panels'
      }
    ]
  },
  {
    groupTitle: 'MANAGEMENT & LEDGER',
    items: [
      {
        id: 'expenses',
        name: 'Healthcare Expenses & Claims',
        href: '/expenses',
        icon: Receipt,
        description: 'Track medical out-of-pocket costs and Section 80D tax receipts'
      },
      {
        id: 'notifications',
        name: 'Notification Center',
        href: '/inbox',
        icon: Bell,
        description: 'Review clinical, refill and adherence notifications'
      },
      {
        id: 'emergency',
        name: 'Emergency Response QR',
        href: '/emergency',
        icon: AlertOctagon,
        description: 'Paramedic ICE lockscreen card & critical medical profile'
      }
    ]
  },
  {
    groupTitle: 'ACCOUNT & SECURITY',
    items: [
      {
        id: 'profile',
        name: 'Patient Profile & ABHA ID',
        href: '/profile',
        icon: User,
        description: 'Personal health identifier, blood group & allergies'
      },
      {
        id: 'settings',
        name: 'Privacy, Consents & Security',
        href: '/settings',
        icon: Settings,
        description: 'Manage digital health record access and consent revocations'
      }
    ]
  }
];
