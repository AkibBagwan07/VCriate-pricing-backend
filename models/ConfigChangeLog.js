const mongoose = require('mongoose');

const configChangeLogSchema = new mongoose.Schema({
  configId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PricingConfig', 
    required: true,
  },
  action: {
    type: String,
    enum: ['created', 'updated', 'deleted'], 
    required: true,
  },
  actor: {
    type: String,
    required: true, 
  },
  timestamp: {
    type: Date,
    default: Date.now, 
  },
});

// Export the model to use it anywhere in the app
module.exports = mongoose.model('ConfigChangeLog', configChangeLogSchema);

