const GuildConfig = require('../models/GuildConfig');

// @desc    Create or Update config for a specific guild
// @route   POST /api/config/:guild_id
// @access  Protected (Handled by canManageGuild middleware)
exports.createOrUpdateGuildConfig = async (req, res) => {
    const { guild_id } = req.params;
    const configData = req.body;

    try {
        let config = await GuildConfig.findOneAndUpdate(
            { guild_id: guild_id },
            { $set: configData },
            { new: true, upsert: true, setDefaultsOnInsert: true } // Create if not exists
        );
        res.json(config);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get config for a specific guild
// @route   GET /api/config/:guild_id
// @access  Protected (Handled by canManageGuild middleware)
exports.getGuildConfig = async (req, res) => {
    try {
        const config = await GuildConfig.findOne({ guild_id: req.params.guild_id });
        if (!config) {
            // If no config exists, maybe return a default structure or 404?
            // For now, returning 404 if strictly not found.
            return res.status(404).json({ msg: 'Guild configuration not found' });
        }
        res.json(config);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete config for a specific guild
// @route   DELETE /api/config/:guild_id
// @access  Protected (Handled by adminOnly middleware)
exports.deleteGuildConfig = async (req, res) => {
    try {
        const config = await GuildConfig.findOneAndDelete({ guild_id: req.params.guild_id });
        if (!config) {
            return res.status(404).json({ msg: 'Guild configuration not found' });
        }
        res.json({ msg: 'Guild configuration removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a specific field from a guild's config
// @route   GET /api/config/:guild_id/:field
// @access  Protected (Handled by canManageGuild middleware)
exports.getGuildConfigField = async (req, res) => {
    try {
        const { guild_id, field } = req.params;
        const config = await GuildConfig.findOne({ guild_id: guild_id }).select(field);
        if (!config || config[field] === undefined) {
            return res.status(404).json({ msg: `Configuration field '${field}' not found for this guild` });
        }
        res.json({ [field]: config[field] });
    } catch (err) {
        console.error(err.message);
        // Handle potential errors if the field is not valid or part of the schema
        if (err.name === 'CastError' || err.name === 'ValidationError') {
            return res.status(400).json({ msg: `Invalid field requested: ${req.params.field}` });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update a specific field in a guild's config
// @route   PUT /api/config/:guild_id/:field
// @access  Protected (Handled by canManageGuild middleware)
exports.updateGuildConfigField = async (req, res) => {
    try {
        const { guild_id, field } = req.params;
        const value = req.body.value; // Expecting { "value": ... }

        if (value === undefined) {
            return res.status(400).json({ msg: "Request body must contain a 'value' field." });
        }

        // Check if the field exists in the schema (optional but good practice)
        // This is basic; a more robust check might introspect the schema
        if (!GuildConfig.schema.path(field)) {
             return res.status(400).json({ msg: `Field '${field}' is not a valid configuration field.` });
        }

        const update = { $set: { [field]: value } };
        const updatedConfig = await GuildConfig.findOneAndUpdate(
            { guild_id: guild_id },
            update,
            { new: true, runValidators: true } // Return updated doc, run schema validators
        );

        if (!updatedConfig) {
            return res.status(404).json({ msg: 'Guild configuration not found' });
        }

        res.json(updatedConfig);
    } catch (err) {
        console.error(err.message);
         if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: `Validation failed for field '${field}': ${err.message}` });
        }
        res.status(500).send('Server Error');
    }
};
