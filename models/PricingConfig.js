const mongoose = require('mongoose');

// Schema to represent each time multiplier tier
const timeMultiplierSchema = new mongoose.Schema({
  uptoMinutes: {
    type: Number,           
    required: true,
  },
  multiplier: {
    type: Number,             
    required: true,
  }
});

// Main pricing configuration schema
const pricingConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,          
  },
  isActive: {
    type: Boolean,
    default: false,          
  },
  applicableDays: {
    type: [String],        
    required: true,
  },
  distanceBasePrice: {
    amount: {
      type: Number,
      required: true,         
    },
    uptoKm: {
      type: Number,
      required: true,        
    }
  },
  distanceAdditionalPrice: {
    type: Number,
    required: true,           
  },
  timeMultiplierFactors: {
    type: [timeMultiplierSchema],
    required: true,          
  },
  waitingCharge: {
    perMinutes: {
      type: Number,
      required: true,         
    },
    afterMinutes: {
      type: Number,
      required: true,       
    }
  }
}, {
  timestamps: true       
});

// Export the model so it can be imported anywhere
module.exports = mongoose.model('PricingConfig', pricingConfigSchema);

