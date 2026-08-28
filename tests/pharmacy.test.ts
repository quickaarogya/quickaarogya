import { describe, it, expect } from 'vitest';
import { PharmacyService } from '../src/server/services/pharmacy.service';

describe('Phase 5 Pharmacy & Medicine Marketplace Edge Case Tests', () => {
  it('should list and search medicine catalog with category filters', async () => {
    const skinCare = await PharmacyService.getMedicines({ category: 'skin_care' });
    expect(skinCare.length).toBeGreaterThan(0);
    expect(skinCare.some(m => m.brandName.includes('Cetaphil'))).toBe(true);

    const searchResults = await PharmacyService.getMedicines({ searchQuery: 'Montair' });
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].prescriptionRequired).toBe(true);
  });

  it('should reject an order with zero or negative quantity', async () => {
    await expect(
      PharmacyService.createOrder({
        patientProfileId: 'usr-101',
        patientName: 'Arjun Sharma',
        items: [{ medicineId: 'med-1', quantity: 0 }],
        deliveryType: 'delivery',
      })
    ).rejects.toThrow(/greater than zero/i);
  });

  it('should strictly block checkout for prescription-required medicines if no prescription document is attached', async () => {
    // med-3 is Montair LC (Rx Required)
    await expect(
      PharmacyService.createOrder({
        patientProfileId: 'usr-101',
        patientName: 'Arjun Sharma',
        items: [{ medicineId: 'med-3', quantity: 1 }],
        deliveryType: 'delivery',
      })
    ).rejects.toThrow(/require a valid prescription/i);
  });

  it('should allow checkout for OTC items without prescription and set status to confirmed', async () => {
    // med-1 is Cetaphil Cleanser (OTC)
    const order = await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      items: [{ medicineId: 'med-1', quantity: 2 }],
      deliveryType: 'delivery',
    });

    expect(order).toBeDefined();
    expect(order.id).toContain('ord-');
    expect(order.status).toBe('confirmed');
    expect(order.requiresPrescription).toBe(false);
    expect(order.subtotal).toBe(341 * 2);
  });

  it('should allow checkout for Rx items when valid prescription document is provided and set status to prescription_verification', async () => {
    // med-4 is Telma 40 (Rx Required)
    const order = await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      items: [{ medicineId: 'med-4', quantity: 2 }],
      deliveryType: 'delivery',
      prescriptionDocumentId: 'doc-rec-1',
      prescriptionFileName: 'Prescription_Telma40_Dr_Rajesh.pdf',
    });

    expect(order).toBeDefined();
    expect(order.status).toBe('prescription_verification');
    expect(order.requiresPrescription).toBe(true);
    expect(order.prescriptionDocumentId).toBe('doc-rec-1');
  });

  it('should calculate free delivery for orders above ₹500 and apply ₹30 fee otherwise', async () => {
    // med-7 is Dolo 650 (₹32) -> total < 500
    const smallOrder = await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      items: [{ medicineId: 'med-7', quantity: 2 }], // ₹64
      deliveryType: 'delivery',
    });
    expect(smallOrder.deliveryFee).toBe(30);

    // med-2 is CeraVe Lotion (₹1440) -> total > 500
    const bigOrder = await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      items: [{ medicineId: 'med-2', quantity: 1 }], // ₹1440
      deliveryType: 'delivery',
    });
    expect(bigOrder.deliveryFee).toBe(0);
  });

  it('should advance order status through the delivery lifecycle and support 1-click reorder', async () => {
    const order = await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      items: [{ medicineId: 'med-6', quantity: 1 }], // Shelcal 500 (OTC)
      deliveryType: 'delivery',
    });

    // Advance to out_for_delivery
    const updated = await PharmacyService.updateOrderStatus(order.id, 'out_for_delivery');
    expect(updated.status).toBe('out_for_delivery');

    // 1-Click Reorder
    const reordered = await PharmacyService.reorder(order.id);
    expect(reordered.id).not.toBe(order.id);
    expect(reordered.items).toHaveLength(1);
    expect(reordered.items[0].medicineId).toBe('med-6');
  });

  it('should cancel an active order before delivery', async () => {
    const order = await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      items: [{ medicineId: 'med-1', quantity: 1 }],
      deliveryType: 'delivery',
    });

    const success = await PharmacyService.cancelOrder(order.id);
    expect(success).toBe(true);

    const fetched = await PharmacyService.getOrderById(order.id);
    expect(fetched?.status).toBe('cancelled');
  });
});
