'use client';

import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  ThumbsUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  CheckCircle2,
  X
} from 'lucide-react';
import { Doctor } from '@/types';

interface PatientReview {
  id: string;
  patientName: string;
  patientCity: string;
  isVerifiedVisit: boolean;
  visitType: 'In-Person OPD' | 'Video Teleconsult';
  treatmentTag: string;
  rating: number;
  reviewDate: string;
  title: string;
  comment: string;
  aspects: string[];
  helpfulCount: number;
  isHelpfulClicked?: boolean;
}

interface DoctorReviewSectionProps {
  doctor: Doctor;
}

export default function DoctorReviewSection({ doctor }: DoctorReviewSectionProps) {
  const [isHowCalculatedOpen, setIsHowCalculatedOpen] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newVisitType, setNewVisitType] = useState<'In-Person OPD' | 'Video Teleconsult'>('In-Person OPD');
  const [newTreatmentTag] = useState('General Consultation');
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Seeded reviews tailored for the doctor's specialty
  const [reviews, setReviews] = useState<PatientReview[]>([
    {
      id: 'rev-1',
      patientName: 'Rajesh Kulkarni',
      patientCity: 'Sagar, MP',
      isVerifiedVisit: true,
      visitType: 'In-Person OPD',
      treatmentTag: doctor.specialization === 'Orthopedics' ? 'Knee Joint Consultation' : `${doctor.specialization} Checkup`,
      rating: 5,
      reviewDate: '18 August 2026',
      title: 'Exceptional diagnosis and prompt relief from chronic pain',
      comment: `Dr. ${doctor.name} examined all previous MRI and blood reports thoroughly. The consultation was unhurried and clear explanations were provided for every prescription. The live token system at ${doctor.hospitalName} made the OPD wait under 15 minutes.`,
      aspects: ['Accurate Diagnosis', 'Explains Treatment', 'Bedside Manner'],
      helpfulCount: 42
    },
    {
      id: 'rev-2',
      patientName: 'Sunita Agrawal',
      patientCity: 'Bhopal, MP',
      isVerifiedVisit: true,
      visitType: 'Video Teleconsult',
      treatmentTag: 'Post-Op Followup',
      rating: 5,
      reviewDate: '12 August 2026',
      title: 'Very patient listener and gentle with senior citizens',
      comment: `Booked a video teleconsult for my 68-year-old mother. Doctor was extremely polite, addressed every single doubt regarding medication dosages, and shared the digital prescription immediately after the call.`,
      aspects: ['Bedside Manner', 'Prescription Clarity', 'Post-Op Care'],
      helpfulCount: 28
    },
    {
      id: 'rev-3',
      patientName: 'Vikramaditya Sharma',
      patientCity: 'Jabalpur, MP',
      isVerifiedVisit: true,
      visitType: 'In-Person OPD',
      treatmentTag: 'Preventive Care',
      rating: 5,
      reviewDate: '5 August 2026',
      title: 'Spot-on guidance with transparent treatment options',
      comment: `Unlike other clinics that rush you, Dr. ${doctor.name} explained both surgical and non-surgical therapy routes openly. Really appreciated the honesty and methodical approach.`,
      aspects: ['Accurate Diagnosis', 'Explains Treatment'],
      helpfulCount: 19
    },
    {
      id: 'rev-4',
      patientName: 'Ananya Deshmukh',
      patientCity: 'Indore, MP',
      isVerifiedVisit: true,
      visitType: 'In-Person OPD',
      treatmentTag: 'Routine Review',
      rating: 4,
      reviewDate: '28 July 2026',
      title: 'Great doctor, clinic was slightly busy',
      comment: `The doctor's expertise is undoubtedly 5/5. The OPD was a bit crowded during peak morning hours, but the live token tracking on Quick Aarogya saved us from standing in line.`,
      aspects: ['OPD Wait Time', 'Accurate Diagnosis'],
      helpfulCount: 14
    }
  ]);

  // Aspect Pills for "Patients say" section
  const aspectOptions = [
    { label: 'Accurate Diagnosis', count: '640', trend: 'positive' },
    { label: 'Bedside Manner', count: '520', trend: 'positive' },
    { label: 'Explains Treatment', count: '590', trend: 'positive' },
    { label: 'OPD Wait Time', count: '310', trend: 'neutral' },
    { label: 'Prescription Clarity', count: '430', trend: 'positive' },
    { label: 'Post-Op Care', count: '380', trend: 'positive' }
  ];

  // Dynamic Rating distribution breakdown
  const ratingDistribution = [
    { star: 5, percentage: 82, count: Math.round((doctor.ratingCount || 500) * 0.82) },
    { star: 4, percentage: 12, count: Math.round((doctor.ratingCount || 500) * 0.12) },
    { star: 3, percentage: 4, count: Math.round((doctor.ratingCount || 500) * 0.04) },
    { star: 2, percentage: 1, count: Math.round((doctor.ratingCount || 500) * 0.01) },
    { star: 1, percentage: 1, count: Math.round((doctor.ratingCount || 500) * 0.01) }
  ];

  const handleHelpfulClick = (reviewId: string) => {
    setReviews(prev =>
      prev.map(rev => {
        if (rev.id === reviewId) {
          const isClicked = !!rev.isHelpfulClicked;
          return {
            ...rev,
            helpfulCount: isClicked ? rev.helpfulCount - 1 : rev.helpfulCount + 1,
            isHelpfulClicked: !isClicked
          };
        }
        return rev;
      })
    );
  };

  const handleToggleAspect = (aspectLabel: string) => {
    setSelectedAspect(prev => (prev === aspectLabel ? null : aspectLabel));
  };

  const handleToggleStarFilter = (star: number) => {
    setSelectedStarFilter(prev => (prev === star ? null : star));
  };

  const handleAspectSelectionForReview = (aspect: string) => {
    setSelectedAspects(prev =>
      prev.includes(aspect) ? prev.filter(a => a !== aspect) : [...prev, aspect]
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) return;

    const newRev: PatientReview = {
      id: `rev-${Date.now()}`,
      patientName: 'Arjun Mehta (You)',
      patientCity: 'New Delhi',
      isVerifiedVisit: true,
      visitType: newVisitType,
      treatmentTag: newTreatmentTag,
      rating: newRating,
      reviewDate: 'Just now',
      title: newTitle.trim(),
      comment: newComment.trim(),
      aspects: selectedAspects.length > 0 ? selectedAspects : ['Accurate Diagnosis', 'Bedside Manner'],
      helpfulCount: 0
    };

    setReviews([newRev, ...reviews]);
    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsWriteReviewOpen(false);
      setNewTitle('');
      setNewComment('');
      setSelectedAspects([]);
    }, 1500);
  };

  // Filtered reviews
  const filteredReviews = reviews.filter(rev => {
    if (selectedStarFilter && rev.rating !== selectedStarFilter) return false;
    if (selectedAspect && !rev.aspects.includes(selectedAspect)) return false;
    return true;
  });

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-5 sm:p-6 space-y-6 text-slate-900">
      {/* 1. PATIENT REVIEWS & RATING BREAKDOWN (AMAZON REFERENCE PATTERN) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">Patient reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-sm font-black text-slate-900">
              {doctor.ratingAverage || 4.9} out of 5
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {doctor.ratingCount ? `${doctor.ratingCount.toLocaleString()} global patient ratings` : '710 verified patient ratings'}
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-2 pt-2">
          {ratingDistribution.map((item) => (
            <button
              key={item.star}
              onClick={() => handleToggleStarFilter(item.star)}
              className={`w-full flex items-center gap-3 group text-left p-1 rounded-xl transition-all cursor-pointer ${
                selectedStarFilter === item.star ? 'bg-amber-50 ring-1 ring-amber-300' : 'hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold text-[#026dd9] group-hover:underline w-12 shrink-0">
                {item.star} star
              </span>
              <div className="flex-1 h-4 bg-slate-100 rounded-md overflow-hidden border border-slate-200/60 relative">
                <div
                  className="h-full bg-amber-400 group-hover:bg-amber-500 transition-all rounded-md"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-600 w-8 text-right shrink-0">
                {item.percentage}%
              </span>
            </button>
          ))}
        </div>

        {/* How are ratings calculated accordion */}
        <div className="pt-1">
          <button
            onClick={() => setIsHowCalculatedOpen(!isHowCalculatedOpen)}
            className="text-xs font-bold text-[#026dd9] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>How are patient ratings calculated?</span>
            {isHowCalculatedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {isHowCalculatedOpen && (
            <p className="text-[11px] text-slate-500 mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 leading-relaxed">
              To calculate the overall star rating and percentage breakdown by star, Quick Aarogya uses verified patient consultations (in-person OPD tokens and ABDM-verified video teleconsults). Ratings are verified against completed appointment records.
            </p>
          )}
        </div>

        {/* Review this Doctor CTA Box */}
        <div className="pt-3 border-t border-slate-200/80 space-y-2">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Review this doctor</h4>
          <p className="text-xs text-slate-600">Share your consultation experience with other patients</p>
          <button
            onClick={() => setIsWriteReviewOpen(true)}
            className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-black text-slate-800 shadow-2xs hover:shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus size={15} className="text-[#026dd9]" />
            <span>Write a Patient Review</span>
          </button>
        </div>
      </div>

      {/* 2. "PATIENTS SAY" AI REVIEW SUMMARY (AMAZON REFERENCE PATTERN) */}
      <div className="pt-4 border-t border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <span>Patients say</span>
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200/70 px-2 py-0.5 rounded-md shadow-2xs">
            <Sparkles size={11} className="text-purple-600" />
            AI Summary
          </span>
        </div>

        {/* Synthesized AI Summary Paragraph */}
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
          Patients find Dr. {doctor.name} highly attentive, praising <strong>accurate clinical diagnosis</strong>, <strong>thorough explanation of treatment options</strong>, and a polite bedside manner. The consultation atmosphere is reassuring, with clear guidance on prescriptions and follow-ups. In-person OPD visits at {doctor.hospitalName} benefit from live digital token updates that minimize waiting times.
        </p>
        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Sparkles size={11} className="text-slate-400" />
          <span>Generated from the text of verified patient reviews</span>
        </p>

        {/* Select to learn more (Aspect Pills) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
            Select to learn more
          </span>
          <div className="flex flex-wrap gap-1.5">
            {aspectOptions.map((asp) => {
              const isSelected = selectedAspect === asp.label;
              return (
                <button
                  key={asp.label}
                  onClick={() => handleToggleAspect(asp.label)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#026dd9] text-white border-[#026dd9] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-emerald-600 font-extrabold'}>↗</span>
                  <span>{asp.label}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    ({asp.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. VERIFIED PATIENT REVIEWS LIST */}
      <div className="pt-4 border-t border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Top reviews from verified patients
          </h4>
          {(selectedAspect || selectedStarFilter) && (
            <button
              onClick={() => {
                setSelectedAspect(null);
                setSelectedStarFilter(null);
              }}
              className="text-[11px] font-bold text-[#026dd9] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-3.5">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">No reviews matching the selected filter.</p>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 hover:bg-slate-50 transition-colors"
              >
                {/* Reviewer Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-[#026dd9] font-black text-xs flex items-center justify-center border border-blue-200">
                      {rev.patientName[0]}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                        {rev.patientName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {rev.patientCity}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <ShieldCheck size={11} className="text-emerald-600" />
                    Verified Patient
                  </span>
                </div>

                {/* Rating & Review Title */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-900">{rev.title}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2">
                    <span>Reviewed in India on {rev.reviewDate}</span>
                    <span>•</span>
                    <span className="text-[#026dd9] font-bold">{rev.visitType}</span>
                    <span>•</span>
                    <span className="text-slate-600">{rev.treatmentTag}</span>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {rev.comment}
                </p>

                {/* Aspects Tags */}
                {rev.aspects.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rev.aspects.map(asp => (
                      <span
                        key={asp}
                        className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {asp}
                      </span>
                    ))}
                  </div>
                )}

                {/* Helpful CTA */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-3 text-[11px] text-slate-500">
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      rev.isHelpfulClicked
                        ? 'bg-blue-50 border-[#026dd9] text-[#026dd9]'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <ThumbsUp size={12} className={rev.isHelpfulClicked ? 'fill-[#026dd9]' : ''} />
                    <span>Helpful {rev.helpfulCount > 0 ? `(${rev.helpfulCount})` : ''}</span>
                  </button>
                  <button className="hover:underline text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer">
                    Report
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. WRITE PATIENT REVIEW MODAL / DRAWER */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Write a Patient Review</h3>
                <p className="text-xs text-slate-500 font-medium">for Dr. {doctor.name}</p>
              </div>
              <button
                onClick={() => setIsWriteReviewOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {isSubmittedSuccess ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-black text-slate-900">Review Submitted!</h4>
                <p className="text-xs text-slate-600">Thank you for helping other patients with your feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Overall Star Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    1. Overall Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          size={26}
                          className={star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-slate-700 ml-2">
                      {newRating === 5 && 'Excellent'}
                      {newRating === 4 && 'Very Good'}
                      {newRating === 3 && 'Average'}
                      {newRating === 2 && 'Below Average'}
                      {newRating === 1 && 'Poor'}
                    </span>
                  </div>
                </div>

                {/* Consultation Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    2. Consultation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewVisitType('In-Person OPD')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                        newVisitType === 'In-Person OPD'
                          ? 'bg-blue-50 border-[#026dd9] text-[#026dd9]'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      In-Person OPD Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVisitType('Video Teleconsult')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                        newVisitType === 'Video Teleconsult'
                          ? 'bg-blue-50 border-[#026dd9] text-[#026dd9]'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      Video Teleconsult
                    </button>
                  </div>
                </div>

                {/* Aspect Tags */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    3. Highlight Positive Aspects
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Accurate Diagnosis',
                      'Bedside Manner',
                      'Explains Treatment',
                      'OPD Wait Time',
                      'Prescription Clarity',
                      'Post-Op Care'
                    ].map(asp => (
                      <button
                        type="button"
                        key={asp}
                        onClick={() => handleAspectSelectionForReview(asp)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          selectedAspects.includes(asp)
                            ? 'bg-[#026dd9] text-white border-[#026dd9]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {asp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Headline */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    4. Add a Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What's most important to know?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-[#026dd9]"
                  />
                </div>

                {/* Written Review */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    5. Write your review
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What did you like or dislike? How was the diagnosis and doctor's explanation?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-[#026dd9] resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteReviewOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black shadow-md active:scale-95 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
