import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const AuthModal = ({ isOpen, onClose, mode: initialMode = 'signup' }) => {
  const [mode, setMode] = useState(initialMode); // 'signup', 'login', or 'forgot-password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signup, login } = useAuth();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        await signup(email, password, name);
        onClose();
      } else if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'forgot-password') {
        await handleForgotPassword();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send reset email');
      }

      const data = await response.json();
      setSuccess(data.message);
      setEmail(''); // Clear email field after success
    } catch (error) {
      throw error;
    }
  };

  const switchMode = () => {
    if (mode === 'signup') setMode('login');
    else if (mode === 'login') setMode('signup');
    else if (mode === 'forgot-password') setMode('login');
    setError('');
    setSuccess('');
    setName(''); // Clear name when switching modes
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'signup' ? 'Start Your Free Trial' : 
             mode === 'login' ? 'Welcome Back' : 'Reset Your Password'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'signup' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">3-Day Free Trial</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Unlimited document analysis</li>
                    <li>• Google Docs integration</li>
                    <li>• Full access to all features</li>
                    <li>• No credit card required</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {mode === 'forgot-password' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Name field for signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            {mode !== 'forgot-password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={mode === 'signup' ? 'Create a password (6+ characters)' : 'Enter your password'}
                    minLength={6}
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || (mode !== 'forgot-password' && !password) || (mode === 'signup' && !name)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {mode === 'signup' ? 'Creating Account...' : 
                   mode === 'login' ? 'Signing In...' : 'Sending Reset Link...'}
                </div>
              ) : (
                mode === 'signup' ? 'Start Free Trial' : 
                mode === 'login' ? 'Sign In' : 'Send Reset Link'
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            {mode === 'forgot-password' ? (
              <p className="text-sm text-gray-600">
                Remember your password?
                <button
                  onClick={() => setMode('login')}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <>
                {mode === 'login' && (
                  <p className="text-sm text-gray-600 mb-3">
                    <button
                      onClick={() => setMode('forgot-password')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot your password?
                    </button>
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={switchMode}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {mode === 'signup' ? 'Sign In' : 'Start Free Trial'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
