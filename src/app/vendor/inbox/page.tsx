'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Calendar,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Check,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
  Eye,
  Trash2
} from 'lucide-react';
import { NotificationService } from '@/server/services/notification.service';
import { OrganizationService, VendorOrganization } from '@/server/services/organization.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { HealthInboxItem, InboxCategory, InboxPriority } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';

export default function VendorInboxPage() {
  const { user } = useAuthStore();

  // Active Organization & Staff Context
  const [activeOrgId, setActiveOrgId] = useState('org-apollo-hospital');
  const [activeUserId, setActiveUserId] = useState('auth-staff-apollo');
  const [orgProfile, setOrgProfile] = useState<VendorOrganization | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<HealthInboxItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<InboxCategory | 'all'>('all');
  const [activePriority, setActivePriority] = useState<InboxPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const org = await OrganizationService.getOrganizationById(activeOrgId);
      setOrgProfile(org);

      const items = await NotificationService.getVendorInbox(activeUserId, activeOrgId, {
        category: activeCategory,
        priority: activePriority,
        searchQuery
      });
      setNotifications(items);
    } catch (err) {
      console.error('Failed to load vendor inbox:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeOrgId, activeUserId, activeCategory, activePriority]);

  const handleMarkRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    await loadData();
  };

  const handleMarkUnread = async (id: string) => {
    await NotificationService.markAsUnread(id);
    await loadData();
  };

  const handleMarkAllRead = async () => {
    await NotificationService.markAllAsRead(activeCategory);
    await loadData();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider border border-teal-500/30">
                Vendor Operations Stream
              </span>
              <Badge variant="success" className="text-xs">
                <ShieldCheck className="w-3 h-3 mr-1" /> Tenant Scoped
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {orgProfile?.name || 'Vendor Notification Inbox'}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Organization: <strong>{activeOrgId}</strong> • Logged in Staff: <strong>{activeUserId}</strong> • Unread Alerts: <strong className="text-teal-400">{unreadCount}</strong>
            </p>
          </div>

          {/* Quick Tenant Switcher for Testing */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium px-1">Switch Tenant Stream:</span>
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
              variant={activeOrgId === 'org-dr-vivek-clinic' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveOrgId('org-dr-vivek-clinic');
                setActiveUserId('auth-doc-2');
              }}
              className={activeOrgId === 'org-dr-vivek-clinic' ? 'bg-teal-600 hover:bg-teal-700 text-xs' : 'text-xs text-slate-300'}
            >
              Dr. Vivek Clinic
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-4">
        {/* Filter Controls Card */}
        <Card className="p-4 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory('all')}
                className={activeCategory === 'all' ? 'bg-teal-600 hover:bg-teal-700' : 'text-xs'}
              >
                All Events
              </Button>
              <Button
                variant={activeCategory === 'vendor_appointments' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory('vendor_appointments')}
                className={activeCategory === 'vendor_appointments' ? 'bg-teal-600 hover:bg-teal-700' : 'text-xs'}
              >
                <Calendar className="w-3.5 h-3.5 mr-1" /> Appointments
              </Button>
              <Button
                variant={activeCategory === 'vendor_orders' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory('vendor_orders')}
                className={activeCategory === 'vendor_orders' ? 'bg-teal-600 hover:bg-teal-700' : 'text-xs'}
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Pharmacy Orders
              </Button>
              <Button
                variant={activeCategory === 'vendor_settlements' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory('vendor_settlements')}
                className={activeCategory === 'vendor_settlements' ? 'bg-teal-600 hover:bg-teal-700' : 'text-xs'}
              >
                <CreditCard className="w-3.5 h-3.5 mr-1" /> Settlement Balance
              </Button>
              <Button
                variant={activeCategory === 'vendor_compliance' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory('vendor_compliance')}
                className={activeCategory === 'vendor_compliance' ? 'bg-teal-600 hover:bg-teal-700' : 'text-xs'}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Compliance
              </Button>
            </div>

            {/* Actions & Search */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleMarkAllRead} className="text-xs shrink-0">
                <Check className="w-3.5 h-3.5 mr-1" /> Mark All Read
              </Button>
              <Button size="sm" variant="outline" onClick={loadData} className="text-xs shrink-0">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No Notifications in Stream"
              description="New appointment bookings, prescription verification requests, and settlement events will appear here."
            />
          ) : (
            notifications.map(item => {
              const isUrgent = item.priority === 'urgent';
              const isImportant = item.priority === 'important';

              return (
                <Card
                  key={item.id}
                  className={`p-5 rounded-2xl transition-all border ${
                    !item.isRead
                      ? isUrgent
                        ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-500/30'
                        : isImportant
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isUrgent
                          ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                          : isImportant
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                          : 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400'
                      }`}>
                        {item.category === 'vendor_appointments' && <Calendar className="w-5 h-5" />}
                        {item.category === 'vendor_orders' && <ShoppingBag className="w-5 h-5" />}
                        {item.category === 'vendor_settlements' && <CreditCard className="w-5 h-5" />}
                        {item.category === 'vendor_compliance' && <ShieldCheck className="w-5 h-5" />}
                        {item.category === 'appointments' && <Calendar className="w-5 h-5" />}
                        {item.category === 'orders' && <ShoppingBag className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h2>
                          <Badge
                            variant={
                              isUrgent ? 'destructive' : isImportant ? 'warning' : 'outline'
                            }
                            className="text-[10px] uppercase font-bold"
                          >
                            {item.priority}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {item.category.replace('vendor_', '')}
                          </Badge>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {item.message}
                        </p>

                        <div className="text-[11px] text-slate-400 mt-2">
                          {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                      {item.action && (
                        <Link href={item.action.url}>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold">
                            {item.action.label} <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      )}

                      {!item.isRead ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkRead(item.id)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Mark Read
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkUnread(item.id)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Mark Unread
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
