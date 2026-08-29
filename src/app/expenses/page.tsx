'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  TrendingUp,
  DollarSign,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  XCircle,
  Pill,
  Stethoscope,
  FlaskConical,
  Building2
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { HealthcareExpense, ExpenseCategory, FamilyMember, UserProfile } from '../../types';

export default function HealthcareExpensesPage() {
  const [expenses, setExpenses] = useState<HealthcareExpense[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Expense Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('medicines');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Cash' | 'Insurance Claim'>('UPI');
  const [isInsuranceClaimable, setIsInsuranceClaimable] = useState(false);
  const [patientId, setPatientId] = useState('usr-101');

  const loadData = () => {
    setExpenses(AarogyaStorage.getHealthcareExpenses());
    setProfile(AarogyaStorage.getUserProfile());
    setFamilyMembers(AarogyaStorage.getFamilyMembers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    AarogyaStorage.addHealthcareExpense({
      patientProfileId: patientId,
      title,
      category,
      amount: Number(amount),
      date: expenseDate,
      paymentMethod,
      isInsuranceClaimed: isInsuranceClaimable,
      claimStatus: isInsuranceClaimable ? 'in_review' : 'not_claimed'
    });

    setIsAddModalOpen(false);
    setTitle('');
    setAmount('');
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const medicineSpent = expenses.filter(e => e.category === 'medicines').reduce((sum, e) => sum + e.amount, 0);
  const consultSpent = expenses.filter(e => e.category === 'doctor_consultation').reduce((sum, e) => sum + e.amount, 0);
  const labSpent = expenses.filter(e => e.category === 'lab_diagnostics').reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter(e => {
    return selectedCategory === 'all' || e.category === selectedCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'medicines': return <Pill size={16} style={{ color: 'var(--primary-600)' }} />;
      case 'doctor_consultation': return <Stethoscope size={16} style={{ color: 'var(--secondary-600)' }} />;
      case 'lab_diagnostics': return <FlaskConical size={16} style={{ color: 'var(--warning-text)' }} />;
      default: return <Receipt size={16} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={20} />
            </div>
            <h1 className="heading-lg">Healthcare Expenses & Insurance Claims</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Comprehensive family medical spending ledger, insurance claim reimbursement status, and Section 80D tax deductions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => alert('Exporting Annual Medical Spending Summary (Section 80D Form 16 Ready PDF)...')}
            className="btn btn-secondary"
          >
            <Download size={16} /> Tax 80D Report
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} /> Add Expense
          </button>
        </div>
      </div>

      {/* Spending Breakdown Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Healthcare Spend</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹{totalSpent.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--primary-600)', fontWeight: 600 }}>Family Total (YTD 2026)</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--secondary-500)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Prescription Medicines</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹{medicineSpent.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--secondary-600)', fontWeight: 600 }}>{Math.round((medicineSpent / (totalSpent || 1)) * 100)}% of total spend</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning-text)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Doctor Consultations</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹{consultSpent.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--warning-text)', fontWeight: 600 }}>OPD & Telehealth</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success-text)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Diagnostics & Labs</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹{labSpent.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--success-text)', fontWeight: 600 }}>Blood & Full Body Checkups</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'all', label: 'All Expenses' },
          { id: 'medicines', label: 'Medicines' },
          { id: 'doctor_consultation', label: 'Doctor Consultations' },
          { id: 'lab_diagnostics', label: 'Diagnostics & Labs' }
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

      {/* Expenses Ledger Table */}
      <div className="card-elevated" style={{ marginBottom: '2.5rem' }}>
        <h2 className="heading-md" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Receipt size={20} style={{ color: 'var(--primary-500)' }} />
          Medical Expense Ledger Entries ({filteredExpenses.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredExpenses.map(exp => (
            <div
              key={exp.id}
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCategoryIcon(exp.category)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {exp.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    📅 {exp.date} • Paid via {exp.paymentMethod}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{exp.amount.toLocaleString()}
                </div>
                {exp.isInsuranceClaimed && (
                  <span className={`badge ${exp.claimStatus === 'settled' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                    Claim: {exp.claimStatus?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="heading-md">Add Medical Expense</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ cursor: 'pointer', padding: '0.25rem' }}>
                <XCircle size={22} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Expense Description *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Monthly Diabetes Medicines, Eye Specialist Visit"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              {/* Amount & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    required
                    min={1}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="medicines">Medicines & Pharmacy</option>
                    <option value="doctor_consultation">Doctor Consultation</option>
                    <option value="lab_diagnostics">Diagnostic Lab Tests</option>
                    <option value="hospitalization">Hospitalization / Surgery</option>
                    <option value="insurance_premium">Health Insurance Premium</option>
                  </select>
                </div>
              </div>

              {/* Date & Payment Method */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Expense Date *
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="Credit Card">Credit / Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Insurance Claim">Insurance TPA Direct</option>
                  </select>
                </div>
              </div>

              {/* Insurance Claimable Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <input
                  type="checkbox"
                  id="insuranceClaimToggle"
                  checked={isInsuranceClaimable}
                  onChange={(e) => setIsInsuranceClaimable(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="insuranceClaimToggle" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  Submit this expense for Health Insurance Claim Reimbursement
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Expense Entry
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
