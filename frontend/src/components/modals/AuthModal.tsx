import React, { useState } from 'react';
import {
  X,
  Shield,
  User,
  KeyRound,
  Lock,
  Mail,
  CheckCircle,
  Building,
  RefreshCw,
  Phone,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { CRMUserRole } from '../../types/crm';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    setCurrentUser,
    switchRole,
    login,
    signup,
    logout,
    isAuthenticated,
  } = useCRM();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'roles'>('roles');
  const [email, setEmail] = useState('aman.kumar@Dleaf.com');
  const [password, setPassword] = useState('aman');
  const [name, setName] = useState('Aman Kumar');
  const [company, setCompany] = useState('Dleaf Solutions');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [selectedRole, setSelectedRole] = useState<CRMUserRole>(currentUser.role);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('748291');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleRoleSelect = (role: CRMUserRole) => {
    switchRole(role);
    setSelectedRole(role);
    setStatusMsg(`Switched active role to ${role.toUpperCase()} successfully!`);
    setTimeout(() => {
      setStatusMsg(null);
      setIsAuthModalOpen(false);
    }, 1200);
  };

  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await login(email, password);
      if (res.otpRequired) {
        if (res.devHint) setGeneratedOtp(res.devHint);
        setMode('otp');
        setStatusMsg(`Security OTP sent to ${email} to your inbox!`);
      } else if (res.success) {
        setStatusMsg(`Authenticated successfully as ${res.user?.name || email}!`);
        setTimeout(() => {
          setStatusMsg(null);
          setIsAuthModalOpen(false);
        }, 1000);
      } else {
        setErrorMsg(res.message || 'Failed to dispatch OTP.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await login(email, password, entered);
      if (res.success && res.token) {
        setStatusMsg('Email OTP verified successfully! Access granted.');
        setTimeout(() => {
          setStatusMsg(null);
          setIsAuthModalOpen(false);
        }, 1000);
      } else {
        setErrorMsg(res.message || 'Invalid or expired OTP code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newArr = [...otpCode];
    newArr[index] = val;
    setOtpCode(newArr);

    // auto-focus next
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F172A] to-[#EE0979] flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">User & Access Management</h2>
              <p className="text-xs text-slate-300">Roles, Organization & Security Portal</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setMode('roles')}
            className={`flex-1 py-2.5 text-center transition ${
              mode === 'roles' ? 'bg-white text-[#EE0979] border-b-2 border-[#EE0979]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Switch Role
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-center transition ${
              mode === 'login' ? 'bg-white text-[#EE0979] border-b-2 border-[#EE0979]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-center transition ${
              mode === 'signup' ? 'bg-white text-[#EE0979] border-b-2 border-[#EE0979]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Org
          </button>
          <button
            onClick={() => handleSendOtp()}
            className={`flex-1 py-2.5 text-center transition ${
              mode === 'otp' ? 'bg-white text-[#EE0979] border-b-2 border-[#EE0979]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            OTP / 2FA
          </button>
        </div>

        {statusMsg && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-pink-50 border border-rose-200 text-[#BE075E] text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#EE0979] shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <X className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-5">
          {/* TAB 1: ROLE SWITCHER */}
          {mode === 'roles' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Select your operational role. Permissions and modules adapt dynamically based on your enterprise tier:
              </div>

              <div className="space-y-2.5">
                {/* Admin */}
                <div
                  onClick={() => handleRoleSelect('admin')}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    currentUser.role === 'admin'
                      ? 'border-[#EE0979] bg-[#FFF8FA]/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EE0979] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      ADM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">Administrator / Superuser</span>
                        <span className="text-[10px] bg-[#FFF1F7] text-[#EE0979] font-semibold px-1.5 py-0.5 rounded">All Access</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Full access to Setup, Modules & Custom Fields, User management, Pipelines & Backups.
                      </p>
                    </div>
                  </div>
                  {currentUser.role === 'admin' && (
                    <div className="w-5 h-5 rounded-full bg-[#EE0979] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Sales Manager */}
                <div
                  onClick={() => handleRoleSelect('manager')}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    currentUser.role === 'manager'
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      MGR
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">Sales Manager</span>
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-1.5 py-0.5 rounded">Team Lead</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Deal discount approvals, team quota tracking, lead assignment & forecasting analytics.
                      </p>
                    </div>
                  </div>
                  {currentUser.role === 'manager' && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Sales Agent */}
                <div
                  onClick={() => handleRoleSelect('agent')}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    currentUser.role === 'agent'
                      ? 'border-[#EE0979] bg-pink-50/60 ring-2 ring-pink-600/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EE0979] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      AGT
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">Sales Agent / Inside Sales</span>
                        <span className="text-[10px] bg-pink-100 text-[#D8086C] font-semibold px-1.5 py-0.5 rounded">Rep</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Leads qualification, Kanban deals execution, VoIP dialer & WhatsApp client chats.
                      </p>
                    </div>
                  </div>
                  {currentUser.role === 'agent' && (
                    <div className="w-5 h-5 rounded-full bg-[#EE0979] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIGN IN */}
          {mode === 'login' && (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Password</label>
                  <button
                    onClick={() => handleSendOtp()}
                    className="text-[11px] text-[#EE0979] hover:underline"
                  >
                    Forgot Password / OTP Login?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={async () => {
                  setErrorMsg(null);
                  setStatusMsg(null);
                  setIsSubmitting(true);
                  try {
                    const res = await login(email, password);
                    if (res.otpRequired) {
                      if (res.devHint) setGeneratedOtp(res.devHint);
                      setMode('otp');
                      setStatusMsg(`Verification OTP sent to ${res.email || email} to your inbox!`);
                    } else if (res.success && res.token) {
                      setStatusMsg(`Signed in successfully as ${res.user?.name || email}!`);
                      setTimeout(() => {
                        setStatusMsg(null);
                        setIsAuthModalOpen(false);
                      }, 900);
                    } else {
                      setErrorMsg(res.message || 'Authentication failed. Please check credentials.');
                    }
                  } catch (err: any) {
                    setErrorMsg(err.message || 'Error occurred during login.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="w-full py-2.5 bg-[#EE0979] hover:bg-[#EE0979] disabled:opacity-50 text-white rounded-lg font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Continue with Email OTP</span>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: CREATE ORG / SIGN UP */}
          {mode === 'signup' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Organization Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg"
                    placeholder="e.g. Acme Global Technologies"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Optional"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Password (min 5 chars)"
                />
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={async () => {
                  setErrorMsg(null);
                  setStatusMsg(null);
                  setIsSubmitting(true);
                  try {
                    const res = await signup({
                      fullName: name,
                      email,
                      password: password || 'admin123',
                      companyName: company,
                      phone: phone || undefined,
                      role: 'admin',
                    });
                    if (res.otpRequired) {
                      if (res.devHint) setGeneratedOtp(res.devHint);
                      setMode('otp');
                      setStatusMsg(`Verification OTP sent to ${res.email || email} to your inbox!`);
                    } else if (res.success && res.token) {
                      setStatusMsg(`Organization created! Welcome ${res.user?.name || name}!`);
                      setTimeout(() => {
                        setStatusMsg(null);
                        setIsAuthModalOpen(false);
                      }, 1000);
                    } else {
                      setErrorMsg(res.message || 'Registration failed. Email may already be in use.');
                    }
                  } catch (err: any) {
                    setErrorMsg(err.message || 'Error occurred during registration.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="w-full py-2.5 bg-[#EE0979] hover:bg-[#D8086C] disabled:opacity-50 text-white rounded-lg font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Send Email OTP & Verify</span>
                )}
              </button>
            </div>
          )}

          {/* TAB 4: OTP VERIFICATION */}
          {mode === 'otp' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">Enter Security OTP Code</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 6-digit verification code to <strong>{phone || email}</strong>
                </p>
                <div className="mt-2 inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold rounded">
                  Demo Auto-fill OTP: {generatedOtp}
                </div>
              </div>

              {/* 6 digits input */}
              <div className="flex justify-center gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-bold font-mono border-2 rounded-lg border-slate-300 focus:border-[#EE0979] focus:ring-2 focus:ring-blue-100"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setOtpCode(generatedOtp.split(''));
                  }}
                  className="text-xs text-[#EE0979] hover:underline font-semibold"
                >
                  ⚡ Auto-fill Code
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => handleSendOtp()}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full py-2.5 bg-[#EE0979] hover:bg-[#EE0979] text-white rounded-lg font-bold shadow-sm transition text-xs"
              >
                Verify & Continue
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate max-w-[240px]">
            <span>User:</span>
            <strong className="text-slate-800 truncate">{currentUser?.email || 'Guest'}</strong>
          </div>
          {isAuthenticated ? (
            <button
              onClick={async () => {
                await logout();
                setIsAuthModalOpen(false);
              }}
              className="text-rose-600 hover:text-rose-700 font-bold transition cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <span className="font-semibold text-[#EE0979]">Secure 256-bit TLS</span>
          )}
        </div>
      </div>
    </div>
  );
};
