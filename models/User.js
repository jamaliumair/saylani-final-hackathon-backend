import mongoose from "mongoose";


// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cnic: { type: String, required: true, unique: true, 
    max: [13, "must be at least 13 characters"],
    min: [13, "must be at least 13 characters"],
   },
  password: { type: String, required: true },
  address: { type: String },
  phoneNumber: { type: String },
  loanRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "LoanRequest" }],
  isPasswordChanged: { type: Boolean, default: false },

});

// Slip Schema
// const SlipSchema = new mongoose.Schema({
//   loanRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   tokenNumber: { type: String, required: true },
//   qrCode: { type: String, required: true },
//   appointmentDetails: {
//     date: { type: Date, required: true },
//     time: { type: String, required: true },
//     officeLocation: { type: String, required: true },
//   },
// });

// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
});

// Export models
 const User = mongoose.model('User', UserSchema)
 const Admin = mongoose.model('Admin', AdminSchema)

  
  export default { User, Admin };
  
