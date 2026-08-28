'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Stethoscope,
  Pill,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  UserCheck,
  FileText,
  UserPlus,
  RefreshCw,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { OrganizationService, VendorOrganization, VendorStaffMember } from '@/server/services/organization.service';
import { AppointmentService } from '@/server/services/appointment.service';
import { PharmacyService } from '@/server/services/pharmacy.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { Appointment, PharmacyOrder } from '@/types';
import { OrganizationType, VerificationStatus, StaffRole } from '@prisma/client';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function VendorDashboardPage() {
  const router = useRouter();
  const { user, profile, logout } = useAuthStore();

  const [activeOrg, setActiveOrg] = useState<VendorOrganization | null>(null);
  const [staffMemberships, setStaffMemberships] = useState<VendorStaffMember[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'orders' | 'staff'>('appointments');
  const [isLoading, setIsLoading] = useState(true);

  // Add Staff Member Modal State
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<StaffRole>(StaffRole.DOCTOR);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const orgs = await OrganizationService.getOrganizations();
      const currentUserId = user?.id || 'auth-doc-1';
      const memberships = await OrganizationService.getStaffMembershipsForUser(currentUserId);

      setStaffMemberships(memberships);

      // Select active organization (either the user's membership or the first available organization)
      const selected = memberships[0]?.organization || orgs[0] || null;
      setActiveOrg(selected);

      // Load appointments & orders
      const apts = await AppointmentService.getAppointments();
      setAppointments(apts);

      const ords = await PharmacyService.getOrders();
      setOrders(ords);
    } catch (err) {
      console.error('Failed to load vendor dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg || !staffEmail.trim()) return;

    setIsSubmittingStaff(true);
    try {
      await OrganizationService.addStaffMember({
        userId: `usr-staff-${Date.now()}`,
        organizationId: activeOrg.id,
        role: staffRole,
        isActive: true
      });
      setIsAddStaffOpen(false);
      setStaffEmail('');
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  const isVerified = activeOrg?.verificationStatus === VerificationStatus.VERIFIED;
  const isPending = activeOrg?.verificationStatus === VerificationStatus.PENDING;
  const isRejected = activeOrg?.verificationStatus === VerificationStatus.REJECTED;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider border border-teal-500/30">
                Vendor Workspace
              </span>
              {isVerified && (
                <Badge variant="success" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Active on Marketplace
                </Badge>
              )}
              {isPending && (
                <Badge variant="warning" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" /> Verification In Progress
                </Badge>
              )}
              {isRejected && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="w-3 h-3 mr-1" /> Application Rejected
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {activeOrg?.name || 'Healthcare Vendor Workspace'}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 flex items-center gap-3">
              <span>Type: <strong>{activeOrg?.type || 'Organization'}</strong></span>
              <span>•</span>
              <span>License: <strong>{activeOrg?.licenseNumber || 'Verified Registry'}</strong></span>
              <span>•</span>
              <span>Logged in as: <strong>{user?.email || 'dr.ananya@aarogya.health'}</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-slate-200 border-slate-700 hover:bg-slate-800">
                Switch to Patient App <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/admin/vendors">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Admin Review Portal <ShieldCheck className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-4">
        {/* Verification Status Warning for Unverified Tenants */}
        {isPending && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Clinical Compliance Review in Progress</AlertTitle>
            <AlertDescription className="text-xs mt-1 leading-relaxed">
              Your organization is currently undergoing medical registry verification. Your doctors and pharmacy services will be published to patient search results as soon as clinical audit approvals are granted.
            </AlertDescription>
          </Alert>
        )}

        {isRejected && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Verification Rejected</AlertTitle>
            <AlertDescription className="text-xs mt-1">
              Reason: {activeOrg?.rejectionReason || 'Regulatory license documentation failed verification checks.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  OPD Appointments
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{appointments.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Live consultation queue
            </div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Medicine Orders
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{orders.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Active prescriptions & orders</div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Staff Roster
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {activeOrg?.staffCount || 2}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Doctors & Clinical Admins</div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Marketplace Status
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {isVerified ? 'Live (Searchable)' : 'Hidden (Pending)'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">ABDM & PCI compliant</div>
          </Card>
        </div>

        {/* Tab Controls */}
        <Card className="p-2 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'appointments' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('appointments')}
              className={activeTab === 'appointments' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              <Calendar className="w-4 h-4 mr-1.5" /> OPD Appointments ({appointments.length})
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('orders')}
              className={activeTab === 'orders' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" /> Pharmacy Orders ({orders.length})
            </Button>
            <Button
              variant={activeTab === 'staff' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('staff')}
              className={activeTab === 'staff' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              <Users className="w-4 h-4 mr-1.5" /> Staff Roster
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddStaffOpen(true)}
            className="text-teal-600 border-teal-200 hover:bg-teal-50 dark:border-teal-800 dark:hover:bg-teal-950/40"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add Staff Member
          </Button>
        </Card>

        {/* Tab 1: OPD Appointments Queue */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Upcoming Consultations"
                description="Consultations booked by patients will appear in this live queue."
              />
            ) : (
              appointments.map(apt => (
                <Card
                  key={apt.id}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex flex-col items-center justify-center border border-teal-200 dark:border-teal-800 shrink-0">
                        <span className="text-[10px] uppercase leading-none">Token</span>
                        <span className="text-sm font-extrabold">{apt.tokenNumber || '#'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{apt.patientName}</h2>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {apt.appointmentNumber}
                          </Badge>
                          <Badge variant="success" className="text-[10px]">
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Consultation with <strong>{apt.doctorName}</strong> • {apt.date} at {apt.timeSlot} ({apt.type})
                        </p>
                        {apt.symptoms && (
                          <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                            <strong>Chief Complaint:</strong> {apt.symptoms}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        Call Patient
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                        Start Consultation
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Pharmacy Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No Pending Pharmacy Orders"
                description="Orders placed by patients for prescription and OTC medicines will appear here."
              />
            ) : (
              orders.map(order => (
                <Card
                  key={order.id}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{order.orderNumber}</h2>
                        <Badge variant="outline" className="text-[10px]">
                          {order.items.length} Item(s)
                        </Badge>
                        <Badge variant="info" className="text-[10px] uppercase">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Patient: <strong>{order.patientName}</strong> • Amount: <strong>₹{order.totalAmount}</strong> ({order.paymentMethod.toUpperCase()})
                      </p>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        Items: {order.items.map(i => `${i.medicineName} x${i.quantity}`).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        View Prescription
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                        Mark Dispatched
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Staff Roster */}
        {activeTab === 'staff' && (
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Authorized Clinical & Administrative Staff
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'Dr. Ananya Roy', role: 'DOCTOR', email: 'dr.ananya@aarogya.health', active: true },
                { name: 'Pooja Nair', role: 'ORG_ADMIN', email: 'pooja.admin@apollo.org', active: true },
                { name: 'Rohan Gupta', role: 'PHARMACIST', email: 'rohan.pharma@apollo.org', active: true }
              ].map((staff, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                      {staff.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{staff.name}</div>
                      <div className="text-xs text-slate-500">{staff.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs uppercase font-mono">
                      {staff.role}
                    </Badge>
                    <Badge variant="success" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <Dialog open={isAddStaffOpen} onOpenChange={() => setIsAddStaffOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Clinical Staff Member</DialogTitle>
            <DialogDescription>
              Authorize a practitioner or receptionist to act on behalf of {activeOrg?.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStaffSubmit} className="space-y-4 py-2">
            <FormField label="Staff Member Email *">
              <Input
                type="email"
                placeholder="e.g. dr.sharma@hospital.org"
                value={staffEmail}
                onChange={e => setStaffEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Staff Role *">
              <Select
                value={staffRole}
                onChange={e => setStaffRole(e.target.value as StaffRole)}
              >
                <option value={StaffRole.DOCTOR}>Doctor / Clinical Specialist</option>
                <option value={StaffRole.PHARMACIST}>Pharmacist / Dispenser</option>
                <option value={StaffRole.RECEPTIONIST}>Receptionist / OPD Queue Manager</option>
                <option value={StaffRole.ORG_ADMIN}>Organization Administrator</option>
                <option value={StaffRole.LAB_TECH}>Lab Technician</option>
              </Select>
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddStaffOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white" disabled={isSubmittingStaff}>
                {isSubmittingStaff ? 'Adding Staff...' : 'Add Staff Member'}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
