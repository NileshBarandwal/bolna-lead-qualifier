const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

function scoreCall(extractedData) {
  if (!extractedData || typeof extractedData !== 'object') {
    return 'cold';
  }

  const budgetConfirmed = Boolean(extractedData.budget_confirmed);
  const isDecisionMaker = Boolean(extractedData.is_decision_maker);
  const timeline = extractedData.timeline || '';

  const isShortTimeline = parseTimelineToMonths(timeline) < 3;

  const criteriaCount = [budgetConfirmed, isDecisionMaker, isShortTimeline].filter(Boolean).length;

  if (criteriaCount === 3) return 'hot';
  if (criteriaCount >= 2) return 'warm';
  return 'cold';
}

function parseTimelineToMonths(timeline) {
  if (!timeline) return Infinity;

  const lower = timeline.toLowerCase();

  if (/asap|immediately|now|urgent/i.test(lower)) return 0.5;

  const weekMatch = lower.match(/(\d+)\s*week/);
  if (weekMatch) return parseInt(weekMatch[1], 10) / 4;

  const monthMatch = lower.match(/(\d+)\s*month/);
  if (monthMatch) return parseInt(monthMatch[1], 10);

  const yearMatch = lower.match(/(\d+)\s*year/);
  if (yearMatch) return parseInt(yearMatch[1], 10) * 12;

  if (/q1|q2|q3/i.test(lower)) return 6;
  if (/q4/i.test(lower)) return 9;

  return Infinity;
}

// POST /webhook/bolna
router.post('/bolna', (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const callId = payload.call_id || payload.id;
    const transcript = payload.transcript || null;
    const extractedData = payload.extracted_data || payload.variables || null;

    if (!callId) {
      return res.status(400).json({ error: 'Missing call_id in webhook payload' });
    }

    const qualification = scoreCall(extractedData);
    const now = new Date().toISOString();

    const db = getDb();
    const result = db.prepare(
      `UPDATE leads
       SET call_status = 'completed',
           qualification = ?,
           transcript = ?,
           raw_webhook_payload = ?,
           updated_at = ?
       WHERE call_id = ?`
    ).run(
      qualification,
      transcript || '',
      JSON.stringify(payload),
      now,
      callId
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'No lead found for this call_id' });
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
});

module.exports = router;
