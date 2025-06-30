import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  team_id: { type: String, required: true, unique: true },
  access_token: { type: String, required: true },
  bot_user_id: { type: String },
  scope: { type: String },
  authed_user: {
    id: String,
    access_token: String,
    token_type: String,
  }
}, { timestamps: true });

export default mongoose.model("SlackToken", tokenSchema);
