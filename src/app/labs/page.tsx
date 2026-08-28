'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  FileText,
  User,
  Plus,
  XCircle,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { LabTest, LabBooking, FamilyMember, UserProfile } from '../../types';

export default function LabTestsPage() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingTest, setBookingTest] = useState<LabTest | null>(null);

  // Booking Form State
  const [selectedPatientId, setSelectedPatientId] = useState('usr-101');
  const [collectionType, setCollectionType] = useState<'home_collection' | 'walk_in'>('home_collection');
  const [scheduledDate, setScheduledDate] = useState('2026-08-30');
  const [timeSlot, setTimeSlot] = useState('07:30 AM - 08:30 AM');

  const loadData = () => {
    setLabTests(AarogyaStorage.getLabTests());
    setBookings(AarogyaStorage.getLabBookings());
    setFamilyMembers(AarogyaStorage.getFamilyMembers());
    setProfile(AarogyaStorage.getUserProfile());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const handleConfirmLabBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTest) return;

    const patientName = selectedPatientId === 'usr-101'
      ? `${profile?.firstName} ${profile?.lastName} (Self)`
      : (familyMembers.find(f => f.id === selectedPatientId)?.fullName || 'Family Member');

    AarogyaStorage.bookLabTest({
      patientProfileId: selectedPatientId,
      patientName,
      testNames: [bookingTest.name],
      totalPrice: bookingTest.price,
      collectionType,
      scheduledDate,
      scheduledTimeSlot: timeSlot
    });

    setBookingTest(null);
    alert(`Lab test booked successfully for ${patientName}! Certified phlebotomist assigned for home sample pickup.`);
  };

  const filteredTests = labTests.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={20} />
            </div>
            <h1 className="heading-lg">Diagnostic Lab Tests & Health Checkups</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            NABL-accredited diagnostic packages with free home sample collection and smart digital reports.
          </p>
        </div>
      </div>

      {/* Active Bookings Status */}
      {bookings.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="heading-md" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--primary-500)' }} />
            Active Diagnostic Bookings
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {bookings.map(b => (
              <div
                key={b.id}
                className="card-elevated"
                style={{
                  borderLeft: '5px solid var(--warning-text)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {b.testNames.join(', ')}
                    </span>
                    <span className="badge badge-warning">
                      {b.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    👤 Patient: <strong>{b.patientName}</strong> • Booking Ref #{b.bookingNumber}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    📅 Sample Pickup: <strong>{b.scheduledDate} ({b.scheduledTimeSlot})</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-700)' }}>
                    🩸 Phlebotomist: {b.phlebotomistName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Phone: {b.phlebotomistPhone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalog Search & Category Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { id: 'all', label: 'All Packages' },
            { id: 'Package', label: 'Full Body Checkups' },
            { id: 'Blood', label: 'Blood & Sugar Panels' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                backgroundColor: selectedCategory === tab.id ? 'var(--primary-500)' : 'var(--bg-surface)',
                color: selectedCategory === tab.id ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${selectedCategory === tab.id ? 'var(--primary-600)' : 'var(--border-color)'}`,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test name..."
            style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Lab Tests Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {filteredTests.map(test => (
          <div key={test.id} className="card-elevated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-teal">
                  {test.category} ({test.parametersCount} Parameters)
                </span>
                {test.fastingRequiredHours > 0 && (
                  <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                    {test.fastingRequiredHours}h Fasting Req.
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {test.name}
              </h3>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                {test.description}
              </p>

              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem' }}>
                <span>🧪 Sample: {test.sampleType}</span>
                <span>⏱️ Report in {test.reportTurnaroundHours} hrs</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.25rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{test.price}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  MRP ₹{test.mrp} ({Math.round(((test.mrp - test.price) / test.mrp) * 100)}% OFF)
                </div>
              </div>

              <button
                onClick={() => setBookingTest(test)}
                className="btn btn-primary btn-sm"
              >
                Book Home Sample
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book Lab Test Modal */}
      {bookingTest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="heading-md">Book Home Sample Collection</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {bookingTest.name} • ₹{bookingTest.price}
                </span>
              </div>
              <button onClick={() => setBookingTest(null)} style={{ cursor: 'pointer', padding: '0.25rem' }}>
                <XCircle size={22} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <form onSubmit={handleConfirmLabBooking} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Select Patient */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Patient *
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="usr-101">Arjun Sharma (Self)</option>
                  {familyMembers.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.fullName} ({f.relationship.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sample Collection Mode */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Collection Mode *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setCollectionType('home_collection')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${collectionType === 'home_collection' ? 'var(--primary-500)' : 'var(--border-color)'}`,
                      backgroundColor: collectionType === 'home_collection' ? 'var(--primary-50)' : 'var(--bg-surface)',
                      color: collectionType === 'home_collection' ? 'var(--primary-700)' : 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    🏠 Home Sample Pickup (FREE)
                  </button>

                  <button
                    type="button"
                    onClick={() => setCollectionType('walk_in')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${collectionType === 'walk_in' ? 'var(--primary-500)' : 'var(--border-color)'}`,
                      backgroundColor: collectionType === 'walk_in' ? 'var(--primary-50)' : 'var(--bg-surface)',
                      color: collectionType === 'walk_in' ? 'var(--primary-700)' : 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    🏢 Visit Diagnostic Lab
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Morning Slot (Fasting) *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="06:30 AM - 07:30 AM">06:30 AM - 07:30 AM</option>
                    <option value="07:30 AM - 08:30 AM">07:30 AM - 08:30 AM</option>
                    <option value="08:30 AM - 09:30 AM">08:30 AM - 09:30 AM</option>
                    <option value="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM</option>
                  </select>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🔒 Phlebotomist will arrive with sterilized vacutainer needles & cold-chain transport.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm Booking (₹{bookingTest.price})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingTest(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
