import { describe, it, expect } from 'vitest';
import { doctorsMobileNavItems, pharmaMobileNavItems, careMobileNavItems } from '../src/config/navigation';
import { useAppModeStore } from '../src/stores/useAppModeStore';
import { useCartStore } from '../src/stores/useCartStore';
import { Medicine } from '../src/types';

describe('3-Pillar App Mode Navigation & Cart Architecture Tests', () => {
  it('should define distinct bottom navigation bars for Doctors, Pharma, and Care modes', () => {
    // 1. Doctors Mode Items: Home, Find Doctors, My Tokens, Menu
    expect(doctorsMobileNavItems.length).toBe(4);
    expect(doctorsMobileNavItems.map(i => i.id)).toEqual([
      'home',
      'find_doctors',
      'appointments',
      'menu'
    ]);
    expect(doctorsMobileNavItems[0].href).toBe('/');
    expect(doctorsMobileNavItems[1].href).toBe('/doctors');
    expect(doctorsMobileNavItems[2].href).toBe('/appointments');
    expect(doctorsMobileNavItems[3].href).toBe('/more');

    // 2. Pharma Mode Items: Home, Shop, Cart, Menu
    expect(pharmaMobileNavItems.length).toBe(4);
    expect(pharmaMobileNavItems.map(i => i.id)).toEqual([
      'home',
      'shop',
      'cart',
      'menu'
    ]);
    expect(pharmaMobileNavItems[0].href).toBe('/');
    expect(pharmaMobileNavItems[1].href).toBe('/pharmacies');
    expect(pharmaMobileNavItems[2].href).toBe('/cart');
    expect(pharmaMobileNavItems[3].href).toBe('/more');

    // 3. Care Mode Items: Health Hub, My Meds, ABHA Vault, Family
    expect(careMobileNavItems.length).toBe(4);
    expect(careMobileNavItems.map(i => i.id)).toEqual([
      'home',
      'medicines',
      'records',
      'family'
    ]);
    expect(careMobileNavItems[0].href).toBe('/');
    expect(careMobileNavItems[1].href).toBe('/medicines');
    expect(careMobileNavItems[2].href).toBe('/records');
    expect(careMobileNavItems[3].href).toBe('/family');
  });

  it('should switch between pharma, doctors, and care modes via useAppModeStore', () => {
    const { setAppMode } = useAppModeStore.getState();

    setAppMode('pharma');
    expect(useAppModeStore.getState().appMode).toBe('pharma');

    setAppMode('doctors');
    expect(useAppModeStore.getState().appMode).toBe('doctors');

    setAppMode('care');
    expect(useAppModeStore.getState().appMode).toBe('care');
  });

  it('should manage cart items and calculations for Pharma app mode', () => {
    const { addItem, removeItem, clearCart, getTotalCount, getTotalPrice } = useCartStore.getState();

    clearCart();
    expect(useCartStore.getState().items.length).toBe(0);

    const testMedicine: Medicine = {
      id: 'med-test-1',
      brandName: 'Telma 40',
      genericName: 'Telmisartan 40mg',
      form: 'tablet',
      strength: '40mg',
      manufacturer: 'Glenmark',
      price: 140,
      mrp: 180,
      prescriptionRequired: true,
      inStock: true,
      unit: '1 Strip'
    };

    addItem(testMedicine, 2);
    expect(getTotalCount()).toBe(2);
    expect(getTotalPrice()).toBe(280);

    addItem(testMedicine, 1);
    expect(getTotalCount()).toBe(3);
    expect(getTotalPrice()).toBe(420);

    removeItem('med-test-1');
    expect(getTotalCount()).toBe(0);
    expect(getTotalPrice()).toBe(0);
  });
});
