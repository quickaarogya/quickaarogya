'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Bell,
  CheckCheck,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Calendar,
  Pill,
  FileText,
  Truck,
  Users,
  FlaskConical,
  CreditCard,
  ChevronRight,
  Filter,
  Search,
  Trash2,
  Radio,
  Send,
  Smartphone,
  Mail,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { NotificationService } from '../../server/services/notification.service';
import { AarogyaStorage } from '../../lib/storage';
import {
  HealthInboxItem,
  InboxCategory,
  InboxPriority,
  DeliveryChannelLog
} from '../../types';
import { PageHeader } from '../../components/ui/page-header';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs } from '../../components/ui/tabs';
import { EmptyState } from '../../components/ui/empty-state';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { useAppModeStore } from '@/stores/useAppModeStore';

export default function HealthInboxPage() {
  const { appMode } = useAppModeStore();
  const isDoctors = appMode === 'doctors';
  const isCare = appMode === 'care';
  const isPharma = appMode === 'pharma';

  const [items, setItems] = useState<HealthInboxItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<InboxCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<InboxPriority | 'all'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState<HealthInboxItem | null>(null);

  const loadData = async () => {
    const data = await NotificationService.getInbox('usr-101', {
      category: selectedCategory,
      priority: selectedPriority,
      isRead: readFilter === 'all' ? 'all' : readFilter === 'read',
      searchQuery: searchQuery || undefined,
    });
    setItems(data);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, [selectedCategory, selectedPriority, readFilter, searchQuery]);

  const allItems = typeof window !== 'undefined' ? AarogyaStorage.getInboxItems() : [];
  const unreadCount = allItems.filter(i => !i.isRead).length;
  const urgentCount = allItems.filter(i => i.priority === 'urgent').length;
  const importantCount = allItems.filter(i => i.priority === 'important').length;

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) {
      await NotificationService.markAsUnread(id);
    } else {
      await NotificationService.markAsRead(id);
    }
    loadData();
  };

  const handleMarkAllRead = async () => {
    await NotificationService.markAllAsRead(selectedCategory);
    loadData();
  };

  const handleDeleteItem = async (id: string) => {
    await NotificationService.deleteNotification(id);
    loadData();
  };

  const handleClearAll = async () => {
    if (confirm('Clear all notifications from your inbox?')) {
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

  const getCategoryBadgeColor = (category: InboxCategory) => {
    switch (category) {
      case 'appointments':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300';
      case 'medicines':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300';
      case 'records':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300';
      case 'orders':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300';
      case 'family':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300';
      case 'tests':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300';
      case 'payments':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getPriorityBadge = (priority: InboxPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-900 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            URGENT
          </span>
        );
      case 'important':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-900">
            IMPORTANT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            NORMAL
          </span>
        );
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'in_app':
        return <Smartphone size={13} />;
      case 'push':
        return <Radio size={13} />;
      case 'sms':
        return <MessageSquare size={13} />;
      case 'email':
        return <Mail size={13} />;
      case 'whatsapp':
        return <Send size={13} />;
      default:
        return <Bell size={13} />;
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 pb-12">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between gap-3 pb-1">
        {unreadCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
            {unreadCount} Unread
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
            isDoctors
              ? 'bg-blue-50 text-[#026dd9] border-blue-200 dark:bg-blue-950 dark:text-sky-300'
              : isCare
              ? 'bg-rose-50 text-[#ff645e] border-rose-200 dark:bg-rose-950 dark:text-rose-300'
              : 'bg-teal-50 text-[#0F766E] border-teal-200 dark:bg-teal-950 dark:text-teal-300'
          }`}>
            <CheckCircle2 size={13} />
            All Caught Up
          </span>
        )}

        <div className="flex items-center gap-2">
          <Button
            onClick={handleMarkAllRead}
            variant="outline"
            size="sm"
            disabled={unreadCount === 0}
            className="text-xs font-bold rounded-xl border-slate-200"
          >
            <CheckCheck size={14} className="mr-1" /> Mark All Read
          </Button>
          {allItems.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="ghost"
              size="sm"
              className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl"
            >
              <Trash2 size={14} className="mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip with Mode Theme Adapters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className={`glass-card p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all ${
          isDoctors
            ? 'border-blue-100/80 dark:border-blue-900/40'
            : isCare
            ? 'border-rose-100/80 dark:border-rose-900/40'
            : 'border-teal-100/80 dark:border-teal-900/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unread Alerts</span>
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isDoctors
                ? 'bg-blue-50 text-[#026dd9] dark:bg-blue-950 dark:text-sky-400'
                : isCare
                ? 'bg-rose-50 text-[#ff645e] dark:bg-rose-950 dark:text-rose-400'
                : 'bg-teal-50 text-[#0F766E] dark:bg-teal-950 dark:text-teal-400'
            }`}>
              <Bell size={13} />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{unreadCount}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Pending</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">Requires attention</p>
          </div>
        </div>

        <div className="glass-card p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all border-red-100/80 dark:border-red-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Urgent Tasks</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={13} />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-red-600">{urgentCount}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Critical</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">Clinical alerts</p>
          </div>
        </div>

        <div className="glass-card p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all border-amber-100/80 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Important</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={13} />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-600">{importantCount}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Scheduled</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">Refills & follow-ups</p>
          </div>
        </div>

        <div className="glass-card p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all border-sky-100/80 dark:border-sky-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Feed</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Inbox size={13} />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-sky-700 dark:text-sky-400">{allItems.length}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Activities</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">Activity logs</p>
          </div>
        </div>
      </div>

      {/* Category Tabs with Dynamic Mode Accent Color */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Activities', count: allItems.length },
          { id: 'appointments', label: 'Appointments', count: allItems.filter(i => i.category === 'appointments').length },
          { id: 'medicines', label: 'Medicines', count: allItems.filter(i => i.category === 'medicines').length },
          { id: 'records', label: 'Records', count: allItems.filter(i => i.category === 'records').length },
          { id: 'orders', label: 'Orders', count: allItems.filter(i => i.category === 'orders').length },
          { id: 'family', label: 'Family', count: allItems.filter(i => i.category === 'family').length },
          { id: 'tests', label: 'Tests', count: allItems.filter(i => i.category === 'tests').length },
          { id: 'payments', label: 'Payments', count: allItems.filter(i => i.category === 'payments').length },
        ]}
        activeTab={selectedCategory}
        onTabChange={(tab) => setSelectedCategory(tab as any)}
        variant="underline"
        accentColor={isDoctors ? 'doctors' : isCare ? 'care' : 'pharma'}
      />

      {/* Filter Bar (Search, Priority, Read/Unread) */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search activities, doctors, medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-white dark:bg-slate-900"
          />
        </div>

        {/* Priority & Read Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter size={13} />
            <span>Priority:</span>
          </div>

          <Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="h-9 text-xs w-36 bg-white dark:bg-slate-900"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent Only</option>
            <option value="important">🟡 Important Only</option>
            <option value="normal">⚪ Normal Only</option>
          </Select>

          <Select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value as any)}
            className="h-9 text-xs w-32 bg-white dark:bg-slate-900"
          >
            <option value="all">All Read Status</option>
            <option value="unread">📬 Unread Only</option>
            <option value="read">📭 Read Only</option>
          </Select>
        </div>
      </div>

      {/* Activity List or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No healthcare activity found"
          description={
            searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || readFilter !== 'all'
              ? "No alerts match the selected search or filter criteria. Try resetting the filters."
              : "Your health activity center is up to date. You have no pending clinical alerts."
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isUnread = !item.isRead;

            return (
              <Card
                key={item.id}
                variant={isUnread ? (item.priority === 'urgent' ? 'alert' : 'highlight') : 'interactive'}
                padding="default"
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all hover:shadow-md ${
                  isUnread
                    ? isDoctors
                      ? 'border-l-4 border-l-[#026dd9] dark:border-l-sky-400 bg-blue-50/25 dark:bg-blue-950/25'
                      : isCare
                      ? 'border-l-4 border-l-[#ff645e] dark:border-l-rose-400 bg-rose-50/25 dark:bg-rose-950/25'
                      : 'border-l-4 border-l-[#0F766E] dark:border-l-teal-400 bg-teal-50/25 dark:bg-teal-950/25'
                    : ''
                }`}
              >
                {/* Left Content */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Category & Status Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs ${getCategoryBadgeColor(
                      item.category
                    )}`}
                  >
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header line: Badges & Timestamp */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {item.category}
                      </span>

                      {getPriorityBadge(item.priority)}

                      {item.familyMemberName && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60">
                          <Users size={10} /> {item.familyMemberName}
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-medium ml-auto sm:ml-0">
                        • {item.timestamp}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {isUnread && (
                        <span className={`w-2 h-2 rounded-full inline-block flex-shrink-0 ${
                          isDoctors ? 'bg-[#026dd9]' : isCare ? 'bg-[#ff645e]' : 'bg-[#0F766E]'
                        }`} />
                      )}
                      <span className="truncate">{item.title}</span>
                    </h3>

                    {/* Message Body */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    {/* Related Entity Chip & Multi-channel status indicator */}
                    <div className="flex items-center gap-2 flex-wrap mt-2.5">
                      {item.relatedEntity && (
                        <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                          <span className="text-slate-400">Linked:</span> {item.relatedEntity.name || item.relatedEntity.id}
                        </span>
                      )}

                      {/* Delivery Status Chip */}
                      {item.deliveryChannels && item.deliveryChannels.length > 0 && (
                        <button
                          onClick={() => setSelectedDeliveryItem(item)}
                          className={`text-[11px] font-medium flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                            isDoctors
                              ? 'text-slate-500 hover:text-[#026dd9]'
                              : isCare
                              ? 'text-slate-500 hover:text-[#ff645e]'
                              : 'text-slate-500 hover:text-[#0F766E]'
                          }`}
                          title="View multi-channel delivery audit logs"
                        >
                          <Radio size={11} className={isDoctors ? 'text-[#026dd9]' : isCare ? 'text-[#ff645e]' : 'text-[#0F766E]'} />
                          <span>{item.deliveryChannels.length} Channels</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons with Mode Accent Color */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Action Link Button */}
                  {item.action && (
                    <Link
                      href={item.action.url}
                      onClick={() => NotificationService.markAsRead(item.id)}
                      className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer ${
                        isDoctors
                          ? 'bg-[#026dd9] hover:bg-[#0256ab] text-white shadow-blue-500/20'
                          : isCare
                          ? 'bg-[#ff645e] hover:bg-[#e04f4a] text-white shadow-rose-500/20'
                          : 'bg-[#0F766E] hover:bg-[#0d635c] text-white shadow-teal-500/20'
                      }`}
                    >
                      <span>{item.action.label}</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  )}

                  {/* Toggle Read/Unread */}
                  <Button
                    onClick={() => handleToggleRead(item.id, item.isRead)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    title={item.isRead ? "Mark as unread" : "Mark as read"}
                  >
                    {item.isRead ? <EyeOff size={15} /> : <Eye size={15} />}
                  </Button>

                  {/* Delete Button */}
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                    title="Delete activity"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Multi-Channel Delivery Status Modal */}
      {selectedDeliveryItem && (
        <Dialog open={!!selectedDeliveryItem} onOpenChange={() => setSelectedDeliveryItem(null)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Radio size={18} className={isDoctors ? 'text-[#026dd9]' : isCare ? 'text-[#ff645e]' : 'text-[#0F766E]'} /> Multi-Channel Delivery Status
            </DialogTitle>
            <DialogDescription>
              Audit trail of dispatched notifications for "{selectedDeliveryItem.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {selectedDeliveryItem.deliveryChannels.map((ch, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-teal-600 font-bold border border-slate-200 dark:border-slate-600">
                    {getChannelIcon(ch.channel)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 capitalize">
                      {ch.channel.replace('_', ' ')} Channel
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Provider: {ch.provider || 'System Gateway'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    ch.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {ch.status.toUpperCase()}
                  </span>
                  {ch.externalId && (
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {ch.externalId}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={() => setSelectedDeliveryItem(null)} variant="secondary" size="sm">
              Close Audit Log
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
