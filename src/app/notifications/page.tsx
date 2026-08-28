'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Pill,
  Calendar,
  FlaskConical,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Trash2,
  Inbox,
  FileText,
  Truck,
  Users,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { NotificationService } from '../../server/services/notification.service';
import { AarogyaStorage } from '../../lib/storage';
import { HealthInboxItem, InboxCategory } from '../../types';
import { PageHeader } from '../../components/ui/page-header';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs } from '../../components/ui/tabs';
import { EmptyState } from '../../components/ui/empty-state';

export default function NotificationsPage() {
  const [items, setItems] = useState<HealthInboxItem[]>([]);
  const [activeTab, setActiveTab] = useState<InboxCategory | 'all'>('all');

  const loadData = async () => {
    const data = await NotificationService.getInbox('usr-101', {
      category: activeTab,
    });
    setItems(data);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, [activeTab]);

  const allItems = typeof window !== 'undefined' ? AarogyaStorage.getInboxItems() : [];
  const unreadCount = allItems.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await NotificationService.markAllAsRead(activeTab);
    loadData();
  };

  const handleClearAll = async () => {
    if (confirm('Clear all notifications?')) {
      await NotificationService.clearInbox();
      loadData();
    }
  };

  const getCategoryIcon = (category: InboxCategory) => {
    switch (category) {
      case 'appointments':
        return <Calendar size={18} />;
      case 'medicines':
        return <Pill size={18} />;
      case 'records':
        return <FileText size={18} />;
      case 'orders':
        return <Truck size={18} />;
      case 'family':
        return <Users size={18} />;
      case 'tests':
        return <FlaskConical size={18} />;
      case 'payments':
        return <CreditCard size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  return (
    <div className="page-wrapper animate-fade-in space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between gap-3 pb-1">
        {unreadCount > 0 ? (
          <Badge variant="danger" className="font-bold text-xs">{unreadCount} Unread</Badge>
        ) : (
          <Badge variant="teal" className="font-bold text-xs">All Caught Up</Badge>
        )}

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm" className="text-xs font-bold rounded-xl border border-slate-200">
            <Link href="/inbox">
              <Inbox size={14} className="mr-1" /> Activity Center
            </Link>
          </Button>
          {allItems.length > 0 && (
            <>
              <Button
                onClick={handleMarkAllRead}
                variant="outline"
                size="sm"
                disabled={unreadCount === 0}
                className="text-xs font-bold rounded-xl border-slate-200"
              >
                <CheckCheck size={14} className="mr-1" /> Mark Read
              </Button>
              <Button
                onClick={handleClearAll}
                variant="ghost"
                size="sm"
                className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl"
              >
                <Trash2 size={14} className="mr-1" /> Clear
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs Filter */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Notifications', count: allItems.length },
          { id: 'appointments', label: 'Appointments', count: allItems.filter(n => n.category === 'appointments').length },
          { id: 'medicines', label: 'Medicines', count: allItems.filter(n => n.category === 'medicines').length },
          { id: 'records', label: 'Records', count: allItems.filter(n => n.category === 'records').length },
          { id: 'orders', label: 'Orders', count: allItems.filter(n => n.category === 'orders').length },
          { id: 'family', label: 'Family', count: allItems.filter(n => n.category === 'family').length },
          { id: 'tests', label: 'Tests', count: allItems.filter(n => n.category === 'tests').length },
          { id: 'payments', label: 'Payments', count: allItems.filter(n => n.category === 'payments').length },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        variant="underline"
      />

      {/* Notification List or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No notifications in this category"
          description="You're all caught up on your medications, appointments, and diagnostic updates."
        />
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const isUnread = !n.isRead;

            return (
              <Card
                key={n.id}
                variant={isUnread ? (n.priority === 'urgent' ? 'alert' : 'highlight') : 'default'}
                padding="default"
                className={`flex items-start gap-3.5 transition-all ${
                  isUnread ? 'border-l-4 border-l-teal-600 dark:border-l-teal-400' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                  n.category === 'medicines'
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                    : n.category === 'appointments'
                    ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400'
                    : n.category === 'family'
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400'
                }`}>
                  {getCategoryIcon(n.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 inline-block" />}
                      {n.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    {n.action && (
                      <Button asChild variant="default" size="sm" className="h-7 text-xs font-bold" onClick={() => NotificationService.markAsRead(n.id)}>
                        <Link href={n.action.url}>
                          {n.action.label} <ArrowUpRight size={12} className="ml-1" />
                        </Link>
                      </Button>
                    )}

                    {isUnread && (
                      <Button
                        onClick={() => NotificationService.markAsRead(n.id)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-slate-500 hover:text-slate-800"
                      >
                        Mark as Read
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
  );
}
