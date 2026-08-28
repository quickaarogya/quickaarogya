'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  RefreshCw,
  ArrowUpRight,
  Receipt,
  Download,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { SettlementService } from '@/server/services/settlement.service';
import { OrganizationService, VendorOrganization } from '@/server/services/organization.service';
import { VendorEarningsSummary, EscrowLedgerEntry } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export default function VendorEarningsPage() {
  const [activeOrgId, setActiveOrgId] = useState('org-apollo-hospital');
  const [activeUserId, setActiveUserId] = useState('auth-staff-apollo');
  const [earnings, setEarnings] = useState<VendorEarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const summary = await SettlementService.getVendorEarningsSummary(activeUserId, activeOrgId);
      setEarnings(summary);
    } catch (err) {
      console.error('Failed to load vendor earnings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeOrgId, activeUserId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                Financial Escrow & Settlements
              </span>
              <Badge variant="success" className="text-xs">
                <ShieldCheck className="w-3 h-3 mr-1" /> Platform Commission: {earnings?.commissionRatePercent || 10}%
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {earnings?.organizationName || 'Vendor Earnings & Escrow Ledger'}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Organization: <strong>{activeOrgId}</strong> • Logged in Staff: <strong>{activeUserId}</strong> • Tokenized Ledger Protection Active
            </p>
          </div>

          {/* Quick Tenant Switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium px-1">Switch Tenant:</span>
            <Button
              size="sm"
              variant={activeOrgId === 'org-apollo-hospital' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveOrgId('org-apollo-hospital');
                setActiveUserId('auth-staff-apollo');
              }}
              className={activeOrgId === 'org-apollo-hospital' ? 'bg-teal-600 hover:bg-teal-700 text-xs' : 'text-xs text-slate-300'}
            >
              Apollo Hospital
            </Button>
            <Button
              size="sm"
              variant={activeOrgId === 'org-apollo-pharmacy' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveOrgId('org-apollo-pharmacy');
                setActiveUserId('auth-staff-pharmacy');
              }}
              className={activeOrgId === 'org-apollo-pharmacy' ? 'bg-teal-600 hover:bg-teal-700 text-xs' : 'text-xs text-slate-300'}
            >
              Apollo Pharmacy
            </Button>
            <Button
              size="sm"
              variant={activeOrgId === 'org-medplus-pharmacy' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveOrgId('org-medplus-pharmacy');
                setActiveUserId('auth-staff-medplus');
              }}
              className={activeOrgId === 'org-medplus-pharmacy' ? 'bg-teal-600 hover:bg-teal-700 text-xs' : 'text-xs text-slate-300'}
            >
              MedPlus Pharmacy
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Gross Revenue */}
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Gross Patient Revenue</span>
              <Receipt className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(earnings?.totalGrossRevenue || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total patient billings processed</p>
          </Card>

          {/* Card 2: Platform Commission */}
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Platform Fee ({earnings?.commissionRatePercent || 10}%)</span>
              <Building className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              -₹{(earnings?.totalPlatformCommission || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Platform service & hosting fee</p>
          </Card>

          {/* Card 3: In Escrow (Pending) */}
          <Card className="p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>In Escrow (Pending)</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
              ₹{(earnings?.pendingEscrowAmount || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Awaiting automated weekly payout</p>
          </Card>

          {/* Card 4: Settled & Disbursed */}
          <Card className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Settled (Disbursed)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              ₹{(earnings?.settledAmount || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Successfully transferred to bank</p>
          </Card>
        </div>

        {/* Ledger Entries Table */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" /> Escrow Transaction Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Itemized entries with tokenized transaction references (zero raw financial credentials stored)
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={loadData} className="text-xs self-start sm:self-auto">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Ledger
            </Button>
          </div>

          <div className="overflow-x-auto">
            {(!earnings?.ledgerEntries || earnings.ledgerEntries.length === 0) ? (
              <div className="p-8">
                <EmptyState
                  icon={Receipt}
                  title="No Escrow Ledger Entries Yet"
                  description="Completed appointments and delivered pharmacy sub-orders will automatically generate escrow entries here."
                />
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Transaction Token</th>
                    <th className="py-3 px-4">Type / Reference</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4 text-right">Gross (INR)</th>
                    <th className="py-3 px-4 text-right">Platform Fee</th>
                    <th className="py-3 px-4 text-right font-bold text-teal-600 dark:text-teal-400">Net Payable</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {earnings.ledgerEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {entry.transactionToken}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                          {entry.referenceType === 'appointment' ? (
                            <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          ) : (
                            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>{entry.referenceNumber}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {entry.patientName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-900 dark:text-white">
                        ₹{entry.grossAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-rose-600 dark:text-rose-400">
                        -₹{entry.platformCommissionAmount.toLocaleString()} ({entry.platformCommissionRate}%)
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{entry.netVendorPayable.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant={entry.status === 'settled' ? 'success' : 'warning'}
                          className="text-[10px] uppercase font-bold"
                        >
                          {entry.status === 'in_escrow' ? 'In Escrow' : 'Settled'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
