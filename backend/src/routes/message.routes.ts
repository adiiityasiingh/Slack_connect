import express from 'express';
import { sendMessageNow } from '../controllers/message.controller';
import { scheduleMessage } from '../controllers/message.controller';
import { getScheduledMessages } from '../controllers/message.controller';
import { cancelScheduledMessage } from '../controllers/message.controller';



const router = express.Router();


router.post('/send', sendMessageNow);
router.post('/schedule', scheduleMessage);
router.get('/scheduled/:team_id', getScheduledMessages);
router.delete('/cancel/:id', cancelScheduledMessage);

export default router;
