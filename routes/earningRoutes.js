const express = require('express');
const {
    getGuildEarnings,
    createEarning,
    // getEarningById, // Original function using _id
    // updateEarning,  // Original function using _id
    // deleteEarning,  // Original function using _id
    getEarningByCustomId, // New function
    updateEarningByCustomId, // New function
    deleteEarningByCustomId, // New function
    getAllEarnings
} = require('../controllers/earningController');

const router = express.Router();

// Route to get all earnings
router.route('/')
    .get(getAllEarnings);

// Routes specific to a guild
router.route('/:guild_id')
    .get(getGuildEarnings)
    .post(createEarning);

// Routes for individual earning entries identified by the custom 'id' field
router.route('/entry/:custom_id')
    .get(getEarningByCustomId)    // Was getEarningById
    .put(updateEarningByCustomId)   // Was updateEarning
    .delete(deleteEarningByCustomId); // Was deleteEarning

// Optional: Keep the old routes using _id if needed?
// router.route('/entry/:earning_id')
//     .get(getEarningById)
//     .put(updateEarning)
//     .delete(deleteEarning);

module.exports = router;
