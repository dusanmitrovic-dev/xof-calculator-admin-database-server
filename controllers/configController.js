const GuildConfig = require('../models/GuildConfig');

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

// @desc    Get config for a specific guild
// @route   GET /api/config/:guild_id
// @access  Public
exports.getGuildConfig = async (req, res) => {
  try {
    const guildId = Number(req.params.guild_id);
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

// @desc    Create or update guild config
// @route   POST /api/config
// @access  Public // Might want to add authentication/authorization later
exports.createOrUpdateGuildConfig = async (req, res) => {
  const {
    guild_id,
    models,
    shifts,
    periods,
    bonus_rules,
    display_settings,
    commission_settings,
    roles
  } = req.body;

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

    if (config) {
      // Update
      config = await GuildConfig.findOneAndUpdate(
        { guild_id: configFields.guild_id },
        { $set: configFields },
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


// @desc    Get specific config field for a guild
// @route   GET /api/config/:guild_id/:field
// @access  Public
exports.getGuildConfigField = async (req, res) => {
  try {
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

// @desc    Update a specific config field for a guild
// @route   PUT /api/config/:guild_id/:field
// @access  Public // Add Auth later
exports.updateGuildConfigField = async (req, res) => {
    const { guild_id, field } = req.params;
    const { value } = req.body;

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
             return res.status(400).json({ msg: 'Invalid data for field ' + field, error: err.message });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a guild config
// @route   DELETE /api/config/:guild_id
// @access  Public // Add Auth later
exports.deleteGuildConfig = async (req, res) => {
  try {
    const guildId = Number(req.params.guild_id);
    const config = await GuildConfig.findOneAndDelete({ guild_id: guildId });

    if (!config) {
      return res.status(404).json({ msg: 'Guild config not found' });
    }

    // Optionally: Delete associated earnings for this guild
    // await Earning.deleteMany({ guild_id: req.params.guild_id });

    res.json({ msg: 'Guild config deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
