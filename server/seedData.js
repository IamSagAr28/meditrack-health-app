import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';
import Doctor from './models/Doctor.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    const connection = await connectDB();
    
    // Clear existing data
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create a sample patient
    const patient = await Patient.create({
      patientId: 'P123456',
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      email: 'patient@example.com',
      password: hashedPassword,
      allergies: 'Penicillin, Peanuts',
      medicalHistory: 'Appendectomy (2018), Hypertension (Diagnosed 2019)',
      ongoingMedications: 'Lisinopril 10mg daily, Atorvastatin 20mg daily',
      hereditaryDiseases: 'Father: Diabetes, Mother: Hypertension',
      prescriptions: [
        { 
          date: '2023-04-15', 
          doctor: 'Dr. Sarah Johnson', 
          medications: 'Amoxicillin 500mg', 
          instructions: 'Take 1 tablet 3 times daily for 7 days', 
          diagnosis: 'Bacterial infection' 
        },
        { 
          date: '2023-02-20', 
          doctor: 'Dr. Michael Chen', 
          medications: 'Ibuprofen 400mg', 
          instructions: 'Take 1 tablet every 6 hours as needed for pain', 
          diagnosis: 'Lower back pain' 
        }
      ]
    });
    
    // Create a sample doctor
    const doctor = await Doctor.create({
      doctorId: 'D789012',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      hospital: 'Central Medical Center',
      email: 'doctor@example.com',
      password: hashedPassword
    });
    
    console.log('Sample data has been seeded successfully!');
    console.log('Sample Patient ID:', patient.patientId);
    console.log('Sample Patient Email: patient@example.com');
    console.log('Sample Doctor ID:', doctor.doctorId);
    console.log('Sample Doctor Email: doctor@example.com');
    console.log('Password for both accounts: password123');
    
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

// Run the seeding function
seedData();
