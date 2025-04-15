const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Needed to potentially fetch user details like managedGuilds

// Middleware to verify JWT
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach basic user info (id, role) to the request
            // We fetch the full user object to easily access managedGuilds if needed
            req.user = await User.findById(decoded.user.id).select('-password');

            if (!req.user) {
                 return res.status(401).json({ msg: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// Middleware to check for Admin role
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Not authorized, admin role required' });
    }
};

// Middleware to check if user can manage the specific guild requested
const canManageGuild = (req, res, next) => {
    const { guild_id } = req.params; // Assumes guild_id is a route parameter

    if (!req.user) {
         return res.status(401).json({ msg: 'Not authorized' });
    }

    // Admin can manage any guild
    if (req.user.role === 'admin') {
        return next();
    }

    // Managers must have the guild_id in their managedGuilds array
    if (req.user.role === 'manager' && req.user.managedGuilds && req.user.managedGuilds.includes(guild_id)) {
        return next();
    }

    // If none of the above, they are not authorized for this guild
    res.status(403).json({ msg: 'Not authorized to manage this guild' });
};

module.exports = { protect, adminOnly, canManageGuild };