const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { detectFraud } = require('../services/aiService');

// Known M-Pesa scam patterns
const SCAM_PATTERNS = [
  { pattern: /you have won/i, type: 'lottery_scam', severity: 'high' },
  { pattern: /safaricom refund/i, type: 'refund_scam', severity: 'high' },
  { pattern: /send ksh.*to receive/i, type: 'advance_fee', severity: 'high' },
  { pattern: /mpesa agent.*pin/i, type: 'phishing', severity: 'high' },
  { pattern: /reversal.*error/i, type: 'reversal_scam', severity: 'medium' },
  { pattern: /bonus.*airtime/i, type: 'fake_bonus', severity: 'medium' },
];

function ruleBasedFraudCheck(transaction) {
  for (const { pattern, type, severity } of SCAM_PATTERNS) {
    if (pattern.test(transaction.description)) {
      return { flagged: true, alert_type: type, severity, fraud_score: severity === 'high' ? 90 : 60 };
    }
  }
  return { flagged: false };
}

// Scan all unscanned transactions for fraud
router.post('/scan', authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    // Get unscanned transactions
    const txResult = await pool.query(
      `SELECT id, description, amount, type, date FROM transactions
       WHERE user_id = $1 AND fraud_score = 0 AND type = 'debit'
       ORDER BY date DESC LIMIT 100`,
      [req.user.id]
    );

    if (txResult.rows.length === 0) {
      return res.json({ message: 'No new transactions to scan', alerts: [] });
    }

    // Get user spending stats for AI context
    const statsResult = await pool.query(
      `SELECT AVG(amount) as avg_amount, MIN(amount) as min_amount, MAX(amount) as max_amount
       FROM transactions WHERE user_id = $1 AND type = 'debit'`,
      [req.user.id]
    );
    const stats = statsResult.rows[0];

    const userHistory = {
      avgMonthlySpend: parseFloat(stats.avg_amount) || 0,
      minTypical: parseFloat(stats.min_amount) || 0,
      maxTypical: parseFloat(stats.max_amount) || 0
    };

    const alerts = [];
    await client.query('BEGIN');

    for (const tx of txResult.rows) {
      // Rule-based check first (fast, no API cost)
      const ruleCheck = ruleBasedFraudCheck(tx);

      let fraudScore = ruleCheck.fraud_score || 0;
      let alertType = ruleCheck.alert_type || null;
      let severity = ruleCheck.severity || null;

      // AI check for high-value transactions (>5x avg)
      if (!ruleCheck.flagged && tx.amount > (userHistory.avgMonthlySpend * 5) && tx.amount > 10000) {
        const aiResult = await detectFraud(tx, userHistory);
        fraudScore = aiResult.fraud_score || 0;
        alertType = aiResult.alert_type;
        severity = aiResult.severity;
      }

      // Update fraud score on transaction
      await client.query(
        'UPDATE transactions SET fraud_score = $1, is_flagged = $2 WHERE id = $3',
        [fraudScore, fraudScore > 50, tx.id]
      );

      // Create alert if flagged
      if (fraudScore > 50) {
        const alertResult = await client.query(
          `INSERT INTO fraud_alerts (user_id, transaction_id, alert_type, severity, description)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [req.user.id, tx.id, alertType, severity,
           `Suspicious transaction detected: "${tx.description}" - KSH ${tx.amount}`]
        );
        alerts.push({ ...alertResult.rows[0], transaction: tx });
      }
    }

    await client.query('COMMIT');

    res.json({
      message: `Scanned ${txResult.rows.length} transactions`,
      alertCount: alerts.length,
      alerts
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Fraud scan failed' });
  } finally {
    client.release();
  }
});

// Get all fraud alerts
router.get('/alerts', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT fa.*, t.description as tx_description, t.amount as tx_amount, t.date as tx_date
       FROM fraud_alerts fa
       JOIN transactions t ON fa.transaction_id = t.id
       WHERE fa.user_id = $1
       ORDER BY fa.created_at DESC`,
      [req.user.id]
    );
    res.json({ alerts: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Resolve/dismiss an alert
router.patch('/alerts/:id/resolve', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE fraud_alerts SET resolved = TRUE
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Alert not found' });
    res.json({ alert: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

// Fraud statistics summary
router.get('/stats', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         COUNT(*) as total_alerts,
         COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_severity,
         COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_severity,
         COUNT(CASE WHEN resolved = FALSE THEN 1 END) as unresolved,
         COUNT(CASE WHEN resolved = TRUE THEN 1 END) as resolved
       FROM fraud_alerts WHERE user_id = $1`,
      [req.user.id]
    );
    res.json({ stats: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fraud stats' });
  }
});

module.exports = router;