'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  ShieldCheck,
  Plus,
  Heart,
  Pill,
  Calendar,
  Trash2,
  CheckCircle2,
  Key,
  ShieldAlert,
  Edit2,
  Syringe,
  FileText,
  UserPlus,
  ArrowRight,
  Filter,
  AlertCircle,
  Clock,
  Activity,
  Sparkles,
  Info
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { FamilyService, CAREGIVER_DEFAULT_PERMISSIONS, STANDARD_FAMILY_PERMISSIONS } from '../../server/services/family.service';
import {
  FamilyMember,
  UserProfile,
  FamilyRelationship,
  FamilyPermission,
  FamilyHealthOverview,
  Gender,
  BloodGroup
} from '../../types';
import { PageHeader } from '../../components/ui/page-header';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs } from '../../components/ui/tabs';
import { EmptyState } from '../../components/ui/empty-state';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { FormField } from '../../components/ui/form-field';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';

const ALL_PERMISSIONS: { key: FamilyPermission; label: string; desc: string; category: 'Clinical' | 'Appointments' | 'Financial' | 'Emergency' }[] = [
  { key: 'VIEW_APPOINTMENTS', label: 'View Appointments', desc: 'Inspect scheduled doctor visits, token queues, and consultation history.', category: 'Appointments' },
  { key: 'BOOK_APPOINTMENTS', label: 'Book & Reschedule Appointments', desc: 'Book new clinical visits, modify consultation slots, and cancel appointments.', category: 'Appointments' },
  { key: 'VIEW_MEDICATIONS', label: 'View Medication Regimens', desc: 'Inspect active prescriptions, dosage timings, and current medicine balances.', category: 'Clinical' },
  { key: 'MANAGE_MEDICATIONS', label: 'Manage & Log Medication Doses', desc: 'Mark daily doses as taken/skipped, update reminder times, and request refills.', category: 'Clinical' },
  { key: 'VIEW_RECORDS', label: 'View Medical Documents & Lab Reports', desc: 'Access diagnostic reports, radiology scans, and historical doctor prescriptions.', category: 'Clinical' },
  { key: 'UPLOAD_RECORDS', label: 'Upload Health Records & Diagnostics', desc: 'Upload scanned clinical documents, vaccination certificates, and invoices.', category: 'Clinical' },
  { key: 'VIEW_EXPENSES', label: 'View Healthcare Expenses', desc: 'Inspect OPD consultation bills, lab booking invoices, and pharmacy expenditures.', category: 'Financial' },
  { key: 'EMERGENCY_ACCESS', label: 'Emergency QR Profile Access', desc: 'Authorize vital emergency medical profile access via public QR scanning.', category: 'Emergency' },
];

export default function FamilyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('feed');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [healthOverview, setHealthOverview] = useState<FamilyHealthOverview | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>('usr-101');
  const [selectedFeedFilter, setSelectedFeedFilter] = useState<string>('all');

  // Add Member State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<FamilyRelationship>('parent');
  const [dob, setDob] = useState('1965-05-15');
  const [gender, setGender] = useState<Gender>('female');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [abhaId, setAbhaId] = useState('');
  const [chronicInput, setChronicInput] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedInitialPerms, setSelectedInitialPerms] = useState<FamilyPermission[]>([
    ...STANDARD_FAMILY_PERMISSIONS
  ]);

  // Edit Permissions State
  const [editingPermsMember, setEditingPermsMember] = useState<FamilyMember | null>(null);
  const [editPermsList, setEditPermsList] = useState<FamilyPermission[]>([]);
  const [isPermsSaving, setIsPermsSaving] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    const activeId = AarogyaStorage.getActiveProfileId();
    setActiveProfileId(activeId);
    setProfile(AarogyaStorage.getUserProfile());

    const members = await FamilyService.getFamilyMembers('usr-101');
    setFamilyMembers(members);

    const overview = await FamilyService.getFamilyHealthOverview('usr-101');
    setHealthOverview(overview);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const handleRelationshipChange = (newRel: FamilyRelationship) => {
    setRelationship(newRel);
    if (newRel === 'caregiver') {
      setSelectedInitialPerms([...CAREGIVER_DEFAULT_PERMISSIONS]);
    } else if (selectedInitialPerms.length === CAREGIVER_DEFAULT_PERMISSIONS.length) {
      setSelectedInitialPerms([...STANDARD_FAMILY_PERMISSIONS]);
    }
  };

  const handleSetActiveContext = (id: string, name: string) => {
    AarogyaStorage.setActiveProfileId(id);
    setActiveProfileId(id);
    setActionSuccessMsg(`Active care context switched to ${name}.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const conditions = chronicInput
        ? chronicInput.split(',').map(s => s.trim()).filter(Boolean)
        : undefined;

      await FamilyService.addFamilyMember(profile?.id || 'usr-101', {
        fullName,
        relationship,
        dateOfBirth: dob,
        gender,
        bloodGroup,
        abhaId: abhaId || undefined,
        permissions: selectedInitialPerms,
        chronicConditions: conditions,
        notes: notes || undefined,
      });

      setIsAddModalOpen(false);
      setFullName('');
      setAbhaId('');
      setChronicInput('');
      setNotes('');
      setRelationship('parent');
      setSelectedInitialPerms([...STANDARD_FAMILY_PERMISSIONS]);
      setActionSuccessMsg(`Successfully added ${fullName} to your family health circle.`);
      loadData();
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to add family member.');
    }
  };

  const handleOpenEditPermissions = (member: FamilyMember) => {
    setEditingPermsMember(member);
    setEditPermsList(member.permissions || []);
  };

  const handleTogglePerm = (perm: FamilyPermission) => {
    setEditPermsList(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleToggleInitialPerm = (perm: FamilyPermission) => {
    setSelectedInitialPerms(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPermsMember) return;
    setIsPermsSaving(true);

    try {
      await FamilyService.updatePermissions(editingPermsMember.id, editPermsList);
      setActionSuccessMsg(`Updated granular permissions for ${editingPermsMember.fullName}.`);
      setEditingPermsMember(null);
      loadData();
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update permissions.');
    } finally {
      setIsPermsSaving(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(`Remove ${name} from your managed family circle?`)) {
      await FamilyService.deleteFamilyMember(id);
      setActionSuccessMsg(`Removed ${name} from managed family members.`);
      loadData();
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  const calculateAge = (dobString: string) => {
    const diff = Date.now() - new Date(dobString).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const filteredFeedItems = (healthOverview?.feedItems || []).filter(item => {
    if (selectedFeedFilter === 'all') return true;
    return item.familyMemberId === selectedFeedFilter;
  });

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-end pb-1">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="care"
          size="sm"
          className="rounded-xl shadow-xs"
        >
          <UserPlus size={15} className="mr-1.5" /> Add Family Member
        </Button>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <Alert variant="success" className="animate-in fade-in-50">
          <CheckCircle2 size={16} />
          <AlertTitle className="text-xs font-bold">Care Circle Updated</AlertTitle>
          <AlertDescription className="text-xs">{actionSuccessMsg}</AlertDescription>
        </Alert>
      )}

      {/* Summary KPI Cards */}
      {healthOverview && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Family Circle */}
          <div className="glass-card p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Family Circle</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <Users size={13} />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {healthOverview.totalMembers + 1}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Profiles</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">1 Primary • {healthOverview.totalMembers} Dependents</p>
            </div>
          </div>

          {/* Card 2: Appointments */}
          <div className="glass-card p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all border-rose-100/80 dark:border-rose-900/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Appointments</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-50 text-[#ff645e] flex items-center justify-center shrink-0">
                <Calendar size={13} />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#ff645e]">
                  {healthOverview.upcomingAppointmentsCount}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Scheduled</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">Confirmed OPD visits</p>
            </div>
          </div>

          {/* Card 3: Low Medicine */}
          <div className="glass-card p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all border-amber-100/80 dark:border-amber-900/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Low Medicine</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Pill size={13} />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-amber-600">
                  {healthOverview.lowRefillsCount}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Refills Due</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">Under refill threshold</p>
            </div>
          </div>

          {/* Card 4: Active Reminders */}
          <div className="glass-card p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all border-rose-100/80 dark:border-rose-900/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reminders</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Activity size={13} />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-rose-600">
                  {healthOverview.activeRemindersCount}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Active</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">Doses & vaccinations</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'feed', label: 'Health Dashboard', count: healthOverview?.feedItems.length || 0 },
          { id: 'members', label: 'Members & Access', count: familyMembers.length },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
        accentColor="care"
      />

      {/* TAB 1: UNIFIED FAMILY HEALTH DASHBOARD (Core Retention Experience) */}
      {activeTab === 'feed' && (
        <div className="space-y-4 animate-in fade-in-50">
          {/* Member Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter Feed by Member:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedFeedFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedFeedFilter === 'all'
                    ? 'bg-[#ff645e] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                }`}
              >
                All Circle ({healthOverview?.feedItems.length || 0})
              </button>
              {familyMembers.map((m) => {
                const count = (healthOverview?.feedItems || []).filter(f => f.familyMemberId === m.id).length;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedFeedFilter(m.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all capitalize ${
                      selectedFeedFilter === m.id
                        ? 'bg-[#ff645e] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    {m.fullName.split(' ')[0]} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {!healthOverview || filteredFeedItems.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="All family members are healthy and up to date"
              description="No pending appointments, low medicine refills, or due vaccinations for this selection."
            />
          ) : (
            <div className="space-y-3">
              {filteredFeedItems.map((item) => (
                <Card
                  key={item.id}
                  variant={item.urgency === 'urgent' ? 'alert' : 'interactive'}
                  padding="default"
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                        item.type === 'refill_alert'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                          : item.type === 'appointment'
                          ? 'bg-rose-100 text-[#ff645e]'
                          : item.type === 'vaccination'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                          : item.type === 'lab_report'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      }`}
                    >
                      {item.type === 'refill_alert' && <Pill size={20} />}
                      {item.type === 'appointment' && <Calendar size={20} />}
                      {item.type === 'vaccination' && <Syringe size={20} />}
                      {item.type === 'lab_report' && <FileText size={20} />}
                      {item.type === 'reminder' && <Clock size={20} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
                          {item.memberName}
                        </span>
                        <Badge variant="secondary" className="capitalize text-[10px]">
                          {item.relationship}
                        </Badge>
                        <Badge
                          variant={
                            item.urgency === 'urgent'
                              ? 'danger'
                              : item.type === 'refill_alert'
                              ? 'warning'
                              : item.type === 'appointment'
                              ? 'care'
                              : 'secondary'
                          }
                          className="text-[10px]"
                        >
                          {item.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {item.dueDate && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            • {item.dueDate}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="care" size="sm" className="font-bold text-xs flex-shrink-0 rounded-xl shadow-xs">
                    <Link href={item.actionUrl}>
                      {item.actionLabel || 'View Details'} <ArrowRight size={13} className="ml-1" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAMILY MEMBERS & PERMISSIONS */}
      {activeTab === 'members' && (
        <div className="space-y-4 animate-in fade-in-50">
          {/* Primary User (Self) Card */}
          {profile && (
            <Card variant="interactive" padding="default" className="border-rose-300 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt="Self"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-300 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <Badge variant="care" className="text-[10px]">PRIMARY USER (SELF)</Badge>
                      {activeProfileId === 'usr-101' && (
                        <Badge variant="secondary" className="text-[10px]">CURRENT CONTEXT</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Blood Group: <strong>{profile.bloodGroup}</strong> • ABHA ID: <span className="font-mono">{profile.abhaId || '14-5521-9874-2201'}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#ff645e] mt-1 font-semibold">
                      <ShieldCheck size={14} /> Full Primary Account Owner (All 8 Permissions)
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSetActiveContext('usr-101', 'Self')}
                  variant={activeProfileId === 'usr-101' ? 'secondary' : 'care'}
                  size="sm"
                  className="font-bold text-xs flex-shrink-0 rounded-xl"
                >
                  {activeProfileId === 'usr-101' ? '✓ Active Context' : 'Switch to Self'}
                </Button>
              </div>
            </Card>
          )}

          {/* Dependents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {familyMembers.map((member) => {
              const isActive = activeProfileId === member.id;
              const age = calculateAge(member.dateOfBirth);
              const isCaregiver = member.relationship === 'caregiver';

              return (
                <Card
                  key={member.id}
                  variant={isActive ? 'highlight' : 'interactive'}
                  padding="default"
                  className="flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start gap-3.5">
                      <img
                        src={member.avatarUrl}
                        alt={member.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-2xs"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 truncate">
                            {member.fullName}
                          </h3>
                          <Badge
                            variant={isCaregiver ? 'warning' : 'secondary'}
                            className="capitalize text-[10px]"
                          >
                            {member.relationship}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-500 mt-0.5">
                          {age} Yrs • {member.gender} • Blood: <strong>{member.bloodGroup}</strong>
                        </p>

                        {member.abhaId && (
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            ABHA: {member.abhaId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chronic Health Badges */}
                    {member.chronicConditions && member.chronicConditions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 my-3">
                        {member.chronicConditions.map((cond, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md font-semibold border border-rose-200/60 dark:border-rose-900"
                          >
                            • {cond}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Active Permission Tokens Badge */}
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs flex justify-between items-center my-2">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Key size={14} className={isCaregiver ? 'text-amber-600' : 'text-[#ff645e]'} />
                        <span>
                          Granted Scopes: <strong>{member.permissions.length} / 8 Permissions</strong>
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenEditPermissions(member)}
                        className="text-[11px] text-[#ff645e] hover:text-[#e84f49] dark:text-rose-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Edit2 size={11} /> Edit Scopes
                      </button>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <Button
                      onClick={() => handleSetActiveContext(member.id, member.fullName)}
                      variant={isActive ? 'secondary' : 'care'}
                      size="sm"
                      className="font-bold text-xs rounded-xl shadow-xs"
                    >
                      {isActive ? '✓ Active Context' : 'Switch Care Context'}
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => handleOpenEditPermissions(member)}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-600 dark:text-slate-300 rounded-xl"
                      >
                        <ShieldCheck size={13} className="mr-1" /> Permissions
                      </Button>
                      <Button
                        onClick={() => handleDeleteMember(member.id, member.fullName)}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT PERMISSIONS MODAL DIALOG (Granular Permission Security) */}
      {editingPermsMember && (
        <Dialog open={!!editingPermsMember} onOpenChange={() => setEditingPermsMember(null)}>
          <DialogHeader>
            <DialogTitle>Granular Scopes for {editingPermsMember.fullName}</DialogTitle>
            <DialogDescription>
              Authorize explicit capabilities to prevent horizontal privilege escalation vulnerabilities.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePermissions} className="space-y-4">
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {ALL_PERMISSIONS.map((p) => {
                const isChecked = editPermsList.includes(p.key);
                return (
                  <div
                    key={p.key}
                    onClick={() => handleTogglePerm(p.key)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'border-[#ff645e] bg-rose-50/70 dark:bg-rose-950/40'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 opacity-75'
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleTogglePerm(p.key)}
                      variant="care"
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {p.label}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {p.category}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {p.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button type="submit" variant="care" className="flex-1 font-bold rounded-xl" isLoading={isPermsSaving}>
                Save Scopes ({editPermsList.length} of 8 Active)
              </Button>
              <Button type="button" onClick={() => setEditingPermsMember(null)} variant="secondary" className="rounded-xl">
                Cancel
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* ADD FAMILY MEMBER MODAL DIALOG */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader>
          <DialogTitle>Add Family Member to Health Circle</DialogTitle>
          <DialogDescription>
            Create a managed dependent profile with customized healthcare tracking scopes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddMemberSubmit} className="space-y-3.5">
          <FormField label="Full Name" required>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Sharma"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Relationship" required>
              <Select value={relationship} onChange={(e) => handleRelationshipChange(e.target.value as any)}>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="spouse">Spouse</option>
                <option value="relative">Relative</option>
                <option value="caregiver">Caregiver (Restricted)</option>
                <option value="sibling">Sibling</option>
                <option value="grandparent">Grandparent</option>
                <option value="other">Other</option>
              </Select>
            </FormField>

            <FormField label="Date of Birth" required>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Gender" required>
              <Select value={gender} onChange={(e) => setGender(e.target.value as any)}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </Select>
            </FormField>

            <FormField label="Blood Group" required>
              <Select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value as any)}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </Select>
            </FormField>
          </div>

          <FormField label="ABHA / Ayushman Bharat Health ID (Optional)">
            <Input
              type="text"
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="e.g. 14-9981-6672-1102"
            />
          </FormField>

          <FormField label="Chronic Conditions (Comma-separated)">
            <Input
              type="text"
              value={chronicInput}
              onChange={(e) => setChronicInput(e.target.value)}
              placeholder="e.g. Hypertension, Diabetes, Thyroid"
            />
          </FormField>

          <FormField label="Clinical Notes / Special Care Instructions">
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Daily BP recording required"
            />
          </FormField>

          {/* Caregiver Least Privilege Notice */}
          {relationship === 'caregiver' && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <strong>Least-Privilege Caregiver Protection:</strong> Caregivers receive restricted read-only permissions by default (Appointments & Medications). Records, modifications, and financial expenses remain confidential unless explicitly granted.
              </div>
            </div>
          )}

          {/* Initial Permissions Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Authorized Scopes ({selectedInitialPerms.length} selected):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {ALL_PERMISSIONS.map((p) => {
                const isChecked = selectedInitialPerms.includes(p.key);
                return (
                  <div
                    key={p.key}
                    onClick={() => handleToggleInitialPerm(p.key)}
                    className={`p-2 rounded-lg border text-[11px] cursor-pointer flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'border-rose-400 bg-rose-50/70 font-semibold text-rose-950'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggleInitialPerm(p.key)}
                      variant="care"
                    />
                    <span className="truncate">{p.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2.5 pt-3">
            <Button type="submit" variant="care" className="flex-1 font-bold">
              Add to Family Circle
            </Button>
            <Button type="button" onClick={() => setIsAddModalOpen(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

