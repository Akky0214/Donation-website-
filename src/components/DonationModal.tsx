import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign, DonationFrequency, DonationReceipt, DonorWallEntry, TrustSettings } from '../types/donation';
import {
  X,
  Heart,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Lock,
  MessageSquareHeart,
  QrCode,
  Building2,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';
import { DynamicUpiQrCode } from './DynamicUpiQrCode';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  initialCampaignId?: string;
  initialAmount?: number;
  initialFrequency?: DonationFrequency;
  initialTributeActive?: boolean;
  trustSettings: TrustSettings;
  onSuccess: (receipt: DonationReceipt, donorEntry?: DonorWallEntry) => void;
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  initialCampaignId,
  initialAmount = 2500,
  initialFrequency = 'once',
  initialTributeActive = false,
  trustSettings,
  onSuccess
}) => {
  // Selected campaign
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    initialCampaignId || 'general'
  );

  // Amount & frequency in INR
  const [frequency, setFrequency] = useState<DonationFrequency>(initialFrequency);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(!PRESET_AMOUNTS.includes(initialAmount));

  // Fee coverage
  const [coverFees, setCoverFees] = useState<boolean>(true);

  // Tribute & dedication
  const [hasTribute, setHasTribute] = useState<boolean>(initialTributeActive);
  const [tributeType, setTributeType] = useState<'in_honor' | 'in_memory'>('in_honor');
  const [tributeName, setTributeName] = useState<string>('');
  const [tributeEmail, setTributeEmail] = useState<string>('');

  // Donor Information
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorPAN, setDonorPAN] = useState<string>(''); // For 80G
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [wallMessage, setWallMessage] = useState<string>('');

  // Payment method: 'upi' | 'card' | 'netbanking' | 'neft'
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'neft'>('upi');

  // UPI State
  const [donorUpiId, setDonorUpiId] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Card details
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState<string>('09/29');
  const [cardCvc, setCardCvc] = useState<string>('542');

  // NetBanking bank choice
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('849201');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate final amounts in INR
  const currentGiftAmount = isCustom ? Number(customAmount) || 0 : amount;
  const processingFee = coverFees ? Math.round(currentGiftAmount * 0.02) : 0; // 2% gateway cost
  const totalAmount = currentGiftAmount + processingFee;

  const targetCampaign = campaigns.find((c) => c.id === selectedCampaignId);
  const campaignName = targetCampaign ? targetCampaign.title : 'Global Emergency Relief & Greatest Need Fund';

  const handleCopyUpiVpa = () => {
    navigator.clipboard.writeText(trustSettings.upiVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  const handleProcessDonation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentGiftAmount < 100) {
      setErrorMsg('Minimum contribution amount is ₹100.');
      return;
    }
    if (!donorEmail || !donorEmail.includes('@')) {
      setErrorMsg('Please enter a valid donor email address for the Section 80G tax receipt.');
      return;
    }

    // Validate PAN format if entered
    if (donorPAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(donorPAN.trim())) {
      setErrorMsg('Please enter a valid 10-character PAN (e.g. ABCDE1234F) or leave empty.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    // Simulate 256-bit encrypted banking authorization
    setTimeout(() => {
      const generatedReceiptId = `KH-80G-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const effectiveName = isAnonymous ? 'Anonymous Supporter' : (donorName.trim() || 'Conscientious Donor');

      let methodLabel = 'UPI';
      if (paymentMethod === 'upi') methodLabel = `UPI (${donorUpiId || 'VPA QR Scanner'})`;
      if (paymentMethod === 'card') methodLabel = 'RuPay / Debit Card';
      if (paymentMethod === 'netbanking') methodLabel = `NetBanking (${selectedBank})`;
      if (paymentMethod === 'neft') methodLabel = 'Direct NEFT / RTGS Transfer';

      const receipt: DonationReceipt = {
        receiptId: generatedReceiptId,
        transactionDate: dateStr,
        donorName: effectiveName,
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim() || undefined,
        donorPAN: donorPAN.trim().toUpperCase() || undefined,
        campaignTitle: campaignName,
        amount: currentGiftAmount,
        feeCovered: processingFee,
        totalPaid: totalAmount,
        frequency,
        paymentMethod: methodLabel,
        upiVpa: paymentMethod === 'upi' ? (donorUpiId || trustSettings.upiVpa) : undefined,
        cardLast4: paymentMethod === 'card' ? '8912' : undefined,
        taxDeductiblePercentage: 50,
        taxDeductibleAmount: currentGiftAmount,
        section80GRegNo: trustSettings.section80GRegNo,
        trustPAN: trustSettings.trustPan,
        darpanId: trustSettings.darpanId,
        tributeType: hasTribute ? tributeType : undefined,
        tributeName: hasTribute ? tributeName.trim() : undefined
      };

      const donorEntry: DonorWallEntry = {
        id: `user-${Date.now()}`,
        donorName: effectiveName,
        amount: currentGiftAmount,
        frequency,
        campaignTitle: campaignName,
        timestamp: 'Just now',
        tributeType: hasTribute ? tributeType : undefined,
        tributeName: hasTribute ? tributeName.trim() : undefined,
        message: wallMessage.trim() || undefined,
        isAnonymous
      };

      setIsProcessing(false);
      onSuccess(receipt, donorEntry);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl max-w-xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-20">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Section 80G Certified · Form 10BE</span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-stone-900 mt-0.5">
              Secure Philanthropic Contribution (INR ₹)
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleProcessDonation} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-900 border border-rose-200 rounded-md text-xs">
              {errorMsg}
            </div>
          )}

          {/* Cause Selection */}
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
              Designated Initiative
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full text-xs sm:text-sm py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400 cursor-pointer"
            >
              <option value="general">
                Global Emergency Relief & Greatest Need Fund (Recommended)
              </option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.location})
                </option>
              ))}
            </select>
          </div>

          {/* Frequency Toggle */}
          <div className="p-1 bg-stone-100 rounded-lg flex items-center">
            <button
              type="button"
              onClick={() => setFrequency('once')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                frequency === 'once'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              One-Time Seva
            </button>
            <button
              type="button"
              onClick={() => setFrequency('monthly')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                frequency === 'monthly'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Monthly Sankalpa</span>
            </button>
          </div>

          {/* Amount Presets in INR */}
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
              Contribution Amount (INR ₹)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((amt) => {
                const active = !isCustom && amount === amt;
                return (
                  <motion.button
                    key={amt}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAmount(amt);
                      setIsCustom(false);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 px-2 rounded-lg border text-xs sm:text-sm font-semibold tabular-nums transition-all cursor-pointer ${
                      active
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </motion.button>
                );
              })}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Custom ₹"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value.replace(/[^0-9]/g, ''));
                    setIsCustom(true);
                  }}
                  onFocus={() => setIsCustom(true)}
                  className={`w-full h-full py-2.5 pl-6 pr-2 rounded-lg border text-xs sm:text-sm font-semibold tabular-nums transition-all focus:outline-hidden ${
                    isCustom
                      ? 'bg-stone-900 text-white border-stone-900 placeholder:text-stone-400'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100 placeholder:text-stone-500'
                  }`}
                />
                <span className={`absolute left-2.5 top-2.5 text-xs font-bold ${isCustom ? 'text-stone-300' : 'text-stone-400'}`}>
                  ₹
                </span>
              </div>
            </div>
          </div>

          {/* Fee Coverage Toggle */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between gap-3">
            <div className="text-xs">
              <label htmlFor="cover-fees" className="font-semibold text-stone-900 cursor-pointer block">
                Cover transaction costs (₹{processingFee})
              </label>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Adds 2% bank processing so 100% of your ₹{currentGiftAmount.toLocaleString('en-IN')} reaches the field.
              </p>
            </div>
            <input
              id="cover-fees"
              type="checkbox"
              checked={coverFees}
              onChange={(e) => setCoverFees(e.target.checked)}
              className="w-4 h-4 rounded-sm border-stone-300 text-stone-900 accent-stone-900 cursor-pointer"
            />
          </div>

          {/* Donor Information & Indian Tax Details */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>Donor & 80G Tax Details</span>
              <span className="text-emerald-700 font-semibold normal-case text-[11px]">
                Form 10BE Guaranteed
              </span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Full Name (As per PAN card)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lavanya Gurbhele"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 focus:outline-hidden focus:border-stone-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Email (Receipt Destination)
                </label>
                <input
                  type="email"
                  required
                  placeholder="lavanya@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 focus:outline-hidden focus:border-stone-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  PAN Number (For Section 80G Tax Exemption)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  maxLength={10}
                  value={donorPAN}
                  onChange={(e) => setDonorPAN(e.target.value.toUpperCase())}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 focus:outline-hidden focus:border-stone-400 font-mono uppercase"
                />
                <span className="text-[10px] text-stone-400 block mt-0.5">Required by CBDT for IT filing</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Mobile Number (Optional SMS receipt)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 focus:outline-hidden focus:border-stone-400 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="is-anon"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded-sm text-stone-900 accent-stone-900 cursor-pointer"
              />
              <label htmlFor="is-anon" className="text-xs text-stone-700 cursor-pointer">
                Keep my name anonymous on the public donor wall
              </label>
            </div>
          </div>

          {/* Tribute / Memorial Dedication */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setHasTribute(!hasTribute)}
                className="text-xs font-semibold text-stone-900 flex items-center gap-1.5 cursor-pointer hover:text-stone-700"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-amber-700" />
                <span>{hasTribute ? 'Dedicated Seva Options' : 'Dedicate this donation in honor or memory of someone'}</span>
              </button>
              <button
                type="button"
                onClick={() => setHasTribute(!hasTribute)}
                className="text-xs text-stone-500 underline cursor-pointer"
              >
                {hasTribute ? 'Remove' : '+ Add'}
              </button>
            </div>

            {hasTribute && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-3.5 space-y-3 mt-2"
              >
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tribute_type"
                      checked={tributeType === 'in_honor'}
                      onChange={() => setTributeType('in_honor')}
                      className="accent-stone-900"
                    />
                    <span>In Honor of</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tribute_type"
                      checked={tributeType === 'in_memory'}
                      onChange={() => setTributeType('in_memory')}
                      className="accent-stone-900"
                    />
                    <span>In Memory of</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Honoree Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Late Shri Govind Rao"
                      value={tributeName}
                      onChange={(e) => setTributeName(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Notify Family (Optional Email)
                    </label>
                    <input
                      type="email"
                      placeholder="family@example.com"
                      value={tributeEmail}
                      onChange={(e) => setTributeEmail(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Personal Blessing or Seva Note for the Donor Wall
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. May this pure water bring joy and health to the families."
                    value={wallMessage}
                    onChange={(e) => setWallMessage(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 focus:outline-hidden"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Indian Payment Gateway: UPI, RuPay/Cards, NetBanking, NEFT */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2.5">
              Select Secure Payment Gateway
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 px-2 text-xs font-medium rounded-md border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'upi'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI (GPay/PhonePe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-2 text-xs font-medium rounded-md border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>RuPay / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2 px-2 text-xs font-medium rounded-md border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'netbanking'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('neft')}
                className={`py-2 px-2 text-xs font-medium rounded-md border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'neft'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NEFT / RTGS</span>
              </button>
            </div>

            {/* Dynamically Generated UPI QR Code Component */}
            {paymentMethod === 'upi' && (
              <div className="space-y-3">
                <DynamicUpiQrCode
                  vpa={trustSettings.upiVpa}
                  payeeName={trustSettings.trustName}
                  amount={totalAmount}
                  campaignTitle={campaignName}
                  onPaymentSuccess={() => {
                    handleProcessDonation();
                  }}
                />

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Or Enter Your Personal UPI ID (VPA) for Direct Collect Request
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                    value={donorUpiId}
                    onChange={(e) => setDonorUpiId(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    An in-app payment request will be routed to your Google Pay, PhonePe, or BHIM app upon clicking Proceed.
                  </p>
                </div>
              </div>
            )}

            {/* RuPay / Card Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-medium text-stone-600">
                      RuPay / Debit / Credit Card
                    </label>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                      RBI 3D-Secure 2.0
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 0000 0000 0000"
                      className="w-full text-xs py-2 pl-8 pr-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full text-xs py-2 px-2.5 bg-white border border-stone-200 rounded-md text-stone-900 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      maxLength={4}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVV"
                      className="w-full text-xs py-2 px-2.5 bg-white border border-stone-200 rounded-md text-stone-900 font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NetBanking Bank Selection */}
            {paymentMethod === 'netbanking' && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <label className="block text-xs font-semibold text-stone-900">
                  Select Your Bank:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                        selectedBank === b
                          ? 'border-stone-900 bg-white shadow-xs font-bold text-stone-900'
                          : 'border-stone-200 bg-stone-100/70 text-stone-700 hover:bg-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* NEFT / RTGS Details */}
            {paymentMethod === 'neft' && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
                <div className="font-semibold text-stone-900 border-b border-stone-200 pb-2 mb-2 flex items-center justify-between">
                  <span>Trust Designated Bank Escrow</span>
                  <span className="font-mono text-[10px] text-emerald-800">Direct IFSC Clearance</span>
                </div>
                <p>Account Name: <strong className="text-stone-900">{trustSettings.trustName}</strong></p>
                <p>Account Number: <span className="font-mono font-bold text-stone-900">{trustSettings.accountNumber}</span></p>
                <p>IFSC Code: <span className="font-mono font-bold text-stone-900">{trustSettings.ifscCode}</span></p>
                <p>Branch: <span className="text-stone-800">{trustSettings.bankBranch}</span></p>
                <p className="text-[11px] text-stone-500 pt-1">
                  Upon clicking confirm, an instant tentative receipt is generated; funds are verified automatically within 2 hours.
                </p>
              </div>
            )}
          </div>

          {/* Total & Submit */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                Total Authorized Contribution:
              </span>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
                {frequency === 'monthly' && (
                  <span className="text-xs text-stone-500 block">/ month</span>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isProcessing || currentGiftAmount < 100}
              className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authorizing via 256-Bit Escrow...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40" />
                  <span>
                    Authorize ₹{totalAmount.toLocaleString('en-IN')}{' '}
                    {frequency === 'monthly' ? 'Monthly Pledge' : 'Gift'}
                  </span>
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                </>
              )}
            </motion.button>

            <div className="mt-3 text-center text-[11px] text-stone-500">
              Eligible for 50% Tax Deduction under Section 80G of the Indian Income Tax Act 1961. An official Form 10BE tax receipt is issued instantly.
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
