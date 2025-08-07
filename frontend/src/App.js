import React from 'react';
import './App.css';
import { AuthProvider } from './AuthContext';
import { StripeProvider } from './StripeContext';
import AIWritingDetector from './AIWritingDetector';

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <div className="App">
          <AIWritingDetector />
        </div>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;
