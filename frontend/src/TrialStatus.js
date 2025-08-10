import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import UpgradeModal from './UpgradeModal';

const TrialStatus = () => {
  const { user, getTrialDaysLeft, isTrialExpired } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!user || user.subscription_status !== 'trial') {
    return null;
  }

  const daysLeft = getTrialDaysLeft();
  const expired = isTrialExpired();

  if (expired) {
    return (
      <>
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-red-800">Trial Expired</h3>
              <p className="text-red-700">Your free trial has ended. Upgrade to continue using all features.</p>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </>
    );
  }

  const getStatusColor = () => {
    if (daysLeft <= 1) return 'bg-red-50 border-red-200 text-red-700';
    if (daysLeft <= 2) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  const getButtonColor = () => {
    if (daysLeft <= 1) return 'bg-red-600 hover:bg-red-700';
    if (daysLeft <= 2) return 'bg-yellow-600 hover:bg-yellow-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <>
      <div className={`mb-6 p-4 border rounded-lg ${getStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">
              {daysLeft > 1 ? `${daysLeft} days left` : daysLeft === 1 ? '1 day left' : 'Less than 1 day left'} in your free trial
            </h3>
            <p className="text-sm">
              Enjoying the AI Writing Detector? Upgrade for unlimited access and premium features.
            </p>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${getButtonColor()}`}
          >
            {daysLeft <= 1 ? 'Upgrade Now' : 'View Plans'}
          </button>
        </div>
      </div>
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </>
  );
};

export default TrialStatus;
