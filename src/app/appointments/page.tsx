'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Stethoscope,
  User,
  AlertCircle,
  PhoneCall,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building2,
  RotateCcw,
  Trash2,
  Activity,
  Layers,
  ArrowRight,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  RefreshCw,
  X,
  MessageSquare
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { AppointmentService } from '../../server/services/appointment.service';
import { Appointment, AppointmentSlot, Doctor, FamilyMember, UserProfile } from '../../types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function AppointmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>('usr-101');

  // Live Video Teleconsultation Screen State (Screenshot 1 Screen C)
  const [activeVideoCallApt, setActiveVideoCallApt] = useState<Appointment | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(148); // 02:28

  // Inline Reschedule State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('2026-08-31');
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const activeId = AarogyaStorage.getActiveProfileId();
    setActiveProfileId(activeId);
    setProfile(AarogyaStorage.getUserProfile());
    setFamilyMembers(AarogyaStorage.getFamilyMembers());

    const list = await AppointmentService.getAppointments({
      patientProfileId: activeId,
      status: 'all',
    });
    setAppointments(list);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, [activeProfileId]);

  // Video call timer tick
  useEffect(() => {
    let interval: any;
    if (activeVideoCallApt) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeVideoCallApt]);

  // Available slots for inline reschedule
  useEffect(() => {
    if (rescheduleApt) {
      AppointmentService.getAvailableSlots(rescheduleApt.doctorId, rescheduleDate)
        .then(slots => {
          setAvailableSlots(slots);
          const firstOpen = slots.find(s => s.isAvailable);
          if (firstOpen) setSelectedSlot(firstOpen.time);
        })
        .catch(console.error);
    }
  }, [rescheduleApt, rescheduleDate]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleApt || !selectedSlot) return;
    setIsSubmitting(true);

    try {
      await AppointmentService.rescheduleAppointment(rescheduleApt.id, rescheduleDate, selectedSlot);
      setActionSuccessMsg(`Moved to ${rescheduleDate} at ${selectedSlot}.`);
      setRescheduleApt(null);
      loadData();
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelApt = async (apt: Appointment) => {
    await AppointmentService.cancelAppointment(apt.id);
    setActionSuccessMsg(`Appointment with ${apt.doctorName} cancelled.`);
    loadData();
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const upcomingAppointments = appointments.filter(
    a => a.status === 'confirmed' || a.status === 'booked' || a.status === 'requested'
  );
  const pastAppointments = appointments.filter(
    a => a.status === 'completed' || a.status === 'cancelled'
  );

  /* =========================================================================
   * 1. LIVE VIDEO CONSULTATION SCREEN (1:1 with Screenshot 1 Screen C)
   * ========================================================================= */
  if (activeVideoCallApt) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between select-none">
        {/* Top Floating Video Controls Header */}
        <div className="p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveVideoCallApt(null)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h2 className="text-base font-black text-white">{activeVideoCallApt.doctorName}</h2>
              <div className="flex items-center gap-2 text-xs text-teal-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{formatDuration(callDuration)}</span>
                <span>• HD Encrypted Call</span>
              </div>
            </div>
          </div>

          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Main Video Stage: Doctor Feed */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80"
            alt="Doctor Video Stream"
            className="w-full h-full object-cover"
          />

          {/* Floating Self Camera Window (Bottom Right) */}
          <div className="absolute bottom-6 right-4 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/80 shadow-2xl bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
              alt="Patient Self View"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 left-2 text-[9px] font-black text-white bg-black/60 px-1.5 py-0.2 rounded">
              You
            </span>
          </div>
        </div>

        {/* Bottom Call Controls (Mic, End Call, Video) */}
        <div className="p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center gap-5 z-10">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all ${
              isAudioMuted ? 'bg-rose-600' : 'bg-white/25 backdrop-blur-md hover:bg-white/35'
            }`}
          >
            {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button
            onClick={() => setActiveVideoCallApt(null)}
            className="w-16 h-16 rounded-full bg-[#E11D48] hover:bg-rose-700 text-white flex items-center justify-center shadow-xl active:scale-95 transition-transform"
          >
            <PhoneOff size={28} />
          </button>

          <button
            onClick={() => setIsVideoMuted(!isVideoMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all ${
              isVideoMuted ? 'bg-rose-600' : 'bg-white/25 backdrop-blur-md hover:bg-white/35'
            }`}
          >
            {isVideoMuted ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * 2. MAIN APPOINTMENTS & LIVE TOKENS DIRECTORY
   * ========================================================================= */
  return (
    <div className="min-h-screen pb-28 text-slate-900 select-none">
      {/* Sticky Tab Switcher */}
      <div className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="px-4 py-2.5 flex items-center gap-2 w-full max-w-[1720px] mx-auto sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center gap-2 max-w-md mx-auto w-full">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-white/90 text-[#026dd9] shadow-xs border border-white/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Tokens ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-white/90 text-[#026dd9] shadow-xs border border-white/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Past History ({pastAppointments.length})
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        {actionSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 backdrop-blur-md border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Reschedule Modal Card (if active) */}
        {rescheduleApt && (
          <div className="glass-card p-5 border-blue-200/80 bg-blue-50/60 space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900">Reschedule Consultation</h3>
                <p className="text-xs text-slate-500">{rescheduleApt.doctorName} • {rescheduleApt.doctorSpecialty}</p>
              </div>
              <button onClick={() => setRescheduleApt(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Choose Slot</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot.time}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2 px-1 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      selectedSlot === slot.time
                        ? 'bg-[#026dd9] text-white border-[#026dd9] shadow-xs'
                        : 'bg-white/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={() => setRescheduleApt(null)} variant="outline" size="sm" className="flex-1 rounded-xl text-xs cursor-pointer">
                Cancel
              </Button>
              <Button onClick={handleConfirmReschedule} disabled={isSubmitting} size="sm" className="flex-1 bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer">
                {isSubmitting ? 'Saving...' : 'Confirm Move'}
              </Button>
            </div>
          </div>
        )}

        {/* UPCOMING APPOINTMENTS LIST */}
        {activeTab === 'upcoming' ? (
          upcomingAppointments.length === 0 ? (
            <div className="glass-card p-10 text-center max-w-md mx-auto">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-black text-sm text-slate-800">No Active Appointments</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">Book slots with top specialists without waiting in lines.</p>
              <Button asChild size="sm" className="bg-[#026dd9] hover:bg-[#0256ab] text-white font-bold text-xs rounded-xl shadow-xs">
                <Link href="/doctors">Book Appointment</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcomingAppointments.map(apt => {
                const isVideo = apt.type === 'video_teleconsult';

                return (
                  <div
                    key={apt.id}
                    className="glass-card p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#01478f] via-[#025bb5] to-[#026dd9] text-white flex flex-col items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(2,109,217,0.3)]">
                          <span className="text-[9px] uppercase font-bold opacity-80">Token</span>
                          <span className="font-black text-sm">#{apt.tokenNumber || '12'}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-sm text-slate-900">{apt.doctorName}</h3>
                            <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                              isVideo ? 'bg-blue-50 text-blue-700' : 'bg-blue-50 text-[#026dd9]'
                            }`}>
                              {isVideo ? '📹 Teleconsult' : '🏥 Clinic Visit'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#026dd9]">{apt.doctorSpecialty}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{apt.dateTime} • {apt.hospitalName}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shadow-2xs">
                        {apt.status}
                      </span>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setRescheduleApt(apt)}
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-white cursor-pointer"
                        >
                          Reschedule
                        </Button>
                        <button
                          onClick={() => handleCancelApt(apt)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      {isVideo ? (
                        <Button
                          onClick={() => setActiveVideoCallApt(apt)}
                          size="sm"
                          className="h-8 bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Video size={14} />
                          <span>Join Video</span>
                        </Button>
                      ) : (
                        <Button asChild size="sm" className="h-8 bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl shadow-xs cursor-pointer">
                          <Link href={`https://maps.google.com/?q=${encodeURIComponent(apt.hospitalName)}`} target="_blank">
                            <MapPin size={13} className="mr-1" /> Get Directions
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* PAST APPOINTMENTS LIST */
          pastAppointments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-black text-sm text-slate-800">No Past Consultations</h3>
              <p className="text-xs text-slate-400 mt-1">Completed medical appointments will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {pastAppointments.map(apt => (
                <div key={apt.id} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{apt.doctorName}</h4>
                    <p className="text-xs text-slate-500">{apt.doctorSpecialty} • {apt.dateTime}</p>
                    <span className="text-[10px] font-bold text-slate-400 capitalize">{apt.status}</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs font-bold rounded-xl">
                    <Link href={`/doctors?book=${apt.doctorId}`}>Book Again</Link>
                  </Button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
