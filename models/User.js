import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  gold: { type: Number, default: 1000 },
  inventory: [{
    itemId: String,
    name: String,
    quantity: Number,
    icon: String
  }]
});

export default mongoose.model('User', userSchema); 