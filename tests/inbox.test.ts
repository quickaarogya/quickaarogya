import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationService } from '../src/server/services/notification.service';
import { AarogyaStorage } from '../src/lib/storage';
import { InboxCategory, InboxPriority, NotificationType, NotificationChannelProvider, HealthInboxItem } from '../src/types';

describe('Phase 7 Health Inbox & Multi-Channel Notification Engine Tests', () => {
  beforeEach(() => {
    // Ensure clean in-memory state
    AarogyaStorage.clearInbox();
  });

  it('should create a notification with strict deterministic priority rules', async () => {
    // 1. URGENT rule: Appointment Cancelled
    const urgentNotif = await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled: Dr. Siddharth Verma',
      message: 'Consultation was cancelled. Refund initiated.',
      action: { label: 'Reschedule', url: '/appointments' },
    });
    expect(urgentNotif.priority).toBe('urgent');
    expect(urgentNotif.category).toBe('appointments');
    expect(urgentNotif.isRead).toBe(false);

    // 2. URGENT rule: Emergency / Family crisis
    const emergencyNotif = await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'emergency_alert',
      title: 'Emergency SOS Triggered',
      message: 'First responders alerted to current location.',
    });
    expect(emergencyNotif.priority).toBe('urgent');

    // 3. IMPORTANT rule: Medicine running low (<= 3 days)
    const lowMedNotif = await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'refill_alert',
      title: 'Medicine Running Low: Telma 40',
      message: 'Only 3 tablets remaining.',
      clinicalContext: { daysRemaining: 3 },
    });
    expect(lowMedNotif.priority).toBe('important');
    expect(lowMedNotif.category).toBe('medicines');

    // 4. IMPORTANT rule: Follow-up due
    const followUpNotif = await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'followup_due',
      title: 'Follow-Up Due: Endocrinology Consultation',
      message: 'Quarterly glycemic check is due.',
    });
    expect(followUpNotif.priority).toBe('important');

    // 5. NORMAL rule: Prescription uploaded
    const rxNotif = await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'prescription_uploaded',
      title: 'Prescription Uploaded: Dr. Vivek Mehra',
      message: 'Digital Rx for Montair LC added.',
    });
    expect(rxNotif.priority).toBe('normal');
    expect(rxNotif.category).toBe('records');

    // 6. NORMAL rule: Payment completed
    const payNotif = await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'payment_completed',
      title: 'Payment Completed: ₹1,200 via UPI',
      message: 'Receipt ready for Section 80D claim.',
    });
    expect(payNotif.priority).toBe('normal');
    expect(payNotif.category).toBe('payments');
  });

  it('should disallow AI-based arbitrary classification and enforce deterministic system rules', () => {
    // Normal document uploads should remain normal by system rule
    const priority1 = NotificationService.resolvePriority('prescription_uploaded');
    expect(priority1).toBe('normal');

    // Routine orders should remain normal
    const priority2 = NotificationService.resolvePriority('order_delivered');
    expect(priority2).toBe('normal');

    // Dose reminders should always be important by clinical rule
    const priority3 = NotificationService.resolvePriority('dose_reminder');
    expect(priority3).toBe('important');

    // Verified emergency / cancellation is always urgent
    const priority4 = NotificationService.resolvePriority('appointment_cancelled');
    expect(priority4).toBe('urgent');
  });

  it('should track multi-channel delivery status across In-App, Push, SMS, Email, and WhatsApp', async () => {
    const multiChannelNotif = await NotificationService.createNotification(
      {
        userId: 'usr-101',
        type: 'appointment',
        title: 'Appointment Tomorrow with Dr. Ananya Roy',
        message: 'Visit scheduled for tomorrow 11:00 AM.',
        action: { label: 'View Appointment', url: '/appointments' },
        relatedEntity: { type: 'appointment', id: 'apt-1', name: 'Dr. Ananya Roy' },
      },
      ['in_app', 'push', 'sms', 'email', 'whatsapp']
    );

    expect(multiChannelNotif.deliveryChannels).toBeDefined();
    expect(multiChannelNotif.deliveryChannels.length).toBe(5);

    const channels = multiChannelNotif.deliveryChannels.map(d => d.channel);
    expect(channels).toContain('in_app');
    expect(channels).toContain('push');
    expect(channels).toContain('sms');
    expect(channels).toContain('email');
    expect(channels).toContain('whatsapp');

    // All registered staging providers should record delivered status
    for (const log of multiChannelNotif.deliveryChannels) {
      expect(log.status).toBe('delivered');
      expect(log.externalId).toBeDefined();
    }

    // Inspect via getDeliveryStatus
    const auditLogs = await NotificationService.getDeliveryStatus(multiChannelNotif.id);
    expect(auditLogs.length).toBe(5);
  });

  it('should support registering custom notification channel providers', async () => {
    const mockCustomProvider: NotificationChannelProvider = {
      channel: 'sms',
      name: 'Custom Fast2SMS Healthcare Gateway',
      send: async (notif: HealthInboxItem) => ({
        success: true,
        externalId: `fast2sms_${notif.id}`,
      }),
    };

    NotificationService.registerChannelProvider('sms', mockCustomProvider);

    const notif = await NotificationService.createNotification(
      {
        userId: 'usr-101',
        type: 'dose_reminder',
        title: 'Medicine Due: Glycomet-GP 1',
        message: 'Morning dose scheduled at 08:00 AM.',
      },
      ['sms']
    );

    const smsLog = notif.deliveryChannels.find(d => d.channel === 'sms');
    expect(smsLog).toBeDefined();
    expect(smsLog?.provider).toBe('Custom Fast2SMS Healthcare Gateway');
    expect(smsLog?.externalId).toBe(`fast2sms_${notif.id}`);
  });

  it('should handle read/unread state transitions seamlessly', async () => {
    const notif1 = await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'lab_ready',
      title: 'Lab Report Available',
      message: 'Lipid panel results uploaded.',
    });

    const notif2 = await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'order_delivered',
      title: 'Order Delivered',
      message: 'Medicine package received.',
    });

    expect(await NotificationService.getUnreadCount('usr-101')).toBe(2);

    // Mark single as read
    const updated1 = await NotificationService.markAsRead(notif1.id);
    expect(updated1.isRead).toBe(true);
    expect(await NotificationService.getUnreadCount('usr-101')).toBe(1);

    // Mark single as unread
    const unreadUpdated = await NotificationService.markAsUnread(notif1.id);
    expect(unreadUpdated.isRead).toBe(false);
    expect(await NotificationService.getUnreadCount('usr-101')).toBe(2);

    // Mark all as read
    await NotificationService.markAllAsRead('all');
    expect(await NotificationService.getUnreadCount('usr-101')).toBe(0);
  });

  it('should filter activities across all 7 categories and link to the relevant features', async () => {
    // Seed 7 items across all 7 categories
    const categories: { category: InboxCategory; type: NotificationType; title: string; actionUrl: string }[] = [
      { category: 'appointments', type: 'appointment', title: 'Doctor Appointment', actionUrl: '/appointments' },
      { category: 'medicines', type: 'dose_reminder', title: 'Dose Reminder', actionUrl: '/medicines' },
      { category: 'records', type: 'prescription_uploaded', title: 'Prescription', actionUrl: '/records' },
      { category: 'orders', type: 'order_delivered', title: 'Pharmacy Order', actionUrl: '/pharmacies' },
      { category: 'family', type: 'family_attention', title: 'Family Attention', actionUrl: '/family' },
      { category: 'tests', type: 'lab_ready', title: 'Diagnostic Lab Report', actionUrl: '/records' },
      { category: 'payments', type: 'payment_completed', title: 'Payment Receipt', actionUrl: '/expenses' },
    ];

    for (const item of categories) {
      await NotificationService.createNotification({
        userId: 'usr-101',
        category: item.category,
        type: item.type,
        title: item.title,
        message: `Detailed notification for ${item.category}`,
        action: { label: 'Open', url: item.actionUrl },
      });
    }

    const allItems = await NotificationService.getInbox('usr-101');
    expect(allItems.length).toBe(7);

    // Test category-specific filters
    for (const cat of categories) {
      const filtered = await NotificationService.getInbox('usr-101', { category: cat.category });
      expect(filtered.length).toBe(1);
      expect(filtered[0].category).toBe(cat.category);
      expect(filtered[0].action?.url).toBe(cat.actionUrl);
    }
  });

  it('should support search query across titles, messages, and related entity names', async () => {
    await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'refill_alert',
      title: 'Refill Telma 40',
      message: 'Mother medication running low',
      relatedEntity: { type: 'medication', id: 'med-101', name: 'Telma 40 Telmisartan' },
      familyMemberName: 'Savitri Sharma',
    });

    await NotificationService.createNotification({
      userId: 'usr-101',
      type: 'appointment',
      title: 'Consultation with Dr. Ananya Roy',
      message: 'Cardiology OPD visit',
      relatedEntity: { type: 'appointment', id: 'apt-101', name: 'Dr. Ananya Roy' },
    });

    const search1 = await NotificationService.getInbox('usr-101', { searchQuery: 'Telmisartan' });
    expect(search1.length).toBe(1);
    expect(search1[0].title).toContain('Telma 40');

    const search2 = await NotificationService.getInbox('usr-101', { searchQuery: 'Ananya' });
    expect(search2.length).toBe(1);
    expect(search2[0].title).toContain('Dr. Ananya Roy');

    const search3 = await NotificationService.getInbox('usr-101', { searchQuery: 'Savitri' });
    expect(search3.length).toBe(1);
  });
});
