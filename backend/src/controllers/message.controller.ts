import { Request, Response } from 'express';
import SlackToken from '../models/token.model';
import ScheduledMessage from '../models/scheduledMessage.model';
import axios from 'axios';

export const sendMessageNow = async (req: Request, res: Response) => {
  const { team_id, channel, message } = req.body;
  console.log("Incoming body:", req.body);

  if (!team_id || !channel || !message) {
    
    return res.status(400).json({ error: "Missing required fields" });
  }

  const tokenDoc = await SlackToken.findOne({ team_id });
  if (!tokenDoc) return res.status(404).json({ error: "No token found for this team" });

  try {
    const response = await axios.post('https://slack.com/api/chat.postMessage', {
      channel,
      text: message
    }, {
      headers: {
        Authorization: `Bearer ${tokenDoc.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data.ok) throw new Error(response.data.error);
    res.json({ success: true, ts: response.data.ts });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Slack API error" });
  }
};


export const scheduleMessage = async (req: Request, res: Response) => {
  const { team_id, channel, message, scheduled_for } = req.body;

  if (!team_id || !channel || !message || !scheduled_for) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newMsg = await ScheduledMessage.create({
      team_id,
      channel,
      message,
      scheduled_for: new Date(scheduled_for)
    });

    res.json({ success: true, message: newMsg });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getScheduledMessages = async (req: Request, res: Response) => {
  const { team_id } = req.params;

  if (!team_id) {
    return res.status(400).json({ error: "Missing team_id" });
  }

  try {
    const messages = await ScheduledMessage.find({
      team_id,
      sent: false
    }).sort({ scheduled_for: 1 });

    res.json({ success: true, messages });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelScheduledMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const msg = await ScheduledMessage.findById(id);

    if (!msg) {
      return res.status(404).json({ error: "Scheduled message not found" });
    }

    if (msg.sent) {
      return res.status(400).json({ error: "Message already sent. Cannot cancel." });
    }

    await ScheduledMessage.findByIdAndDelete(id);

    res.json({ success: true, message: "Scheduled message cancelled." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
