const express = require('express');
const {
    getAllGuildConfigs,
    getGuildConfig,
    createOrUpdateGuildConfig,
    getGuildConfigField,
    updateGuildConfigField,
    deleteGuildConfig
} = require('../controllers/configController');

const router = express.Router();

// Base routes
router.route('/')
    .get(getAllGuildConfigs)
    .post(createOrUpdateGuildConfig);

// Routes specific to a guild
router.route('/:guild_id')
    .get(getGuildConfig)
    .delete(deleteGuildConfig);
    // Note: PUT on /:guild_id could replace the entire config, similar to POST if it exists.
    // Add .put(createOrUpdateGuildConfig) here if you want that behavior.


// Routes for specific fields within a guild's config
router.route('/:guild_id/:field')
    .get(getGuildConfigField) // GET /api/config/123/models
    .put(updateGuildConfigField); // PUT /api/config/123/models (with body: { "value": [...] })
    // Consider adding DELETE for specific fields if needed, e.g., removing all models:
    // .delete(deleteGuildConfigField) // Requires a new controller function


// Specific config endpoints (Alternative/More Explicit Structure)
// You can uncomment these if you prefer more explicit routes over the dynamic :field route

// router.get('/:guild_id/models', (req, res) => getGuildConfigField(req, res));
// router.put('/:guild_id/models', (req, res) => updateGuildConfigField(req, res));

// router.get('/:guild_id/shifts', (req, res) => getGuildConfigField(req, res));
// router.put('/:guild_id/shifts', (req, res) => updateGuildConfigField(req, res));

// router.get('/:guild_id/periods', (req, res) => getGuildConfigField(req, res));
// router.put('/:guild_id/periods', (req, res) => updateGuildConfigField(req, res));

// router.get('/:guild_id/bonus_rules', (req, res) => getGuildConfigField(req, res));
// router.put('/:guild_id/bonus_rules', (req, res) => updateGuildConfigField(req, res));

// router.get('/:guild_id/display_settings', (req, res) => getGuildConfigField(req, res));
// router.put('/:guild_id/display_settings', (req, res) => updateGuildConfigField(req, res));

// router.get('/:guild_id/commission_settings', (req, res) => getGuildConfigField(req, res));
// router.put('/:guild_id/commission_settings', (req, res) => updateGuildConfigField(req, res));

// router.get('/:guild_id/roles', (req, res) => getGuildConfigField(req, res));
// router.put('/:guild_id/roles', (req, res) => updateGuildConfigField(req, res));


module.exports = router;
