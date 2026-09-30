import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    house: { type: String, required: true }, // House/Flat No, Building
    street: { type: String, required: true }, // Street, Landmark
    area: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);
export default Address;
