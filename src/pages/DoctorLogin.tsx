
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';
import DoctorRegistration from '@/components/DoctorRegistration';

const DoctorLogin = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat" 
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(240, 248, 255, 0.85)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
      }}
    >
      <Layout className="flex-1 flex items-center justify-center py-10">
      <div className="w-full max-w-4xl px-4">
        <div className="mb-8 text-center">
          <img src="https://cdn-icons-png.flaticon.com/512/3774/3774091.png" alt="Doctor Portal" className="w-16 h-16 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-medical-blue mb-2">Physician Portal</h1>
          <p className="text-gray-600">Access your patient records and medical dashboard</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-1">
          {showLogin ? (
            <LoginForm 
              userType="doctor" 
              onRegisterClick={() => setShowLogin(false)} 
            />
          ) : (
            <DoctorRegistration 
              onLoginClick={() => setShowLogin(true)} 
            />
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>For professional assistance, contact the IT department at medstaff@meditrack.com</p>
        </div>
      </div>
    </Layout>
    </div>
  );
};

export default DoctorLogin;
