import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout className="pb-0">
      {/* Hero section with background image */}
      <div 
        className="relative -mt-20 px-4 py-32 bg-cover bg-center" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center container mx-auto">
          <div className="flex-1 space-y-6 pb-10 z-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Simplifying Medical Records<br />
              <span className="text-medical-blue">For Patients & Doctors</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              MediTrack offers a streamlined solution for managing health records, enabling secure access and efficient communication between patients and healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/patient/login">
                <Button className="bg-medical-blue hover:bg-medical-blue/90 min-w-32">
                  Patient Login
                </Button>
              </Link>
              <Link to="/doctor/login">
                <Button variant="outline" className="text-medical-blue border-medical-blue hover:bg-medical-blue/10 min-w-32">
                  Doctor Login
                </Button>
              </Link>
              <a href="http://localhost:5001/chatbot" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="bg-medical-green text-white hover:bg-medical-green/90 min-w-32 ml-0 sm:ml-4 mt-4 sm:mt-0">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                  Chat with AI Assistant
                </Button>
              </a>
            </div>
            <div className="pt-4">
              <ul className="flex flex-col md:flex-row gap-y-2 md:gap-x-8 text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-medical-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Secure Medical Records
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-medical-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Easy Access for Doctors
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-medical-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Prescription Management
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-1 md:pl-10">
            <div className="rounded-lg overflow-hidden shadow-2xl bg-white">
              <div className="h-64 md:h-80 bg-medical-blue/10 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-white rounded-lg shadow-lg p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-sm font-bold">P</div>
                    <div className="ml-2">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-2 bg-gray-100 rounded w-16 mt-1"></div>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 mt-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <div className="h-6 bg-medical-blue/20 rounded w-20"></div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold text-gray-900">Intuitive Interface</h3>
                <p className="text-gray-600 mt-2">Our clean, easy-to-use dashboard makes managing health records simple for both patients and healthcare providers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How it works section */}
      <div className="mt-20 md:mt-32 text-center px-4" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.97)), url('https://www.transparenttextures.com/patterns/medical-icons.png')`,
        backgroundSize: '300px 300px',
        backgroundRepeat: 'repeat',
        padding: '3rem 0'
      }}>
        <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.2)' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Register" className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-semibold">Register as a Patient</h3>
            <p className="text-gray-600">Create an account and receive a unique patient ID that securely links to your medical records.</p>
          </div>
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ boxShadow: '0 0 15px rgba(5, 150, 105, 0.2)' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3774/3774089.png" alt="Access Records" className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-semibold">Access Your Records</h3>
            <p className="text-gray-600">View your complete medical history, prescriptions, and ongoing treatments anytime, anywhere.</p>
          </div>
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ boxShadow: '0 0 15px rgba(96, 165, 250, 0.2)' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3774/3774091.png" alt="Doctor Communication" className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-semibold">Doctor Communication</h3>
            <p className="text-gray-600">Healthcare providers can securely access your information using your patient ID to provide better care.</p>
          </div>
        </div>
      </div>
      
      {/* Get started section */}
      <div className="bg-gray-50 -mx-4 px-4 py-16 mt-20 md:mt-32" style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.92), rgba(249, 250, 251, 0.92)), url('https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="container mx-auto text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          <img src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png" alt="Get Started" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
            Join thousands of patients and healthcare providers who are simplifying medical record management with MediTrack.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/patient/register">
              <Button className="bg-medical-blue hover:bg-medical-blue/90 min-w-44">
                Register as Patient
              </Button>
            </Link>
            <Link to="/doctor/register">
              <Button className="bg-medical-green hover:bg-medical-green/90 min-w-44">
                Register as Doctor
              </Button>
            </Link>
          </div>
          <div className="mt-4">
            <a href="http://localhost:5001/chatbot" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-medical-lightblue text-medical-blue hover:bg-medical-lightblue/10">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                Have Questions? Chat with our AI Assistant
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
