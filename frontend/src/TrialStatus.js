```javascript
import React, { useState } from 'react';
import { Clock, Crown, AlertTriangle } from 'lucide-react';
import { useAuth } from './AuthContext';
import UpgradeModal from './UpgradeModal';

const TrialStatus = () => {
  const { user, getTrialDaysLeft, isTrialExpired } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!user) return null;

  const daysLeft = getTrialDaysLeft();
  const expired = isTrialExpired();

  if (user.subscription_status === 'active' || user.subscription_status === 'pro' || user.subscription_status === 'business') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Crown className="w-5 h-5 text-purple-600 mr-2" />
          <div>
            <p className="font-semibold text-purple-800">
              {user.subscription_status === 'pro' ? 'Pro Plan' : user.subscription_status === 'business' ? 'Business Plan' : 'Premium Plan'} Active
            </p>
            <p className="text-sm text-purple-600">Unlimited access to all features</p>
          </div>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <div className="flex-grow">
              <h3 className="font-semibold text-red-800 mb-1">Trial Expired</h3>
              <p className="text-sm text-red-700 mb-3">
                Your 3-day trial has ended. Upgrade now to continue analyzing documents.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-red-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Upgrade to Pro - $29.95/year
                </button>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gray-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Business Plan - $67/month
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </>
    );
  }

  if (user.subscription_status === 'trial') {
    const urgencyClass = daysLeft <= 1 ? 'from-orange-50 to-red-50 border-orange-200' : 'from-blue-50 to-green-50 border-blue-200';
    const textClass = daysLeft <= 1 ? 'text-orange-800' : 'text-blue-800';
    const iconClass = daysLeft <= 1 ? 'text-orange-600' : 'text-blue-600';

    return (
      <>
        <div className={`bg-gradient-to-r ${urgencyClass} border rounded-lg p-4 mb-6`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Clock className={`w-5 h-5 ${iconClass} mr-2`} />
              <div>
                <p className={`font-semibold ${textClass}`}>
                  {daysLeft > 0 ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in trial` : 'Trial expires today'}
                </p>
                <p className={`text-sm ${daysLeft <= 1 ? 'text-orange-600' : 'text-blue-600'}`}>
                  {daysLeft <= 1 ? 'Upgrade now to avoid interruption' : 'Enjoying unlimited access to all features'}
                </p>
              </div>
            </div>
            
            {daysLeft <= 1 && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Upgrade
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-600">
                ✨ <strong>Upgrade anytime:</strong> Pro Plan $29.95/year • Business Plan $67/month
              </p>
              {daysLeft > 1 && (
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  View Plans
                </button>
              )}
            </div>
          </div>
        </div>

        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </>
    );
  }

  return null;
};

export default TrialStatus;
```
