const mongoose = require('mongoose');
// ...mongodb code removed
// ...existing code...
// ...existing code...
const bcrypt = require('bcryptjs');
const User = require('../lib/models/User').default || require('../lib/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auravein_local';

(async ()=>{
  try{
    await mongoose.connect(MONGODB_URI);
    const email = 'admin@auravein.com';
    const password = 'admin123';
    let user = await User.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = new User({ name: 'Admin', email, password: hashed, role: 'admin', isAdmin: true });
      await user.save();
      console.log('Admin user created:', email, password);
    } else {
      console.log('Admin user already exists:', email);
    }
    process.exit(0);
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})()
