const { getDb } = require('../db/database');

const MOCK_TRANSCRIPTS = [
  `Agent: Hi, this is Aria calling from our sales team. Is this a good time to chat for a couple of minutes?
Lead: Sure, go ahead.
Agent: Great! I wanted to follow up on your inquiry. What problem are you hoping to solve?
Lead: We're struggling to respond to customer support tickets fast enough. Our team is overwhelmed.
Agent: Got it. Do you have a budget set aside for a solution like this?
Lead: Yes, we've allocated around $2,000 per month for tooling.
Agent: Perfect. What's your timeline for getting something in place?
Lead: We need it within the next 4-6 weeks ideally.
Agent: And are you the main decision-maker, or is someone else involved in this purchase?
Lead: It's mostly me, though I'll loop in my manager before signing anything.
Agent: Understood. Have you looked at any other tools so far?
Lead: We've demoed two other vendors but haven't committed yet.
Agent: Great, that's really helpful. We'll have someone reach out with more details. Have a great day!`,

  `Agent: Hi, this is Aria from the sales team. Do you have a moment?
Lead: Yeah, make it quick.
Agent: Of course. What challenge are you trying to solve with our platform?
Lead: We want to automate some internal workflows but nothing urgent.
Agent: Is there a budget earmarked for this project?
Lead: Not really, it's more exploratory at this point.
Agent: And what's your expected timeline?
Lead: Probably later in the year, maybe Q4.
Agent: Are you the decision-maker for this?
Lead: No, that would be our VP. I'm just doing research.
Agent: Thanks for sharing that. We'll send over some resources you can review with your team.`,

  `Agent: Hello, this is Aria. Thanks for your interest! What are you looking to accomplish?
Lead: We need to reduce churn. We're losing customers faster than we can acquire them.
Agent: That's critical. Do you have a budget allocated for churn reduction tooling?
Lead: Yes, we've got a $5k monthly budget approved.
Agent: Excellent. How soon are you looking to implement something?
Lead: ASAP — within 6 weeks if possible. We're losing ground every month.
Agent: Are you the one who makes the final call on this purchase?
Lead: Yes, I'm the CEO.
Agent: And have you evaluated other solutions?
Lead: Yes, looked at two others but neither fit our use case well.
Agent: Sounds like we could be a strong fit. I'll make sure our team prioritizes your follow-up!`,
];

const MOCK_OUTCOMES = [
  { qualification: 'hot', budget: true, decision_maker: true, timeline: '4-6 weeks' },
  { qualification: 'cold', budget: false, decision_maker: false, timeline: 'Q4' },
  { qualification: 'hot', budget: true, decision_maker: true, timeline: '6 weeks' },
  { qualification: 'warm', budget: true, decision_maker: false, timeline: '2 months' },
  { qualification: 'warm', budget: false, decision_maker: true, timeline: '1 month' },
];

async function triggerOutboundCall(lead) {
  if (process.env.MOCK_BOLNA === 'true') {
    return triggerMockCall(lead);
  }

  const response = await fetch('https://api.bolna.ai/call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.BOLNA_API_KEY}`,
    },
    body: JSON.stringify({
      agent_id: process.env.BOLNA_AGENT_ID,
      recipient_phone_number: lead.phone,
      user_data: {
        name: lead.name,
        company: lead.company || '',
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Bolna API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.execution_id || data.call_id || data.id;
}

function triggerMockCall(lead) {
  const fakeCallId = `mock_call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  setTimeout(() => {
    simulateMockWebhook(lead.id, fakeCallId);
  }, 10000);

  return fakeCallId;
}

function simulateMockWebhook(leadId, callId) {
  try {
    const db = getDb();
    const outcomeIndex = Math.floor(Math.random() * MOCK_OUTCOMES.length);
    const outcome = MOCK_OUTCOMES[outcomeIndex];
    const transcript = MOCK_TRANSCRIPTS[outcomeIndex % MOCK_TRANSCRIPTS.length];

    const mockPayload = {
      call_id: callId,
      status: 'completed',
      transcript,
      extracted_data: {
        budget_confirmed: outcome.budget,
        is_decision_maker: outcome.decision_maker,
        timeline: outcome.timeline,
      },
    };

    const now = new Date().toISOString();
    db.prepare(
      `UPDATE leads
       SET call_status = 'completed',
           qualification = ?,
           transcript = ?,
           raw_webhook_payload = ?,
           updated_at = ?
       WHERE id = ?`
    ).run(
      outcome.qualification,
      transcript,
      JSON.stringify(mockPayload),
      now,
      leadId
    );
  } catch {
    // Silently fail mock webhook — lead remains in 'in_progress' state
  }
}

module.exports = { triggerOutboundCall };
