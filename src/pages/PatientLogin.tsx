
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';
import PatientRegistration from '@/components/PatientRegistration';

const PatientLogin = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat" 
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(240, 249, 255, 0.85)), url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
      }}
    >
      <Layout className="flex-1 flex items-center justify-center py-10">
      <div className="w-full max-w-4xl px-4">
        <div className="mb-8 text-center">
          <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Patient Portal" className="w-16 h-16 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-medical-blue mb-2">Patient Portal</h1>
          <p className="text-gray-600">Access your health records securely</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-1">
          {showLogin ? (
            <LoginForm 
              userType="patient" 
              onRegisterClick={() => setShowLogin(false)} 
            />
          ) : (
            <PatientRegistration 
              onLoginClick={() => setShowLogin(true)} 
            />
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help accessing your account? Contact support at support@meditrack.com</p>
        </div>
      </div>
    </Layout>
    </div>
  );
};

export default PatientLogin;
