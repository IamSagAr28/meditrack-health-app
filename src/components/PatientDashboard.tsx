
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientRecord from './PatientRecord';
import { patientAPI } from '@/lib/api';
import { toast } from 'sonner';

// Define the Patient interface to match our MongoDB model
interface Prescription {
  _id?: string;
  date: string;
  doctor: string;
  medications: string;
  instructions: string;
  diagnosis: string;
}

interface Patient {
  _id?: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  allergies: string;
  medicalHistory: string;
  ongoingMedications: string;
  hereditaryDiseases: string;
  prescriptions: Prescription[];
}

const PatientDashboard = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Get patient info from localStorage
        const patientInfo = localStorage.getItem('patientInfo');
        
        if (!patientInfo) {
          // If not logged in, redirect to login page
          toast.error('Please log in to access your dashboard');
          navigate('/patient/login');
          return;
        }
        
        const { patientId } = JSON.parse(patientInfo);
        
        // Fetch patient data using the API
        const data = await patientAPI.getPatientData(patientId);
        setPatient(data);
      } catch (error: any) {
        toast.error('Failed to load patient data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-16 h-16 border-4 border-t-medical-blue border-b-medical-blue border-r-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-medical-blue font-medium">Loading your medical records...</p>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-800">Failed to load patient data</p>
        <p className="text-gray-500 mb-2">Please try logging in again</p>
        <Button onClick={() => navigate('/patient/login')} className="bg-medical-blue hover:bg-medical-blue/90 min-w-[180px]">
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{
      backgroundImage: `url('https://www.transparenttextures.com/patterns/medical-pattern.png')`,
      backgroundSize: '200px',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'repeat'
    }}>
      <div className="flex justify-between items-center bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-sm mb-8" style={{
        backgroundImage: `linear-gradient(120deg, rgba(255, 255, 255, 0.95), rgba(240, 249, 255, 0.9))`,
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div className="flex items-center gap-3">
          <div className="bg-medical-blue/10 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-medical-blue">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-500">View your medical records and prescriptions</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white py-3 px-4 rounded-full shadow-sm border border-gray-50">
          <div className="text-right">
            <p className="font-medium text-gray-900">{patient.name}</p>
            <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-blue to-medical-lightblue text-white flex items-center justify-center font-medium shadow-md">
            {patient.name.charAt(0)}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 overflow-hidden">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Overview
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="record" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Full Record
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="transition-all duration-300 hover:shadow-lg border-gray-100 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-medical-lightblue/10 to-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-medical-blue/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-4 mt-2">
                  <div className="text-sm font-medium text-gray-600">Name:</div>
                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                  <div className="text-sm font-medium text-gray-600">Age:</div>
                  <div className="text-sm font-medium text-gray-900">{patient.age}</div>
                  <div className="text-sm font-medium text-gray-600">Gender:</div>
                  <div className="text-sm font-medium text-gray-900">{patient.gender}</div>
                  <div className="text-sm font-medium text-gray-600">Patient ID:</div>
                  <div className="text-sm font-medium text-gray-900">{patient.patientId}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-lg border-gray-100 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-red-50 to-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-red-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">Allergies</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 p-3 rounded-lg border border-dashed border-red-200 bg-red-50/30">
                  <p className="text-sm font-medium text-gray-800">{patient.allergies || 'No allergies recorded'}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 transition-all duration-300 hover:shadow-lg border-gray-100 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-medical-green/10 to-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-medical-green/20 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-green">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">Current Medications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 p-4 rounded-lg border border-dashed border-medical-green/40 bg-medical-green/5">
                  <p className="text-sm font-medium text-gray-800 whitespace-pre-line">
                    {patient.ongoingMedications || 'No current medications'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-4">
          <Card className="border-gray-100 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-medical-blue/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle>Prescriptions</CardTitle>
              </div>
              <CardDescription>History of prescriptions ordered by your doctors</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {patient.prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {patient.prescriptions.map((prescription, index) => (
                    <div key={prescription._id || index} className="p-5 border border-gray-200 hover:border-medical-blue/30 rounded-lg bg-white hover:bg-blue-50/30 shadow-sm hover:shadow transition-all duration-200 mb-4">
                      <div className="flex justify-between mb-4 pb-2 border-b border-dashed border-gray-200">
                        <span className="font-medium flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {prescription.date}
                        </span>
                        <span className="text-sm bg-medical-blue/10 text-medical-blue px-3 py-1 rounded-full flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {prescription.doctor}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-blue">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Diagnosis:
                          </p>
                          <p className="pl-6 text-gray-900">{prescription.diagnosis}</p>
                        </div>
                        <div className="p-3 bg-green-50/50 rounded-lg">
                          <p className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-green">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Medications:
                          </p>
                          <p className="pl-6 text-gray-900">{prescription.medications}</p>
                        </div>
                      </div>
                      <div className="mt-4 text-sm p-3 bg-blue-50/50 rounded-lg border border-dashed border-medical-blue/30">
                        <p className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-blue">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Instructions:
                        </p>
                        <p className="pl-6 text-gray-900">{prescription.instructions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No prescriptions available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="record">
          <PatientRecord patient={patient} readOnly={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;
