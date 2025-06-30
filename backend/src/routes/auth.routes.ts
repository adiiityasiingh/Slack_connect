import express from 'express';
import { redirectToSlack, slackOAuthCallback } from '../controllers/auth.controller';

const router = express.Router();

// ✅ Corrected: leave off the `/auth` prefix
router.get('/slack', redirectToSlack);
router.get('/slack/callback', slackOAuthCallback);

export default router;
