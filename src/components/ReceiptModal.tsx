import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DonationReceipt } from '../types/donation';
import { X, CheckCircle, Printer, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  receipt: DonationReceipt | null;
  onClose: () => void;
  onViewDonorWall: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  onClose,
  onViewDonorWall
}) => {
  const [copied, setCopied] = useState(false);

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(receipt.receiptId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl max-w-xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10 print:hidden">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-mono font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Contribution Confirmed · Form 10BE Generated</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Indian 80G Receipt Body */}
        <div id="official-tax-receipt" className="p-6 sm:p-8 space-y-6">
          {/* Header of Receipt */}
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                  Kindred Horizons Trust
                </h2>
                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                  Public Charitable Trust Registered under Indian Trusts Act, 1882
                </p>
                <div className="text-[11px] font-mono text-stone-500 mt-1 space-y-0.5">
                  <div>Trust PAN: <strong className="text-stone-700">{receipt.trustPAN}</strong> · Darpan ID: {receipt.darpanId}</div>
                  <div>80G Approval: <strong className="text-stone-700">{receipt.section80GRegNo}</strong></div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
                  Official 80G Receipt
                </span>
                <span className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                  #{receipt.receiptId}
                </span>
              </div>
            </div>
          </div>

          {/* Acknowledgement Statement */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-xs text-stone-700 leading-relaxed">
            Thank you, <strong className="text-stone-900 font-semibold">{receipt.donorName}</strong>.
            Your philanthropic contribution in Indian Rupees has been received into the Trust escrow and dispatched directly to verified ground projects.
            {receipt.donorPAN && (
              <span className="block mt-1 font-mono text-stone-800">
                Donor PAN: <strong>{receipt.donorPAN}</strong> (Incorporated into Form 10BD for Income Tax e-filing).
              </span>
            )}
          </div>

          {/* Line Item Receipt Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Transaction Date</span>
              <span className="font-mono text-stone-900">{receipt.transactionDate}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Designated Initiative</span>
              <span className="font-semibold text-stone-900 text-right max-w-xs truncate">
                {receipt.campaignTitle}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Contribution Type</span>
              <span className="font-mono text-stone-900">
                {receipt.frequency === 'monthly' ? 'Monthly Sustainer (Sankalpa)' : 'One-Time Contribution'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Payment Instrument</span>
              <span className="font-mono text-stone-900">
                {receipt.paymentMethod}
              </span>
            </div>

            {receipt.tributeName && (
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Memorial Dedication</span>
                <span className="font-semibold text-stone-900">
                  {receipt.tributeType === 'in_memory' ? 'In memory of ' : 'In honor of '} {receipt.tributeName}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Direct Program Seva</span>
              <span className="font-mono text-stone-900 tabular-nums">₹{receipt.amount.toLocaleString('en-IN')}</span>
            </div>

            {receipt.feeCovered > 0 && (
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Gateway Processing Surcharge Covered</span>
                <span className="font-mono text-stone-900 tabular-nums">+₹{receipt.feeCovered.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex items-baseline justify-between pt-3 border-t border-stone-200">
              <div>
                <span className="text-sm font-bold text-stone-900">Total Contribution</span>
                <span className="text-[11px] text-stone-500 block">50% Eligible for Tax Deduction u/s 80G</span>
              </div>
              <span className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                ₹{receipt.totalPaid.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Authorized Trust Signatories */}
          <div className="pt-4 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-mono text-stone-600">
            <div className="border border-stone-200/80 rounded-md p-2 bg-stone-50/50">
              <div className="font-bold text-stone-900">Lavanya Gurbhele</div>
              <div className="text-[9px] text-stone-500">Managing Trustee</div>
              <div className="text-[8px] text-emerald-700 mt-1">✓ Digitally Signed</div>
            </div>
            <div className="border border-stone-200/80 rounded-md p-2 bg-stone-50/50">
              <div className="font-bold text-stone-900">Bhakti Kapse</div>
              <div className="text-[9px] text-stone-500">Co-Admin (Operations)</div>
              <div className="text-[8px] text-emerald-700 mt-1">✓ Field Verified</div>
            </div>
            <div className="border border-stone-200/80 rounded-md p-2 bg-stone-50/50">
              <div className="font-bold text-stone-900">Aarya Sarode</div>
              <div className="text-[9px] text-stone-500">Co-Admin (80G Audits)</div>
              <div className="text-[8px] text-emerald-700 mt-1">✓ Form 10BD Audited</div>
            </div>
            <div className="border border-stone-200/80 rounded-md p-2 bg-stone-50/50">
              <div className="font-bold text-stone-900">Aastha Kelelkar</div>
              <div className="text-[9px] text-stone-500">Co-Admin (Outreach)</div>
              <div className="text-[8px] text-emerald-700 mt-1">✓ Signatory Verified</div>
            </div>
          </div>

          {/* Indian Income Tax Section 80G / 12A Certification Footer */}
          <div className="pt-2 text-[10px] text-stone-500 leading-normal">
            Kindred Horizons Trust is registered under Section 12A and Section 80G of the Income Tax Act, 1961. Donors are entitled to deduction under Section 80G. Form 10BD statement of donation will be filed with the Income Tax Department and Form 10BE certificate will be available for annual ITR assessment.
          </div>
        </div>

        {/* Modal Action Buttons (hidden during print) */}
        <div className="p-5 border-t border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none py-2 px-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={handleCopyId}
              className="py-2 px-3 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-medium rounded-md flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copied ? 'Copied' : 'Receipt #'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onViewDonorWall();
            }}
            className="w-full sm:w-auto text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center justify-center gap-1 cursor-pointer py-1"
          >
            <span>View on Live Donor Wall</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
