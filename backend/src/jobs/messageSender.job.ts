import cron from 'node-cron';
import ScheduledMessage from '../models/scheduledMessage.model';
import SlackToken from '../models/token.model';
import axios from 'axios';

export const startMessageScheduler = () => {
  cron.schedule('* * * * *', async () => {
    console.log("⏰ Running scheduled message check:", new Date().toISOString());

    const dueMessages = await ScheduledMessage.find({
      scheduled_for: { $lte: new Date() },
      sent: false
    });

    console.log(`📦 Found ${dueMessages.length} message(s) due`);

    for (const msg of dueMessages) {
      console.log("➡️ Trying to send:", msg.message);

      const tokenDoc = await SlackToken.findOne({ team_id: msg.team_id });
      if (!tokenDoc) {
        console.error("❌ No token found for team:", msg.team_id);
        continue;
      }

      try {
        const response = await axios.post('https://slack.com/api/chat.postMessage', {
          channel: msg.channel,
          text: msg.message
        }, {
          headers: {
            Authorization: `Bearer ${tokenDoc.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.ok) {
          msg.sent = true;
          await msg.save();
          console.log(`✅ Sent scheduled message to ${msg.channel}`);
        } else {
          console.error(`❌ Slack API error:`, response.data);
        }
      } catch (err: any) {
        console.error("❌ Exception when sending:", err.message);
      }
    }
  });
};

