import { Request, Response } from 'express';
import { getSlackOAuthURL, exchangeCodeForToken } from '../services/slack.service';
import SlackToken from '../models/token.model';

export const redirectToSlack = (_req: Request, res: Response) => {
  const url = getSlackOAuthURL();
  res.redirect(url);
};

export const slackOAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) return res.status(400).send("Missing code");

  try {
    const tokenData = await exchangeCodeForToken(code as string);

    if (!tokenData.ok) {
      console.error(tokenData);
      return res.status(500).send("Slack OAuth failed");
    }

    const { team, access_token, bot_user_id, scope, authed_user } = tokenData;

    await SlackToken.findOneAndUpdate(
      { team_id: team.id },
      {
        team_id: team.id,
        access_token,
        bot_user_id,
        scope,
        authed_user
      },
      { upsert: true }
    );

    res.send("Slack workspace connected successfully. You may now close this tab.");
  } catch (error) {
    console.error(error);
    res.status(500).send("OAuth callback error");
  }
};
