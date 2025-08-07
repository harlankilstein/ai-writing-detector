```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get Stripe publishable key from backend
        const response = await fetch(`${BACKEND_URL}/api/stripe/config`);
        const { publishable_key } = await response.json();

        // Initialize Stripe
        const stripeInstance = await loadStripe(publishable_key);
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, [BACKEND_URL]);

  const createCheckoutSession = async (priceId, token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-cancelled`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create checkout session');
      }

      const { checkout_url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = checkout_url;

    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const getSubscriptionInfo = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stripe/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get subscription info');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription info error:', error);
      return { has_active_subscription: false };
    }
  };

  const value = {
    stripe,
    loading,
    createCheckoutSession,
    getSubscriptionInfo,
    // Stripe price IDs - LIVE PRODUCTION PRICES
    priceIds: {
      pro: 'price_1Rta7fGxbXNfm3xszfM9Xanr', // $29.95/year LIVE
      business: 'price_1Rta8FGxbXNfm3xsX4SgFsYJ'  // $67/month LIVE
    }
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};
```
