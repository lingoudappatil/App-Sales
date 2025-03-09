import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  phone: { type: String, required: [true, 'Phone is required'] },
  address: { type: String, required: [true, 'Address is required'] },
  state: { type: String, required: [true, 'State is required'] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Lead', leadSchema);