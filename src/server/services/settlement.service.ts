import { AarogyaStorage } from '@/lib/storage';
import {
  EscrowLedgerEntry,
  EscrowStatus,
  LedgerReferenceType,
  VendorEarningsSummary,
  AdminPlatformEarningsSummary,
  CommissionRule
} from '@/types';
import { OrgService, OrganizationService } from './organization.service';
import { NotificationService } from './notification.service';

export class SettlementService {
  // Default Commission Rates by Organization Type (or per-org override)
  private static readonly DEFAULT_COMMISSION_RATES: Record<string, number> = {
    'org-apollo-hospital': 10, // 10% on hospital consultations & procedures
    'org-dr-vivek-clinic': 10,  // 10% on specialist OPD
    'org-apollo-pharmacy': 8,   // 8% on pharmacy marketplace sales
    'org-medplus-pharmacy': 8   // 8% on pharmacy marketplace sales
  };

  static getCommissionRate(organizationId: string): number {
    return this.DEFAULT_COMMISSION_RATES[organizationId] ?? 10;
  }

  // Generate Tokenized Secure Transaction Reference (Zero raw card/bank numbers)
  private static generateTransactionToken(prefix: string): string {
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 12);
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-ESCROW-${prefix.toUpperCase()}-${timestamp}-${randomHex}`;
  }

  /**
   * Record Escrow Ledger Entry when an Appointment Consultation is completed
   */
  static async recordAppointmentCompletionLedger(params: {
    appointmentId: string;
    doctorId: string;
    organizationId: string;
    organizationName?: string;
    patientName: string;
    consultationFee: number;
    actorUserId: string;
  }): Promise<EscrowLedgerEntry> {
    OrgService.checkStaffPermission(params.actorUserId, params.organizationId, 'MANAGE_APPOINTMENTS');

    // Prevent duplicate ledger entry for the same appointment (Idempotency)
    const existingEntries = AarogyaStorage.getEscrowLedgerEntries();
    const duplicate = existingEntries.find(
      e => e.referenceType === 'appointment' && e.referenceId === params.appointmentId
    );
    if (duplicate) return duplicate;

    const rate = this.getCommissionRate(params.organizationId);
    const grossAmount = params.consultationFee;
    const platformCommissionAmount = Math.round(grossAmount * (rate / 100));
    const netVendorPayable = grossAmount - platformCommissionAmount;

    const entry: EscrowLedgerEntry = {
      id: `escrow-apt-${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      organizationId: params.organizationId,
      organizationName: params.organizationName || 'Apollo Hospital & Heart Center',
      referenceType: 'appointment',
      referenceId: params.appointmentId,
      referenceNumber: `QA-APT-${params.appointmentId.slice(-4).toUpperCase()}`,
      patientName: params.patientName,
      grossAmount,
      platformCommissionRate: rate,
      platformCommissionAmount,
      netVendorPayable,
      status: 'in_escrow',
      transactionToken: this.generateTransactionToken('APT'),
      createdAt: new Date().toISOString(),
      notes: `Consultation fee held in escrow after OPD completion by ${params.actorUserId}`
    };

    AarogyaStorage.addEscrowLedgerEntry(entry);

    // Dispatch Vendor Notification Stream Event
    try {
      await NotificationService.createNotification({
        organizationId: params.organizationId,
        type: 'vendor_low_balance',
        title: `Escrow Credit: ₹${netVendorPayable}`,
        message: `Consultation for ${params.patientName} completed. Gross: ₹${grossAmount}, Platform Fee (${rate}%): ₹${platformCommissionAmount}. ₹${netVendorPayable} credited to Escrow.`,
        action: { label: 'View Earnings', url: '/vendor/earnings' },
        relatedEntity: { type: 'appointment', id: params.appointmentId, name: params.patientName }
      });
    } catch (err) {
      console.warn('Failed to dispatch escrow notification:', err);
    }

    return entry;
  }

  /**
   * Record Escrow Ledger Entry when a Pharmacy Sub-Order is Delivered
   */
  static async recordOrderDeliveredLedger(params: {
    orderId: string;
    orderNumber: string;
    pharmacyId: string;
    organizationId: string;
    organizationName?: string;
    patientName: string;
    subtotal: number;
    deliveryFee?: number;
    totalAmount: number;
    actorUserId: string;
  }): Promise<EscrowLedgerEntry> {
    OrgService.checkStaffPermission(params.actorUserId, params.organizationId, 'MANAGE_ORDERS');

    // Prevent duplicate ledger entry for the same order (Idempotency)
    const existingEntries = AarogyaStorage.getEscrowLedgerEntries();
    const duplicate = existingEntries.find(
      e => e.referenceType === 'order' && e.referenceId === params.orderId
    );
    if (duplicate) return duplicate;

    const rate = this.getCommissionRate(params.organizationId);
    const grossAmount = params.totalAmount || params.subtotal;
    const platformCommissionAmount = Math.round(grossAmount * (rate / 100));
    const netVendorPayable = grossAmount - platformCommissionAmount;

    const entry: EscrowLedgerEntry = {
      id: `escrow-ord-${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      organizationId: params.organizationId,
      organizationName: params.organizationName || (params.organizationId === 'org-medplus-pharmacy' ? 'MedPlus Superstore & Pharmacy' : 'Apollo 24|7 Express Pharmacy'),
      referenceType: 'order',
      referenceId: params.orderId,
      referenceNumber: params.orderNumber,
      patientName: params.patientName,
      grossAmount,
      platformCommissionRate: rate,
      platformCommissionAmount,
      netVendorPayable,
      status: 'in_escrow',
      transactionToken: this.generateTransactionToken('ORD'),
      createdAt: new Date().toISOString(),
      notes: `Order fulfillment payment held in escrow after delivery confirmation`
    };

    AarogyaStorage.addEscrowLedgerEntry(entry);

    // Dispatch Vendor Notification Stream Event
    try {
      await NotificationService.createNotification({
        organizationId: params.organizationId,
        type: 'vendor_low_balance',
        title: `Escrow Credit: ₹${netVendorPayable}`,
        message: `Order #${params.orderNumber} delivered to ${params.patientName}. Gross: ₹${grossAmount}, Platform Fee (${rate}%): ₹${platformCommissionAmount}. ₹${netVendorPayable} in Escrow.`,
        action: { label: 'View Earnings', url: '/vendor/earnings' },
        relatedEntity: { type: 'order', id: params.orderId, name: params.orderNumber }
      });
    } catch (err) {
      console.warn('Failed to dispatch escrow notification:', err);
    }

    return entry;
  }

  /**
   * Vendor-Facing Earnings Summary (Strictly Tenant-Scoped)
   */
  static async getVendorEarningsSummary(
    actorUserId: string,
    organizationId: string
  ): Promise<VendorEarningsSummary> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'VIEW_FINANCIALS');

    const org = await OrganizationService.getOrganizationById(organizationId);
    const entries = AarogyaStorage.getEscrowLedgerEntries().filter(
      e => e.organizationId === organizationId
    );

    const totalGrossRevenue = entries.reduce((acc, e) => acc + e.grossAmount, 0);
    const totalPlatformCommission = entries.reduce((acc, e) => acc + e.platformCommissionAmount, 0);
    const totalNetEarnings = entries.reduce((acc, e) => acc + e.netVendorPayable, 0);
    const pendingEscrowAmount = entries
      .filter(e => e.status === 'in_escrow')
      .reduce((acc, e) => acc + e.netVendorPayable, 0);
    const settledAmount = entries
      .filter(e => e.status === 'settled')
      .reduce((acc, e) => acc + e.netVendorPayable, 0);

    return {
      organizationId,
      organizationName: org?.name || organizationId,
      totalGrossRevenue,
      totalPlatformCommission,
      totalNetEarnings,
      pendingEscrowAmount,
      settledAmount,
      commissionRatePercent: this.getCommissionRate(organizationId),
      ledgerEntries: entries
    };
  }

  /**
   * Platform Admin Action: Settle Pending Escrow Holdings into Payouts
   */
  static async settleVendorPayout(
    adminUserId: string,
    organizationId: string,
    entryIds?: string[]
  ): Promise<{ settledCount: number; totalSettledAmount: number }> {
    const entries = AarogyaStorage.getEscrowLedgerEntries();
    let settledCount = 0;
    let totalSettledAmount = 0;

    for (const entry of entries) {
      if (
        entry.organizationId === organizationId &&
        entry.status === 'in_escrow' &&
        (!entryIds || entryIds.includes(entry.id))
      ) {
        AarogyaStorage.updateEscrowLedgerEntry(entry.id, {
          status: 'settled',
          settledAt: new Date().toISOString()
        });
        settledCount++;
        totalSettledAmount += entry.netVendorPayable;
      }
    }

    return { settledCount, totalSettledAmount };
  }

  /**
   * Platform Admin View: Aggregate Commission and GMV Across All Organizations
   */
  static async getAdminPlatformEarningsSummary(adminUserId: string): Promise<AdminPlatformEarningsSummary> {
    const allEntries = AarogyaStorage.getEscrowLedgerEntries();
    const orgs = await OrganizationService.getOrganizations();

    const totalPlatformGrossVolume = allEntries.reduce((acc, e) => acc + e.grossAmount, 0);
    const totalCommissionCollected = allEntries.reduce((acc, e) => acc + e.platformCommissionAmount, 0);
    const totalVendorNetPayable = allEntries.reduce((acc, e) => acc + e.netVendorPayable, 0);
    const pendingEscrowHoldings = allEntries
      .filter(e => e.status === 'in_escrow')
      .reduce((acc, e) => acc + e.netVendorPayable, 0);
    const totalSettledDisbursements = allEntries
      .filter(e => e.status === 'settled')
      .reduce((acc, e) => acc + e.netVendorPayable, 0);

    const breakdownMap = new Map<string, {
      organizationId: string;
      organizationName: string;
      grossVolume: number;
      commissionCollected: number;
      netPayable: number;
      pendingEscrow: number;
      settled: number;
      transactionCount: number;
    }>();

    // Initialize with all known orgs
    for (const org of orgs) {
      breakdownMap.set(org.id, {
        organizationId: org.id,
        organizationName: org.name,
        grossVolume: 0,
        commissionCollected: 0,
        netPayable: 0,
        pendingEscrow: 0,
        settled: 0,
        transactionCount: 0
      });
    }

    for (const entry of allEntries) {
      if (!breakdownMap.has(entry.organizationId)) {
        breakdownMap.set(entry.organizationId, {
          organizationId: entry.organizationId,
          organizationName: entry.organizationName || entry.organizationId,
          grossVolume: 0,
          commissionCollected: 0,
          netPayable: 0,
          pendingEscrow: 0,
          settled: 0,
          transactionCount: 0
        });
      }

      const orgStats = breakdownMap.get(entry.organizationId)!;
      orgStats.grossVolume += entry.grossAmount;
      orgStats.commissionCollected += entry.platformCommissionAmount;
      orgStats.netPayable += entry.netVendorPayable;
      if (entry.status === 'in_escrow') {
        orgStats.pendingEscrow += entry.netVendorPayable;
      } else if (entry.status === 'settled') {
        orgStats.settled += entry.netVendorPayable;
      }
      orgStats.transactionCount += 1;
    }

    return {
      totalPlatformGrossVolume,
      totalCommissionCollected,
      totalVendorNetPayable,
      pendingEscrowHoldings,
      totalSettledDisbursements,
      totalTransactionsCount: allEntries.length,
      organizationBreakdown: Array.from(breakdownMap.values()),
      recentLedgerEntries: allEntries.slice(0, 50)
    };
  }
}
