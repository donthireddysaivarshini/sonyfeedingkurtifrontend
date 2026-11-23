import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, AlertCircle, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, login, signup } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setGoogleLoading(true);
      setErrorMessage(null);
      try {
        const res = await loginWithGoogle(codeResponse.code, true);
        if (!res.success) {
          setErrorMessage(res.message || 'Google authentication failed. Please try again.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Google sign-in could not be completed.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMessage('Google sign-in was canceled or encountered an issue. Please try again.');
    },
  });

  if (!isAuthModalOpen) return null;

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(formData.email, formData.password);
        if (!res.success) {
          setErrorMessage(res.message || 'Invalid email or password.');
        }
      } else {
        const res = await signup({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        if (!res.success) {
          setErrorMessage(res.message || 'Registration could not be completed.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    closeAuthModal();
  };

  const busy = loading || googleLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-ivory-300 overflow-hidden z-10 animate-slide-up">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-ivory-200 flex items-center justify-between bg-ivory-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-maroon" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-maroon">
              Sony Collections Account
            </span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-1 rounded-full hover:bg-ivory-200 text-ink-secondary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">
          {/* Top Segmented Tabs: Sign In / Create Account */}
          <div className="grid grid-cols-2 p-1 bg-ivory border border-neutral-stone/40 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-brand-maroon text-white shadow-xs'
                  : 'text-neutral-charcoal/70 hover:text-neutral-charcoal'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-brand-maroon text-white shadow-xs'
                  : 'text-neutral-charcoal/70 hover:text-neutral-charcoal'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="text-center mb-5">
            <h3 className="font-serif text-2xl font-bold text-neutral-charcoal">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h3>
            <p className="text-xs text-neutral-charcoal/70 mt-1 max-w-xs mx-auto">
              {mode === 'login'
                ? 'Sign in to access your orders, track parcels, and manage saved addresses.'
                : 'Join Sony Collections for fast checkout and real-time order tracking.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-left text-xs text-rose-800 flex flex-col gap-1.5 animate-fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{errorMessage}</p>
              </div>
              {mode === 'login' && errorMessage.toLowerCase().includes('no account found') && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon hover:underline pl-6 cursor-pointer"
                >
                  Create an account with this email <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-neutral-stone/60 bg-white hover:bg-neutral-stone/10 text-neutral-charcoal text-sm font-medium shadow-2xs transition-colors disabled:opacity-60 cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-maroon" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-xs text-neutral-charcoal/50">
            <span className="h-px flex-1 bg-neutral-stone/40" />
            <span className="uppercase tracking-wider text-[10px] font-semibold">Or with email</span>
            <span className="h-px flex-1 bg-neutral-stone/40" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon transition-colors"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="Mobile Number (Optional)"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon transition-colors"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                placeholder="Password (min. 8 characters)"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
                minLength={8}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-stone/60 font-sans text-sm focus:outline-hidden focus:border-brand-maroon transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white font-sans text-sm font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          {/* Toggle Login / Signup Footer Link */}
          <div className="mt-5 text-center text-xs text-neutral-charcoal/70">
            {mode === 'login' ? (
              <p>
                New to Sony Collections?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-brand-maroon hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-brand-maroon hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Privacy Note */}
          <div className="mt-5 pt-4 border-t border-ivory-200 flex items-center justify-center gap-1.5 text-[11px] text-neutral-charcoal/60">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>Secure 256-bit SSL encrypted authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
