'use client';

import React from 'react';
import Link from 'next/link';
import {
  Grid,
  ChevronRight,
  ShieldCheck,
  Heart,
  PhoneCall,
  Sparkles,
  Users,
  Store,
  FlaskConical,
  Receipt,
  Bell,
  AlertOctagon,
  User,
  Settings
} from 'lucide-react';
import { moreMenuGroups } from '../../config/navigation';
import { useCareContextStore } from '../../stores/useCareContextStore';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';

export default function MorePage() {
  const { userProfile, activeProfileId, familyMembers, toggleSos, isSosActive } = useCareContextStore();

  const getActiveName = () => {
    if (activeProfileId === 'usr-101' || !userProfile) {
      return `${userProfile?.firstName || 'Arjun'} ${userProfile?.lastName || 'Sharma'} (Self)`;
    }
    const member = familyMembers.find(f => f.id === activeProfileId);
    return member ? `${member.fullName} (${member.relationship.toUpperCase()})` : 'Managed Profile';
  };

  return (
    <div className="page-wrapper animate-fade-in pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center dark:bg-teal-950 dark:text-teal-400">
            <Grid size={20} />
          </div>
          <div>
            <h1 className="heading-lg">More Health Modules</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Caregiver tools, pharmacy orders, expenses, and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Active Care Context Strip */}
      <Card className="mb-6 bg-gradient-to-r from-teal-50/60 to-sky-50/60 border-teal-200 dark:from-teal-950/40 dark:to-sky-950/40 dark:border-teal-800/60">
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shadow-sm shrink-0">
              {getActiveName().charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-teal-800 dark:text-teal-300 uppercase tracking-wider truncate">
                Current Care Context
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">
                {getActiveName()}
              </div>
            </div>
          </div>
          <Link
            href="/family"
            className="text-xs font-bold text-teal-700 bg-white border border-teal-200 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors whitespace-nowrap shrink-0 dark:bg-slate-900 dark:text-teal-400 dark:border-teal-800"
          >
            Switch Profile
          </Link>
        </div>
      </Card>

      {/* Emergency Quick SOS Banner */}
      <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50/70 dark:bg-red-950/30 dark:border-red-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0">
            <AlertOctagon size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-red-900 dark:text-red-300 truncate">
              Emergency Health Profile & SOS
            </div>
            <div className="text-xs text-red-700 dark:text-red-400 line-clamp-1">
              Instant access to blood type, allergies & first-responder QR
            </div>
          </div>
        </div>
        <Link
          href="/emergency"
          className="text-xs font-bold text-white bg-red-600 px-3.5 py-1.5 rounded-md hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
        >
          Open ICE
        </Link>
      </div>

      {/* Grouped Navigation Sections */}
      <div className="space-y-6">
        {moreMenuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 dark:text-slate-400">
              {group.groupTitle}
            </div>

            <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/60 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-teal-950 dark:group-hover:text-teal-400">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 dark:text-slate-50 dark:group-hover:text-teal-400 transition-colors">
                            {item.name}
                          </span>
                          {item.badge && (
                            <Badge
                              variant={item.badgeType === 'danger' ? 'danger' : 'teal'}
                              className="text-[10px] py-0 px-2 h-4"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all dark:text-slate-500" />
                  </Link>
                );
              })}
            </Card>
          </div>
        ))}
      </div>

      {/* App Version Info */}
      <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        Quick Aarogya v2.4 Enterprise • HIPAA & ABDM Compliant
      </div>
    </div>
  );
}
