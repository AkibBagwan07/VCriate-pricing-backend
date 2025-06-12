const express = require('express');
const mongoose = require('mongoose');
const pricingRoutes = require('./routes/Pricing');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the pricing routes under /api/pricing
app.use('/api/pricing', pricingRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  
  app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
