'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  Heart,
  Activity,
  Edit,
  CheckCircle2,
  QrCode,
  Calendar,
  Phone,
  Mail,
  Scale
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { UserProfile } from '../../types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [heightCm, setHeightCm] = useState(176);
  const [weightKg, setWeightKg] = useState(74.5);
  const [bloodGroup, setBloodGroup] = useState('B+');

  const loadData = () => {
    const p = AarogyaStorage.getUserProfile();
    setProfile(p);
    if (p) {
      setFirstName(p.firstName);
      setLastName(p.lastName);
      setPhone(p.phone);
      setHeightCm(p.heightCm || 176);
      setWeightKg(p.weightKg || 74.5);
      setBloodGroup(p.bloodGroup);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    AarogyaStorage.updateUserProfile({
      firstName,
      lastName,
      phone,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      bloodGroup: bloodGroup as any
    });
    setIsEditing(false);
  };

  if (!profile) return null;

  // Calculate BMI
  const heightM = (profile.heightCm || 176) / 100;
  const bmi = ((profile.weightKg || 74.5) / (heightM * heightM)).toFixed(1);

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </div>
            <h1 className="heading-lg">Patient Health Profile & ABHA Identity</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Demographic information, physical vitals, and National Ayushman Bharat Digital Health Account.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-secondary"
        >
          <Edit size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* Main Profile Info & ABHA Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Profile Card */}
        <div className="card-elevated">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-500)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.75rem',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}>
              {profile.firstName.charAt(0)}
            </div>

            <div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {profile.firstName} {profile.lastName}
              </h2>
              <div style={{ fontSize: '0.8125rem', color: 'var(--primary-700)', fontWeight: 600, marginTop: '2px' }}>
                Primary Account Holder • DOB: {profile.dateOfBirth}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                <span className="badge badge-danger">Blood Group: {profile.bloodGroup}</span>
                <span className="badge badge-success">Active Patient</span>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{profile.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{profile.phone} (Verified)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                <Activity size={16} style={{ color: 'var(--text-muted)' }} />
                <span>Height: {profile.heightCm} cm • Weight: {profile.weightKg} kg</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  placeholder="Height (cm)"
                />
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  placeholder="Weight (kg)"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* ABHA National Health Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--secondary-700) 0%, var(--secondary-900) 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
                  NATIONAL HEALTH AUTHORITY • ABDM
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
                  Ayushman Bharat Health Account
                </div>
              </div>
              <ShieldCheck size={28} style={{ color: '#38bdf8' }} />
            </div>

            <div style={{
              fontSize: '1.375rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              letterSpacing: '0.12em',
              marginTop: '1.5rem',
              color: '#38bdf8'
            }}>
              {profile.abhaId}
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', opacity: 0.9 }}>
              Name: <strong>{profile.firstName} {profile.lastName}</strong> • Gender: {profile.gender.toUpperCase()}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              ✓ KYC Verified & Linked with Aadhaar
            </span>
            <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Body Vitals & BMI Calculator Card */}
      <div className="card-elevated">
        <h2 className="heading-md" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scale size={20} style={{ color: 'var(--primary-500)' }} />
          Calculated Body Vitals & Lifestyle Metrics
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Body Mass Index (BMI)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {bmi} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>kg/m²</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--success-text)', fontWeight: 600, marginTop: '2px' }}>
              Normal & Healthy Range
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Height</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {profile.heightCm} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>cm</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              ~5 ft 9.5 in
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weight</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {profile.weightKg} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>kg</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Target: 72.0 kg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
