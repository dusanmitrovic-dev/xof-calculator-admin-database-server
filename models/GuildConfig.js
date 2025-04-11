const mongoose = require('mongoose');

const BonusRuleSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  amount: { type: Number, required: true }
}, { _id: false }); // Disable default _id for subdocuments if not needed

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
  guild_id: { type: String, required: true, unique: true, index: true },
  models: { type: [String], default: [] },
  shifts: { type: [String], default: [] },
  periods: { type: [String], default: [] },
  bonus_rules: { type: [BonusRuleSchema], default: [] },
  display_settings: { type: DisplaySettingsSchema, default: () => ({}) },
  commission_settings: { type: CommissionSettingsSchema, default: () => ({ roles: new Map(), users: new Map() }) },
  // Storing roles directly in commission_settings seems more structured based on your example
  // If you need a separate top-level 'roles' field, define it here.
  // roles: { type: Map, of: Number } // Example: Role ID -> Percentage (if needed separately)
  roles: { type: Map, of: Number, default: new Map() } // Storing role ID -> percentage based on example

}, { timestamps: true }); // Adds createdAt and updatedAt timestamps


module.exports = mongoose.model('GuildConfig', GuildConfigSchema);
