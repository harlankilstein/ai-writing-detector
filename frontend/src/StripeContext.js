import React, { createContext, useContext, useState, useEffect } from 'react';

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Production price IDs from your Stripe account
  const priceIds = {
    pro: 'price_1Rta7fGxbXNfm3xszfM9Xanr',
    business: 'price_1Rta8FGxbXNfm3xsX4SgFsYJ'
  };

  const createCheckoutSession = async (priceId, token) => {
    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL + '/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: window.location.origin + '/success',
          cancel_url: window.location.origin + '/cancel'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create checkout session');
      }

      const { checkout_url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = checkout_url;
      
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value = {
    loading,
    priceIds,
    createCheckoutSession
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};
