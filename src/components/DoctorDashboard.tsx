
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientRecord from './PatientRecord';
import { toast } from 'sonner';
import { doctorAPI } from '@/lib/api';

// Define the interfaces for our data types
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

interface Doctor {
  _id?: string;
  doctorId: string;
  name: string;
  specialization: string;
  hospital: string;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patientId, setPatientId] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showPrescribeForm, setShowPrescribeForm] = useState(false);
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    medications: '',
    instructions: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Check if doctor is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const doctorInfo = localStorage.getItem('doctorInfo');
        
        if (!doctorInfo) {
          toast.error('Please log in to access the dashboard');
          navigate('/doctor/login');
          return;
        }
        
        // Set doctor information from localStorage
        setDoctor(JSON.parse(doctorInfo));
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Authentication error');
        navigate('/doctor/login');
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handlePatientSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim()) {
      toast.error('Please enter a patient ID');
      return;
    }
    
    setLoading(true);
    setPatient(null);

    try {
      // Make an actual API call to fetch patient data
      const patientData = await doctorAPI.getPatientByID(patientId);
      setPatient(patientData);
      toast.success('Patient record found');
    } catch (error: any) {
      console.error('Patient search error:', error);
      setPatient(null);
      toast.error(error.response?.data?.message || 'Patient not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrescription(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patient || !doctor) return;
    
    try {
      const prescriptionData = {
        ...prescription,
        doctor: doctor.name
      };
      
      // Send the prescription to the backend
      await doctorAPI.addPrescription(patient.patientId, prescriptionData);
      
      toast.success('Prescription added successfully');
      setShowPrescribeForm(false);
      
      // Refresh patient data to show the new prescription
      const updatedPatient = await doctorAPI.getPatientByID(patient.patientId);
      setPatient(updatedPatient);
      
      // Reset the prescription form
      setPrescription({
        diagnosis: '',
        medications: '',
        instructions: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error: any) {
      console.error('Add prescription error:', error);
      toast.error(error.response?.data?.message || 'Failed to add prescription');
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-16 h-16 border-4 border-t-medical-green border-b-medical-green border-r-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-medical-green font-medium">Loading doctor profile...</p>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-800">Authentication Error</p>
        <p className="text-gray-500 mb-2">Please try logging in again</p>
        <Button onClick={() => navigate('/doctor/login')} className="bg-medical-green hover:bg-medical-green/90 min-w-[180px]">
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
        backgroundImage: `linear-gradient(120deg, rgba(255, 255, 255, 0.95), rgba(240, 255, 244, 0.9))`,
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div className="flex items-center gap-3">
          <div className="bg-medical-green/10 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-medical-green">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-500">Manage patient records and prescriptions</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white py-3 px-4 rounded-full shadow-sm border border-gray-50">
          <div className="text-right">
            <p className="font-medium text-gray-900">{doctor.name}</p>
            <p className="text-sm text-gray-500">{doctor.specialization}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-green to-teal-400 text-white flex items-center justify-center font-medium shadow-md">
            {doctor.name.split(' ')[0]?.charAt(0) || ''}{doctor.name.split(' ')[1]?.charAt(0) || ''}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-medical-green/10 to-white border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-medical-green/20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-green">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <CardTitle>Patient Lookup</CardTitle>
          </div>
          <CardDescription>Enter a patient's ID to access their records</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handlePatientSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Label htmlFor="patientId" className="sr-only">
                Patient ID
              </Label>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Input
                id="patientId"
                className="pl-10 border-gray-200 focus:border-medical-green focus:ring-medical-green/20"
                placeholder="Enter patient ID (try P123456)"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-medical-green hover:bg-medical-green/90 text-white min-w-[100px] transition-all duration-200 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {patient && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-medical-blue/10 flex items-center justify-center text-medical-blue">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              Patient: {patient.name} ({patient.patientId})
            </h2>
            <Button 
              onClick={() => setShowPrescribeForm(!showPrescribeForm)}
              className={`transition-all duration-300 flex items-center gap-2 ${showPrescribeForm ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-medical-green hover:bg-medical-green/90 text-white'}`}
            >
              {showPrescribeForm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Prescribe Medicine
                </>
              )}
            </Button>
          </div>

          {showPrescribeForm && (
            <Card className="overflow-hidden border-medical-green/20 shadow-md transition-all duration-300 animate-fadeIn">
              <CardHeader className="bg-gradient-to-r from-medical-green/10 to-white border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-medical-green/20 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-green">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <CardTitle>Add New Prescription</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <form onSubmit={handleAddPrescription} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis" className="flex items-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-green">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Diagnosis
                    </Label>
                    <Input
                      id="diagnosis"
                      name="diagnosis"
                      placeholder="Enter diagnosis"
                      value={prescription.diagnosis}
                      onChange={handlePrescriptionChange}
                      className="border-gray-200 focus:border-medical-green focus:ring-medical-green/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications" className="flex items-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-green">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Medications
                    </Label>
                    <Input
                      id="medications"
                      name="medications"
                      placeholder="Enter medication names and dosages"
                      value={prescription.medications}
                      onChange={handlePrescriptionChange}
                      className="border-gray-200 focus:border-medical-green focus:ring-medical-green/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="flex items-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-green">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Instructions
                    </Label>
                    <Input
                      id="instructions"
                      name="instructions"
                      placeholder="Enter instructions for the patient"
                      value={prescription.instructions}
                      onChange={handlePrescriptionChange}
                      className="border-gray-200 focus:border-medical-green focus:ring-medical-green/20"
                      required
                    />
                  </div>
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="bg-medical-green hover:bg-medical-green/90 text-white shadow-sm flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Add Prescription
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
              <TabsTrigger value="overview">Patient Overview</TabsTrigger>
              <TabsTrigger value="record">Edit Record</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="overflow-hidden border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-medical-blue/10 to-white border-b">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-medical-blue/20 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-blue">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    <div className="space-y-2">
                      <div className="flex items-center border-b border-dashed border-gray-100 pb-1">
                        <div className="w-1/3 text-sm font-medium text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-blue/70">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Name:
                        </div>
                        <div className="w-2/3 text-sm font-medium text-gray-800">{patient.name}</div>
                      </div>
                      <div className="flex items-center border-b border-dashed border-gray-100 pb-1">
                        <div className="w-1/3 text-sm font-medium text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-blue/70">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Age:
                        </div>
                        <div className="w-2/3 text-sm font-medium text-gray-800">{patient.age} years</div>
                      </div>
                      <div className="flex items-center border-b border-dashed border-gray-100 pb-1">
                        <div className="w-1/3 text-sm font-medium text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-blue/70">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Gender:
                        </div>
                        <div className="w-2/3 text-sm font-medium text-gray-800">{patient.gender}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-blue/70">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          Patient ID:
                        </div>
                        <div className="w-2/3 text-sm font-medium text-gray-800">
                          <span className="px-2 py-1 bg-medical-blue/5 rounded-md border border-medical-blue/10">{patient.patientId}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-red-50 to-white border-b">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-red-500">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <CardTitle className="text-lg">Allergies</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    {patient.allergies ? (
                      <div className="p-2 bg-red-50 rounded-md border border-red-100 text-sm font-medium text-red-700">
                        {patient.allergies}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 text-sm p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        No allergies recorded
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2 overflow-hidden border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-medical-green/10 to-white border-b">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-medical-green/20 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-green">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <CardTitle className="text-lg">Current Medications</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    {patient.ongoingMedications ? (
                      <div className="space-y-2">
                        {patient.ongoingMedications.split('\n').map((med, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-medical-green/5 rounded-md border border-medical-green/10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-green mt-0.5">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                            </svg>
                            <p className="text-sm font-medium text-gray-700">{med}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 text-sm p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        No current medications
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2 overflow-hidden border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-medical-blue/10 to-white border-b">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-medical-blue/20 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-medical-blue">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <CardTitle className="text-lg">Prescription History</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    {patient.prescriptions.length > 0 ? (
                      <div className="space-y-4">
                        {patient.prescriptions.map((prescription) => (
                          <div key={prescription._id} className="p-4 border border-medical-blue/10 rounded-lg bg-medical-blue/5 hover:shadow-sm transition-all duration-200">
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-dashed border-medical-blue/10">
                              <span className="font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-medical-blue">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {prescription.date}
                              </span>
                              <span className="text-sm bg-medical-blue text-white px-2 py-1 rounded-full">{prescription.doctor}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="p-3 bg-white rounded-md border border-gray-100">
                                <p className="font-medium flex items-center gap-1 mb-1 text-medical-blue">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Diagnosis:
                                </p>
                                <p className="ml-5 text-gray-700">{prescription.diagnosis}</p>
                              </div>
                              <div className="p-3 bg-white rounded-md border border-gray-100">
                                <p className="font-medium flex items-center gap-1 mb-1 text-medical-green">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                  </svg>
                                  Medications:
                                </p>
                                <p className="ml-5 text-gray-700">{prescription.medications}</p>
                              </div>
                            </div>
                            <div className="mt-3 text-sm p-3 bg-white rounded-md border border-gray-100">
                              <p className="font-medium flex items-center gap-1 mb-1 text-amber-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Instructions:
                              </p>
                              <p className="ml-5 text-gray-700">{prescription.instructions}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-gray-500 p-6 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        No prescriptions available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="record">
              <PatientRecord patient={patient} readOnly={false} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
