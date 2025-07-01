
# 🚀 Slack Connect

Slack Connect is a full-stack web application that allows users to connect their Slack workspace, compose messages, send them immediately, or schedule them for future delivery — with automatic token refresh and secure integration.

## 🌐 Live Demo

Frontend (Vercel): [https://slack-connect-eta.vercel.app/](https://slack-connect-eta.vercel.app/)
Backend (Render): [https://slack-connect-backend.onrender.com](https://slack-connect-backend.onrender.com)

---

## 📌 Features

- 🔐 OAuth 2.0 authentication with Slack
- 🔁 Secure token storage with automatic refresh logic
- ✍️ Send Slack messages instantly
- ⏰ Schedule messages for future date/time
- 🗂 View and cancel scheduled messages
- 🎨 Modern UI built with Next.js & Tailwind CSS

---

## 🛠 Tech Stack

| Layer       | Tech Used                      |
|-------------|--------------------------------|
| Frontend    | Next.js, TypeScript, Tailwind CSS |
| Backend     | Node.js, Express, TypeScript   |
| Database    | MongoDB Atlas                  |
| Auth        | Slack OAuth 2.0                |
| Deployment  | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

\`\`\`
slack-connect/
├── backend/           # Express API (OAuth, scheduling)
├── frontend/          # Next.js UI
\`\`\`

---

## 🔐 Slack App Setup

1. Go to https://api.slack.com/apps → Create a new app
2. Enable:
   - **OAuth & Permissions**  
     - Redirect URL: \`https://slack-connect-backend.onrender.com/auth/slack/callback\`
     - Scopes: \`chat:write\`, \`channels:read\`, \`groups:read\`, \`users:read\`
   - **Bot Token** → Create a bot user
3. Save:
   - \`SLACK_CLIENT_ID\`
   - \`SLACK_CLIENT_SECRET\`
   - \`SLACK_REDIRECT_URI\`

---

## 🚀 Local Development

### 1. Clone the repo

\`\`\`bash
git clone https://github.com/your-username/slack-connect.git
cd slack-connect
\`\`\`

---

### 2. Backend Setup

\`\`\`bash
cd backend
npm install
\`\`\`

#### Create `.env` file:
\`\`\`env
PORT=5000
MONGO_URI=your_mongo_connection_string
SLACK_CLIENT_ID=your_client_id
SLACK_CLIENT_SECRET=your_client_secret
SLACK_REDIRECT_URI=http://localhost:5000/auth/slack/callback
\`\`\`

\`\`\`bash
npx ts-node-dev src/app.ts
\`\`\`

---

### 3. Frontend Setup

\`\`\`bash
cd frontend
npm install
\`\`\`

#### Create `.env.local` file:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

Open \`http://localhost:3000\`

---

## 📦 Deployment

### 🟨 Backend (Render)

- Create a new web service from GitHub
- Set root to \`/backend\`
- Add the same \`.env\` values in the Render dashboard
- Set start command:
  \`\`\`bash
  npx ts-node src/app.ts
  \`\`\`

### 🟩 Frontend (Vercel)

- Import project from GitHub
- Set root to \`/frontend\`
- Add:
  \`\`\`env
  NEXT_PUBLIC_API_URL=[https://your-backend.onrender.com](https://slack-connect-backend.onrender.com)
  \`\`\`

---

## 🧠 Architectural Overview

- **Slack OAuth**: OAuth flow with token exchange and refresh handling
- **Token Management**: Tokens stored securely in MongoDB with team ID
- **Scheduling Logic**: Cron job runs every minute to dispatch due messages
- **Frontend**: React-based UI for sending, scheduling, listing, and canceling messages

---

## ⚠️ Known Limitations

- Channel selection is currently hardcoded
- No user-level Slack workspace management (multi-user not supported yet)

---

## 🙌 Challenges & Learnings

- Handling Slack's OAuth token refresh mechanism with long-term reliability
- Ensuring scheduled jobs work even after server restarts
- Building flexible APIs that can integrate smoothly with a modern frontend
- Managing secure deployment of secrets across two platforms (Vercel & Render)

---

## 📬 Feedback or Suggestions?

Feel free to open an issue or create a PR — always happy to improve this!

---

## 📄 License

MIT License
