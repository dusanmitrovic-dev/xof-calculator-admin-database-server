const express = require('express');
const {
    getGuildEarnings,
    createEarning,
    getEarningById,
    updateEarning,
    deleteEarning,
    getAllEarnings // new
} = require('../controllers/earningController');

const router = express.Router();

// Route to get all earnings
router.route('/')
    .get(getAllEarnings);

// Routes specific to a guild
router.route('/:guild_id')
    .get(getGuildEarnings)
    .post(createEarning);

// Routes for individual earning entries (identified by their own _id)
router.route('/entry/:earning_id')
    .get(getEarningById)
    .put(updateEarning)
    .delete(deleteEarning);

module.exports = router;
