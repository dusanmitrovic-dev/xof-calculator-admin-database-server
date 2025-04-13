const Earning = require('../models/Earning');

// @desc    Get all earnings for a specific guild
// @route   GET /api/earnings/:guild_id
// @access  Public
exports.getGuildEarnings = async (req, res) => {
  try {
    const guildId = Number(req.params.guild_id);
    const earnings = await Earning.find({ guild_id: guildId });
    res.json(earnings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all earnings
// @route   GET /api/earnings
// @access  Public
exports.getAllEarnings = async (req, res) => {
    try {
        const earnings = await Earning.find();
        res.json(earnings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new earning for a guild
// @route   POST /api/earnings/:guild_id
// @access  Public // Add Auth later
exports.createEarning = async (req, res) => {
  const { guild_id } = req.params;

  const {
    id,
    date,
    total_cut,
    gross_revenue,
    period,
    shift,
    role,
    models,
    hours_worked,
    user_mention
  } = req.body;

  try {
    const guildId = Number(req.params.guild_id);
    // Optional: Check if guild exists in GuildConfig
    // const guildExists = await GuildConfig.findOne({ guild_id });
    // if (!guildExists) {
    //   return res.status(404).json({ msg: 'Guild not found, cannot create earning' });
    // }

    const newEarning = new Earning({
      guild_id: guildId,
      id,
      date,
      total_cut,
      gross_revenue,
      period,
      shift,
      role,
      models,
      hours_worked,
      user_mention
    });

    const earning = await newEarning.save();
    res.status(201).json(earning);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get a specific earning by its ID
// @route   GET /api/earnings/entry/:earning_id // Use a different path segment to avoid conflict
// @access  Public
exports.getEarningById = async (req, res) => {
  try {
    const earning = await Earning.findById(req.params.earning_id);
    if (!earning) {
      return res.status(404).json({ msg: 'Earning not found' });
    }
    res.json(earning);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Earning ID format' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update a specific earning by its ID
// @route   PUT /api/earnings/entry/:earning_id
// @access  Public // Add Auth later
exports.updateEarning = async (req, res) => {
  try {
    const earning = await Earning.findByIdAndUpdate(
      req.params.earning_id,
      { $set: req.body },
      { new: true, runValidators: true } // Return updated doc and run schema validators
    );

    if (!earning) {
      return res.status(404).json({ msg: 'Earning not found' });
    }

    res.json(earning);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
    }
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Earning ID format' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an earning by its ID
// @route   DELETE /api/earnings/entry/:earning_id
// @access  Public // Add Auth later
exports.deleteEarning = async (req, res) => {
  try {
    const earning = await Earning.findByIdAndDelete(req.params.earning_id);

    if (!earning) {
      return res.status(404).json({ msg: 'Earning not found' });
    }

    res.json({ msg: 'Earning removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Earning ID format' });
    }
    res.status(500).send('Server Error');
  }
};
