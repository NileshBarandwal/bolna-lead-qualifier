# AI Lead Qualification Voice Agent

## Problem

Sales teams waste hours manually calling and qualifying inbound leads from web forms. Most leads are low-intent, and SDRs spend 70% of their time on leads that never convert — leaving high-value prospects waiting and pipeline data stale.

## Solution

This app automates outbound lead qualification using a Voice AI agent built on Bolna's platform. When a lead submits a form, the system immediately triggers a personalized phone call. The AI agent asks 4–5 qualifying questions, extracts structured data from the conversation, and automatically scores each lead as Hot, Warm, or Cold — without any human SDR involvement.

## Architecture

```
User fills form → Backend saves lead → Bolna Voice Agent calls lead →
Agent qualifies lead → Webhook updates DB → Dashboard shows result
```

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, SQLite
- **Voice AI:** Bolna ([platform.bolna.ai](https://platform.bolna.ai))

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd bolna-lead-qualifier

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Configure environment variables
cp ../.env.example .env
# Edit .env with your actual values

# 5. Initialize the database
cd ../backend
node db/init.js

# 6. Start the backend (in one terminal)
npm run dev

# 7. Start the frontend (in another terminal)
cd ../frontend
npm run dev
```

The frontend runs at http://localhost:3000 and the backend at http://localhost:3001.

## Bolna Agent Configuration

1. Log in to [platform.bolna.ai](https://platform.bolna.ai)
2. Create a new agent with the following system prompt:

> "You are Aria, a friendly sales assistant. Qualify the lead by asking these questions one at a time:
> 1. What problem are you trying to solve?
> 2. Do you have a budget allocated for this?
> 3. What is your expected timeline to implement a solution?
> 4. Are you the decision-maker, or is someone else involved?
> 5. Have you evaluated any other tools?
> Keep responses brief. Be natural. Do not sound scripted."

3. Copy the Agent ID and add it to your `.env` as `BOLNA_AGENT_ID`.
4. Generate an API key from the dashboard and add it as `BOLNA_API_KEY`.
5. Set your webhook URL to: `https://<your-backend-url>/webhook/bolna`

## API Reference

### POST /api/leads
Submit a new lead and trigger an outbound qualification call.

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "phone": "+14155551234",
  "company": "Acme Corp",
  "use_case": "We need to automate our customer support"
}
```

**Response (201):**
```json
{
  "id": 1,
  "call_id": "bolna_call_abc123",
  "message": "Lead saved and call initiated"
}
```

---

### GET /api/leads
Fetch all leads ordered by most recently submitted.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@acme.com",
    "phone": "+14155551234",
    "company": "Acme Corp",
    "call_status": "completed",
    "qualification": "hot",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### GET /api/leads/:id
Fetch a single lead including full call transcript.

**Response (200):**
```json
{
  "id": 1,
  "name": "Jane Smith",
  "transcript": "Agent: Hi Jane, this is Aria...",
  "qualification": "hot",
  "call_status": "completed"
}
```

---

### POST /webhook/bolna
Receive call completion data from Bolna. Updates lead qualification and transcript.

**Payload:** Bolna webhook format with transcript and extracted variables.

**Response (200):**
```json
{ "received": true }
```

## Demo

[Add deployed link or screen recording link here]
