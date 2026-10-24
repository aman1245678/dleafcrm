import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Mail,
  User,
  Building2,
  Loader2,
  AlertCircle,
  LogIn,
  UserPlus,
  RefreshCw,
  Phone,
  ShieldCheck,
  Check,
  ChevronLeft,
  KeyRound,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

export const PortalSignInModal: React.FC = () => {
  const {
    isPortalSignInOpen,
    setIsPortalSignInOpen,
    setAppMode,
    login,
    signup,
  } = useCRM();

  // Mode: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Step: 'credentials' | 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpCompany, setSignUpCompany] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpRole, setSignUpRole] = useState<'admin' | 'manager' | 'agent'>('agent');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Email OTP State
  const [otpTargetEmail, setOtpTargetEmail] = useState('');
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', '']);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-focus first OTP input when switching to 'otp' step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  if (!isPortalSignInOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(false);
    setStep('credentials');
    setOtpCode(['', '', '', '', '', '']);
    setDevOtpHint(null);
  };

  const handleClose = () => {
    resetFormState();
    setIsPortalSignInOpen(false);
  };



  // -------------------------------------------------------------------------
  // Step 1: Handle Sign In Submit (Request Email OTP)
  // -------------------------------------------------------------------------
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = signInEmail.trim().toLowerCase();
    if (!email) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    if (!signInPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, signInPassword);

      if (res.otpRequired) {
        setOtpTargetEmail(res.email || email);
        if (res.devHint) setDevOtpHint(res.devHint);
        setResendCooldown(60);
        setStep('otp');
        setSuccessMessage(`Verification OTP sent to ${res.email || email} to your inbox!`);
      } else if (res.success && res.token) {
        // Direct authenticated (e.g. if OTP was already processed)
        triggerLoginSuccess(res.user?.name || 'User');
      } else {
        setErrorMessage(res.message || 'Incorrect email or password. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error connecting to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Step 1: Handle Sign Up Submit (Request Email OTP)
  // -------------------------------------------------------------------------
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const name = signUpName.trim();
    const email = signUpEmail.trim().toLowerCase();

    if (!name) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please provide a valid corporate email format (e.g., name@company.com).');
      return;
    }
    if (signUpPassword.length < 5) {
      setErrorMessage('Password must be at least 5 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-type your password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({
        fullName: name,
        email,
        password: signUpPassword,
        companyName: signUpCompany.trim() || 'Enterprise Workspace',
        phone: signUpPhone.trim() || undefined, // Mobile is optional
        role: signUpRole,
      });

      if (res.otpRequired) {
        setOtpTargetEmail(res.email || email);
        if (res.devHint) setDevOtpHint(res.devHint);
        setResendCooldown(60);
        setStep('otp');
        setSuccessMessage(`Verification OTP sent to ${res.email || email} to your inbox!`);
      } else if (res.success && res.token) {
        triggerLoginSuccess(res.user?.name || name);
      } else {
        setErrorMessage(res.message || 'Registration failed. Email may already be registered.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while attempting to register.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Step 2: Verify Email OTP Code
  // -------------------------------------------------------------------------
  const handleVerifyOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const enteredCode = otpCode.join('').trim();
    if (enteredCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'signin') {
        const res = await login(otpTargetEmail, signInPassword, enteredCode);
        if (res.success && res.token) {
          triggerLoginSuccess(res.user?.name || 'Administrator');
        } else {
          setErrorMessage(res.message || 'Invalid or expired verification code.');
        }
      } else {
        // Sign up verification
        const res = await signup({
          fullName: signUpName.trim(),
          email: otpTargetEmail,
          password: signUpPassword,
          companyName: signUpCompany.trim() || 'Enterprise Workspace',
          phone: signUpPhone.trim() || undefined,
          role: signUpRole,
          otp: enteredCode,
        });

        if (res.success && res.token) {
          triggerLoginSuccess(res.user?.name || signUpName.trim());
        } else {
          setErrorMessage(res.message || 'Invalid or expired verification code.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while verifying OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Resend OTP Code
  // -------------------------------------------------------------------------
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await api.auth.resendOtp({
        email: otpTargetEmail,
        purpose: activeTab,
      });

      if (res.success) {
        setSuccessMessage(`New 6-digit code dispatched to ${otpTargetEmail}!`);
        if (res.devHint) setDevOtpHint(res.devHint);
        setResendCooldown(60);
      } else {
        setErrorMessage(res.message || 'Failed to resend code. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while requesting new code.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // OTP Input Box Logic (Auto-focus, Paste, Backspace)
  // -------------------------------------------------------------------------
  const handleOtpDigitChange = (index: number, val: string) => {
    // Take only numbers
    const cleaned = val.replace(/[^0-9]/g, '');
    const newCode = [...otpCode];

    if (cleaned.length > 1) {
      // Pasted full code or multiple characters
      const chars = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = chars[i] || '';
      }
      setOtpCode(newCode);
      const nextIndex = Math.min(chars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    newCode[index] = cleaned;
    setOtpCode(newCode);

    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpCode[index] && index > 0) {
        const newCode = [...otpCode];
        newCode[index - 1] = '';
        setOtpCode(newCode);
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const newCode = [...otpCode];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pasted[i] || '';
    }
    setOtpCode(newCode);

    const focusIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIdx]?.focus();
  };

  const autoFillDevOtp = () => {
    if (!devOtpHint) return;
    const chars = devOtpHint.slice(0, 6).split('');
    setOtpCode(chars);
    otpInputRefs.current[5]?.focus();
  };

  // Helper on success
  const triggerLoginSuccess = (userName: string) => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setSuccessMessage(`Email verified! Welcome back, ${userName}. Launching CRM...`);
    setTimeout(() => {
      handleClose();
      setAppMode('workspace');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border border-[#D8E3D6] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#F5F8F3] hover:bg-[#E5EFE4] text-[#47574B] hover:text-[#17251D] flex items-center justify-center transition border border-[#D8E3D6] cursor-pointer shadow-xs"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* -------------------------------------------------------------
            LEFT PANEL: Deep Forest (#153B2E) Enterprise Security Showcase
        -------------------------------------------------------------- */}
        <div className="hidden md:flex flex-col justify-between md:w-5/12 bg-[#153B2E] p-8 border-b md:border-b-0 md:border-r border-[#1D4C3C] text-white">
          {/* Top Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="DleafCRM Logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-black text-white tracking-tight leading-snug">
                Zero-Trust Security & Seamless Email Verification
              </h3>
              <p className="text-xs text-[#C4D5C2] mt-2 leading-relaxed">
                Sign in and account registrations are strictly verified via transactional Email OTP dispatched securely through Enterprise Email API.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#123327] border border-[#1D4C3C]">
                <div className="w-8 h-8 rounded-xl bg-[#E5EFE4] text-[#3F7657] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Mandatory Email OTP</div>
                  <div className="text-[11px] text-[#C4D5C2] mt-0.5">
                    Guaranteed verification with 6-digit one-time passcode per session.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#123327] border border-[#1D4C3C]">
                <div className="w-8 h-8 rounded-xl bg-[#E5EFE4] text-[#16845B] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Enterprise Cloud Delivery</div>
                  <div className="text-[11px] text-[#C4D5C2] mt-0.5">
                    High deliverability with 256-bit TLS encryption on all notifications.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#123327] border border-[#1D4C3C]">
                <div className="w-8 h-8 rounded-xl bg-[#E5EFE4] text-[#3F7657] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Mobile Optional</div>
                  <div className="text-[11px] text-[#C4D5C2] mt-0.5">
                    Phone number is fully optional during sign up. Work email is all you need.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer Badge */}
          <div className="pt-6 border-t border-[#1D4C3C] flex items-center justify-between text-[11px] text-[#C4D5C2]">
            <span className="flex items-center gap-1.5 text-[#16845B] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#16845B] animate-pulse" />
              Auth Gateway Active
            </span>
            <span>Version 4.2 &bull; TLS 1.3</span>
          </div>
        </div>

        {/* -------------------------------------------------------------
            RIGHT PANEL: Crisp Professional Clean Form (Card White)
        -------------------------------------------------------------- */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between bg-white text-[#17251D]">
          <div>
            {/* Top Switcher (Only visible in 'credentials' step) */}
            {step === 'credentials' && (
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D8E3D6]">
                <div className="flex bg-[#F5F8F3] p-1 rounded-2xl border border-[#D8E3D6] w-full max-w-xs shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'signin'
                        ? 'bg-[#3F7657] text-white shadow-xs'
                        : 'text-[#47574B] hover:text-[#17251D]'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'signup'
                        ? 'bg-[#3F7657] text-white shadow-xs'
                        : 'text-[#47574B] hover:text-[#17251D]'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in shadow-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed flex-1">{successMessage}</div>
              </div>
            )}

            {/* -----------------------------------------------------------
                VIEW 1: SIGN IN (Credentials Step)
            ------------------------------------------------------------ */}
            {step === 'credentials' && activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#17251D] tracking-tight">
                    Sign in to your CRM Account
                  </h2>
                  <p className="text-xs text-[#47574B] mt-1">
                    Enter your work email and password. An Email OTP will be sent to complete login.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17251D] mb-1.5">
                      Corporate Work Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#738F70]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-[#17251D] placeholder:text-slate-400 focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17251D] mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#738F70]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-[#17251D] placeholder:text-slate-400 focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#738F70] hover:text-[#17251D] transition cursor-pointer"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email OTP Notice */}
                <div className="p-3 bg-[#E5EFE4] border border-[#D8E3D6] rounded-xl text-[11px] text-[#153B2E] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#3F7657] shrink-0" />
                  <span>
                    Email OTP verification is <strong>strictly mandatory</strong>. You will receive a 6-digit code on your email to sign in.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#3F7657] hover:bg-[#336147] active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-[#3F7657]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Email OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with Email OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}


            {/* -----------------------------------------------------------
                VIEW 2: SIGN UP (Credentials Step)
            ------------------------------------------------------------ */}
            {step === 'credentials' && activeTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <h2 className="text-xl font-black text-[#17251D] tracking-tight">
                    Create your Enterprise CRM Account
                  </h2>
                  <p className="text-xs text-[#47574B] mt-0.5">
                    Register with work email. Verification OTP will be sent to activate your workspace.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17251D] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#738F70]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-9 pr-3 py-2 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-[#17251D] placeholder:text-slate-400 focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17251D] mb-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#738F70]">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={signUpCompany}
                        onChange={(e) => setSignUpCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full pl-9 pr-3 py-2 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-[#17251D] placeholder:text-slate-400 focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17251D] mb-1">
                      Corporate Work Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#738F70]">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="john@acmecorp.com"
                        className="w-full pl-9 pr-3 py-2 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-[#17251D] placeholder:text-slate-400 focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Mobile Number - EXPLICITLY OPTIONAL AS REQUESTED */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17251D] mb-1">
                      Mobile Number <span className="text-[#738F70] font-normal text-[10.5px]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#738F70]">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="+91 98765 43210 (Optional)"
                        className="w-full pl-9 pr-3 py-2 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-[#17251D] placeholder:text-slate-400 focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17251D] mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#738F70]">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        minLength={5}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Min 5 characters"
                        className="w-full pl-9 pr-8 py-2 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-[#17251D] placeholder:text-slate-400 focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#738F70] hover:text-[#17251D] transition"
                      >
                        {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17251D] mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#738F70]">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-9 pr-3 py-2 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-[#17251D] placeholder:text-slate-400 focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3F7657] bg-[#F5F8F3] border-[#D8E3D6] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="terms-check" className="text-[11px] text-[#47574B] cursor-pointer select-none">
                    I agree to DleafCRM's Enterprise Terms of Service and Privacy Policy.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#3F7657] hover:bg-[#336147] active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-[#3F7657]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Email Verification OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Email OTP & Verify Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* -----------------------------------------------------------
                VIEW 3: MANDATORY EMAIL OTP VERIFICATION SCREEN
            ------------------------------------------------------------ */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 animate-in fade-in duration-200">
                {/* Back Link */}
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="inline-flex items-center gap-1 text-xs text-[#47574B] hover:text-[#17251D] font-medium transition cursor-pointer mb-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                </button>

                {/* Header Icon & Info */}
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#E5EFE4] text-[#3F7657] border border-[#D8E3D6] flex items-center justify-center mx-auto shadow-sm">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[#17251D] tracking-tight">
                    Enter Verification Code
                  </h2>
                  <p className="text-xs text-[#47574B] max-w-sm mx-auto leading-relaxed">
                    A 6-digit one-time security passcode was sent to your registered email address:
                  </p>
                  <div className="inline-block mt-1">
                    <span className="font-semibold text-[#153B2E] bg-[#E5EFE4] border border-[#D8E3D6] px-3.5 py-1 rounded-full text-xs shadow-inner">
                      {otpTargetEmail}
                    </span>
                  </div>
                </div>

                {/* 6-Box OTP Input Grid */}
                <div className="py-2">
                  <div className="flex items-center justify-center gap-2.5 sm:gap-3.5">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold bg-[#F5F8F3] border-2 border-[#D8E3D6] rounded-2xl text-[#17251D] focus:outline-hidden focus:border-[#3F7657] focus:ring-2 focus:ring-[#3F7657]/20 transition"
                      />
                    ))}
                  </div>

                  {/* Dev Mode Code Helper (Click to fill) */}
                  {devOtpHint && (
                    <div className="mt-4 p-2.5 bg-[#E5EFE4] border border-[#D8E3D6] rounded-xl text-center text-xs flex items-center justify-between gap-2 max-w-xs mx-auto">
                      <span className="text-[#153B2E] font-medium text-[11.5px]">
                        Security Verification OTP: <strong className="text-[#17251D] tracking-widest font-mono">{devOtpHint}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={autoFillDevOtp}
                        className="px-2 py-0.5 bg-[#3F7657] hover:bg-[#336147] text-white text-[10px] font-bold rounded-md transition cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.join('').length !== 6}
                    className="w-full py-3.5 bg-[#3F7657] hover:bg-[#336147] active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-[#3F7657]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          {activeTab === 'signin'
                            ? 'Verify OTP & Launch Workspace'
                            : 'Verify OTP & Activate Account'}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Resend OTP Section */}
                  <div className="text-center text-xs text-[#47574B]">
                    {resendCooldown > 0 ? (
                      <span>
                        Resend code in <strong className="text-[#17251D]">{resendCooldown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-[#3F7657] hover:text-[#153B2E] font-semibold transition cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Didn't receive code? Resend Code</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer Security Note */}
          <div className="pt-6 mt-6 border-t border-[#D8E3D6] flex items-center justify-between text-[11px] text-[#47574B]">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#16845B]" />
              <span>Encrypted via Enterprise Cloud Delivery</span>
            </div>
            <span>Dleaf Cloud</span>
          </div>
        </div>

      </div>
    </div>
  );
};
