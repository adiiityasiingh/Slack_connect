import express from 'express';
import { sendMessageNow } from '../controllers/message.controller';
import { scheduleMessage } from '../controllers/message.controller';
import { getScheduledMessages } from '../controllers/message.controller';
import { cancelScheduledMessage } from '../controllers/message.controller';



const router = express.Router();


router.post('/message/send', sendMessageNow);
router.post('/message/schedule', scheduleMessage);
router.get('/message/scheduled/:team_id', getScheduledMessages);
router.delete('/message/cancel/:id', cancelScheduledMessage);

export default router;
