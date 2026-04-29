require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const adminSchema = new mongoose.Schema({}, { strict: false });
  const Admin = mongoose.model('Admin', adminSchema, 'admins');
  const admins = await Admin.find({});
  console.log('Admins:', JSON.stringify(admins, null, 2));
  process.exit();
}
check();
