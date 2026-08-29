'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  PhoneCall,
  MapPin,
  Star,
  ShieldAlert,
  Search,
  Activity,
  Bed,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Navigation,
  Stethoscope
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { initialHospitals } from '../../lib/mockData';
import { AppointmentService } from '../../server/services/appointment.service';
import { Hospital } from '../../types';
import { PageHeader } from '../../components/ui/page-header';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { EmptyState } from '../../components/ui/empty-state';
import { Input } from '../../components/ui/input';

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyEmergency, setOnlyEmergency] = useState(false);

  const loadData = () => {
    const list = AarogyaStorage.getHospitals();
    let res = list && list.length > 0 ? list : initialHospitals;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.facilities.some(f => f.toLowerCase().includes(q))
      );
    }
    setHospitals(res);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, [searchQuery]);

  const filteredHospitals = hospitals.filter(h => {
    const matchesEmergency = !onlyEmergency || h.has24x7Emergency;
    return matchesEmergency;
  });

  return (
    <div className="page-wrapper animate-fade-in space-y-6">

      {/* Emergency Helpline Banner */}
      <Card variant="alert" padding="default" className="border-red-400 dark:border-red-900 bg-red-50/80 dark:bg-red-950/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <PhoneCall size={18} />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-red-950 dark:text-red-200">
                National Medical Emergency Helpline: 108 / 112
              </h3>
              <p className="text-xs text-red-800 dark:text-red-300">
                Instant ambulance dispatch with GPS telemetry and triage pre-arrival alert.
              </p>
            </div>
          </div>

          <Button asChild variant="emergency" size="sm" className="font-extrabold text-xs flex-shrink-0">
            <a href="tel:108">
              <PhoneCall size={13} className="mr-1" /> Call 108 Now
            </a>
          </Button>
        </div>
      </Card>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals by name, city, trauma facilities..."
            className="pl-10"
          />
        </div>

        <button
          onClick={() => setOnlyEmergency(!onlyEmergency)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            onlyEmergency
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          {onlyEmergency ? '✓ 24x7 Emergency Only' : 'Filter 24x7 Emergency'}
        </button>
      </div>

      {/* Hospitals Grid */}
      {filteredHospitals.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No hospitals found"
          description="Try changing your search keywords or clearing filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHospitals.map((hosp) => (
            <Card
              key={hosp.id}
              variant="interactive"
              padding="default"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={hosp.imageUrl}
                    alt={hosp.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 truncate">
                        {hosp.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                        <Star size={11} fill="currentColor" /> {hosp.rating}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={12} className="flex-shrink-0" />
                      <span className="truncate">{hosp.address} ({hosp.distanceKm} km away)</span>
                    </p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {hosp.type}
                      </Badge>
                      {hosp.has24x7Emergency && (
                        <Badge variant="danger" className="text-[10px]">
                          24/7 Emergency
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bed Status Metrics */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-[#026dd9]" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">ICU Beds Available</div>
                      <div className="font-bold text-[#026dd9] dark:text-blue-400">{hosp.icuBedsAvailable} Open</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Bed size={14} className="text-sky-600" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Total Inpatient Beds</div>
                      <div className="font-bold text-slate-700 dark:text-slate-200">{hosp.totalBeds} Beds</div>
                    </div>
                  </div>
                </div>

                {/* Facilities Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {hosp.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-medium"
                    >
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="text-xs text-slate-500 font-mono">
                  Helpline: <strong className="text-slate-800 dark:text-slate-200">{hosp.emergencyHelpline}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${hosp.phone || hosp.emergencyHelpline || '07582-236200'}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                    title={`Call Hospital: ${hosp.phone || hosp.emergencyHelpline}`}
                  >
                    <PhoneCall size={13} className="text-white" />
                    <span>Call Helpline</span>
                  </a>

                  <Button asChild variant="default" size="sm" className="bg-[#026dd9] hover:bg-[#0256ab] text-xs font-bold rounded-xl">
                    <Link href={`/doctors?hospital=${encodeURIComponent(hosp.name)}`}>
                      <Stethoscope size={13} className="mr-1" /> View Doctors
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
