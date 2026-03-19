# AI Lead Qualification Voice Agent

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bolna--lead--qualifier.vercel.app-brightgreen?style=flat-square&logo=vercel)](https://bolna-lead-qualifier.vercel.app)
[![GitHub commits](https://img.shields.io/github/commit-activity/t/NileshBarandwal/bolna-lead-qualifier?style=flat-square&logo=github)](https://github.com/NileshBarandwal/bolna-lead-qualifier/commits/main)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org)

## Problem

Sales teams waste hours manually calling and qualifying inbound leads from web forms. Most leads are low-intent, and SDRs spend 70% of their time on leads that never convert — leaving high-value prospects waiting and pipeline data stale.

## Solution

This app automates outbound lead qualification using a Voice AI agent built on Bolna's platform. When a lead submits a form, the system immediately triggers a personalized phone call. The AI agent asks 4–5 qualifying questions, extracts structured data from the conversation, and automatically scores each lead as Hot, Warm, or Cold — without any human SDR involvement.

## Assignment Overview — Bolna FSE (Full Stack Engineer)

| Objective | Status | Details |
|---|---|---|
| 1. Enterprise Use Case | ✅ | AI-powered outbound lead qualification |
| 2. Voice AI Agent on Bolna | ✅ | Agent "Aria" built on platform.bolna.ai |
| 3. Web App | ✅ | Next.js 14 frontend + Express backend |
| 4. Full Flow Demo | ✅ | Form → Agent → Webhook → Dashboard |
| 5. Submission | ✅ | GitHub + Vercel + Screen recording |

## Architecture

```
User fills form → Backend saves lead → Bolna Voice Agent calls lead →
Agent qualifies lead → Webhook updates DB → Dashboard shows result
```

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, SQLite
- **Voice AI:** Bolna ([platform.bolna.ai](https://platform.bolna.ai))

## Mock Mode (Demo without a phone)

`MOCK_BOLNA=true` simulates the Bolna outbound call flow locally. When enabled:

- Submitting a lead instantly returns a fake `call_id`
- After **10 seconds**, the backend simulates a webhook callback internally
- The lead is automatically scored **Hot / Warm / Cold** with a realistic transcript
- The dashboard updates on its 15-second poll cycle

Set `MOCK_BOLNA=false` and add real `BOLNA_API_KEY` / `BOLNA_AGENT_ID` credentials to trigger actual phone calls via the Bolna platform.

## Local Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/NileshBarandwal/bolna-lead-qualifier.git
cd bolna-lead-qualifier

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Configure environment variables
cd ../backend
cp ../.env.example .env
# For a local demo, MOCK_BOLNA=true is already set — no API keys needed

# 5. Start the backend (Terminal 1)
npm run dev

# 6. Start the frontend (Terminal 2)
cd ../frontend
npm run dev
```

The frontend runs at http://localhost:3000 and the backend at http://localhost:3001.

Open http://localhost:3000 to submit a lead, then watch http://localhost:3000/dashboard update within ~15 seconds.

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

## Qualification Scoring

| Score | Criteria | Action |
|---|---|---|
| 🔴 Hot | Budget confirmed + Decision maker + Timeline < 3 months | Immediate follow-up |
| 🟡 Warm | 2 of the above criteria met | Nurture within 48 hours |
| 🔵 Cold | No budget or no clear timeline | Long-term nurture campaign |

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

- **Frontend (Live):** https://bolna-lead-qualifier.vercel.app
- **Backend API (Live):** https://bolna-lead-qualifier.onrender.com
- **GitHub:** https://github.com/NileshBarandwal/bolna-lead-qualifier
