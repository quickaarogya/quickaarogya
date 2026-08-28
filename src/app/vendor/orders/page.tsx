'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Truck,
  Check,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Building2,
  Plus,
  Edit2,
  DollarSign,
  Package,
  ArrowRight,
  Eye,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { PharmacyService } from '@/server/services/pharmacy.service';
import { OrganizationService, VendorOrganization } from '@/server/services/organization.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { PharmacyOrder, Medicine, OrderStatus } from '@/types';
import { StaffRole } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function PharmacyOrdersDeskPage() {
  const { user } = useAuthStore();

  // Tenant & Pharmacist Context
  const [activePharmacyId, setActivePharmacyId] = useState('pharma-1');
  const [activeOrgId, setActiveOrgId] = useState('org-apollo-pharmacy');
  const [activeUserId, setActiveUserId] = useState('auth-staff-pharmacy');
  const [pharmacyProfile, setPharmacyProfile] = useState<any | null>(null);

  // Desk State
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [inventory, setInventory] = useState<(Medicine & { batchNumber?: string; stockQuantity: number; sellingPrice: number })[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'history'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Prescription Verification Modal
  const [verifyingOrder, setVerifyingOrder] = useState<PharmacyOrder | null>(null);
  const [rxNotes, setRxNotes] = useState('');
  const [isVerifyingRx, setIsVerifyingRx] = useState(false);

  // Inventory Stock & Price Adjustment Modal
  const [editingMed, setEditingMed] = useState<(Medicine & { batchNumber?: string; stockQuantity: number; sellingPrice: number }) | null>(null);
  const [editStockQty, setEditStockQty] = useState(100);
  const [editPrice, setEditPrice] = useState(45);
  const [editBatch, setEditBatch] = useState('DL-2026-B8');
  const [isUpdatingInv, setIsUpdatingInv] = useState(false);
  const [inventoryNotice, setInventoryNotice] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const pharma = await PharmacyService.getPharmacyById(activePharmacyId);
      setPharmacyProfile(pharma);

      const ords = await PharmacyService.getPharmacyOrders(
        activeUserId,
        activePharmacyId,
        activeOrgId
      );
      setOrders(ords);

      const inv = await PharmacyService.getPharmacyInventory(
        activeUserId,
        activePharmacyId,
        activeOrgId
      );
      setInventory(inv);
    } catch (err) {
      console.error('Failed to load pharmacy desk data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activePharmacyId, activeOrgId, activeUserId]);

  const handleVerifyPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingOrder) return;

    setIsVerifyingRx(true);
    try {
      await PharmacyService.verifyOrderPrescription(
        activeUserId,
        activePharmacyId,
        activeOrgId,
        verifyingOrder.id,
        rxNotes.trim() || 'Prescription verified against state drug schedule requirements. Approved for dispensing.'
      );
      setVerifyingOrder(null);
      setRxNotes('');
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifyingRx(false);
    }
  };

  const handleAdvanceStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await PharmacyService.updatePharmacyOrderStatus(
        activeUserId,
        activePharmacyId,
        activeOrgId,
        orderId,
        nextStatus
      );
      await loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to update order status');
    }
  };

  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;

    setIsUpdatingInv(true);
    try {
      await PharmacyService.updateInventoryStock(
        activeUserId,
        activePharmacyId,
        activeOrgId,
        editingMed.id,
        Number(editStockQty),
        Number(editPrice),
        editBatch
      );
      setEditingMed(null);
      setInventoryNotice(`Updated stock and pricing for ${editingMed.brandName} successfully.`);
      setTimeout(() => setInventoryNotice(null), 4000);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingInv(false);
    }
  };

  const openEditInventoryModal = (med: any) => {
    setEditingMed(med);
    setEditStockQty(med.stockQuantity);
    setEditPrice(med.sellingPrice);
    setEditBatch(med.batchNumber || 'BATCH-2026-N1');
  };

  // Filter Active vs Completed
  const activeOrders = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const deliveredHistory = orders.filter(
    o => o.status === 'delivered' || o.status === 'cancelled'
  );

  const pendingRxCount = activeOrders.filter(
    o => o.requiresPrescription && !o.prescriptionVerified
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Pharmacy Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                Pharmacist Order Desk
              </span>
              <Badge variant="success" className="text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" /> RBAC Authorized
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {pharmacyProfile?.name || 'Apollo 24|7 Express Pharmacy'}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Drug License: <strong>DL-20B-18492</strong> • Verified Vendor Tenant: <strong>org-apollo-pharmacy</strong> • Pharmacist: <strong>Rohan Gupta</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="text-slate-200 border-slate-700 hover:bg-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Orders
            </Button>
            <Link href="/vendor/dashboard">
              <Button size="sm" variant="default" className="bg-teal-600 hover:bg-teal-700 text-white">
                <ChevronRight className="w-3.5 h-3.5 mr-1" /> Vendor Workspace
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-4">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Active Orders
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeOrders.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-2">Incoming fulfillment queue</div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Pending Rx Audits
                </div>
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pendingRxCount}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Requires pharmacist review</div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Medicine SKUs
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{inventory.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Pharmacy managed catalog</div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Delivered Total
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{deliveredHistory.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Completed customer orders</div>
          </Card>
        </div>

        {inventoryNotice && (
          <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <AlertTitle>Inventory Updated</AlertTitle>
            <AlertDescription className="text-xs">{inventoryNotice}</AlertDescription>
          </Alert>
        )}

        {/* Tab Controls */}
        <Card className="p-2 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('orders')}
              className={activeTab === 'orders' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" /> Incoming Order Desk ({activeOrders.length})
            </Button>
            <Button
              variant={activeTab === 'inventory' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('inventory')}
              className={activeTab === 'inventory' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              <Package className="w-4 h-4 mr-1.5" /> Store Stock & Pricing Controls ({inventory.length})
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('history')}
              className={activeTab === 'history' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              <Truck className="w-4 h-4 mr-1.5" /> Fulfilled Deliveries ({deliveredHistory.length})
            </Button>
          </div>
        </Card>

        {/* Tab 1: Incoming Orders Queue */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No Active Orders in Queue"
                description="Orders placed by patients from your pharmacy catalog will appear in this fulfillment console."
              />
            ) : (
              activeOrders.map(order => {
                const needsRxAudit = order.requiresPrescription && !order.prescriptionVerified;

                return (
                  <Card
                    key={order.id}
                    className={`p-6 border rounded-2xl shadow-sm transition-all ${
                      needsRxAudit
                        ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">{order.orderNumber}</h2>
                          <Badge variant="outline" className="text-xs font-mono">
                            {order.items.length} Item(s)
                          </Badge>
                          <Badge variant="info" className="text-xs uppercase font-semibold">
                            {order.status}
                          </Badge>
                          {order.requiresPrescription && (
                            order.prescriptionVerified ? (
                              <Badge variant="success" className="text-xs font-semibold">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Rx Verified
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="text-xs font-semibold animate-pulse">
                                <Clock className="w-3 h-3 mr-1" /> Requires Pharmacist Rx Audit
                              </Badge>
                            )
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Patient: <strong className="text-slate-800 dark:text-slate-200">{order.patientName}</strong> • Delivery: <strong>{order.deliveryAddress || 'Standard Delivery'}</strong> • Total: <strong className="text-emerald-600">₹{order.totalAmount}</strong> ({order.paymentMethod.toUpperCase()} - {order.paymentStatus.toUpperCase()})
                        </p>

                        {/* Itemized list */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                item.requiresPrescription
                                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <Pill className="w-3 h-3" />
                              <span>{item.medicineName} x{item.quantity}</span>
                              {item.requiresPrescription && (
                                <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 ml-1">
                                  [Rx]
                                </span>
                              )}
                            </span>
                          ))}
                        </div>

                        {order.prescriptionReviewNotes && (
                          <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <strong>Pharmacist Audit Note:</strong> {order.prescriptionReviewNotes}
                          </div>
                        )}
                      </div>

                      {/* Workflow Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                        {needsRxAudit && (
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm"
                            onClick={() => setVerifyingOrder(order)}
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" /> Review & Verify Rx
                          </Button>
                        )}

                        {order.status === 'placed' && (
                          <Button
                            size="sm"
                            disabled={needsRxAudit}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                            onClick={() => handleAdvanceStatus(order.id, 'processing')}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Accept & Prepare
                          </Button>
                        )}

                        {(order.status === 'processing' || order.status === 'preparing' || order.status === 'confirmed') && (
                          <Button
                            size="sm"
                            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold"
                            onClick={() => handleAdvanceStatus(order.id, 'out_for_delivery')}
                          >
                            <Truck className="w-3.5 h-3.5 mr-1" /> Mark Dispatched
                          </Button>
                        )}

                        {order.status === 'out_for_delivery' && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            onClick={() => handleAdvanceStatus(order.id, 'delivered')}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirm Delivered
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          onClick={() => handleAdvanceStatus(order.id, 'cancelled')}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Pharmacy Store Inventory & Pricing */}
        {activeTab === 'inventory' && (
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" /> Pharmacy Store Stock & Direct Pricing
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage retail batch stocks, availability status, and patient selling prices for this licensed store.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter inventory..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Medicine & Strength</th>
                    <th className="py-3 px-3">Form & Manufacturer</th>
                    <th className="py-3 px-3">Batch #</th>
                    <th className="py-3 px-3">Store Stock</th>
                    <th className="py-3 px-3">MRP / Selling Price</th>
                    <th className="py-3 px-3">Rx Policy</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {inventory
                    .filter(
                      m =>
                        searchQuery.trim() === '' ||
                        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(med => (
                      <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                          <div>{med.brandName}</div>
                          <div className="text-[11px] text-slate-500">{med.genericName} • {med.strength}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                          <span className="capitalize">{med.form}</span>
                          <div className="text-[10px] text-slate-400">{med.manufacturer}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                          {med.batchNumber || 'DL-2026-B8'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-bold px-2 py-0.5 rounded ${
                            med.stockQuantity > 20
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {med.stockQuantity} Units
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          <span className="line-through text-slate-400 text-[11px] mr-1">₹{med.mrp || (med.sellingPrice * 1.15).toFixed(0)}</span>
                          <span className="text-emerald-600">₹{med.sellingPrice}</span>
                        </td>
                        <td className="py-3 px-3">
                          {med.prescriptionRequired ? (
                            <Badge variant="warning" className="text-[10px]">
                              Rx Required
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px]">
                              OTC
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditInventoryModal(med)}
                            className="text-xs"
                          >
                            <Edit2 className="w-3 h-3 mr-1" /> Adjust Stock & Price
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tab 3: Fulfilled Deliveries History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {deliveredHistory.length === 0 ? (
              <EmptyState
                icon={Truck}
                title="No Fulfilled Deliveries Yet"
                description="Orders that have been marked as delivered or concluded will be recorded here."
              />
            ) : (
              deliveredHistory.map(order => (
                <Card
                  key={order.id}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{order.orderNumber}</h2>
                        <Badge variant="outline" className="text-xs">
                          {order.items.length} Item(s)
                        </Badge>
                        <Badge variant={order.status === 'delivered' ? 'success' : 'destructive'} className="text-xs uppercase">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Customer: <strong>{order.patientName}</strong> • Total Value: <strong>₹{order.totalAmount}</strong> ({order.paymentMethod.toUpperCase()})
                      </p>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        Dispensed: {order.items.map(i => `${i.medicineName} (${i.quantity}x)`).join(', ')}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Order Archived
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Prescription Audit Modal */}
      {verifyingOrder && (
        <Dialog open={!!verifyingOrder} onOpenChange={() => setVerifyingOrder(null)}>
          <DialogHeader>
            <DialogTitle>Audit Clinical Prescription — Order #{verifyingOrder.orderNumber}</DialogTitle>
            <DialogDescription>
              Verify doctor signature, dosage schedule, and patient details before authorizing dispensation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyPrescription} className="space-y-4 py-2">
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{verifyingOrder.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prescription Record:</span>
                <span className="font-bold text-teal-600">Rx-Clinical-Cardiology-2026.pdf (ABDM Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prescribed Drugs:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {verifyingOrder.items.filter(i => i.requiresPrescription).map(i => i.medicineName).join(', ')}
                </span>
              </div>
            </div>

            <FormField label="Pharmacist Compliance Audit Notes *">
              <Textarea
                placeholder="e.g. Verified valid MCI registration for prescribing doctor. Dosage schedules confirmed. Dispensation authorized."
                value={rxNotes}
                onChange={e => setRxNotes(e.target.value)}
                required
                rows={3}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setVerifyingOrder(null)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" disabled={isVerifyingRx}>
                {isVerifyingRx ? 'Verifying...' : 'Authorize & Verify Prescription'}
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Inventory Stock & Price Adjustment Modal */}
      {editingMed && (
        <Dialog open={!!editingMed} onOpenChange={() => setEditingMed(null)}>
          <DialogHeader>
            <DialogTitle>Adjust Store Stock & Price — {editingMed.brandName}</DialogTitle>
            <DialogDescription>
              Directly control retail stock units and pricing for {editingMed.genericName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveInventory} className="space-y-4 py-2">
            <FormField label="Store Stock Quantity (Units) *">
              <Input
                type="number"
                value={editStockQty}
                onChange={e => setEditStockQty(Number(e.target.value))}
                min={0}
                required
              />
            </FormField>

            <FormField label="Selling Price (₹ INR) *">
              <Input
                type="number"
                value={editPrice}
                onChange={e => setEditPrice(Number(e.target.value))}
                min={1}
                required
              />
            </FormField>

            <FormField label="Batch Number *">
              <Input
                type="text"
                value={editBatch}
                onChange={e => setEditBatch(e.target.value)}
                required
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingMed(null)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" disabled={isUpdatingInv}>
                {isUpdatingInv ? 'Saving...' : 'Save Stock & Price'}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
