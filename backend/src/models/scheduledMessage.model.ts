import mongoose from 'mongoose';

const scheduledMessageSchema = new mongoose.Schema({
  team_id: { type: String, required: true },
  channel: { type: String, required: true },
  message: { type: String, required: true },
  scheduled_for: { type: Date, required: true },
  sent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("ScheduledMessage", scheduledMessageSchema);
