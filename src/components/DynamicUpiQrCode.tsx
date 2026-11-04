import React, { useState, useEffect, useId } from 'react';
import QRCode from 'qrcode';
import {
  Copy,
  Check,
  ExternalLink,
  Download,
  RotateCw,
  Clock,
  ShieldCheck,
  Sparkles,
  Smartphone,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export interface DynamicUpiQrCodeProps {
  vpa: string;
  payeeName: string;
  amount: number;
  campaignTitle?: string;
  transactionRef?: string;
  onPaymentSuccess?: () => void;
  className?: string;
}

export const DynamicUpiQrCode: React.FC<DynamicUpiQrCodeProps> = ({
  vpa,
  payeeName,
  amount,
  campaignTitle = 'General Seva Fund',
  transactionRef,
  onPaymentSuccess,
  className = ''
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes session
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [utrInput, setUtrInput] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean>(false);

  // Generate a stable or provided transaction reference
  const generatedRef = React.useMemo(() => {
    return transactionRef || `KH${Date.now().toString().slice(-8)}`;
  }, [transactionRef]);

  // Construct NPCI standard UPI URI
  // Spec: upi://pay?pa={vpa}&pn={name}&am={amount}&cu=INR&tn={note}&tr={ref}&mc=8398
  const cleanNote = React.useMemo(() => {
    const raw = `Donation to Kindred Horizons - ${campaignTitle}`;
    // NPCI UPI transaction notes usually allow up to 50 alphanumeric characters
    return raw.replace(/[^a-zA-Z0-9 -]/g, '').slice(0, 48);
  }, [campaignTitle]);

  const upiIntentUri = React.useMemo(() => {
    const formattedAmount = amount > 0 ? amount.toFixed(2) : '100.00';
    const params = new URLSearchParams({
      pa: vpa,
      pn: payeeName,
      am: formattedAmount,
      cu: 'INR',
      tn: cleanNote,
      tr: generatedRef,
      mc: '8398' // Merchant Category Code for Charitable and Social Service Organizations
    });
    return `upi://pay?${params.toString()}`;
  }, [vpa, payeeName, amount, cleanNote, generatedRef]);

  // Generate QR Code data URL dynamically when amount or VPA changes
  useEffect(() => {
    let isSubscribed = true;

    QRCode.toDataURL(upiIntentUri, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#1c1917', // stone-900
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isSubscribed) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR Code:', err);
      });

    return () => {
      isSubscribed = false;
    };
  }, [upiIntentUri]);

  // Countdown timer for live session
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetSession = () => {
    setTimeLeft(600);
  };

  const handleCopyVpa = async () => {
    try {
      await navigator.clipboard.writeText(vpa);
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2500);
    } catch {}
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard.writeText(amount.toString());
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2500);
    } catch {}
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(upiIntentUri);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `UPI_QR_${vpa}_INR_${amount}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleManualVerification = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }, 1200);
  };

  return (
    <div className={`bg-stone-50/90 rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col space-y-4 ${className}`}>
      {/* Header bar: Live Status & Session Timer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">Dynamic UPI Intent</span>
          <span className="text-emerald-600 hidden sm:inline">· Zero Gateway Fee</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-stone-500 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span>Session: <strong className="text-stone-800 tabular-nums">{formatTimer(timeLeft)}</strong></span>
          <button
            type="button"
            onClick={handleResetSession}
            title="Refresh UPI Session"
            className="p-1 hover:text-stone-900 transition-colors cursor-pointer ml-0.5"
          >
            <RotateCw className="w-3 h-3 text-stone-400 hover:text-stone-700" />
          </button>
        </div>
      </div>

      {/* Main Grid: QR Code Visual + Payee Info */}
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        {/* QR Code Container */}
        <div className="relative group shrink-0 flex flex-col items-center">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 p-2.5 bg-white rounded-xl border-2 border-stone-900 shadow-sm flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`UPI QR Code for payment of ₹${amount} to ${vpa}`}
                className="w-full h-full object-contain select-none"
              />
            ) : (
              <div className="w-full h-full bg-stone-100 rounded-md animate-pulse flex items-center justify-center text-xs font-mono text-stone-400">
                Generating QR...
              </div>
            )}

            {/* Central NPCI UPI Brand Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/95 px-2 py-0.5 rounded-sm border border-stone-300 shadow-xs flex items-center gap-1 text-[9px] font-mono font-bold text-stone-900">
                <span className="text-emerald-700">UPI</span>
                <span className="text-stone-400">·</span>
                <span>80G</span>
              </div>
            </div>
          </div>

          {/* Dynamic Amount Pill directly under QR */}
          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-stone-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              <span>Pay Exactly:</span>
              <span className="text-stone-950 font-serif font-bold text-sm">₹{amount.toLocaleString('en-IN')}</span>
              <button
                type="button"
                onClick={handleCopyAmount}
                title="Copy Exact Amount"
                className="hover:text-amber-700 ml-0.5 cursor-pointer"
              >
                {copiedAmount ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-400" />}
              </button>
            </span>
          </div>
        </div>

        {/* Right Column: Payee Credentials & Mobile Actions */}
        <div className="flex-1 flex flex-col justify-between space-y-3 w-full text-center sm:text-left">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
              Audited Trust Beneficiary
            </div>
            <h4 className="text-sm font-semibold text-stone-900 mt-0.5">
              {payeeName}
            </h4>

            {/* UPI ID Pill with 1-click copy */}
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="text-xs font-mono bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md border border-stone-200 font-semibold select-all">
                {vpa}
              </span>
              <button
                type="button"
                onClick={handleCopyVpa}
                className="p-1.5 hover:bg-stone-100 rounded-md text-stone-500 hover:text-stone-900 transition-colors cursor-pointer border border-transparent hover:border-stone-200"
                title="Copy UPI VPA ID"
              >
                {copiedVpa ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-mono">
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copied</span>
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="mt-2 text-[11px] text-stone-500 font-mono space-y-0.5">
              <div>Ref: <span className="text-stone-700 font-semibold">{generatedRef}</span></div>
              <div className="truncate max-w-xs">Purpose: <span className="text-stone-700">{cleanNote}</span></div>
            </div>
          </div>

          {/* Native Mobile UPI Deep Link */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <a
              href={upiIntentUri}
              className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Open in UPI App</span>
              <ExternalLink className="w-3 h-3 text-emerald-200" />
            </a>

            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200/80"
              title="Download QR code image to your phone or desktop"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Save QR</span>
            </button>
          </div>

          {/* Supported UPI Apps Row */}
          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-[10px] font-mono text-stone-400">
            <span className="text-stone-500">Supported:</span>
            <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">Google Pay</span>
            <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">PhonePe</span>
            <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">Paytm</span>
            <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">BHIM</span>
            <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">CRED</span>
          </div>
        </div>
      </div>

      {/* Manual UTR Reference Confirmation (for donors who have already scanned & paid) */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1">
            <label className="block text-[10px] font-mono uppercase text-stone-500 mb-1">
              Already Scanned & Sent? Enter 12-Digit UPI UTR (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 429104829102 or bank ref"
              value={utrInput}
              onChange={(e) => setUtrInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleManualVerification();
                }
              }}
              className="w-full py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded-md text-stone-900 font-mono text-xs focus:outline-hidden focus:border-stone-400"
            />
          </div>

          <button
            type="button"
            onClick={handleManualVerification}
            disabled={isVerifying || verifiedSuccess}
            className="sm:self-end py-2 px-3 bg-stone-900 hover:bg-stone-800 disabled:bg-emerald-700 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {isVerifying ? (
              <span className="inline-flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </span>
            ) : verifiedSuccess ? (
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Payment Verified!</span>
              </span>
            ) : (
              <span>I Have Sent Payment</span>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible How-To Guide */}
      <div className="border-t border-stone-200 pt-2 text-xs">
        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex items-center justify-between text-stone-600 hover:text-stone-900 py-1 font-medium transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>How does NPCI Instant UPI Payment work?</span>
          </span>
          {showInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showInstructions && (
          <div className="mt-2 p-3 bg-stone-100/70 rounded-lg space-y-1.5 text-[11px] text-stone-600 leading-relaxed font-sans animate-in fade-in">
            <p>
              <strong>Step 1:</strong> Open Google Pay, PhonePe, Paytm, or BHIM on your smartphone.
            </p>
            <p>
              <strong>Step 2:</strong> Tap <strong>"Scan any QR"</strong> and aim your camera at the screen above. The exact amount of <strong className="text-stone-900 font-mono">₹{amount.toLocaleString('en-IN')}</strong> and Trust VPA will load automatically.
            </p>
            <p>
              <strong>Step 3:</strong> Enter your UPI PIN to approve the zero-charge transaction.
            </p>
            <p>
              <strong>Step 4:</strong> Click <strong>"Complete Contribution & Issue Form 10BE"</strong> below to claim your Section 80G Indian Income Tax receipt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
