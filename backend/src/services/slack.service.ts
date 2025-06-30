import axios from 'axios';

export const getSlackOAuthURL = (): string => {
  const baseURL = "https://slack.com/oauth/v2/authorize";
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID || '',
    scope: process.env.SLACK_SCOPE || '',
    redirect_uri: process.env.SLACK_REDIRECT_URI || ''
  });

  return `${baseURL}?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const url = "https://slack.com/api/oauth.v2.access";
  const response = await axios.post(url, null, {
    params: {
      code,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri: process.env.SLACK_REDIRECT_URI
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return response.data;
};
