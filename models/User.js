const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager'], // 'admin' for superuser, 'manager' for guild access
        default: 'manager'
    },
    // Optional: Link managers to specific guilds they can manage
    // If an admin can manage ALL guilds, this might only apply to 'manager' roles
    managedGuilds: [{
        type: String // Store Guild IDs
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);