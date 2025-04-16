import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  icon: { type: String, required: true },
  description: String,
  effect: String,
  imagePath: String
});

export default mongoose.model('Item', itemSchema); 