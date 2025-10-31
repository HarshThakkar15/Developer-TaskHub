// backend/models/User.js
const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  college: { type: String, default: '' },
  startYear: { type: String, default: '' },
  endYear: { type: String, default: '' },
  cgpa: { type: String, default: '' }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  skills: { type: [String], default: [] },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  phone: {
  type: String,
  default: '',
  validate: {
    validator: function(v) {
      // Allow empty string OR 10 digits only
      return !v || /^(\d{10})$/.test(v);
    },
    message: props => `${props.value} is not a valid 10-digit phone number!`
  }
},
  location: { type: String, default: '' },
  education: { type: EducationSchema, default: () => ({}) },
  published: { type: Boolean, default: false }, // publish/unpublish user's portfolio
  theme: { type: String, enum: ['minimal', 'dark'], default: 'minimal' } 
}, { timestamps: true });

UserSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);