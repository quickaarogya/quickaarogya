'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Building,
  DollarSign,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowUpRight,
  Filter,
  Check,
  Layers
} from 'lucide-react';
import { SettlementService } from '@/server/services/settlement.service';
import { AdminPlatformEarningsSummary } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export default function AdminSettlementsPage() {
  const [summary, setSummary] = useState<AdminPlatformEarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettling, setIsSettling] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await SettlementService.getAdminPlatformEarningsSummary('auth-admin');
      setSummary(data);
    } catch (err) {
      console.error('Failed to load admin settlements summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSettleOrg = async (organizationId: string) => {
    setIsSettling(organizationId);
    try {
      await SettlementService.settleVendorPayout('auth-admin', organizationId);
      await loadData();
    } catch (err) {
      console.error('Failed to settle payouts for organization:', err);
    } finally {
      setIsSettling(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider border border-rose-500/30">
                Platform Admin Financial Gateway
              </span>
              <Badge variant="outline" className="text-xs text-slate-300">
                <ShieldCheck className="w-3 h-3 mr-1" /> Global Escrow Pool
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Platform Commissions & Vendor Settlements
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Cross-organization financial aggregation, escrow holding reserves, and payout reconciliation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/vendors">
              <Button size="sm" variant="outline" className="text-xs bg-slate-800 border-slate-700 text-slate-200">
                Vendor Compliance Desk
              </Button>
            </Link>
            <Button size="sm" onClick={loadData} className="bg-teal-600 hover:bg-teal-700 text-xs">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Ledgers
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total GMV */}
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Total Platform GMV</span>
              <Layers className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(summary?.totalPlatformGrossVolume || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Gross patient transaction volume</p>
          </Card>

          {/* Commission Revenue */}
          <Card className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Platform Commission</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              ₹{(summary?.totalCommissionCollected || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Net platform revenue earned</p>
          </Card>

          {/* Escrow Pool */}
          <Card className="p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Pending Escrow Pool</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
              ₹{(summary?.pendingEscrowHoldings || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Vendor balances in escrow</p>
          </Card>

          {/* Settled Disbursements */}
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Disbursed to Vendors</span>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(summary?.totalSettledDisbursements || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total settled payout transactions</p>
          </Card>
        </div>

        {/* Organization Financial Breakdown */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" /> Vendor Financial Balances & Settlements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Escrow holdings and commission breakdown per verified vendor tenant
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4 text-right">Gross GMV</th>
                  <th className="py-3 px-4 text-right">Commission Earned</th>
                  <th className="py-3 px-4 text-right">Net Payable</th>
                  <th className="py-3 px-4 text-right">Pending in Escrow</th>
                  <th className="py-3 px-4 text-right">Settled</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {summary?.organizationBreakdown.map(org => (
                  <tr key={org.organizationId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {org.organizationName}
                      <span className="block font-mono text-[10px] text-slate-400 font-normal">
                        {org.organizationId} • {org.transactionCount} transactions
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      ₹{org.grossVolume.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      ₹{org.commissionCollected.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-teal-600 dark:text-teal-400">
                      ₹{org.netPayable.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-600 dark:text-amber-400">
                      ₹{org.pendingEscrow.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500">
                      ₹{org.settled.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {org.pendingEscrow > 0 ? (
                        <Button
                          size="sm"
                          disabled={isSettling === org.organizationId}
                          onClick={() => handleSettleOrg(org.organizationId)}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] h-7 px-2.5"
                        >
                          {isSettling === org.organizationId ? 'Settling...' : 'Disburse Payout'}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-slate-400">
                          Reconciled
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
