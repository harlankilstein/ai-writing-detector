import React, { useState } from 'react';
import { X, Crown, Check, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useStripe } from './StripeContext';

const UpgradeModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, user } = useAuth();
  const { createCheckoutSession, priceIds } = useStripe();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      await createCheckoutSession(priceIds.pro, token);
    } catch (err) {
      setError(err.message || 'Failed to start checkout process');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.subscription_status === 'trial' ? 'Upgrade Your Account' : 'Choose Your Plan'}
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
          {user?.subscription_status === 'trial' && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-800 mb-1">Trial Ending Soon</h3>
                  <p className="text-sm text-orange-700">
                    Choose a plan to continue your unlimited access to AI writing detection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Pricing Plan */}
          <div className="flex justify-center">
            {/* Pro Plan */}
            <div className="border-2 border-blue-200 rounded-lg p-6 relative bg-blue-50 max-w-md">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <Crown className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  $29.95
                  <span className="text-lg font-normal text-gray-600">/year</span>
                </div>
                <p className="text-sm text-gray-600">Just $2.49 per month</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Unlimited document analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Google Docs integration</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">All file formats (TXT, DOC, DOCX, RTF)</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Advanced pattern analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Usage analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Email support</span>
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {loading ? 'Processing...' : 'Choose Pro Plan'}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 mr-3">
                <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Secure Payment Processing</h4>
                <p className="text-sm text-gray-600">
                  Your payment is processed securely by Stripe. We never store your credit card information.
                  You can cancel or modify your subscription anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
