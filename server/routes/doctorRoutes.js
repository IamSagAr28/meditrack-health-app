import express from 'express';
import bcrypt from 'bcryptjs';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

const router = express.Router();

// Register a new doctor
router.post('/register', async (req, res) => {
  try {
    console.log('Doctor registration request received:', req.body);
    const { name, specialization, hospital, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password: password ? 'provided' : 'missing' });
      return res.status(400).json({ message: 'Please provide all required fields: name, email, password' });
    }
    
    // Check if doctor with this email already exists
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      console.log('Doctor already exists with email:', email);
      return res.status(400).json({ message: 'Doctor already exists with this email' });
    }
    
    // Generate doctorId (in a real app, you might have a more sophisticated method)
    const doctorIdPrefix = 'D';
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6 digit number
    const doctorId = `${doctorIdPrefix}${randomDigits}`;
    console.log('Generated doctorId:', doctorId);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create doctor object with default values if needed
    const doctorData = {
      doctorId, // Use the generated doctorId
      name,
      specialization: specialization || 'General Medicine',
      hospital: hospital || 'General Hospital',
      email,
      password: hashedPassword
    };
    console.log('Creating doctor with data:', { ...doctorData, password: '[HIDDEN]' });
    
    // Create new doctor
    const doctor = await Doctor.create(doctorData);
    
    if (doctor) {
      console.log('Doctor created successfully:', doctor.doctorId);
      res.status(201).json({
        _id: doctor._id,
        doctorId: doctor.doctorId,
        name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        email: doctor.email,
      });
    } else {
      console.log('Failed to create doctor');
      res.status(400).json({ message: 'Invalid doctor data' });
    }
  } catch (error) {
    console.error('Doctor registration error:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Login doctor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find doctor by email
    const doctor = await Doctor.findOne({ email });
    
    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      res.json({
        _id: doctor._id,
        doctorId: doctor.doctorId,
        name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        email: doctor.email,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by ID (for doctors to access patient data)
router.get('/patients/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    
    if (patient) {
      res.json({
        _id: patient._id,
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        allergies: patient.allergies,
        medicalHistory: patient.medicalHistory,
        ongoingMedications: patient.ongoingMedications,
        hereditaryDiseases: patient.hereditaryDiseases,
        prescriptions: patient.prescriptions,
      });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient record (by doctor)
router.put('/patients/:patientId', async (req, res) => {
  try {
    const { allergies, medicalHistory, ongoingMedications, hereditaryDiseases } = req.body;
    
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patient.allergies = allergies || patient.allergies;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.ongoingMedications = ongoingMedications || patient.ongoingMedications;
    patient.hereditaryDiseases = hereditaryDiseases || patient.hereditaryDiseases;
    
    const updatedPatient = await patient.save();
    
    res.json({
      patientId: updatedPatient.patientId,
      name: updatedPatient.name,
      allergies: updatedPatient.allergies,
      medicalHistory: updatedPatient.medicalHistory,
      ongoingMedications: updatedPatient.ongoingMedications,
      hereditaryDiseases: updatedPatient.hereditaryDiseases,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add prescription to patient (by doctor)
router.post('/patients/:patientId/prescriptions', async (req, res) => {
  try {
    const { date, doctor, medications, instructions, diagnosis } = req.body;
    
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patient.prescriptions.push({
      date,
      doctor,
      medications,
      instructions,
      diagnosis
    });
    
    await patient.save();
    
    res.status(201).json(patient.prescriptions[patient.prescriptions.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
