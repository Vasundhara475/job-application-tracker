const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');

async function debugLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    // Find user
    const user = await User.findOne({ email: 'demo@jobtracker.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User NOT found in database!');
      process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log('🔑 Stored password hash:', user.password);

    // Test password match
    const isMatch = await bcrypt.compare('password123', user.password);
    console.log('🔐 Password match result:', isMatch);

    if (isMatch) {
      console.log('✅ Password is correct! Login should work.');
    } else {
      console.log('❌ Password does NOT match! Need to re-seed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugLogin();