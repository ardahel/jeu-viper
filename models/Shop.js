import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    default: null // null = stock illimité
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

export default mongoose.model('Shop', shopSchema); 