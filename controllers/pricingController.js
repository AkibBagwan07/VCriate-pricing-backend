const PricingConfig = require('../models/PricingConfig');
const ConfigChangeLog = require('../models/ConfigChangeLog');

// Create a new pricing config
const createConfig = async (req, res) => {
  try {
    const config = await PricingConfig.create(req.body);

    await ConfigChangeLog.create({
      configId: config._id,
      action: 'created',
      actor: req.body.actor || 'unknown',
    });

    res.status(201).json(config);
  } catch (err) {
    console.error('Error creating config:', err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all pricing configs
const getAllConfigs = async (req, res) => {
  try {
    const configs = await PricingConfig.find();
    res.json(configs);
  } catch (err) {
    console.error('Error fetching configs:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update an existing pricing config by ID
const updateConfig = async (req, res) => {
  try {
    const config = await PricingConfig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );

    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    await ConfigChangeLog.create({
      configId: config._id,
      action: 'updated',
      actor: req.body.actor || 'unknown',
    });

    res.json(config);
  } catch (err) {
    console.error('Error updating config:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE an existing pricing config by ID
const deleteConfig = async (req, res) => {
  try {
    const config = await PricingConfig.findByIdAndDelete(req.params.id);

    if (!config) {
      return res.status(404).json({ error: 'Pricing configuration not found' });
    }

    try {
      await ConfigChangeLog.create({
        configId: config._id,
        action: 'deleted',
        actor: req.body.actor || 'unknown',
      });
    } catch (logErr) {
      console.warn('Config deleted, but failed to log deletion:', logErr.message);
    }

    return res.status(200).json({ message: 'Pricing configuration deleted successfully' });

  } catch (err) {
    console.error('Error in deleteConfig:', err.message);
    return res.status(500).json({ error: 'Server error during deletion' });
  }
};


function getTimeMultiplier(timeMultiplierFactors, totalMinutes) {
  timeMultiplierFactors.sort((a, b) => a.uptoMinutes - b.uptoMinutes);

  for (const factor of timeMultiplierFactors) {
    if (totalMinutes <= factor.uptoMinutes) {
      return factor.multiplier;
    }
  }

  return timeMultiplierFactors[timeMultiplierFactors.length - 1].multiplier;
}

// Calculate the ride price based on the config and input params
const calculatePrice = async (req, res) => {
  try {
    const { day, totalKm, totalMinutes, waitingMinutes } = req.body;

    if (!day || totalKm == null || totalMinutes == null || waitingMinutes == null) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const config = await PricingConfig.findOne({
      isActive: true,
      applicableDays: day,  
    });

    if (!config) {
      return res.status(404).json({ error: `No active pricing config found for ${day}` });
    }

    const DBP = config.distanceBasePrice.amount;

    const extraDistance = totalKm > config.distanceBasePrice.uptoKm
      ? totalKm - config.distanceBasePrice.uptoKm
      : 0;

    const DAP = config.distanceAdditionalPrice;

    // Total distance cost
    const distanceCost = DBP + (extraDistance * DAP);

    const TMF = getTimeMultiplier(config.timeMultiplierFactors, totalMinutes);

    const timeCost = totalMinutes * TMF;

    // Calculate waiting charges (WC)
    let waitingCost = 0;
    if (waitingMinutes > config.waitingCharge.afterMinutes) {
      const chargeableMinutes = waitingMinutes - config.waitingCharge.afterMinutes;
      const chargeUnits = Math.ceil(chargeableMinutes / config.waitingCharge.perMinutes);
      waitingCost = chargeUnits * config.waitingCharge.amountPerUnit; // Adjust if your schema differs
    }

    // Sum up total price
    const finalPrice = distanceCost + timeCost + waitingCost;

    res.json({
      day,
      totalKm,
      totalMinutes,
      waitingMinutes,
      price: finalPrice.toFixed(2),
      breakdown: {
        distanceCost,
        timeCost,
        waitingCost,
      },
    });
  } catch (err) {
    console.error('Error calculating price:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {createConfig,getAllConfigs,updateConfig,deleteConfig,calculatePrice}
