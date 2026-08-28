import { describe, it, expect } from 'vitest';
import { PharmacyService } from '../src/server/services/pharmacy.service';
import { OrgService } from '../src/server/services/organization.service';

describe('Multi-Vendor Cart Splitting & Independent Sub-Order Lifecycles', () => {
  const patientUserId = 'usr-101';
  const patientName = 'Arjun Sharma';

  const pharmacyApolloId = 'pharma-1';
  const orgApollo = 'org-apollo-pharmacy';
  const staffApollo = 'auth-staff-pharmacy';

  const pharmacyMedplusId = 'pharma-2';
  const orgMedplus = 'org-medplus-pharmacy';
  const staffMedplus = 'auth-staff-medplus';

  let parentOrderId: string;
  let subOrderApolloId: string;
  let subOrderMedplusId: string;

  it('1. Patient checks out a cart containing medicines from two distinct pharmacies', async () => {
    const parentOrder = await PharmacyService.createOrder({
      patientProfileId: patientUserId,
      patientName,
      items: [
        {
          medicineId: 'med-1', // Dolo 650 (from Apollo)
          quantity: 2,
          pharmacyId: pharmacyApolloId
        },
        {
          medicineId: 'med-2', // CeraVe Moisturising Lotion (from MedPlus)
          quantity: 1,
          pharmacyId: pharmacyMedplusId
        }
      ],
      deliveryType: 'delivery',
      deliveryAddress: 'Flat 402, Heritage Heights, Sector 62, Noida',
      paymentMethod: 'upi'
    });

    expect(parentOrder).toBeDefined();
    expect(parentOrder.id).toBeDefined();
    expect(parentOrder.isParentOrder).toBe(true);
    expect(parentOrder.vendorCount).toBe(2);
    expect(parentOrder.subOrders).toBeDefined();
    expect(parentOrder.subOrders?.length).toBe(2);

    parentOrderId = parentOrder.id;

    const apolloSub = parentOrder.subOrders?.find(s => s.pharmacyId === pharmacyApolloId);
    const medplusSub = parentOrder.subOrders?.find(s => s.pharmacyId === pharmacyMedplusId);

    expect(apolloSub).toBeDefined();
    expect(apolloSub?.parentOrderId).toBe(parentOrderId);
    expect(apolloSub?.items.length).toBe(1);
    expect(apolloSub?.items[0].medicineId).toBe('med-1');

    expect(medplusSub).toBeDefined();
    expect(medplusSub?.parentOrderId).toBe(parentOrderId);
    expect(medplusSub?.items.length).toBe(1);
    expect(medplusSub?.items[0].medicineId).toBe('med-2');

    subOrderApolloId = apolloSub!.id;
    subOrderMedplusId = medplusSub!.id;
  });

  it('2. Apollo Pharmacist sees ONLY their own sub-order and MedPlus Pharmacist sees ONLY theirs', async () => {
    // Apollo Pharmacist Query
    const apolloOrders = await PharmacyService.getPharmacyOrders(
      staffApollo,
      pharmacyApolloId,
      orgApollo
    );

    const apolloFound = apolloOrders.find(o => o.id === subOrderApolloId);
    const medplusInApollo = apolloOrders.find(o => o.id === subOrderMedplusId);
    const parentInApollo = apolloOrders.find(o => o.id === parentOrderId);

    expect(apolloFound).toBeDefined();
    expect(medplusInApollo).toBeUndefined(); // Strictly isolated
    expect(parentInApollo).toBeUndefined(); // Parent envelope hidden from single desk

    // MedPlus Pharmacist Query
    const medplusOrders = await PharmacyService.getPharmacyOrders(
      staffMedplus,
      pharmacyMedplusId,
      orgMedplus
    );

    const medplusFound = medplusOrders.find(o => o.id === subOrderMedplusId);
    const apolloInMedplus = medplusOrders.find(o => o.id === subOrderApolloId);

    expect(medplusFound).toBeDefined();
    expect(apolloInMedplus).toBeUndefined(); // Strictly isolated
  });

  it('3. Apollo Pharmacist independently advances Sub-Order A to delivered while Sub-Order B remains pending', async () => {
    // 1. Apollo accepts and processes Sub-Order A
    await PharmacyService.updatePharmacyOrderStatus(
      staffApollo,
      pharmacyApolloId,
      orgApollo,
      subOrderApolloId,
      'processing'
    );

    // 2. Apollo marks Sub-Order A out for delivery
    await PharmacyService.updatePharmacyOrderStatus(
      staffApollo,
      pharmacyApolloId,
      orgApollo,
      subOrderApolloId,
      'out_for_delivery'
    );

    // Check Sub-Order B remains in initial placed state
    const medplusOrder = await PharmacyService.getOrderById(subOrderMedplusId);
    expect(medplusOrder?.status).toBe('placed');

    // 3. Check Patient view of Parent Order reflects overall out_for_delivery progress
    const parentMid = await PharmacyService.getOrderById(parentOrderId);
    expect(parentMid?.status).toBe('out_for_delivery');
    expect(parentMid?.subOrders?.find(s => s.id === subOrderApolloId)?.status).toBe('out_for_delivery');
    expect(parentMid?.subOrders?.find(s => s.id === subOrderMedplusId)?.status).toBe('placed');

    // 4. Apollo marks Sub-Order A as delivered
    await PharmacyService.updatePharmacyOrderStatus(
      staffApollo,
      pharmacyApolloId,
      orgApollo,
      subOrderApolloId,
      'delivered'
    );

    const apolloFinal = await PharmacyService.getOrderById(subOrderApolloId);
    expect(apolloFinal?.status).toBe('delivered');
  });

  it('4. MedPlus Pharmacist advances Sub-Order B to delivered, completing the whole Parent Order', async () => {
    // MedPlus processes and delivers Sub-Order B
    await PharmacyService.updatePharmacyOrderStatus(
      staffMedplus,
      pharmacyMedplusId,
      orgMedplus,
      subOrderMedplusId,
      'processing'
    );

    await PharmacyService.updatePharmacyOrderStatus(
      staffMedplus,
      pharmacyMedplusId,
      orgMedplus,
      subOrderMedplusId,
      'delivered'
    );

    const medplusFinal = await PharmacyService.getOrderById(subOrderMedplusId);
    expect(medplusFinal?.status).toBe('delivered');

    // Parent Order overall status now evaluates to delivered
    const parentFinal = await PharmacyService.getOrderById(parentOrderId);
    expect(parentFinal?.status).toBe('delivered');
    expect(parentFinal?.subOrders?.every(s => s.status === 'delivered')).toBe(true);
  });

  it('5. CRITICAL: Apollo Pharmacist is strictly blocked from acting on MedPlus Sub-Order', async () => {
    // Apollo staff attempting to alter MedPlus sub-order
    await expect(
      PharmacyService.updatePharmacyOrderStatus(
        staffApollo,
        pharmacyMedplusId,
        orgMedplus,
        subOrderMedplusId,
        'cancelled'
      )
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);
  });
});
