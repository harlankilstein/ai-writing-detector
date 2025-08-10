import React, { useState } from 'react';
import { X, Crown, Building2, Check, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useStripe } from './StripeContext';

const UpgradeModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, user } = useAuth();
  const { createCheckoutSession, priceIds } = useStripe();

  if (!isOpen) return null;

  const handleUpgrade = async (plan) => {
    setLoading(true);
    setError('');

    try {
      const priceId = plan === 'pro' ? priceIds.pro : priceIds.business;
      await createCheckoutSession(priceId, token);
    } catch (err) {
      setError(err.message || 'Failed to start checkout process');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-blue-200 rounded-lg p-6 relative bg-blue-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <Crown className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  $29.95<span className="text-lg font-normal text-gray-600">/year</span>
                </div>
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
                  <span className="text-sm text-gray-700">Advanced pattern analysis</span>
                </div>
              </div>

              <button
                onClick={() => handleUpgrade('pro')}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : null}
                {loading ? 'Processing...' : 'Choose Pro Plan'}
              </button>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
              <div className="text-center mb-6">
                <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Plan</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $67<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Everything in Pro</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">Priority processing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">API access</span>
                </div>
              </div>

              <button
                onClick={() => handleUpgrade('business')}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : null}
                {loading ? 'Processing...' : 'Choose Business Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
