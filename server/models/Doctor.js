import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true,
    unique: true
  },
  // Remove any other ID fields from the schema to avoid conflicts
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true,
    default: 'General Medicine'
  },
  hospital: {
    type: String,
    required: true,
    default: 'General Hospital'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
