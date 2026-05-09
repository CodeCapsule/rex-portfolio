import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, ArrowRight, ShieldCheck, ShieldAlert, Mail, Key } from 'lucide-react';
import { sanitizeText, detectThreat } from '../utils/sanitize';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [securityWarning, setSecurityWarning] = useState('');
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleInputChange = (
    value: string,
    setter: (v: string) => void
  ) => {
    const threat = detectThreat(value);
    if (threat) {
      setSecurityWarning(`⚠️ Suspicious input detected: ${threat}. This attempt has been logged.`);
      return;
    }
    setSecurityWarning('');
    setter(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSecurityWarning('');

    // Sanitize inputs
    const cleanUsername = sanitizeText(username);
    const cleanPassword = password.trim();

    // Check for threats in credentials
    const usernameThreat = detectThreat(cleanUsername);
    const passwordThreat = detectThreat(cleanPassword);

    if (usernameThreat || passwordThreat) {
      setSecurityWarning('⚠️ Malicious input detected. This attempt has been logged.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRecoveryMessage(null);
    
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRecoveryMessage({ text: `Username: ${data.credentials.username} | Password: ${data.credentials.password}`, type: 'success' });
      } else {
        setRecoveryMessage({ text: data.error || 'Email not authorized.', type: 'error' });
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setRecoveryMessage({ text: `Connection error: ${err.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
               type="button"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                  isForgotPassword ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-500' : 'bg-accent/20 text-accent'
                }`}>
                  {isForgotPassword ? <Key size={32} /> : <ShieldCheck size={32} />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isForgotPassword ? 'Recover Password' : 'Admin Portal'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {isForgotPassword ? 'Enter your authorized email to recover your credentials.' : 'Please enter your credentials to access the dashboard'}
                </p>
              </div>

              {/* Security Warning */}
              {securityWarning && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-2xl text-orange-600 dark:text-orange-400 text-xs font-bold text-center flex items-center gap-2 justify-center"
                >
                  <ShieldAlert size={16} />
                  {securityWarning}
                </motion.div>
              )}

              {/* Error Message */}
              {error && !isForgotPassword && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Recovery Message */}
              {recoveryMessage && isForgotPassword && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 border rounded-2xl text-xs font-bold text-center ${
                    recoveryMessage.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50 text-red-600 dark:text-red-400'
                  }`}
                >
                  {recoveryMessage.text}
                </motion.div>
              )}

              {/* Form */}
              {isForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider ml-1 text-gray-400">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-gray-400 group-focus-within:text-blue-500">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        placeholder="Enter authorized email"
                        className="w-full border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all bg-gray-50 dark:bg-[#1a1a1a] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center pt-2">
                    <button type="button" onClick={() => { setIsForgotPassword(false); setRecoveryMessage(null); }} className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Back to Login
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-6 bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-blue-500/20"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        RECOVER CREDENTIALS <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider ml-1 text-gray-400">Username</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-gray-400 group-focus-within:text-accent">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => handleInputChange(e.target.value, setUsername)}
                        required
                        maxLength={50}
                        autoComplete="off"
                        placeholder="Enter username"
                        className="w-full border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all bg-gray-50 dark:bg-[#1a1a1a] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-accent/50 focus:border-accent dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider ml-1 text-gray-400">Password</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-gray-400 group-focus-within:text-accent">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => handleInputChange(e.target.value, setPassword)}
                        required
                        maxLength={128}
                        autoComplete="off"
                        placeholder="••••••••"
                        className="w-full border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all bg-gray-50 dark:bg-[#1a1a1a] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-accent/50 focus:border-accent dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Remember me</span>
                    </label>
                    <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); }} className="text-xs font-bold text-accent hover:underline">Forgot Password?</button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-6 bg-accent hover:bg-yellow-400 text-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-accent/20"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        SIGN IN <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-xs text-gray-400">
                  Authorized access only. All activities are logged.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
