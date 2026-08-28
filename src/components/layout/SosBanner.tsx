'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertOctagon, PhoneCall, QrCode, X, ShieldAlert } from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { EmergencyProfile } from '../../types';

export default function SosBanner() {
  const [isSosActive, setIsSosActive] = useState(false);
  const [emergencyProfile, setEmergencyProfile] = useState<EmergencyProfile | null>(null);

  const checkSos = () => {
    setIsSosActive(AarogyaStorage.isSosActive());
    setEmergencyProfile(AarogyaStorage.getEmergencyProfile());
  };

  useEffect(() => {
    checkSos();
    window.addEventListener('storage-update', checkSos);
    return () => window.removeEventListener('storage-update', checkSos);
  }, []);

  if (!isSosActive) return null;

  const handleDeactivate = () => {
    AarogyaStorage.setSosActive(false);
    setIsSosActive(false);
  };

  const primaryContact = emergencyProfile?.emergencyContacts.find(c => c.isPrimary) || {
    name: 'Priya Sharma',
    phone: '+91 98765 88990'
  };

  return (
    <div style={{
      backgroundColor: 'var(--emergency-600)',
      color: '#ffffff',
      padding: '0.75rem 1rem',
      boxShadow: '0 4px 20px var(--emergency-glow)',
      position: 'relative',
      zIndex: 95,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        {/* Left SOS Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div className="animate-heartbeat" style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            color: 'var(--emergency-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              EMERGENCY SOS BROADCAST ACTIVE
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
              Blood Group: <strong>{emergencyProfile?.bloodGroup || 'B+'}</strong> • Allergies: {emergencyProfile?.allergies.join(', ') || 'Penicillin'}
            </div>
          </div>
        </div>

        {/* Action Call Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* Call 108 Ambulance */}
          <a
            href="tel:108"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#ffffff',
              color: 'var(--emergency-700)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            <PhoneCall size={15} />
            <span>Dial 108 Ambulance</span>
          </a>

          {/* Call Family Contact */}
          <a
            href={`tel:${primaryContact.phone}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              textDecoration: 'none'
            }}
          >
            <PhoneCall size={15} />
            <span>Call {primaryContact.name}</span>
          </a>

          {/* View Public QR */}
          <Link
            href="/emergency"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              textDecoration: 'none'
            }}
          >
            <QrCode size={15} />
            <span>Responder QR</span>
          </Link>

          {/* Dismiss SOS */}
          <button
            onClick={handleDeactivate}
            title="Deactivate SOS"
            style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              padding: '0.4rem',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
