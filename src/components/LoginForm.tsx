import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { patientAPI, doctorAPI } from '@/lib/api';
import { toast } from 'sonner';

interface LoginFormProps {
  userType: 'patient' | 'doctor';
  onRegisterClick: () => void;
}

const LoginForm = ({ userType, onRegisterClick }: LoginFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (userType === 'patient') {
        await patientAPI.login(formData);
        navigate('/patient/dashboard');
      } else {
        await doctorAPI.login(formData);
        navigate('/doctor/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{userType === 'patient' ? 'Patient Login' : 'Doctor Login'}</CardTitle>
        <CardDescription>
          Enter your credentials to access your {userType === 'patient' ? 'medical records' : 'patient management dashboard'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-medical-blue hover:bg-medical-blue/90"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-gray-600">
          Don't have an account? 
          <Button variant="link" className="p-0 h-auto ml-1" onClick={onRegisterClick}>
            Register
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
