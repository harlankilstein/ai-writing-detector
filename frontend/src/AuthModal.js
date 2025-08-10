import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const AuthModal = ({ isOpen, onClose, mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [localMode, setLocalMode] = useState(mode);
  
  const { signup, login } = useAuth();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Sync local mode with prop when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalMode(mode);
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (localMode === 'signup') {
        await signup(email, password);
        onClose();
      } else if (localMode === 'login') {
        await login(email, password);
        onClose();
      } else if (localMode === 'forgot-password') {
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
    if (localMode === 'signup') setLocalMode('login');
    else if (localMode === 'login') setLocalMode('signup');
    else if (localMode === 'forgot-password') setLocalMode('login');
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {localMode === 'signup' ? 'Start Your Free Trial' : 
             localMode === 'login' ? 'Welcome Back' : 'Reset Your Password'}
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
          {localMode === 'signup' && (
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

          {localMode === 'forgot-password' && (
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

            {/* Password */}
            {localMode !== 'forgot-password' && (
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
                    placeholder={localMode === 'signup' ? 'Create a password (6+ characters)' : 'Enter your password'}
                    minLength={6}
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || (localMode !== 'forgot-password' && !password)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {localMode === 'signup' ? 'Creating Account...' : 
                   localMode === 'login' ? 'Signing In...' : 'Sending Reset Link...'}
                </div>
              ) : (
                localMode === 'signup' ? 'Start Free Trial' : 
                localMode === 'login' ? 'Sign In' : 'Send Reset Link'
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            {localMode === 'forgot-password' ? (
              <p className="text-sm text-gray-600">
                Remember your password?
                <button
                  onClick={() => setLocalMode('login')}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <>
                {localMode === 'login' && (
                  <p className="text-sm text-gray-600 mb-3">
                    <button
                      onClick={() => setLocalMode('forgot-password')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot your password?
                    </button>
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {localMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={switchMode}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {localMode === 'signup' ? 'Sign In' : 'Start Free Trial'}
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
