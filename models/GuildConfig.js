const mongoose = require('mongoose');

const BonusRuleSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  amount: { type: Number, required: true }
}, { _id: false });

const DisplaySettingsSchema = new mongoose.Schema({
  ephemeral_responses: { type: Boolean, default: false },
  show_average: { type: Boolean, default: true },
  agency_name: { type: String, default: 'Agency' },
  show_ids: { type: Boolean, default: true },
  bot_name: { type: String, default: 'Shift Calculator' }
}, { _id: false });

const CommissionSettingsSchema = new mongoose.Schema({
  roles: { type: Map, of: new mongoose.Schema({ commission_percentage: Number }, { _id: false }) }, // Role ID -> Commission %
  users: { type: Map, of: new mongoose.Schema({ hourly_rate: Number, override_role: Boolean }, { _id: false }) } // User ID -> Hourly Rate/Override
}, { _id: false });


const GuildConfigSchema = new mongoose.Schema({
  guild_id: { type: Number, required: true, unique: true, index: true },
  models: { type: [String], default: [] },
  shifts: { type: [String], default: [] },
  periods: { type: [String], default: [] },
  bonus_rules: { type: [BonusRuleSchema], default: [] },
  display_settings: { type: DisplaySettingsSchema, default: () => ({}) },
  commission_settings: { type: CommissionSettingsSchema, default: () => ({ roles: new Map(), users: new Map() }) },
  roles: { type: Map, of: Number, default: new Map() }

}, {
    collection: 'guild_configs' // Explicitly set the collection name here
});


module.exports = mongoose.model('GuildConfig', GuildConfigSchema);
