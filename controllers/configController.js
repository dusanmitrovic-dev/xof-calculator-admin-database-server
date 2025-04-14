const GuildConfig = require('../models/GuildConfig');
<<<<<<< HEAD

=======
const Earnings = require('../models/Earnings'); // Added for potential use in delete
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
// @desc    Get all guild configs
// @route   GET /api/config
// @access  Public
exports.getAllGuildConfigs = async (req, res) => {
  try {
    const configs = await GuildConfig.find();
    res.json(configs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
<<<<<<< HEAD

=======
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
// @desc    Get config for a specific guild
// @route   GET /api/config/:guild_id
// @access  Public
exports.getGuildConfig = async (req, res) => {
  try {
<<<<<<< HEAD
    const guildId = Number(req.params.guild_id);
=======
    const guildId = req.params.guild_id; // Use string directly
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
    const config = await GuildConfig.findOne({ guild_id: guildId });
    if (!config) {
      return res.status(404).json({ msg: 'Guild config not found' });
    }
    res.json(config);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
<<<<<<< HEAD

// @desc    Create or update guild config
=======
// @desc    Create or update guild config (based on guild_id in body)
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
// @route   POST /api/config
// @access  Public // Might want to add authentication/authorization later
exports.createOrUpdateGuildConfig = async (req, res) => {
  const {
<<<<<<< HEAD
    guild_id,
=======
    guild_id, // Expect guild_id as string in the body
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
    models,
    shifts,
    periods,
    bonus_rules,
    display_settings,
    commission_settings,
    roles
  } = req.body;
<<<<<<< HEAD

  const configFields = {};
  if (guild_id) configFields.guild_id = guild_id;
  if (models) configFields.models = models;
  if (shifts) configFields.shifts = shifts;
  if (periods) configFields.periods = periods;
  if (bonus_rules) configFields.bonus_rules = bonus_rules;
  if (display_settings) configFields.display_settings = display_settings;
  if (commission_settings) configFields.commission_settings = commission_settings;
  if (roles) configFields.roles = roles;

  try {
    let config = await GuildConfig.findOne({ guild_id: configFields.guild_id });

=======
  // Basic validation
  if (!guild_id) {
      return res.status(400).json({ msg: 'guild_id is required in the request body' });
  }
  const configFields = {};
  configFields.guild_id = guild_id; // Store as string
  if (models !== undefined) configFields.models = models;
  if (shifts !== undefined) configFields.shifts = shifts;
  if (periods !== undefined) configFields.periods = periods;
  if (bonus_rules !== undefined) configFields.bonus_rules = bonus_rules;
  if (display_settings !== undefined) configFields.display_settings = display_settings;
  if (commission_settings !== undefined) configFields.commission_settings = commission_settings;
  if (roles !== undefined) configFields.roles = roles;
  try {
    let config = await GuildConfig.findOne({ guild_id: configFields.guild_id });
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
    if (config) {
      // Update
      config = await GuildConfig.findOneAndUpdate(
        { guild_id: configFields.guild_id },
        { $set: configFields },
<<<<<<< HEAD
        { new: true }
      );
      return res.json(config);
    }

    // Create
    config = new GuildConfig(configFields);
    await config.save();
    res.json(config);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


=======
        { new: true, runValidators: true } // Added runValidators
      );
      return res.json(config);
    }
    // Create
    config = new GuildConfig(configFields);
    await config.save();
    res.status(201).json(config); // Use 201 status for creation
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
    }
    res.status(500).send('Server Error');
  }
};
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
// @desc    Get specific config field for a guild
// @route   GET /api/config/:guild_id/:field
// @access  Public
exports.getGuildConfigField = async (req, res) => {
  try {
<<<<<<< HEAD
    const guildId = Number(req.params.guild_id);
    const config = await GuildConfig.findOne({ guild_id: guildId }).select(req.params.field);
    if (!config) {
      return res.status(404).json({ msg: 'Guild config not found' });
    }
    if (config[req.params.field] === undefined) {
         return res.status(404).json({ msg: `Config field '${req.params.field}' not found for this guild` });
    }
    res.json({ [req.params.field]: config[req.params.field] });
  } catch (err) {
    console.error(err.message);
     if (err.name === 'CastError') { // Handle invalid  format for guild_id
        return res.status(400).json({ msg: 'Invalid Guild ID format' });
    }
    res.status(500).send('Server Error');
  }
};

=======
    const guildId = req.params.guild_id; // Use string directly
    const field = req.params.field;
    // Validate field name against schema paths (optional but good practice)
    const validFields = Object.keys(GuildConfig.schema.paths);
    if (!validFields.includes(field)) {
        return res.status(400).json({ msg: `Invalid config field '${field}'` });
    }
    const config = await GuildConfig.findOne({ guild_id: guildId }).select(field);
    if (!config) {
      return res.status(404).json({ msg: 'Guild config not found' });
    }
    // Check if the field itself exists on the retrieved document
    // Mongoose might return the document even if the selected field is undefined
    if (config[field] === undefined) {
         return res.status(404).json({ msg: `Config field '${field}' not found or not set for this guild` });
    }
    res.json({ [field]: config[field] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
// @desc    Update a specific config field for a guild
// @route   PUT /api/config/:guild_id/:field
// @access  Public // Add Auth later
exports.updateGuildConfigField = async (req, res) => {
    const { guild_id, field } = req.params;
    const { value } = req.body;
<<<<<<< HEAD

    const update = { $set: { [field]: value } };

    try {
        const guildId = Number(req.params.guild_id);
        const config = await GuildConfig.findOneAndUpdate({ guild_id:guildId }, update, { new: true, runValidators: true });

        if (!config) {
            return res.status(404).json({ msg: 'Guild config not found' });
        }

        res.json(config);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'CastError' || err.name === 'ValidationError') { // Handle validation or casting errors
=======
    if (value === undefined) {
        return res.status(400).json({ msg: 'Missing ', value: ' in request body' });
    }
    // Validate field name against schema paths (optional but good practice)
    const validFields = Object.keys(GuildConfig.schema.paths);
    if (!validFields.includes(field) || field === '_id' || field === 'guild_id') { // Prevent updating _id or guild_id this way
        return res.status(400).json({ msg: `Invalid or protected config field '${field}'` });
    }
    const update = { $set: { [field]: value } };
    try {
        const guildId = req.params.guild_id; // Use string directly
        const config = await GuildConfig.findOneAndUpdate({ guild_id: guildId }, update, { new: true, runValidators: true });
        if (!config) {
            return res.status(404).json({ msg: 'Guild config not found' });
        }
        res.json(config);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError' || err.name === 'CastError') { // Handle validation or casting errors
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
             return res.status(400).json({ msg: 'Invalid data for field ' + field, error: err.message });
        }
        res.status(500).send('Server Error');
    }
};
<<<<<<< HEAD

=======
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
// @desc    Delete a guild config
// @route   DELETE /api/config/:guild_id
// @access  Public // Add Auth later
exports.deleteGuildConfig = async (req, res) => {
  try {
<<<<<<< HEAD
    const guildId = Number(req.params.guild_id);
    const config = await GuildConfig.findOneAndDelete({ guild_id: guildId });

    if (!config) {
      return res.status(404).json({ msg: 'Guild config not found' });
    }

    // Optionally: Delete associated earnings for this guild
    // await Earning.deleteMany({ guild_id: req.params.guild_id });

=======
    const guildId = req.params.guild_id; // Use string directly
    const config = await GuildConfig.findOneAndDelete({ guild_id: guildId });
    if (!config) {
      return res.status(404).json({ msg: 'Guild config not found' });
    }
    // Optionally: Delete associated earnings for this guild
    // console.log(`Deleting earnings for guild: ${guildId}`);
    // await Earnings.deleteMany({ guild_id: guildId });
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
    res.json({ msg: 'Guild config deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> df04324ffc89225f71d36e4b6710d21ce1d24d11
