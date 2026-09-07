import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { SplitDocument, ParticipantData } from '../types/split';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CheckCircle2, 
  Copy, 
  Smartphone, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft,
  QrCode
} from 'lucide-react';

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
      <div className="min-h-screen bg-[#0D0E11] text-[#F3F4F6] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-400 font-medium">Retrieving Ledgr Split Details...</p>
      </div>
    );
  }

  // 2. Error / Fallback State
  if (error || !splitData || !participant) {
    return (
      <div className="min-h-screen bg-[#0D0E11] text-[#F3F4F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#16181D] border border-[#23272F] rounded-2xl p-6 text-center shadow-xl">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">Split Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">{error || 'Could not verify payment information.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold bg-[#23272F] hover:bg-[#2e343e] text-white px-5 py-2.5 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Ledgr Homepage
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(splitData.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0D0E11] text-[#F3F4F6] flex flex-col justify-between p-4 md:p-8">
      {/* Navbar Banner */}
      <header className="max-w-md md:max-w-2xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#23272F]/60 mb-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center font-bold text-sm text-white">
            L
          </div>
          <span className="font-bold tracking-tight text-lg">Ledgr</span>
        </Link>
        <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-[#3B82F6] border border-blue-500/20 rounded-full font-medium">
          UPI Instant Settlement
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-md md:max-w-xl mx-auto w-full bg-[#16181D] border border-[#23272F] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Bill Context */}
        <div className="text-center mb-6">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{formattedDate}</span>
          <h1 className="text-2xl font-bold mt-1 tracking-tight">{splitData.title}</h1>
          <p className="text-xs text-gray-400 mt-1">
            Created by <span className="text-gray-200 font-medium">{splitData.payeeName}</span> • Total Bill: ₹{splitData.totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Amount Badge */}
        <div className="bg-[#0D0E11] border border-[#23272F] rounded-2xl p-5 mb-6 text-center">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Share</span>
          <div className="text-4xl font-extrabold text-white mt-1 tracking-tight">
            ₹{participant.shareAmount.toFixed(2)}
          </div>
          <p className="text-xs text-blue-400/80 mt-1">Paying as: {participant.name}</p>
        </div>

        {/* Payee Info & Actions */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs bg-[#0D0E11]/60 border border-[#23272F]/50 px-4 py-3 rounded-xl">
            <span className="text-gray-400">Paying To (UPI VPA):</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-200 font-medium">{splitData.payeeVpa}</span>
              <button 
                onClick={() => handleCopy(splitData.payeeVpa, 'vpa')}
                className="p-1 hover:bg-[#23272F] rounded text-gray-400 hover:text-white transition"
                title="Copy UPI ID"
              >
                {copiedVpa ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
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
              className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-blue-600 hover:to-blue-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Smartphone className="w-5 h-5" />
              <span>Tap to Pay ₹{participant.shareAmount.toFixed(2)}</span>
            </button>
            <p className="text-center text-[11px] text-gray-400">
              Opens standard UPI app selection (GPay, PhonePe, Paytm, CRED)
            </p>
          </div>
        ) : (
          /* DESKTOP VIEW: QR Code & Clipboard Utilities */
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-200 mb-3">
              <QRCodeSVG 
                value={participant.upiLink} 
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
              <QrCode className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Scan using any UPI app to pay</span>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCopy(splitData.payeeVpa, 'vpa')}
                className="py-2.5 px-3 bg-[#0D0E11] hover:bg-[#23272F] border border-[#23272F] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
              >
                {copiedVpa ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedVpa ? 'UPI Copied' : 'Copy UPI ID'}</span>
              </button>
              
              <button
                onClick={() => handleCopy(participant.shareAmount.toString(), 'amount')}
                className="py-2.5 px-3 bg-[#0D0E11] hover:bg-[#23272F] border border-[#23272F] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
              >
                {copiedAmount ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAmount ? 'Amount Copied' : 'Copy Amount'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Security Stamp */}
        <div className="mt-8 pt-4 border-t border-[#23272F] flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
          <span>Verified Direct NPCI UPI Link • Zero Middleman Fees</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md md:max-w-xl mx-auto w-full text-center py-6 text-xs text-gray-500">
        <p>Powered by <span className="text-gray-300 font-medium">Ledgr</span> — Privacy-First Automated Finance</p>
      </footer>
    </div>
  );
}
