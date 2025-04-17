
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { patientAPI, doctorAPI } from '@/lib/api';

interface PatientRecordProps {
  patient: {
    patientId: string;
    name: string;
    age: number;
    gender: string;
    allergies: string;
    medicalHistory: string;
    ongoingMedications: string;
    hereditaryDiseases: string;
  };
  readOnly: boolean;
}

const PatientRecord = ({ patient, readOnly }: PatientRecordProps) => {
  const [formData, setFormData] = useState({
    allergies: patient.allergies,
    medicalHistory: patient.medicalHistory,
    ongoingMedications: patient.ongoingMedications,
    hereditaryDiseases: patient.hereditaryDiseases
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (readOnly) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    
    setLoading(true);
    
    try {
      // Get doctor or patient info from localStorage to determine which API to use
      const doctorInfo = localStorage.getItem('doctorInfo');
      const patientInfo = localStorage.getItem('patientInfo');
      
      if (doctorInfo) {
        // Use doctor API to update patient record
        await doctorAPI.updatePatientRecord(patient.patientId, formData);
      } else if (patientInfo) {
        // Use patient API to update own record
        await patientAPI.updatePatientRecord(patient.patientId, formData);
      }
      
      toast.success('Patient record updated successfully');
    } catch (error: any) {
      console.error('Error updating record:', error);
      toast.error(error.response?.data?.message || 'Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Medical Record</CardTitle>
        <CardDescription>
          {readOnly 
            ? 'View your complete medical record' 
            : 'Update patient medical information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={patient.name}
                readOnly
                className={readOnly ? "bg-gray-50" : ""}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={patient.age}
                  readOnly
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={patient.gender}
                  readOnly
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50 resize-none" : ""}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50 resize-none" : ""}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ongoingMedications">Ongoing Medications</Label>
            <Textarea
              id="ongoingMedications"
              name="ongoingMedications"
              value={formData.ongoingMedications}
              onChange={handleChange}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50 resize-none" : ""}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hereditaryDiseases">Hereditary Diseases</Label>
            <Textarea
              id="hereditaryDiseases"
              name="hereditaryDiseases"
              value={formData.hereditaryDiseases}
              onChange={handleChange}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50 resize-none" : ""}
              rows={3}
            />
          </div>
          
          {!readOnly && (
            <Button 
              type="submit" 
              className="w-full bg-medical-blue hover:bg-medical-blue/90"
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientRecord;
