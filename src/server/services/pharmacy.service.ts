import {
  Pharmacy,
  Medicine,
  PharmacyOrder,
  PharmacyOrderItem,
  OrderStatus,
  MedicineCategory
} from '@/types';
import { AarogyaStorage } from '@/lib/storage';
import prisma from '@/lib/prisma';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { OrgService } from './organization.service';
import { NotificationService } from './notification.service';
import { SettlementService } from './settlement.service';

export class PharmacyService {
  static async getPharmacies(filters?: {
    searchQuery?: string;
    only24x7?: boolean;
  }): Promise<Pharmacy[]> {
    try {
        const dbPharmas: any[] = await (prisma.pharmacy.findMany as any)({
          where: {
            isVerified: true,
            OR: [
              { organization: { verificationStatus: 'VERIFIED' } },
              { organizationId: null }
            ]
          },
          include: { organization: true }
        });
        if (dbPharmas && dbPharmas.length > 0) {
          const dbMapped: Pharmacy[] = dbPharmas.map(p => ({
            id: p.id,
            name: p.name,
            address: `${p.addressLine1}, ${p.city}`,
            distanceKm: 2.5,
            rating: 4.8,
            isOpen24x7: p.isOpen24x7,
            phone: p.phone,
            estimatedDeliveryMins: 35,
            deliveryFee: 30,
            deliveryRadiusKm: Number(p.deliveryRadiusKm)
          }));

          const localPharmas = AarogyaStorage.getPharmacies().filter(p => p.isVerified !== false);
          const mergedMap = new Map<string, Pharmacy>();
          localPharmas.forEach(p => mergedMap.set(p.id, p));
          dbMapped.forEach(p => mergedMap.set(p.id, p));

          let mapped = Array.from(mergedMap.values()).filter(p => p.isVerified !== false);

          if (filters?.only24x7) {
            mapped = mapped.filter(p => p.isOpen24x7);
          }

          if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
            const q = filters.searchQuery.toLowerCase();
            mapped = mapped.filter(
              p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
            );
          }

          return mapped;
        }
    } catch (err) {
      console.warn('[PharmacyService] Prisma getPharmacies error:', err);
    }

    let pharmacies = AarogyaStorage.getPharmacies().filter(p => p.isVerified !== false);

    if (filters?.only24x7) {
      pharmacies = pharmacies.filter(p => p.isOpen24x7);
    }

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      pharmacies = pharmacies.filter(
        p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
      );
    }

    return pharmacies;
  }

  static async getPharmacyById(id: string): Promise<Pharmacy | null> {
    try {
      if (typeof window === 'undefined') {
        const p = await prisma.pharmacy.findUnique({ where: { id } });
        if (p) {
          return {
            id: p.id,
            name: p.name,
            address: `${p.addressLine1}, ${p.city}`,
            distanceKm: 2.5,
            rating: 4.8,
            isOpen24x7: p.isOpen24x7,
            phone: p.phone,
            estimatedDeliveryMins: 35,
            deliveryFee: 30,
            deliveryRadiusKm: Number(p.deliveryRadiusKm)
          };
        }
      }
    } catch (err) {
      console.warn('[PharmacyService] Prisma getPharmacyById error:', err);
    }

    const pharmacies = AarogyaStorage.getPharmacies();
    return pharmacies.find(p => p.id === id) || null;
  }

  static async getMedicines(filters?: {
    category?: MedicineCategory | 'all';
    searchQuery?: string;
    requiresPrescription?: boolean;
  }): Promise<Medicine[]> {
    try {
      if (typeof window === 'undefined') {
        const dbMeds = await prisma.medicine.findMany({
          include: { inventory: true }
        });

        if (dbMeds && dbMeds.length > 0) {
          const dbMapped: Medicine[] = dbMeds.map(m => {
            const inv = m.inventory[0];
            return {
              id: m.id,
              brandName: m.brandName,
              genericName: m.genericName,
              form: m.dosageForm as any,
              strength: m.strength,
              manufacturer: m.manufacturer,
              price: inv ? Number(inv.sellingPrice) : 120,
              mrp: inv ? Number(inv.mrp) : 150,
              prescriptionRequired: m.prescriptionRequired,
              sideEffects: m.sideEffects,
              inStock: inv ? inv.isAvailable && inv.stockQuantity > 0 : true,
              stockQuantity: inv ? inv.stockQuantity : 100,
              rating: 4.7,
              ratingCount: 88,
              category: 'chronic_care' as any
            };
          });

          const localMeds = AarogyaStorage.getMedicines();
          const mergedMap = new Map<string, Medicine>();
          localMeds.forEach(m => mergedMap.set(m.id, m));
          dbMapped.forEach(m => mergedMap.set(m.id, m));

          let mapped = Array.from(mergedMap.values());

          if (filters?.requiresPrescription !== undefined) {
            mapped = mapped.filter(m => m.prescriptionRequired === filters.requiresPrescription);
          }

          if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
            const q = filters.searchQuery.toLowerCase();
            mapped = mapped.filter(
              m =>
                m.brandName.toLowerCase().includes(q) ||
                m.genericName.toLowerCase().includes(q) ||
                m.manufacturer.toLowerCase().includes(q)
            );
          }

          return mapped;
        }
      }
    } catch (err) {
      console.warn('[PharmacyService] Prisma getMedicines error:', err);
    }

    let medicines = AarogyaStorage.getMedicines();

    if (filters?.category && filters.category !== 'all') {
      medicines = medicines.filter(m => m.category === filters.category);
    }

    if (filters?.requiresPrescription !== undefined) {
      medicines = medicines.filter(m => m.prescriptionRequired === filters.requiresPrescription);
    }

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      medicines = medicines.filter(
        m =>
          m.brandName.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.manufacturer.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    return medicines;
  }

  static async getMedicineById(id: string): Promise<Medicine | null> {
    try {
      if (typeof window === 'undefined') {
        const m = await prisma.medicine.findUnique({
          where: { id },
          include: { inventory: true }
        });
        if (m) {
          const inv = m.inventory[0];
          return {
            id: m.id,
            brandName: m.brandName,
            genericName: m.genericName,
            form: m.dosageForm as any,
            strength: m.strength,
            manufacturer: m.manufacturer,
            price: inv ? Number(inv.sellingPrice) : 120,
            mrp: inv ? Number(inv.mrp) : 150,
            prescriptionRequired: m.prescriptionRequired,
            sideEffects: m.sideEffects,
            inStock: inv ? inv.isAvailable && inv.stockQuantity > 0 : true,
            stockQuantity: inv ? inv.stockQuantity : 100,
            rating: 4.7,
            ratingCount: 88,
            category: 'chronic_care' as any
          };
        }
      }
    } catch (err) {
      console.warn('[PharmacyService] Prisma getMedicineById error:', err);
    }

    const medicines = AarogyaStorage.getMedicines();
    return medicines.find(m => m.id === id) || null;
  }

  private static async createSinglePharmacyOrder(params: {
    patientProfileId: string;
    patientName: string;
    pharmacy: Pharmacy;
    items: { medicineId: string; quantity: number; pharmacyId?: string }[];
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    prescriptionDocumentId?: string;
    prescriptionFileName?: string;
    paymentMethod?: 'upi' | 'card_token' | 'netbanking' | 'cod';
    allMedicines: Medicine[];
    parentOrderId?: string;
  }): Promise<PharmacyOrder> {
    const { pharmacy, items, allMedicines, parentOrderId } = params;

    let hasRxRequiredItem = false;
    let subtotal = 0;
    let totalDiscount = 0;
    const orderItems: PharmacyOrderItem[] = [];

    for (const item of items) {
      if (item.quantity <= 0) throw new Error('Item quantity must be greater than zero.');
      const med = allMedicines.find(m => m.id === item.medicineId);
      if (!med) throw new Error(`Medicine with ID ${item.medicineId} not found.`);
      if (!med.inStock) throw new Error(`${med.brandName} is currently out of stock.`);
      if (med.prescriptionRequired) hasRxRequiredItem = true;

      const itemTotal = med.price * item.quantity;
      const mrpTotal = (med.mrp || med.price) * item.quantity;
      const discount = mrpTotal - itemTotal;

      subtotal += itemTotal;
      totalDiscount += Math.max(0, discount);

      orderItems.push({
        medicineId: med.id,
        medicineName: `${med.brandName} (${med.strength})`,
        genericName: med.genericName,
        strength: med.strength,
        form: med.form,
        quantity: item.quantity,
        unitPrice: med.price,
        mrp: med.mrp,
        totalPrice: itemTotal,
        requiresPrescription: med.prescriptionRequired,
        pharmacyId: pharmacy.id,
        pharmacyName: pharmacy.name
      });
    }

    if (hasRxRequiredItem && !params.prescriptionDocumentId) {
      throw new Error(
        'One or more medicines in your cart require a valid prescription. Please upload or link your prescription document from your Medical Vault to place the order.'
      );
    }

    const deliveryFee = params.deliveryType === 'delivery' ? (subtotal >= 500 ? 0 : 30) : 0;
    const totalAmount = subtotal + deliveryFee;

    const orderId = parentOrderId ? `ord-sub-${pharmacy.id}-${Date.now()}` : `ord-${Date.now()}`;
    const orderNumber = parentOrderId
      ? `QA-SUB-${pharmacy.id.slice(-4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      : `QA-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialStatus: OrderStatus = hasRxRequiredItem
      ? 'prescription_verification'
      : (parentOrderId ? 'placed' : 'confirmed');

    const order: PharmacyOrder = {
      id: orderId,
      orderNumber,
      parentOrderId,
      patientProfileId: params.patientProfileId,
      patientName: params.patientName,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      items: orderItems,
      subtotal,
      discountAmount: totalDiscount,
      deliveryFee,
      totalAmount,
      deliveryType: params.deliveryType,
      deliveryAddress: params.deliveryAddress || 'Flat 402, Heritage Heights, Green Park, New Delhi',
      status: initialStatus,
      requiresPrescription: hasRxRequiredItem,
      prescriptionDocumentId: params.prescriptionDocumentId,
      prescriptionFileName: params.prescriptionFileName || (params.prescriptionDocumentId ? 'Linked_Medical_Prescription.pdf' : undefined),
      prescriptionVerified: !hasRxRequiredItem,
      estimatedDeliveryTime: 'Arriving in ~25-35 mins',
      createdAt: new Date().toISOString(),
      paymentMethod: params.paymentMethod || 'upi',
      paymentStatus: 'paid'
    };

    // Write to Server-Side PostgreSQL Database
    try {
      if (typeof window === 'undefined') {
        await prisma.order.create({
          data: {
            id: orderId,
            orderNumber,
            userProfileId: params.patientProfileId,
            pharmacyId: pharmacy.id,
            subtotalAmount: subtotal,
            deliveryFee,
            totalAmount,
            status: PrismaOrderStatus.PLACED,
            items: {
              create: orderItems.map(i => ({
                id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                medicineId: i.medicineId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice
              }))
            }
          }
        });
      }
    } catch (err) {
      console.warn('[PharmacyService] Prisma order create error:', err);
    }

    AarogyaStorage.placePharmacyOrder(order);

    // Dispatch Vendor Inbox Stream Event
    const orgId = pharmacy.organizationId || (pharmacy.id === 'pharma-2' ? 'org-medplus-pharmacy' : 'org-apollo-pharmacy');
    try {
      await NotificationService.createNotification({
        organizationId: orgId,
        type: hasRxRequiredItem ? 'vendor_order_pending_rx' : 'vendor_new_order',
        title: hasRxRequiredItem ? `Rx Audit Required: Order #${orderNumber}` : `New Pharmacy Order: #${orderNumber}`,
        message: `Patient ${params.patientName} placed an order for ${orderItems.length} item(s). Total: ₹${totalAmount}.`,
        action: { label: 'View Order Desk', url: '/vendor/orders' },
        relatedEntity: { type: 'order', id: orderId, name: pharmacy.name }
      });
    } catch (e) {
      console.warn('Vendor notification dispatch error:', e);
    }

    return order;
  }

  static async createOrder(data: {
    patientProfileId: string;
    patientName: string;
    pharmacyId?: string;
    items: {
      medicineId: string;
      quantity: number;
      pharmacyId?: string;
    }[];
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    prescriptionDocumentId?: string;
    prescriptionFileName?: string;
    paymentMethod?: 'upi' | 'card_token' | 'netbanking' | 'cod';
  }): Promise<PharmacyOrder> {
    if (!data.items || data.items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }

    const allMedicines = await this.getMedicines();
    const pharmacies = await this.getPharmacies();
    const defaultPharmacy = (data.pharmacyId && pharmacies.find(p => p.id === data.pharmacyId)) || pharmacies[0];

    // Group items by pharmacy
    const pharmacyGroups = new Map<string, typeof data.items>();
    for (const item of data.items) {
      const pId = item.pharmacyId || data.pharmacyId || defaultPharmacy.id;
      if (!pharmacyGroups.has(pId)) {
        pharmacyGroups.set(pId, []);
      }
      pharmacyGroups.get(pId)!.push(item);
    }

    const uniquePharmacyIds = Array.from(pharmacyGroups.keys());

    // Single-Vendor Order Flow
    if (uniquePharmacyIds.length === 1) {
      const pId = uniquePharmacyIds[0];
      const pharmacy = pharmacies.find(p => p.id === pId) || defaultPharmacy;
      return this.createSinglePharmacyOrder({
        ...data,
        pharmacy,
        items: data.items,
        allMedicines
      });
    }

    // Multi-Vendor Cart Splitting Flow (1 Parent Order + N Sub-Orders)
    const parentOrderId = `ord-parent-${Date.now()}`;
    const parentOrderNumber = `QA-MULTI-${Math.floor(1000 + Math.random() * 9000)}`;

    const subOrders: PharmacyOrder[] = [];
    let combinedSubtotal = 0;
    let combinedDiscount = 0;
    let combinedDeliveryFee = 0;
    let anyRequiresRx = false;
    const allOrderItems: PharmacyOrderItem[] = [];

    for (const [pId, groupItems] of pharmacyGroups.entries()) {
      const pharmacy = pharmacies.find(p => p.id === pId) || {
        id: pId,
        name: pId === 'pharma-2' ? 'MedPlus Superstore & Pharmacy' : 'Apollo 24|7 Express Pharmacy',
        organizationId: pId === 'pharma-2' ? 'org-medplus-pharmacy' : 'org-apollo-pharmacy',
        deliveryFee: 29
      } as any;

      const subOrder = await this.createSinglePharmacyOrder({
        ...data,
        pharmacy,
        items: groupItems,
        allMedicines,
        parentOrderId
      });

      subOrders.push(subOrder);
      combinedSubtotal += subOrder.subtotal;
      combinedDiscount += (subOrder.discountAmount || 0);
      combinedDeliveryFee += subOrder.deliveryFee;
      if (subOrder.requiresPrescription) anyRequiresRx = true;
      allOrderItems.push(...subOrder.items);
    }

    const parentOrder: PharmacyOrder = {
      id: parentOrderId,
      orderNumber: parentOrderNumber,
      patientProfileId: data.patientProfileId,
      patientName: data.patientName,
      pharmacyId: 'multi-vendor',
      pharmacyName: `${subOrders.map(s => s.pharmacyName).join(', ')} (${subOrders.length} Pharmacies)`,
      items: allOrderItems,
      subtotal: combinedSubtotal,
      discountAmount: combinedDiscount,
      deliveryFee: combinedDeliveryFee,
      totalAmount: combinedSubtotal + combinedDeliveryFee,
      deliveryType: data.deliveryType,
      deliveryAddress: data.deliveryAddress || 'Flat 402, Heritage Heights, Green Park, New Delhi',
      status: anyRequiresRx ? 'prescription_verification' : 'placed',
      requiresPrescription: anyRequiresRx,
      prescriptionDocumentId: data.prescriptionDocumentId,
      prescriptionFileName: data.prescriptionFileName,
      prescriptionVerified: !anyRequiresRx,
      estimatedDeliveryTime: 'Multiple Packages (~25-45 mins)',
      createdAt: new Date().toISOString(),
      paymentMethod: data.paymentMethod || 'upi',
      paymentStatus: 'paid',
      isParentOrder: true,
      subOrders,
      vendorCount: subOrders.length
    };

    AarogyaStorage.placePharmacyOrder(parentOrder);
    return parentOrder;
  }

  static async getOrders(patientProfileId?: string, status?: OrderStatus | 'all'): Promise<PharmacyOrder[]> {
    try {
      if (typeof window === 'undefined') {
        const whereClause: any = {};
        if (patientProfileId && patientProfileId !== 'all') {
          whereClause.userProfileId = patientProfileId;
        }

        const dbOrders = await prisma.order.findMany({
          where: whereClause,
          include: {
            pharmacy: true,
            userProfile: true,
            items: { include: { medicine: true } }
          },
          orderBy: { createdAt: 'desc' }
        });

        if (dbOrders && dbOrders.length > 0) {
          let mapped: PharmacyOrder[] = dbOrders.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            patientProfileId: o.userProfileId,
            patientName: o.userProfile ? `${o.userProfile.firstName} ${o.userProfile.lastName}` : 'Arjun Sharma',
            pharmacyId: o.pharmacyId || 'pharma-1',
            pharmacyName: o.pharmacy?.name || 'Apollo 24|7 Express Pharmacy',
            items: o.items.map(i => ({
              medicineId: i.medicineId,
              medicineName: i.medicine?.brandName || 'Prescribed Medicine',
              genericName: i.medicine?.genericName,
              strength: i.medicine?.strength,
              form: i.medicine?.dosageForm as any,
              quantity: i.quantity,
              unitPrice: Number(i.unitPrice),
              totalPrice: Number(i.totalPrice),
              requiresPrescription: i.medicine?.prescriptionRequired || false
            })),
            subtotal: Number(o.subtotalAmount),
            deliveryFee: Number(o.deliveryFee),
            totalAmount: Number(o.totalAmount),
            deliveryType: 'delivery',
            deliveryAddress: 'Flat 402, Heritage Heights, Noida',
            status: (o.status.toLowerCase()) as any,
            requiresPrescription: false,
            prescriptionVerified: true,
            createdAt: o.createdAt.toISOString(),
            paymentMethod: 'upi',
            paymentStatus: 'paid'
          }));

          if (status && status !== 'all') {
            mapped = mapped.filter(o => o.status === status);
          }

          return mapped;
        }
      }
    } catch (err) {
      console.warn('[PharmacyService] Prisma getOrders error:', err);
    }

    let orders = AarogyaStorage.getPharmacyOrders();

    if (patientProfileId && patientProfileId !== 'all') {
      orders = orders.filter(o => o.patientProfileId === patientProfileId);
    }

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    return orders;
  }

  static async getOrderById(id: string): Promise<PharmacyOrder | null> {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === id);
    if (!order) return null;

    if (order.isParentOrder || (order.subOrders && order.subOrders.length > 0)) {
      const allOrders = AarogyaStorage.getPharmacyOrders();
      const updatedSubOrders = (order.subOrders || []).map(s => {
        const liveSub = allOrders.find(o => o.id === s.id);
        return liveSub || s;
      });
      order.subOrders = updatedSubOrders;

      const allDelivered = updatedSubOrders.length > 0 && updatedSubOrders.every(s => s.status === 'delivered');
      const allCancelled = updatedSubOrders.length > 0 && updatedSubOrders.every(s => s.status === 'cancelled');
      const anyOutForDelivery = updatedSubOrders.some(s => s.status === 'out_for_delivery' || s.status === 'dispatched');
      const anyProcessing = updatedSubOrders.some(s => s.status === 'processing' || s.status === 'preparing' || s.status === 'confirmed');
      const anyDelivered = updatedSubOrders.some(s => s.status === 'delivered');
      const anyPendingRx = updatedSubOrders.some(s => s.status === 'prescription_verification');

      if (allDelivered) order.status = 'delivered';
      else if (allCancelled) order.status = 'cancelled';
      else if (anyOutForDelivery) order.status = 'out_for_delivery';
      else if (anyProcessing || anyDelivered) order.status = 'processing';
      else if (anyPendingRx) order.status = 'prescription_verification';
      else order.status = 'placed';
    }

    return order;
  }

  static async updateOrderStatus(id: string, status: OrderStatus): Promise<PharmacyOrder> {
    try {
      if (typeof window === 'undefined') {
        await prisma.order.update({
          where: { id },
          data: { status: status.toUpperCase() as any }
        });
      }
    } catch (err) {
      console.warn('[PharmacyService] Prisma updateOrderStatus error:', err);
    }

    const orders = AarogyaStorage.getPharmacyOrders();
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found.');

    const updated: PharmacyOrder = {
      ...order,
      status,
      prescriptionVerified: status === 'confirmed' || status === 'preparing' ? true : order.prescriptionVerified,
    };

    AarogyaStorage.updatePharmacyOrderStatus(id, status);
    return updated;
  }

  static async cancelOrder(id: string, reason?: string): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        await prisma.order.update({
          where: { id },
          data: { status: PrismaOrderStatus.CANCELLED }
        });
      }
    } catch (err) {
      console.warn('[PharmacyService] Prisma cancelOrder error:', err);
    }

    const orders = AarogyaStorage.getPharmacyOrders();
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found.');

    if (order.status === 'out_for_delivery' || order.status === 'delivered') {
      throw new Error('Order cannot be cancelled once out for delivery or delivered.');
    }

    AarogyaStorage.cancelPharmacyOrder(id);

    AarogyaStorage.addNotification({
      type: 'general',
      title: 'Order Cancelled',
      message: `Order #${order.orderNumber} has been cancelled. Refund of ₹${order.totalAmount} initiated.`,
      urgency: 'low',
      actionUrl: '/pharmacies',
    });

    return true;
  }

  static async reorder(orderId: string): Promise<PharmacyOrder> {
    const pastOrder = await this.getOrderById(orderId);
    if (!pastOrder) throw new Error('Past order not found.');

    return this.createOrder({
      patientProfileId: pastOrder.patientProfileId,
      patientName: pastOrder.patientName,
      pharmacyId: pastOrder.pharmacyId,
      items: pastOrder.items.map(i => ({
        medicineId: i.medicineId,
        quantity: i.quantity,
      })),
      deliveryType: pastOrder.deliveryType,
      deliveryAddress: pastOrder.deliveryAddress,
      prescriptionDocumentId: pastOrder.prescriptionDocumentId,
      prescriptionFileName: pastOrder.prescriptionFileName,
      paymentMethod: pastOrder.paymentMethod,
    });
  }

  // Pharmacist Order Desk & Inventory Control (Gated by RBAC Engine)
  static async getPharmacyOrders(
    actorUserId: string,
    pharmacyId: string,
    organizationId: string
  ): Promise<PharmacyOrder[]> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'VIEW_ORDERS');

    const orders = await this.getOrders();
    return orders.filter(o => o.pharmacyId === pharmacyId && !o.isParentOrder);
  }

  static async getPharmacyInventory(
    actorUserId: string,
    pharmacyId: string,
    organizationId: string
  ): Promise<(Medicine & { batchNumber?: string; stockQuantity: number; sellingPrice: number })[]> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'MANAGE_INVENTORY');

    const meds = await this.getMedicines();
    return meds.map(m => ({
      ...m,
      batchNumber: 'DL-2026-B8',
      stockQuantity: m.stockQuantity || 120,
      sellingPrice: m.price
    }));
  }

  static async updateInventoryStock(
    actorUserId: string,
    pharmacyId: string,
    organizationId: string,
    medicineId: string,
    stockQuantity: number,
    sellingPrice: number,
    batchNumber = 'BATCH-2026-N1'
  ): Promise<Medicine> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'MANAGE_INVENTORY');

    try {
      if (typeof window === 'undefined') {
        const existingInv = await prisma.medicineInventory.findFirst({
          where: { pharmacyId, medicineId }
        });

        if (existingInv) {
          await prisma.medicineInventory.update({
            where: { id: existingInv.id },
            data: {
              stockQuantity,
              sellingPrice,
              batchNumber
            }
          });
        } else {
          await prisma.medicineInventory.create({
            data: {
              id: `inv-${Date.now()}`,
              pharmacyId,
              medicineId,
              stockQuantity,
              sellingPrice,
              mrp: sellingPrice * 1.15,
              batchNumber,
              expiryDate: new Date('2028-12-31')
            }
          });
        }
      }
    } catch (err) {
      console.warn('[PharmacyService] updateInventoryStock Prisma error:', err);
    }

    const med = await this.getMedicineById(medicineId);
    if (!med) throw new Error(`Medicine ${medicineId} not found.`);

    med.stockQuantity = stockQuantity;
    med.price = sellingPrice;
    med.inStock = stockQuantity > 0;

    return med;
  }

  static async verifyOrderPrescription(
    actorUserId: string,
    pharmacyId: string,
    organizationId: string,
    orderId: string,
    reviewNotes: string
  ): Promise<PharmacyOrder> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'MANAGE_ORDERS');

    const order = await this.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found.`);

    order.prescriptionVerified = true;
    order.prescriptionReviewNotes = reviewNotes;

    AarogyaStorage.updatePharmacyOrderStatus(orderId, order.status, {
      prescriptionVerified: true,
      prescriptionReviewNotes: reviewNotes
    });

    AarogyaStorage.addNotification({
      type: 'general',
      title: 'Prescription Verified',
      message: `Pharmacist has verified your prescription for Order #${order.orderNumber}. Preparation started.`,
      urgency: 'low',
      actionUrl: '/pharmacies'
    });

    return order;
  }

  static async updatePharmacyOrderStatus(
    actorUserId: string,
    pharmacyId: string,
    organizationId: string,
    orderId: string,
    newStatus: OrderStatus,
    reason?: string
  ): Promise<PharmacyOrder> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'MANAGE_ORDERS');

    const order = await this.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found.`);

    // If order contains prescription-required items, pharmacist MUST have verified before confirming/dispatching
    if (
      order.requiresPrescription &&
      !order.prescriptionVerified &&
      (newStatus === 'confirmed' ||
        newStatus === 'preparing' ||
        newStatus === 'processing' ||
        newStatus === 'dispatched' ||
        newStatus === 'out_for_delivery' ||
        newStatus === 'delivered')
    ) {
      throw new Error(
        '400 Bad Request: Prescription verification required before advancing order to confirmed, processing, or dispatched.'
      );
    }

    let prismaStatus: any = PrismaOrderStatus.PLACED;
    if (newStatus === 'confirmed') prismaStatus = (PrismaOrderStatus as any).CONFIRMED || PrismaOrderStatus.PREPARING;
    else if (newStatus === 'processing' || newStatus === 'preparing') prismaStatus = PrismaOrderStatus.PREPARING;
    else if (newStatus === 'dispatched' || newStatus === 'out_for_delivery') prismaStatus = PrismaOrderStatus.DISPATCHED;
    else if (newStatus === 'delivered') prismaStatus = PrismaOrderStatus.DELIVERED;
    else if (newStatus === 'cancelled') prismaStatus = PrismaOrderStatus.CANCELLED;

    try {
      if (typeof window === 'undefined') {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: prismaStatus }
        });
      }
    } catch (err) {
      console.warn('[PharmacyService] updatePharmacyOrderStatus Prisma error:', err);
    }

    order.status = newStatus;
    AarogyaStorage.updatePharmacyOrderStatus(orderId, newStatus);

    // Automatic Financial Escrow Ledger Trigger on Order Delivery
    if (newStatus === 'delivered') {
      try {
        await SettlementService.recordOrderDeliveredLedger({
          orderId: order.id,
          orderNumber: order.orderNumber,
          pharmacyId: order.pharmacyId,
          organizationId: organizationId,
          organizationName: order.pharmacyName,
          patientName: order.patientName,
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          totalAmount: order.totalAmount,
          actorUserId: actorUserId
        });
      } catch (err) {
        console.warn('[PharmacyService] Failed to record delivery escrow ledger entry:', err);
      }
    }

    return order;
  }
}
