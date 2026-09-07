import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { SplitDocument, ParticipantData } from '../types/split';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Copy, 
  DeviceMobile, 
  WarningCircle, 
  ShieldCheck, 
  ArrowLeft,
  QrCode,
  Lightning
} from '@phosphor-icons/react';
import logo from '../assets/ledgr_logo.png';

export function PayRedirect() {
  const [searchParams] = useSearchParams();
  const splitId = searchParams.get('id');
  const participantId = searchParams.get('pId');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [splitData, setSplitData] = useState<SplitDocument | null>(null);
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);

  // Detect mobile user agent (Android / iOS)
  const isMobile = useMemo(() => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    document.title = "Pay Split — Ledgr";
  }, []);

  useEffect(() => {
    if (!splitId || !participantId) {
      setError('Invalid or incomplete payment link. Missing split identifiers.');
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

  const handleCopy = (text: string, type: 'vpa' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'vpa') {
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleMobilePayment = () => {
    if (participant?.upiLink) {
      window.location.href = participant.upiLink;
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

  // 2. Error / Fallback State
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

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Abstract Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      {/* Navbar Banner */}
      <header className="max-w-md md:max-w-xl mx-auto w-full flex items-center justify-between py-3 border-b border-white/5 mb-6 sm:mb-8">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img 
            src={logo} 
            alt="Ledgr Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain transition-transform group-hover:scale-105" 
          />
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-ledgr">ledgr</span>
        </Link>
        <span className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium flex items-center gap-1.5">
          <Lightning weight="fill" className="w-3.5 h-3.5 text-primary" />
          <span>Instant UPI Settlement</span>
        </span>
      </header>

      {/* Main Container */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md md:max-w-lg mx-auto w-full bg-cardBackground border border-white/10 rounded-3xl p-6 sm:p-8 md:p-9 shadow-2xl relative overflow-hidden backdrop-blur-md"
      >
        {/* Subtle Radial Gradient Glow at top */}
        <div className="absolute top-0 left-0 w-full h-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/25 via-background/0 to-background/0 pointer-events-none" />

        <div className="relative z-10">
          {/* Bill Context */}
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest font-medium text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              {formattedDate}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-2.5 tracking-tight">
              {splitData.title}
            </h1>
            <p className="text-xs text-white/60 mt-1.5">
              Created by <span className="text-white font-medium">{splitData.payeeName}</span> • Total Bill: <span className="font-mono text-white/90">₹{splitData.totalAmount.toFixed(2)}</span>
            </p>
          </div>

          {/* Amount Badge */}
          <div className="bg-background/90 border border-white/10 rounded-2xl p-5 sm:p-6 mb-6 text-center relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
            
            <span className="text-[11px] font-semibold text-primary uppercase tracking-widest">
              Your Share
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold font-heading text-white mt-1.5 tracking-tight">
              ₹{participant.shareAmount.toFixed(2)}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-xs text-white/70">
              <span>Paying as:</span>
              <span className="text-white font-medium">{participant.name}</span>
            </div>
          </div>

          {/* Payee Info & Actions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs bg-background/60 border border-white/5 px-4 py-3 rounded-xl">
              <span className="text-white/50">Paying To (UPI VPA):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-white font-medium tracking-wide">{splitData.payeeVpa}</span>
                <button 
                  onClick={() => handleCopy(splitData.payeeVpa, 'vpa')}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                  title="Copy UPI ID"
                  aria-label="Copy UPI ID"
                >
                  {copiedVpa ? (
                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy weight="bold" className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Platform Conditional Interaction */}
          {isMobile ? (
            /* MOBILE VIEW: Large Tap to Pay Button */
            <div className="space-y-3">
              <button
                onClick={handleMobilePayment}
                className="w-full py-4 px-6 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-[0_0_25px_rgba(164,0,0,0.35)] hover:shadow-[0_0_35px_rgba(164,0,0,0.5)] flex items-center justify-center gap-2.5 transition-all duration-200"
              >
                <DeviceMobile weight="duotone" className="w-5 h-5 text-white" />
                <span>Tap to Pay ₹{participant.shareAmount.toFixed(2)}</span>
              </button>
              <p className="text-center text-[11px] text-white/50">
                Opens standard UPI app picker (GPay, PhonePe, Paytm, CRED)
              </p>
            </div>
          ) : (
            /* DESKTOP VIEW: QR Code & Clipboard Utilities */
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/20 mb-3 group hover:scale-[1.02] transition-transform">
                <QRCodeSVG 
                  value={participant.upiLink} 
                  size={190}
                  level="M"
                  includeMargin={false}
                />
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-white/60 mb-4 font-medium">
                <QrCode weight="duotone" className="w-4 h-4 text-primary" />
                <span>Scan using any UPI app to pay</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCopy(splitData.payeeVpa, 'vpa')}
                  className="py-3 px-3 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/40 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all group"
                >
                  {copiedVpa ? (
                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy weight="bold" className="w-4 h-4 text-white/60 group-hover:text-primary transition-colors" />
                  )}
                  <span>{copiedVpa ? 'UPI Copied' : 'Copy UPI ID'}</span>
                </button>
                
                <button
                  onClick={() => handleCopy(participant.shareAmount.toString(), 'amount')}
                  className="py-3 px-3 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/40 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all group"
                >
                  {copiedAmount ? (
                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy weight="bold" className="w-4 h-4 text-white/60 group-hover:text-primary transition-colors" />
                  )}
                  <span>{copiedAmount ? 'Amount Copied' : 'Copy Amount'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Security Stamp */}
          <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-white/40">
            <ShieldCheck weight="duotone" className="w-4 h-4 text-primary" />
            <span>Verified Direct NPCI UPI Link • Zero Middleman Fees</span>
          </div>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="max-w-md md:max-w-xl mx-auto w-full text-center py-6 text-xs text-white/40">
        <p>
          Powered by <span className="font-ledgr text-white/80 font-bold tracking-tight">ledgr</span> — Privacy-First Automated Finance
        </p>
      </footer>
    </div>
  );
}
