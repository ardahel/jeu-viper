import mongoose from 'mongoose';

const userItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  currentDurability: Number,
  isEquipped: {
    type: Boolean,
    default: false
  }
});

// Index composé pour s'assurer qu'un utilisateur ne peut pas avoir le même item deux fois
userItemSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default mongoose.model('UserItem', userItemSchema); 