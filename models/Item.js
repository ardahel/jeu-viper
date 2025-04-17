import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['skin', 'consumable'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary']
  },
  price: {
    type: Number,
    required: true
  },
  isShopAvailable: {
    type: Boolean,
    default: true
  },
  // Champs spécifiques aux skins
  skinData: {
    characterName: String,
    imageUrl: String
  },
  // Champs spécifiques aux consommables
  consumableData: {
    maxDurability: Number,
    effectDescription: String
  }
});

export default mongoose.model('Item', itemSchema); 