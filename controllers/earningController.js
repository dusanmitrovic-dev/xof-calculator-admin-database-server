const Earnings = require('../models/Earnings');
const GuildConfig = require('../models/GuildConfig'); // May be needed for context

// Helper function to check if user can manage the guild associated with an earning
const checkEarningAuthorization = async (user, custom_id) => {
    const earning = await Earnings.findOne({ id: custom_id });
    if (!earning) {
        return { authorized: false, status: 404, message: 'Earning not found' };
    }

    const guildId = earning.guild_id;

    // Admin can manage any guild
    if (user.role === 'admin') {
        return { authorized: true, earning };
    }

    // Managers must have the guild_id in their managedGuilds array
    if (user.role === 'manager' && user.managedGuilds && user.managedGuilds.includes(guildId)) {
        return { authorized: true, earning };
    }

    return { authorized: false, status: 403, message: 'Not authorized to manage this earning record' };
};

// @desc    Get all earnings for a specific guild
// @route   GET /api/earnings/:guild_id
// @access  Protected (Handled by canManageGuild middleware)
exports.getGuildEarnings = async (req, res) => {
    try {
        const earnings = await Earnings.find({ guild_id: req.params.guild_id });
        res.json(earnings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new earning record
// @route   POST /api/earnings/:guild_id
// @access  Protected (Handled by canManageGuild middleware)
exports.createEarning = async (req, res) => {
    // Ensure the guild_id from the route matches the one in the body, or just use the route param
    const { id, date, total_cut, gross_revenue, period, shift, role, models, hours_worked, user_mention } = req.body;
    const guild_id = req.params.guild_id;

    // Basic validation (could use express-validator)
    if (!id || !date || !guild_id || !user_mention) {
        return res.status(400).json({ msg: 'Missing required fields (id, date, guild_id, user_mention)' });
    }

    try {
        // Check if custom ID already exists for this guild (optional, depends on requirements)
        const existingEarning = await Earnings.findOne({ id: id, guild_id: guild_id });
        if (existingEarning) {
            return res.status(400).json({ msg: 'Custom ID already exists for this guild' });
        }

        const newEarning = new Earnings({
            id, // Custom ID from body
            guild_id,
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
        res.status(500).send('Server Error');
    }
};

// @desc    Get a specific earning by its custom id
// @route   GET /api/earnings/entry/:custom_id
// @access  Protected (Authorization check needed)
exports.getEarningByCustomId = async (req, res) => {
    try {
        const authCheck = await checkEarningAuthorization(req.user, req.params.custom_id);
        if (!authCheck.authorized) {
            return res.status(authCheck.status).json({ msg: authCheck.message });
        }
        res.json(authCheck.earning);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a specific earning by its custom id
// @route   PUT /api/earnings/entry/:custom_id
// @access  Protected (Authorization check needed)
exports.updateEarningByCustomId = async (req, res) => {
    try {
        const authCheck = await checkEarningAuthorization(req.user, req.params.custom_id);
        if (!authCheck.authorized) {
            return res.status(authCheck.status).json({ msg: authCheck.message });
        }

        const earning = await Earnings.findOneAndUpdate(
            { id: req.params.custom_id },
            { $set: req.body },
            { new: true } // Return the updated document
        );

        if (!earning) {
             return res.status(404).json({ msg: 'Earning not found with this custom ID' });
        }

        res.json(earning);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a specific earning by its custom id
// @route   DELETE /api/earnings/entry/:custom_id
// @access  Protected (Authorization check needed)
exports.deleteEarningByCustomId = async (req, res) => {
    try {
        const authCheck = await checkEarningAuthorization(req.user, req.params.custom_id);
        if (!authCheck.authorized) {
            return res.status(authCheck.status).json({ msg: authCheck.message });
        }

        const earning = await Earnings.findOneAndDelete({ id: req.params.custom_id });

        if (!earning) {
            return res.status(404).json({ msg: 'Earning not found with this custom ID' });
        }

        res.json({ msg: 'Earning removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
