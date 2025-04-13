const Earnings = require('../models/Earnings');
const GuildConfig = require('../models/GuildConfig');

// @desc    Get all earnings for a specific guild
// @route   GET /api/earnings/:guild_id
// @access  Public
exports.getGuildEarnings = async (req, res) => {
  try {
    const guildId = req.params.guild_id;
    const earnings = await Earnings.find({ guild_id: guildId });
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
        const earnings = await Earnings.find();
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
    id, // The custom ID
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

  // Basic validation: Ensure custom id is provided
  if (!id) {
      return res.status(400).json({ msg: `Custom {id} field is required in the request body` });
  }

  try {
    // Optional: Check if guild exists
    // const guildExists = await GuildConfig.findOne({ guild_id: guild_id });
    // if (!guildExists) {
    //   return res.status(404).json({ msg: 'Guild not found' });
    // }

    // Optional: Check if custom ID already exists for this guild
    const existingEarning = await Earnings.findOne({ id: id, guild_id: guild_id });
    if (existingEarning) {
        return res.status(400).json({ msg: `Earning with custom id '${id}' already exists for this guild` });
    }

    const newEarning = new Earnings({
      guild_id: guild_id,
      id: id,
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
    // Handle potential duplicate key errors if unique index is violated (though checked above)
    if (err.code === 11000) {
        return res.status(400).json({ msg: `Duplicate key error. An earning with this custom id might already exist.`, error: err.keyValue });
    }
    res.status(500).send('Server Error');
  }
};

// --- Functions using custom 'id' field ---

// @desc    Get a specific earning by its custom ID
// @route   GET /api/earnings/custom/:custom_id
// @access  Public
exports.getEarningByCustomId = async (req, res) => {
  try {
    const customId = req.params.custom_id;
    const earning = await Earnings.findOne({ id: customId }); // Find by custom id field
    if (!earning) {
      return res.status(404).json({ msg: `Earning with custom id '${customId}' not found` });
    }
    res.json(earning);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); // Less specific error for general failures
  }
};

// @desc    Update a specific earning by its custom ID
// @route   PUT /api/earnings/custom/:custom_id
// @access  Public // Add Auth later
exports.updateEarningByCustomId = async (req, res) => {
  try {
    const customId = req.params.custom_id;
    const updateData = { ...req.body };
    // Ensure the custom id itself is not changed via this update method
    delete updateData.id;
    // Ensure guild_id is not changed via this update method (should be updated via different mechanism if needed)
    delete updateData.guild_id;

    const earning = await Earnings.findOneAndUpdate(
      { id: customId }, // Find by custom id field
      { $set: updateData },
      { new: true, runValidators: true } // Return updated doc and run schema validators
    );

    if (!earning) {
      return res.status(404).json({ msg: `Earning with custom id '${customId}' not found` });
    }

    res.json(earning);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an earning by its custom ID
// @route   DELETE /api/earnings/custom/:custom_id
// @access  Public // Add Auth later
exports.deleteEarningByCustomId = async (req, res) => {
  try {
    const customId = req.params.custom_id;
    const earning = await Earnings.findOneAndDelete({ id: customId }); // Find by custom id field

    if (!earning) {
      return res.status(404).json({ msg: `Earning with custom id '${customId}' not found` });
    }

    res.json({ msg: 'Earning removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- Kept original functions using MongoDB _id (renamed) ---
// You can remove these if they are no longer needed

// @desc    Get a specific earning by its MongoDB _id
// @route   GET /api/earnings/entry/:earning_id (If route is kept)
// @access  Public
exports.getEarningBy_Id = async (req, res) => {
  try {
    const earning = await Earnings.findById(req.params.earning_id);
    if (!earning) {
      return res.status(404).json({ msg: 'Earning not found by _id' });
    }
    res.json(earning);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid MongoDB ObjectId format' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update a specific earning by its MongoDB _id
// @route   PUT /api/earnings/entry/:earning_id (If route is kept)
// @access  Public // Add Auth later
exports.updateEarningBy_Id = async (req, res) => {
  try {
    const earning = await Earnings.findByIdAndUpdate(
      req.params.earning_id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!earning) {
      return res.status(404).json({ msg: 'Earning not found by _id' });
    }

    res.json(earning);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
    }
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid MongoDB ObjectId format' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an earning by its MongoDB _id
// @route   DELETE /api/earnings/entry/:earning_id (If route is kept)
// @access  Public // Add Auth later
exports.deleteEarningBy_Id = async (req, res) => {
  try {
    const earning = await Earnings.findByIdAndDelete(req.params.earning_id);

    if (!earning) {
      return res.status(404).json({ msg: 'Earning not found by _id' });
    }

    res.json({ msg: 'Earning removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid MongoDB ObjectId format' });
    }
    res.status(500).send('Server Error');
  }
};
