'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { EmailVerifyModal } from '../forms/verify';

type Tab = 'login' | 'signup';
type Step = 'login' | 'signup' | 'verify';

interface AuthModalProps {
  open: boolean;
  tab: Tab;
  setTab: (t: Tab) => void;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ open, tab, setTab, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<Step>('login');
  const [showForgot, setShowForgot] = useState(false);

  // Login fields
  const [loginUser, setLoginUser] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Signup fields
  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', email: '', phone: '', nationality: '', password: '',
  });
  const [showSignupPwd, setShowSignupPwd] = useState(false);

  // Verify fields
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (open) {
      setStep(tab === 'signup' ? 'signup' : 'login');
      setError('');
      setSuccessMsg('');
    }
  }, [open, tab]);

  const switchTab = (t: Tab) => {
    setTab(t);
    setStep(t === 'signup' ? 'signup' : 'login');
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPwd) { setError('Both fields are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: loginUser, password: loginPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('userSession', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        session_id: data.user.session_id,
      }));
      window.dispatchEvent(new StorageEvent('storage', { key: 'userSession' }));

      if (data.user.status === 'Pending') {
        setVerifyEmail(loginUser);
        setStep('verify');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, nationality, password } = signupData;
    if (!firstName || !lastName || !email || !phone || !nationality || !password) {
      setError('All fields are required.');
      return;
    }
    if (firstName.length < 3 || lastName.length < 3) {
      setError('First and last name must be at least 3 characters.');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone must be exactly 10 digits.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setVerifyEmail(email);
      setSuccessMsg('Account created! Check your email for the verification code.');
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode) { setError('Enter the verification code.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail, verificationCode: verifyCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      setSuccessMsg('Account verified! Please sign in.');
      setVerifyCode('');
      setStep('login');
      setLoginUser(verifyEmail);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Check your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!verifyEmail) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend');
      setSuccessMsg('Code resent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inputClass = (hasError?: boolean) =>
    `w-full py-3 border rounded-xl text-[14px] outline-none transition-all ${
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'
    }`;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden animate-[fadeIn_0.2s_ease]">

        {/* ── Dark header ── */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <i className="bi bi-x-lg text-[12px]"></i>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/15 flex-shrink-0 flex items-center justify-center">
              <Image src="/imgs/logo.ico" alt="BIA" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-extrabold text-[16px] leading-tight">BIA African Touch</p>
              <p className="text-white/60 text-[12px]">Join thousands of customers</p>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        {step !== 'verify' && (
          <div className="flex border-b border-gray-100 bg-gray-50">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-3 text-[14px] font-semibold transition-all border-b-2 ${
                step === 'login'
                  ? 'border-gray-800 text-gray-900 bg-white'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className="bi bi-box-arrow-in-right mr-1.5 text-[13px]"></i>
              Sign In
            </button>
            <button
              onClick={() => switchTab('signup')}
              className={`flex-1 py-3 text-[14px] font-semibold transition-all border-b-2 ${
                step === 'signup'
                  ? 'border-gray-800 text-gray-900 bg-white'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className="bi bi-person-plus mr-1.5 text-[13px]"></i>
              Sign Up
            </button>
          </div>
        )}

        {/* ── Body ── */}
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">

          {/* Error / Success */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-[13px] px-4 py-2.5 rounded-xl mb-4">
              <i className="bi bi-exclamation-circle-fill flex-shrink-0 mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[13px] px-4 py-2.5 rounded-xl mb-4">
              <i className="bi bi-check-circle-fill flex-shrink-0 mt-0.5"></i>
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── Login Form ── */}
          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              <div className="relative">
                <i className="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Email address or phone"
                  className={`${inputClass()} pl-10 pr-4`}
                  required
                />
              </div>

              <div className="relative">
                <i className="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                <input
                  type={showLoginPwd ? 'text' : 'password'}
                  value={loginPwd}
                  onChange={(e) => setLoginPwd(e.target.value)}
                  placeholder="Password"
                  className={`${inputClass()} pl-10 pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPwd(!showLoginPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`bi ${showLoginPwd ? 'bi-eye-slash' : 'bi-eye'} text-[14px]`}></i>
                </button>
              </div>

              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[12px] text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 shadow-md shadow-gray-900/20 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><i className="bi bi-box-arrow-in-right"></i> Sign In</>
                )}
              </button>

              <p className="text-center text-[13px] text-gray-500">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className="text-gray-800 font-semibold hover:text-gray-900 transition-colors underline underline-offset-2"
                >
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* ── Signup Form ── */}
          {step === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3" autoComplete="off">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <i className="bi bi-person absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                  <input
                    type="text"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                    placeholder="First name"
                    className={`${inputClass()} pl-9 pr-3`}
                    required
                  />
                </div>
                <input
                  type="text"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                  placeholder="Last name"
                  className={`${inputClass()} px-3`}
                  required
                />
              </div>

              <div className="relative">
                <i className="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  placeholder="Email address"
                  className={`${inputClass()} pl-10 pr-4`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <i className="bi bi-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                  <input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    placeholder="Phone (10 digits)"
                    className={`${inputClass()} pl-9 pr-3`}
                    required
                  />
                </div>
                <div className="relative">
                  <i className="bi bi-globe2 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                  <input
                    type="text"
                    value={signupData.nationality}
                    onChange={(e) => setSignupData({ ...signupData, nationality: e.target.value })}
                    placeholder="Nationality"
                    className={`${inputClass()} pl-9 pr-3`}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <i className="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                <input
                  type={showSignupPwd ? 'text' : 'password'}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="Password (min. 6 characters)"
                  className={`${inputClass()} pl-10 pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPwd(!showSignupPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`bi ${showSignupPwd ? 'bi-eye-slash' : 'bi-eye'} text-[13px]`}></i>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 shadow-md shadow-gray-900/20 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><i className="bi bi-person-plus"></i> Create Account</>
                )}
              </button>

              <p className="text-center text-[13px] text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-gray-800 font-semibold hover:text-gray-900 transition-colors underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* ── Verify Step ── */}
          {step === 'verify' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <i className="bi bi-envelope-check text-gray-700 text-[30px]"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-[16px]">Verify Your Email</h3>
                <p className="text-gray-400 text-[13px] mt-1">
                  We sent a code to{' '}
                  <span className="text-gray-700 font-semibold">{verifyEmail}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="relative">
                  <i className="bi bi-shield-check absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[14px] pointer-events-none"></i>
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all text-center tracking-[0.3em] font-bold"
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <><i className="bi bi-check-circle"></i> Verify Code</>
                  )}
                </button>

                <p className="text-center text-[13px] text-gray-400">
                  Didn&apos;t receive it?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-gray-700 font-medium hover:text-gray-900 transition-colors disabled:text-gray-300 underline underline-offset-2"
                  >
                    Resend code
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <EmailVerifyModal onClose={() => setShowForgot(false)} event="forgot" emailOpt="" />
      )}
    </div>
  );
}
