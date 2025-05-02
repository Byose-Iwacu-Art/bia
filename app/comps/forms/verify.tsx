import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PasswordChangeModal } from './forgot_password';
import AlertNotification from '../nav/notify';

type EmailVerifyProps = {
  onClose: () => void;
  event: string;
  emailOpt: string;
};

export const EmailVerifyModal = ({ onClose, event, emailOpt }: EmailVerifyProps) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailOpt && emailOpt !== "") {
      setEmail(emailOpt);
      setStep('code');
    }
  }, [emailOpt]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSendCode = async () => {
    clearMessages();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send code');
      setSuccess('Verification code sent! Check your inbox.');
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    clearMessages();
    if (!code) {
      setError('Please enter the verification code.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Code verification failed');
      setSuccess('Code verified successfully!');
      if (event === 'account') {
        window.location.assign('/auth/login');
      } else if (event === 'forgot') {
        setChangePassword(true);
        //onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
        >
          ✕
        </button>

        {error && <AlertNotification message={error} type="error" />}
        {success && <AlertNotification message={success} type="success" />}

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.div
              key="email"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Verify Your Email</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border border-blue-300 rounded-lg px-4 py-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSendCode}
                disabled={loading}
                className={`bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg w-full transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Enter Verification Code</h2>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="border border-green-300 rounded-lg px-4 py-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleVerifyCode}
                disabled={loading}
                className={`bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg w-full transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {changePassword && (<PasswordChangeModal onClose={() => setChangePassword(false)} email={email}/>)}
    </motion.div>
  );
};
