const User = require('../models/User');
const GuildConfig = require('../models/GuildConfig'); // Needed to list available guilds

// @desc    Get all users (excluding passwords)
// @route   GET /api/users
// @access  Admin Only
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a specific user by ID (excluding password)
// @route   GET /api/users/:user_id
// @access  Admin Only
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
         if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update a user's details (e.g., role, managedGuilds)
// @route   PUT /api/users/:user_id
// @access  Admin Only
exports.updateUser = async (req, res) => {
    const { role, managedGuilds } = req.body; // Only allow updating specific fields
    const { user_id } = req.params;

    // Ensure admin cannot accidentally demote themselves or change their own guilds
    if (req.user.id === user_id && role && role !== 'admin'){
         return res.status(400).json({ msg: 'Admin cannot change their own role.' });
    }
    // Prevent modifying the admin's managed guilds (they have access to all)
    const targetUser = await User.findById(user_id);
    if (!targetUser) {
        return res.status(404).json({ msg: 'User not found' });
    }
    if(targetUser.role === 'admin' && managedGuilds !== undefined) {
        return res.status(400).json({ msg: 'Cannot assign managed guilds to an admin.' });
    }

    const updateFields = {};
    if (role) updateFields.role = role;
    if (managedGuilds !== undefined) updateFields.managedGuilds = managedGuilds; // Allow setting empty array

    try {
        const user = await User.findByIdAndUpdate(
            user_id,
            { $set: updateFields },
            { new: true, runValidators: true } // runValidators checks enum for role
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
         if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: `Validation Error: ${err.message}` });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:user_id
// @access  Admin Only
exports.deleteUser = async (req, res) => {
    const { user_id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === user_id) {
        return res.status(400).json({ msg: 'Admin cannot delete themselves.' });
    }

    try {
        const user = await User.findByIdAndDelete(user_id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
         if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Get a list of all unique Guild IDs present in the configs
// @route   GET /api/users/managed-guilds/available
// @access  Admin Only (for assigning guilds to managers)
exports.getAvailableGuilds = async (req, res) => {
    try {
        // Find all configs and select only the guild_id field
        const configs = await GuildConfig.find().select('guild_id -_id');
        // Extract the guild_id values into an array
        const guildIds = configs.map(config => config.guild_id);
        res.json(guildIds);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
