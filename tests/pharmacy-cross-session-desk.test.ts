import { describe, it, expect } from 'vitest';
import { PharmacyService } from '../src/server/services/pharmacy.service';
import { OrgService } from '../src/server/services/organization.service';

describe('Pharmacy Order Desk & Cross-Session Visibility Tests', () => {
  const patientUserId = 'usr-101';
  const patientName = 'Arjun Sharma';

  const pharmacyId = 'pharma-1';
  const orgPharmacy = 'org-apollo-pharmacy';
  const pharmacistUserId = 'auth-staff-pharmacy';

  const otherOrgId = 'org-dr-vivek-clinic';
  const otherUserId = 'auth-doc-2';

  let createdOrderId: string;

  it('1. Patient Session A places a pharmacy order containing prescription medicine', async () => {
    const order = await PharmacyService.createOrder({
      patientProfileId: patientUserId,
      patientName,
      pharmacyId,
      items: [
        {
          medicineId: 'med-4', // Telma 40 (Rx required: true)
          quantity: 2
        }
      ],
      deliveryType: 'delivery',
      deliveryAddress: 'Flat 402, Heritage Heights, Sector 62, Noida',
      prescriptionDocumentId: 'doc-rx-cardiology-001',
      prescriptionFileName: 'Rx-Cardiology-2026.pdf',
      paymentMethod: 'upi'
    });

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.pharmacyId).toBe(pharmacyId);
    expect(order.requiresPrescription).toBe(true);
    expect(order.prescriptionVerified).toBe(false);

    createdOrderId = order.id;
  });

  it('2. Pharmacist Session B queries order desk and immediately sees the incoming patient order', async () => {
    const pharmacyOrders = await PharmacyService.getPharmacyOrders(
      pharmacistUserId,
      pharmacyId,
      orgPharmacy
    );

    expect(pharmacyOrders).toBeDefined();
    expect(pharmacyOrders.length).toBeGreaterThanOrEqual(1);

    const found = pharmacyOrders.find(o => o.id === createdOrderId);
    expect(found).toBeDefined();
    expect(found?.patientName).toBe(patientName);
    expect(found?.requiresPrescription).toBe(true);
    expect(found?.prescriptionVerified).toBe(false);
  });

  it('3. Pharmacist Session B is prevented from dispatching order before verifying the prescription', async () => {
    // Attempting to advance to processing or out_for_delivery without Rx verification must fail
    await expect(
      PharmacyService.updatePharmacyOrderStatus(
        pharmacistUserId,
        pharmacyId,
        orgPharmacy,
        createdOrderId,
        'processing'
      )
    ).rejects.toThrow(/Prescription verification required before advancing order/i);

    await expect(
      PharmacyService.updatePharmacyOrderStatus(
        pharmacistUserId,
        pharmacyId,
        orgPharmacy,
        createdOrderId,
        'out_for_delivery'
      )
    ).rejects.toThrow(/Prescription verification required before advancing order/i);
  });

  it('4. Pharmacist Session B verifies the attached clinical prescription', async () => {
    const reviewNote = 'Verified valid Medical Council registration of Dr. Ananya Roy. Approved for 2-month Telmisartan refill.';

    const verifiedOrder = await PharmacyService.verifyOrderPrescription(
      pharmacistUserId,
      pharmacyId,
      orgPharmacy,
      createdOrderId,
      reviewNote
    );

    expect(verifiedOrder.prescriptionVerified).toBe(true);
    expect(verifiedOrder.prescriptionReviewNotes).toBe(reviewNote);
  });

  it('5. Pharmacist Session B advances order through preparation, dispatch, and delivery', async () => {
    // 1. Process order
    const processingOrder = await PharmacyService.updatePharmacyOrderStatus(
      pharmacistUserId,
      pharmacyId,
      orgPharmacy,
      createdOrderId,
      'processing'
    );
    expect(processingOrder.status).toBe('processing');

    // 2. Dispatch order
    const dispatchedOrder = await PharmacyService.updatePharmacyOrderStatus(
      pharmacistUserId,
      pharmacyId,
      orgPharmacy,
      createdOrderId,
      'out_for_delivery'
    );
    expect(dispatchedOrder.status).toBe('out_for_delivery');

    // 3. Mark delivered
    const deliveredOrder = await PharmacyService.updatePharmacyOrderStatus(
      pharmacistUserId,
      pharmacyId,
      orgPharmacy,
      createdOrderId,
      'delivered'
    );
    expect(deliveredOrder.status).toBe('delivered');

    // Patient session view also reflects delivered status
    const patientOrders = await PharmacyService.getOrders(patientUserId);
    const patientOrder = patientOrders.find(o => o.id === createdOrderId);
    expect(patientOrder).toBeDefined();
    expect(patientOrder?.status).toBe('delivered');
  });

  it('6. Pharmacist Session B adjusts retail inventory stock and direct selling price', async () => {
    const targetMedicineId = 'med-1'; // Paracetamol / Dolo
    const newStockQty = 250;
    const newSellingPrice = 32;

    const updatedMed = await PharmacyService.updateInventoryStock(
      pharmacistUserId,
      pharmacyId,
      orgPharmacy,
      targetMedicineId,
      newStockQty,
      newSellingPrice,
      'BATCH-APOLLO-2026'
    );

    expect(updatedMed.stockQuantity).toBe(newStockQty);
    expect(updatedMed.price).toBe(newSellingPrice);

    // Verify in pharmacy inventory list
    const inventory = await PharmacyService.getPharmacyInventory(
      pharmacistUserId,
      pharmacyId,
      orgPharmacy
    );
    const foundMed = inventory.find(m => m.id === targetMedicineId);
    expect(foundMed).toBeDefined();
    expect(foundMed?.stockQuantity).toBe(newStockQty);
    expect(foundMed?.sellingPrice).toBe(newSellingPrice);
  });

  it('7. Unauthorized Session C (Staff from another tenant) is strictly blocked from viewing or acting on Apollo Pharmacy', async () => {
    // Other tenant attempting to view Apollo orders
    await expect(
      PharmacyService.getPharmacyOrders(
        otherUserId,
        pharmacyId,
        orgPharmacy
      )
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);

    // Other tenant attempting to alter Apollo inventory
    await expect(
      PharmacyService.updateInventoryStock(
        otherUserId,
        pharmacyId,
        orgPharmacy,
        'med-1',
        500,
        20
      )
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);

    // Other tenant attempting to alter Apollo order status
    await expect(
      PharmacyService.updatePharmacyOrderStatus(
        otherUserId,
        pharmacyId,
        orgPharmacy,
        createdOrderId,
        'cancelled'
      )
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);
  });
});
