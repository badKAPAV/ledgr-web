import { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { SplitDocument, ParticipantData } from '../types/split';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Copy, 
  WarningCircle, 
  ShieldCheck, 
  ArrowLeft,
  QrCode,
  Lightning,
  DownloadSimple,
  ArrowsOut,
  X,
  Sparkle,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { CredIcon, GooglePayIcon, PhonePeIcon, PaytmIcon } from '../components/ui/BrandIcons';
import { Toast, type ToastMessage } from '../components/ui/Toast';
import logo from '../assets/ledgr_logo.png';

export function PayRedirect() {
  const [searchParams] = useSearchParams();
  const splitId = searchParams.get('id');
  const participantId = searchParams.get('pId');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [splitData, setSplitData] = useState<SplitDocument | null>(null);
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  
  // UI states
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showDetailsInSettled, setShowDetailsInSettled] = useState<boolean>(false);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Platform detection
  const isAndroid = useMemo(() => {
    const ua = navigator.userAgent || '';
    return /Android/i.test(ua);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      message
    };
    setToast(newToast);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  useEffect(() => {
    document.title = "Settle Split — Ledgr";
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!splitId || !participantId) {
      setError('Invalid or incomplete settlement link. Missing split or participant parameter.');
      setLoading(false);
      return;
    }

    const fetchSplitRecord = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'splits', splitId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('This payment split request does not exist or has expired.');
          return;
        }

        const data = docSnap.data() as SplitDocument;
        setSplitData(data);

        const targetParticipant = data.participants?.[participantId];
        if (!targetParticipant) {
          setError('Participant details not found for this split request.');
          return;
        }

        setParticipant(targetParticipant);
      } catch (err) {
        console.error('Firestore Read Error:', err);
        setError('Unable to load payment details. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchSplitRecord();
  }, [splitId, participantId]);

  // Copy helpers
  const handleCopyVpa = () => {
    if (!splitData) return;
    navigator.clipboard.writeText(splitData.payeeVpa);
    setCopiedVpa(true);
    showToast('UPI ID copied! Paste in your UPI app', 'success');
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleCopyAmount = () => {
    if (!participant) return;
    navigator.clipboard.writeText(participant.shareAmount.toFixed(2));
    setCopiedAmount(true);
    showToast(`Amount copied: ₹${participant.shareAmount.toFixed(2)}`, 'success');
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Tier 1: CRED 1-Tap Intent
  const handleCredPayment = () => {
    if (!splitData || !participant) return;

    // Pre-copy VPA as safe backup
    navigator.clipboard.writeText(splitData.payeeVpa);

    if (isAndroid) {
      showToast('Opening CRED with pre-filled amount...', 'info');
      const credIntent = `intent://pay?pa=${encodeURIComponent(splitData.payeeVpa)}&pn=${encodeURIComponent(splitData.payeeName)}&am=${participant.shareAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(splitData.title || 'Ledgr Split')}#Intent;scheme=upi;package=be.cred.android;end;`;
      window.location.href = credIntent;
    } else {
      showToast('Redirecting to UPI payment link...', 'info');
      if (participant.upiLink) {
        window.location.href = participant.upiLink;
      } else {
        window.location.href = `upi://pay?pa=${encodeURIComponent(splitData.payeeVpa)}&pn=${encodeURIComponent(splitData.payeeName)}&am=${participant.shareAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(splitData.title || 'Ledgr Split')}`;
      }
    }
  };

  // Tier 2: Direct App Launchers (GPay, PhonePe, Paytm)
  const handleLaunchApp = (appName: string, androidPackage: string, iosScheme: string) => {
    if (!splitData || !participant) return;

    // Auto-copy payee VPA to clipboard
    navigator.clipboard.writeText(splitData.payeeVpa);
    showToast(`UPI ID copied! Opening ${appName}...`, 'info');

    const intentUrl = isAndroid
      ? `intent:#Intent;package=${androidPackage};end;`
      : iosScheme;

    setTimeout(() => {
      window.location.href = intentUrl;
    }, 150);
  };

  // Tier 3: QR Code Download
  const handleDownloadQr = () => {
    if (!splitData || !participant) return;
    const canvas = document.getElementById('settlement-hidden-qr') as HTMLCanvasElement;
    if (!canvas) {
      showToast('Could not export QR code. Try taking a screenshot.', 'warning');
      return;
    }

    try {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      const safeTitle = (splitData.title || 'Split').replace(/[^a-zA-Z0-9]/g, '_');
      downloadLink.href = pngUrl;
      downloadLink.download = `Ledgr_QR_${safeTitle}_${participant.name}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      showToast('QR Code downloaded successfully!', 'success');
    } catch {
      showToast('Download blocked by browser. Please screenshot the QR.', 'warning');
    }
  };

  // Settlement Confirmation
  const handleMarkAsSettled = async () => {
    if (!splitId || !participantId) return;

    try {
      setIsSettling(true);
      const splitRef = doc(db, 'splits', splitId);
      await updateDoc(splitRef, {
        [`participants.${participantId}.status`]: 'settled'
      });

      setParticipant((prev) => (prev ? { ...prev, status: 'settled' } : null));
      showToast('Payment settled! You are all square 🎉', 'success');
    } catch (err) {
      console.error('Firestore Update Error:', err);
      showToast('Failed to mark as paid. Check your connection.', 'warning');
    } finally {
      setIsSettling(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] -z-10" />
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img src={logo} alt="Ledgr Logo" className="w-12 h-12 object-contain animate-pulse" />
            <div className="absolute -inset-2 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="font-heading font-semibold text-white text-base">Retrieving Ledgr Split</h3>
            <p className="text-xs text-white/50 mt-1">Connecting to secure transaction ledger...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error || !splitData || !participant) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-cardBackground border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background/0" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-primary/15 text-primary border border-primary/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <WarningCircle weight="duotone" className="w-7 h-7 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold font-heading text-white mb-2 tracking-tight">Split Not Found</h2>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              {error || 'Could not verify payment information.'}
            </p>
            
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full transition-all shadow-[0_0_20px_rgba(164,0,0,0.3)] hover:shadow-[0_0_30px_rgba(164,0,0,0.5)]"
            >
              <ArrowLeft weight="bold" className="w-4 h-4" /> 
              <span>Go to Ledgr Homepage</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const formattedDate = new Date(splitData.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const isSettled = participant.status === 'settled';

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Abstract Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Hidden high-res canvas for QR download */}
      <div className="hidden">
        <QRCodeCanvas
          id="settlement-hidden-qr"
          value={participant.upiLink}
          size={512}
          level="H"
          marginSize={2}
        />
      </div>

      {/* Header Banner */}
      <header className="max-w-md md:max-w-xl mx-auto w-full flex items-center justify-between py-3 border-b border-white/5 mb-6 sm:mb-8">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img 
            src={logo} 
            alt="Ledgr Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain transition-transform group-hover:scale-105" 
          />
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-ledgr">ledgr</span>
        </Link>
        <div className="flex items-center gap-2">
          {isSettled ? (
            <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-full font-medium flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <CheckCircle weight="fill" className="w-3.5 h-3.5 text-emerald-400" />
              <span>Settled</span>
            </span>
          ) : (
            <span className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium flex items-center gap-1.5 shadow-[0_0_12px_rgba(164,0,0,0.15)]">
              <Lightning weight="fill" className="w-3.5 h-3.5 text-primary" />
              <span>Smart UPI Flow</span>
            </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md md:max-w-lg mx-auto w-full bg-cardBackground border border-white/10 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md"
      >
        {/* Subtle Radial Gradient Glow at card header */}
        <div className="absolute top-0 left-0 w-full h-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background/0 pointer-events-none" />

        <div className="relative z-10">
          {/* Bill Meta Context */}
          <div className="text-center mb-5">
            <span className="text-[11px] font-mono uppercase tracking-wider font-medium text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              {formattedDate}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-2 tracking-tight">
              {splitData.title}
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Created by <span className="text-white font-medium">{splitData.payeeName}</span> • Total Bill: <span className="font-mono text-white/90">₹{splitData.totalAmount.toFixed(2)}</span>
            </p>
          </div>

          {/* CELEBRATORY SETTLED STATE */}
          {isSettled ? (
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 text-center relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.12)]"
              >
                <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-3.5">
                  <CheckCircle weight="fill" className="w-10 h-10 text-emerald-400" />
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkle weight="fill" className="w-3.5 h-3.5" />
                  <span>Payment Settled</span>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                  ₹{participant.shareAmount.toFixed(2)}
                </div>

                <p className="text-xs sm:text-sm text-emerald-200/80 mt-2 max-w-xs mx-auto leading-relaxed">
                  You're all square with <span className="text-white font-semibold">{splitData.payeeName}</span> for <span className="text-white font-medium">"{splitData.title}"</span>.
                </p>

                <div className="mt-4 pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs text-white/70">
                  <span>Participant:</span>
                  <span className="font-medium text-white">{participant.name}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-white/70">
                  <span>Payee VPA:</span>
                  <span className="font-mono text-white/90">{splitData.payeeVpa}</span>
                </div>
              </motion.div>

              {/* View/Hide Details Accordion */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => setShowDetailsInSettled(!showDetailsInSettled)}
                  className="text-xs text-white/50 hover:text-white/80 transition-colors flex items-center justify-center gap-1.5 py-2"
                >
                  <span>{showDetailsInSettled ? 'Hide Payment Channels' : 'View UPI Channels & QR Receipt'}</span>
                </button>

                {showDetailsInSettled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-2 border-t border-white/5"
                  >
                    {/* Compact QR card */}
                    <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="bg-white p-3 rounded-xl shadow-lg border border-white/20 mb-2">
                        <QRCodeSVG 
                          value={participant.upiLink} 
                          size={150}
                          level="M"
                        />
                      </div>
                      <span className="text-[11px] text-white/60">Original Settled Payment QR</span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-background/60 border border-white/5 px-4 py-3 rounded-xl">
                      <span className="text-white/50">Payee UPI VPA:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white font-medium text-[11px]">{splitData.payeeVpa}</span>
                        <button 
                          onClick={handleCopyVpa}
                          className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"
                          title="Copy UPI ID"
                        >
                          <Copy weight="bold" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Link
                  to="/"
                  className="w-full py-3.5 px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all group"
                >
                  <ArrowLeft weight="bold" className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  <span>Return to Ledgr Home</span>
                </Link>
              </div>
            </div>
          ) : (
            /* PENDING SETTLEMENT FLOW */
            <div className="space-y-5">
              {/* Share Amount Highlight Box */}
              <div className="bg-background/90 border border-white/10 rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
                
                <span className="text-[10px] sm:text-[11px] font-semibold text-primary uppercase tracking-widest">
                  Your Share to Settle
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold font-heading text-white mt-1 tracking-tight">
                  ₹{participant.shareAmount.toFixed(2)}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-xs text-white/70">
                  <span>Paying as:</span>
                  <span className="text-white font-medium">{participant.name}</span>
                </div>
              </div>

              {/* TIER 1: Instant 1-Tap Pay via CRED */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 via-primary/30 to-rose-500/30 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
                <button
                  onClick={handleCredPayment}
                  className="relative w-full py-3.5 px-4 bg-gradient-to-r from-[#18181B] to-[#27272A] hover:from-[#202024] hover:to-[#2e2e33] border border-white/15 rounded-2xl text-left shadow-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                      <CredIcon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white text-sm sm:text-base tracking-tight">
                          ⚡ Pay with CRED (Instant)
                        </span>
                        <span className="text-[10px] bg-amber-400/15 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-medium">
                          1-Tap
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Auto-fills amount & payee • Recommended
                      </p>
                    </div>
                  </div>
                  <ArrowSquareOut weight="bold" className="w-5 h-5 text-white/50 group-hover:text-white transition-colors shrink-0" />
                </button>
              </div>

              {/* TIER 2: 1-Tap Copy & Direct App Launchers */}
              <div className="space-y-3 pt-1">
                {/* Payee Info & Copy Strip */}
                <div className="bg-background/70 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Payee Name:</span>
                    <span className="text-white font-medium">{splitData.payeeName}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/5">
                    <span className="text-white/50">UPI ID (VPA):</span>
                    <span className="font-mono text-white/95 font-medium tracking-wide text-[11px] sm:text-xs">
                      {splitData.payeeVpa}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleCopyVpa}
                      className="py-2 px-3 bg-white/5 hover:bg-primary/15 border border-white/10 hover:border-primary/40 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copiedVpa ? (
                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy weight="bold" className="w-3.5 h-3.5 text-white/70" />
                      )}
                      <span>{copiedVpa ? 'UPI Copied!' : 'Copy UPI ID'}</span>
                    </button>

                    <button
                      onClick={handleCopyAmount}
                      className="py-2 px-3 bg-white/5 hover:bg-primary/15 border border-white/10 hover:border-primary/40 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copiedAmount ? (
                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy weight="bold" className="w-3.5 h-3.5 text-white/70" />
                      )}
                      <span>{copiedAmount ? 'Amount Copied!' : 'Copy Amount'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct UPI App Launchers (GPay, PhonePe, Paytm) */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-white/50 px-1 mb-2">
                    <span>Or Launch UPI App (Copies VPA Auto):</span>
                    <span className="text-[10px] text-primary/80 font-medium">1-Tap Copy & Open</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Google Pay */}
                    <button
                      onClick={() => handleLaunchApp(
                        'Google Pay',
                        'com.google.android.apps.nbu.paisa.user',
                        'gpay://'
                      )}
                      className="py-3 px-2 bg-background/80 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow">
                        <GooglePayIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-white/90 group-hover:text-white">
                        Google Pay
                      </span>
                    </button>

                    {/* PhonePe */}
                    <button
                      onClick={() => handleLaunchApp(
                        'PhonePe',
                        'com.phonepe.app',
                        'phonepe://'
                      )}
                      className="py-3 px-2 bg-background/80 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#5f259f] flex items-center justify-center shadow">
                        <PhonePeIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-white/90 group-hover:text-white">
                        PhonePe
                      </span>
                    </button>

                    {/* Paytm */}
                    <button
                      onClick={() => handleLaunchApp(
                        'Paytm',
                        'net.one97.paytm',
                        'paytm://'
                      )}
                      className="py-3 px-2 bg-background/80 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#002E6E] flex items-center justify-center shadow">
                        <PaytmIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-white/90 group-hover:text-white">
                        Paytm
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* TIER 3: Dynamic UPI QR Code */}
              <div className="bg-background/60 border border-white/10 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-white/70 mb-3 font-medium">
                  <QrCode weight="duotone" className="w-4 h-4 text-primary" />
                  <span>UPI Payment QR Code</span>
                </div>

                <div className="inline-block bg-white p-3.5 rounded-2xl shadow-xl border border-white/20 mb-3 hover:scale-[1.02] transition-transform">
                  <QRCodeSVG 
                    value={participant.upiLink} 
                    size={170}
                    level="M"
                    includeMargin={false}
                  />
                </div>

                <p className="text-[11px] text-white/50 mb-3 max-w-xs mx-auto">
                  Scan with Google Pay, PhonePe, or any UPI app camera.
                </p>

                <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ArrowsOut weight="bold" className="w-3.5 h-3.5" />
                    <span>Expand QR</span>
                  </button>

                  <button
                    onClick={handleDownloadQr}
                    className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <DownloadSimple weight="bold" className="w-3.5 h-3.5" />
                    <span>Save QR</span>
                  </button>
                </div>
              </div>

              {/* SETTLEMENT CONFIRMATION ACTION */}
              <div className="pt-2">
                <button
                  onClick={handleMarkAsSettled}
                  disabled={isSettling}
                  className="w-full py-4 px-5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-heading font-bold text-sm sm:text-base rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSettling ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Recording Settlement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle weight="fill" className="w-5 h-5 text-white" />
                      <span>I have completed this payment</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-white/40 mt-1.5">
                  Marks your ₹{participant.shareAmount.toFixed(2)} share as settled on the ledger
                </p>
              </div>

              {/* Security stamp */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-white/40">
                <ShieldCheck weight="duotone" className="w-4 h-4 text-primary" />
                <span>Verified Direct NPCI UPI Link • Zero Fees</span>
              </div>
            </div>
          )}
        </div>
      </motion.main>

      {/* FULLSCREEN QR CODE EXPAND MODAL */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-cardBackground border border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center relative shadow-2xl"
            >
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X weight="bold" className="w-5 h-5" />
              </button>

              <h3 className="font-heading font-bold text-lg text-white mb-1">
                Scan to Pay
              </h3>
              <p className="text-xs text-white/60 mb-5">
                {splitData.title} • ₹{participant.shareAmount.toFixed(2)}
              </p>

              <div className="inline-block bg-white p-5 rounded-2xl shadow-2xl mb-4">
                <QRCodeSVG 
                  value={participant.upiLink} 
                  size={230}
                  level="H"
                />
              </div>

              <div className="text-xs font-mono text-white/70 mb-5 bg-background/80 py-2 px-3 rounded-xl border border-white/5">
                {splitData.payeeVpa}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadQr}
                  className="py-2.5 px-4 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <DownloadSimple weight="bold" className="w-4 h-4" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-md md:max-w-xl mx-auto w-full text-center py-6 text-xs text-white/40">
        <p>
          Powered by <span className="font-ledgr text-white/80 font-bold tracking-tight">ledgr</span> — Privacy-First Automated Finance
        </p>
      </footer>
    </div>
  );
}
