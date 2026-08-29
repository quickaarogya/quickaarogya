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

  const getCategoryFallbackImage = (category: InboxCategory) => {
    switch (category) {
      case 'appointments':
        return 'https://images.unsplash.com/photo-1594824813629-9e8a8bcf447f?w=600&auto=format&fit=crop&q=80';
      case 'medicines':
        return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';
      case 'family':
        return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80';
      case 'records':
        return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80';
      case 'orders':
        return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';
      case 'tests':
        return 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80';
      case 'payments':
        return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';
      default:
        return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80';
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((n) => {
            const isUnread = !n.isRead;
            const cardImg = n.imageUrl || getCategoryFallbackImage(n.category);

            return (
              <div
                key={n.id}
                className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between group relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] ${
                  isUnread
                    ? 'border-teal-500/40 dark:border-teal-500/40 ring-1 ring-teal-500/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Image Container with Badges Overlay */}
                  <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden mb-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80">
                    <img
                      src={cardImg}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35 pointer-events-none" />

                    {/* Top Left: Category badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[10px] font-black shadow-xs border border-white/10">
                      <span className="shrink-0">{getCategoryIcon(n.category)}</span>
                      <span className="uppercase tracking-wider">{n.category}</span>
                    </div>

                    {/* Top Right: Status / NEW */}
                    <div className="absolute top-2.5 right-2.5">
                      {isUnread && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-500 text-white shadow-xs">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Bottom Left: Relative time */}
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {n.timestamp}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 leading-snug flex items-center gap-1.5 group-hover:text-teal-600 transition-colors">
                    {isUnread && <span className="w-2 h-2 rounded-full bg-teal-600 inline-block shrink-0" />}
                    <span className="line-clamp-2">{n.title}</span>
                  </h3>

                  {/* Message Body */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
                    {n.message}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {isUnread ? (
                    <button
                      onClick={() => NotificationService.markAsRead(n.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      Mark as read
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Read</span>
                  )}

                  {n.action && (
                    <Button asChild variant="default" size="sm" className="h-8 px-3.5 text-xs font-black rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-xs ml-auto cursor-pointer" onClick={() => NotificationService.markAsRead(n.id)}>
                      <Link href={n.action.url} className="flex items-center gap-1">
                        <span>{n.action.label}</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
