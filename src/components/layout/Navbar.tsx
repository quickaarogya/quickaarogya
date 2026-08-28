'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Bell,
  AlertTriangle,
  Sun,
  Moon,
  Users,
  ChevronDown,
  ShieldCheck,
  QrCode,
  Activity,
  Plus
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { UserProfile, FamilyMember, HealthNotification } from '../../types';

export default function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('usr-101');
  const [notifications, setNotifications] = useState<HealthNotification[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState<boolean>(false);

  const loadData = () => {
    setProfile(AarogyaStorage.getUserProfile());
    setFamilyMembers(AarogyaStorage.getFamilyMembers());
    setActiveProfileId(AarogyaStorage.getActiveProfileId());
    setNotifications(AarogyaStorage.getNotifications());
    setTheme(AarogyaStorage.getTheme());
    setIsSosActive(AarogyaStorage.isSosActive());
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('storage-update', handleStorage);
    window.addEventListener('theme-change', handleStorage);
    return () => {
      window.removeEventListener('storage-update', handleStorage);
      window.removeEventListener('theme-change', handleStorage);
    };
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    AarogyaStorage.setTheme(nextTheme);
  };

  const handleToggleSos = () => {
    const nextState = !isSosActive;
    setIsSosActive(nextState);
    AarogyaStorage.setSosActive(nextState);
  };

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    AarogyaStorage.setActiveProfileId(id);
    setIsProfileMenuOpen(false);
  };

  // Find active member name
  const getActiveProfileDisplay = () => {
    if (activeProfileId === 'usr-101' || !profile) {
      return {
        name: profile ? `${profile.firstName} ${profile.lastName}` : 'Arjun Sharma',
        role: 'Self (Primary)',
        blood: profile?.bloodGroup || 'B+'
      };
    }
    const member = familyMembers.find(f => f.id === activeProfileId);
    if (member) {
      return {
        name: member.fullName,
        role: `${member.relationship.toUpperCase()} (Managed)`,
        blood: member.bloodGroup
      };
    }
    return { name: 'Family Profile', role: 'Managed', blood: 'B+' };
  };

  const activeDisplay = getActiveProfileDisplay();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 1rem',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.35)'
          }}>
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)'
              }}>
                Quick <span style={{ color: 'var(--primary-500)' }}>Aarogya</span>
              </span>
              <span className="badge badge-teal" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                PROD v2.4
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1 }}>
              Unified Family Health & Care Hub
            </p>
          </div>
        </Link>

        {/* Center: Active Profile Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              {activeDisplay.name.charAt(0)}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {activeDisplay.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {activeDisplay.role} • <span style={{ color: 'var(--emergency-600)', fontWeight: 600 }}>{activeDisplay.blood}</span>
              </div>
            </div>
            <ChevronDown size={15} style={{ color: 'var(--text-muted)', transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              minWidth: '260px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              padding: '0.5rem',
              zIndex: 200,
              animation: 'fadeIn 0.15s ease'
            }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Switch Care Context
              </div>

              {/* Primary User */}
              <button
                onClick={() => handleSelectProfile('usr-101')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeProfileId === 'usr-101' ? 'var(--primary-50)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  A
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Arjun Sharma (You)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Primary Account • B+ • ABHA Linked
                  </div>
                </div>
              </button>

              {/* Family Members */}
              {familyMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => handleSelectProfile(member.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: activeProfileId === member.id ? 'var(--primary-50)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginTop: '2px'
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--secondary-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {member.fullName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {member.fullName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {member.relationship.toUpperCase()} • {member.bloodGroup}
                    </div>
                  </div>
                </button>
              ))}

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                <Link
                  href="/family"
                  onClick={() => setIsProfileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--primary-600)',
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}
                >
                  <Plus size={16} /> Manage or Add Family Members
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {/* SOS Emergency Trigger */}
          <button
            onClick={handleToggleSos}
            className={isSosActive ? 'animate-pulse-glow' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: isSosActive ? 'var(--emergency-600)' : 'var(--emergency-50)',
              color: isSosActive ? '#ffffff' : 'var(--emergency-600)',
              border: `1.5px solid ${isSosActive ? 'var(--emergency-700)' : 'var(--emergency-500)'}`,
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <AlertTriangle size={16} />
            <span>{isSosActive ? 'SOS ACTIVE (108)' : 'SOS'}</span>
          </button>

          {/* Emergency Card Quick Link */}
          <Link
            href="/emergency"
            title="Emergency Health Card & QR"
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <QrCode size={18} />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--emergency-600)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-surface)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '0.75rem',
                zIndex: 200,
                animation: 'fadeIn 0.15s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Health Notifications</span>
                  <button
                    onClick={() => {
                      AarogyaStorage.markAllNotificationsRead();
                      setIsNotifMenuOpen(false);
                    }}
                    style={{ fontSize: '0.7rem', color: 'var(--primary-600)', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <Link
                      key={n.id}
                      href={n.actionUrl || '/notifications'}
                      onClick={() => {
                        AarogyaStorage.markNotificationAsRead(n.id);
                        setIsNotifMenuOpen(false);
                      }}
                      style={{
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: n.isRead ? 'var(--bg-surface-subtle)' : 'var(--primary-50)',
                        borderLeft: `3px solid ${n.urgency === 'high' ? 'var(--emergency-500)' : 'var(--primary-500)'}`,
                        display: 'block'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {n.time}
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/notifications"
                  onClick={() => setIsNotifMenuOpen(false)}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--primary-600)',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    paddingTop: '0.4rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
