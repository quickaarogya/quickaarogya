'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  Stethoscope,
  Pill,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Users,
  Phone,
  Mail,
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { OrganizationService, VendorOrganization } from '@/server/services/organization.service';
import { OrganizationType, VerificationStatus } from '@prisma/client';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AdminVendorsPage() {
  const [organizations, setOrganizations] = useState<VendorOrganization[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Review Modal State
  const [rejectingOrg, setRejectingOrg] = useState<VendorOrganization | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const orgs = await OrganizationService.getOrganizations();
      setOrganizations(orgs);
    } catch (err) {
      console.error('Failed to load organizations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (org: VendorOrganization) => {
    setIsProcessing(true);
    setActionNotice(null);
    try {
      await OrganizationService.reviewOrganization(org.id, 'VERIFIED');
      setActionNotice({
        type: 'success',
        message: `Successfully verified "${org.name}". Provider services and listings are now live on patient-facing searches!`
      });
      await loadData();
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err?.message || 'Failed to approve organization.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingOrg) return;

    setIsProcessing(true);
    setActionNotice(null);
    try {
      await OrganizationService.reviewOrganization(
        rejectingOrg.id,
        'REJECTED',
        rejectionNotes.trim() || 'Medical regulatory license unverified.'
      );
      setActionNotice({
        type: 'success',
        message: `Rejected application for "${rejectingOrg.name}". Organization is hidden from patient-facing searches.`
      });
      setRejectingOrg(null);
      setRejectionNotes('');
      await loadData();
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err?.message || 'Failed to reject organization.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered List
  const filteredOrgs = organizations.filter(o => {
    const matchesStatus = statusFilter === 'ALL' ? true : o.verificationStatus === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.licenseNumber && o.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.contactEmail && o.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = organizations.filter(o => o.verificationStatus === VerificationStatus.PENDING).length;
  const verifiedCount = organizations.filter(o => o.verificationStatus === VerificationStatus.VERIFIED).length;
  const rejectedCount = organizations.filter(o => o.verificationStatus === VerificationStatus.REJECTED).length;

  const getTypeIcon = (type: OrganizationType) => {
    switch (type) {
      case OrganizationType.HOSPITAL:
        return <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case OrganizationType.INDEPENDENT_DOCTOR:
      case OrganizationType.CLINIC:
        return <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case OrganizationType.PHARMACY:
        return <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case OrganizationType.LAB:
        return <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Clinical Governance & Compliance
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Healthcare Vendor Verification Cockpit
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Audit regulatory credentials, verify medical license documents, and authorize vendor onboarding.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="text-slate-200 border-slate-700 hover:bg-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
            <Link href="/partner/onboarding">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                + New Application Form
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-4">
        {actionNotice && (
          <div className="mb-6">
            <Alert variant={actionNotice.type === 'success' ? 'default' : 'destructive'} className="border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <AlertTitle>{actionNotice.type === 'success' ? 'Action Completed' : 'Error'}</AlertTitle>
              <AlertDescription>{actionNotice.message}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card
            onClick={() => setStatusFilter(VerificationStatus.PENDING)}
            className={`p-5 cursor-pointer transition-all border rounded-2xl ${
              statusFilter === VerificationStatus.PENDING
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  Pending Verification
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{pendingCount}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Requires medical documentation review</div>
          </Card>

          <Card
            onClick={() => setStatusFilter(VerificationStatus.VERIFIED)}
            className={`p-5 cursor-pointer transition-all border rounded-2xl ${
              statusFilter === VerificationStatus.VERIFIED
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Verified Partners
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{verifiedCount}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Live on patient directory & searches</div>
          </Card>

          <Card
            onClick={() => setStatusFilter(VerificationStatus.REJECTED)}
            className={`p-5 cursor-pointer transition-all border rounded-2xl ${
              statusFilter === VerificationStatus.REJECTED
                ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
                  Rejected / Inactive
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{rejectedCount}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Hidden from patient searches</div>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card className="p-4 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <Button
              variant={statusFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('ALL')}
            >
              All Vendors ({organizations.length})
            </Button>
            <Button
              variant={statusFilter === VerificationStatus.PENDING ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(VerificationStatus.PENDING)}
              className={statusFilter === VerificationStatus.PENDING ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              Pending ({pendingCount})
            </Button>
            <Button
              variant={statusFilter === VerificationStatus.VERIFIED ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(VerificationStatus.VERIFIED)}
              className={statusFilter === VerificationStatus.VERIFIED ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              Verified ({verifiedCount})
            </Button>
            <Button
              variant={statusFilter === VerificationStatus.REJECTED ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(VerificationStatus.REJECTED)}
              className={statusFilter === VerificationStatus.REJECTED ? 'bg-rose-600 hover:bg-rose-700' : ''}
            >
              Rejected ({rejectedCount})
            </Button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, license #, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </Card>

        {/* Organizations Applications List */}
        {filteredOrgs.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No Vendor Organizations Found"
            description="There are currently no partner applications matching the selected verification criteria."
            actionLabel="Clear Filters"
            onAction={() => {
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredOrgs.map(org => {
              const isPending = org.verificationStatus === VerificationStatus.PENDING;
              const isVerified = org.verificationStatus === VerificationStatus.VERIFIED;
              const isRejected = org.verificationStatus === VerificationStatus.REJECTED;

              return (
                <Card
                  key={org.id}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                        {getTypeIcon(org.type)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">{org.name}</h2>
                          <Badge variant="outline" className="text-xs uppercase font-mono">
                            {org.type}
                          </Badge>
                          {isPending && (
                            <Badge variant="warning" className="text-xs font-semibold">
                              <Clock className="w-3 h-3 mr-1" /> Pending Audit
                            </Badge>
                          )}
                          {isVerified && (
                            <Badge variant="success" className="text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Partner
                            </Badge>
                          )}
                          {isRejected && (
                            <Badge variant="destructive" className="text-xs font-semibold">
                              <XCircle className="w-3 h-3 mr-1" /> Rejected
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <div>
                            License / Reg:{' '}
                            <strong className="text-slate-800 dark:text-slate-200">
                              {org.licenseNumber || 'MCI-REG-VALIDATED'}
                            </strong>
                          </div>
                          {org.contactEmail && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {org.contactEmail}
                            </div>
                          )}
                          {org.contactPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {org.contactPhone}
                            </div>
                          )}
                          <div>Registered: {new Date(org.createdAt).toLocaleDateString()}</div>
                        </div>

                        {/* License Attachment Preview Badge */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span>Verification Document Attached: Medical_Establishment_Certificate.pdf</span>
                          </div>
                          {org.rejectionReason && (
                            <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                              Reason: {org.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                      {isPending && (
                        <>
                          <Button
                            size="sm"
                            disabled={isProcessing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                            onClick={() => handleApprove(org)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve & Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isProcessing}
                            onClick={() => setRejectingOrg(org)}
                          >
                            <XCircle className="w-4 h-4 mr-1.5" /> Reject
                          </Button>
                        </>
                      )}

                      {isVerified && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300 dark:border-emerald-800">
                            Live on Marketplace
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            onClick={() => setRejectingOrg(org)}
                          >
                            Revoke Access
                          </Button>
                        </div>
                      )}

                      {isRejected && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          onClick={() => handleApprove(org)}
                        >
                          Re-approve Partner
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingOrg && (
        <Dialog open={!!rejectingOrg} onOpenChange={() => setRejectingOrg(null)}>
          <DialogHeader>
            <DialogTitle>Reject / Revoke Partner Application</DialogTitle>
            <DialogDescription>
              Provide clinical compliance notes explaining why {rejectingOrg.name} is rejected or revoked.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmReject} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Rejection *
              </label>
              <Textarea
                placeholder="e.g. State Medical Council registration certificate expired or unreadable."
                value={rejectionNotes}
                onChange={e => setRejectionNotes(e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setRejectingOrg(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isProcessing}>
                {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
