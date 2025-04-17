
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { patientAPI } from '@/lib/api';

interface PatientRegistrationProps {
  onLoginClick: () => void;
}

const PatientRegistration = ({ onLoginClick }: PatientRegistrationProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Patient data state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    allergies: '',
    medicalHistory: '',
    ongoingMedications: '',
    hereditaryDiseases: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      // Convert age to number for MongoDB
      const patientData = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        allergies: formData.allergies,
        medicalHistory: formData.medicalHistory,
        ongoingMedications: formData.ongoingMedications,
        hereditaryDiseases: formData.hereditaryDiseases
      };
      
      // Register patient using the API
      const response = await patientAPI.register(patientData);
      
      toast.success('Registration successful!', {
        description: `Your Patient ID is: ${response.patientId}. Please save this for future logins.`,
        duration: 6000,
      });

      // Redirect to the login page after registration
      setTimeout(() => {
        onLoginClick();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Patient Registration
        </CardTitle>
        <CardDescription className="text-center">
          Complete the form to create your patient account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={step === 3 ? handleSubmit : undefined} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  placeholder="List any allergies you have (if none, write 'None')"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  placeholder="Briefly describe your medical history"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ongoingMedications">Ongoing Medications</Label>
                <Textarea
                  id="ongoingMedications"
                  name="ongoingMedications"
                  placeholder="List any medications you are currently taking (if none, write 'None')"
                  value={formData.ongoingMedications}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hereditaryDiseases">Hereditary Diseases</Label>
                <Textarea
                  id="hereditaryDiseases"
                  name="hereditaryDiseases"
                  placeholder="List any hereditary diseases in your family (if none, write 'None')"
                  value={formData.hereditaryDiseases}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline"
                onClick={prevStep}
              >
                Previous
              </Button>
            )}
            
            {step < 3 ? (
              <Button 
                type="button" 
                className="ml-auto bg-medical-blue hover:bg-medical-blue/90"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="ml-auto bg-medical-blue hover:bg-medical-blue/90"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <button 
            onClick={onLoginClick}
            className="text-medical-blue hover:underline"
          >
            Login
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default PatientRegistration;
