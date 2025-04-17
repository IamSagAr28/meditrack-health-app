import express from 'express';
import bcrypt from 'bcryptjs';
import Patient from '../models/Patient.js';

const router = express.Router();

// Test route to verify patient routes are working
router.get('/test', (req, res) => {
  console.log('Patient routes test endpoint hit');
  res.json({ message: 'Patient routes are working!' });
});

// Register a new patient
router.post('/register', async (req, res) => {
  try {
    console.log('Patient registration request received:', req.body);
    const { name, age, gender, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password: password ? 'provided' : 'missing' });
      return res.status(400).json({ message: 'Please provide all required fields: name, email, password' });
    }
    
    // Check if patient with this email already exists
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      console.log('Patient already exists with email:', email);
      return res.status(400).json({ message: 'Patient already exists with this email' });
    }
    
    // Generate patientId (in a real app, you might have a more sophisticated method)
    const patientIdPrefix = 'P';
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6 digit number
    const patientId = `${patientIdPrefix}${randomDigits}`;
    console.log('Generated patientId:', patientId);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create patient object with default values if needed
    const patientData = {
      patientId,
      name,
      age: age || 30, // Default age if not provided
      gender: gender || 'Not specified', // Default gender if not provided
      email,
      password: hashedPassword,
      allergies: '',
      medicalHistory: '',
      ongoingMedications: '',
      hereditaryDiseases: '',
      prescriptions: []
    };
    console.log('Creating patient with data:', { ...patientData, password: '[HIDDEN]' });
    
    // Create new patient
    const patient = await Patient.create(patientData);
    
    if (patient) {
      console.log('Patient created successfully:', patient.patientId);
      res.status(201).json({
        _id: patient._id,
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        email: patient.email,
      });
    } else {
      console.log('Failed to create patient');
      res.status(400).json({ message: 'Invalid patient data' });
    }
  } catch (error) {
    console.error('Patient registration error:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Login patient
router.post('/login', async (req, res) => {
  try {
    console.log('Patient login request received:', { email: req.body.email });
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Find patient by email
    const patient = await Patient.findOne({ email });
    
    if (!patient) {
      console.log('Login failed: Patient not found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, patient.password);
    
    if (isMatch) {
      console.log('Patient login successful:', patient.patientId);
      res.json({
        _id: patient._id,
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        email: patient.email,
      });
    } else {
      console.log('Login failed: Invalid password for email:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Patient login error:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get patient by ID
router.get('/:patientId', async (req, res) => {
  try {
    console.log('Get patient request received for ID:', req.params.patientId);
    
    // Find patient by patientId
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    
    if (patient) {
      console.log('Patient found:', patient.patientId);
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
      console.log('Patient not found with ID:', req.params.patientId);
      
      // For testing, check if any patients exist
      const count = await Patient.countDocuments({});
      console.log('Total patients in database:', count);
      
      // List available patient IDs to help debugging
      if (count > 0) {
        const patients = await Patient.find({}, 'patientId');
        console.log('Available patient IDs:', patients.map(p => p.patientId));
      }
      
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error('Get patient error:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update patient record
router.put('/:patientId', async (req, res) => {
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
      _id: updatedPatient._id,
      patientId: updatedPatient.patientId,
      name: updatedPatient.name,
      age: updatedPatient.age,
      gender: updatedPatient.gender,
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

// Add prescription to patient
router.post('/:patientId/prescriptions', async (req, res) => {
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
