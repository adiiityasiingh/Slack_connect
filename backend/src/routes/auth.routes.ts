import express from 'express';
import { redirectToSlack, slackOAuthCallback } from '../controllers/auth.controller';

const router = express.Router();

router.get('/auth/slack', redirectToSlack);
router.get('/auth/slack/callback', slackOAuthCallback);

export default router;
