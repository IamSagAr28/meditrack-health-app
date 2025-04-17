import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  medications: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  }
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  allergies: {
    type: String,
    default: ''
  },
  medicalHistory: {
    type: String,
    default: ''
  },
  ongoingMedications: {
    type: String,
    default: ''
  },
  hereditaryDiseases: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  prescriptions: [prescriptionSchema]
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
