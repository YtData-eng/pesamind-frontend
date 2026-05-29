const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { generateBudgetRecommendations } = require('../services/aiService');

// Get all budgets with spending status
router.get('/', authenticate, async (req, res) => {
  const { month, year } = req.query;
  const m = parseInt(month) || new Date().getMonth() + 1;
  const y = parseInt(year) || new Date().getFullYear();

  try {
    const result = await pool.query(
      `SELECT b.id, b.category, b.amount as budget_amount, b.period, b.month, b.year,
              COALESCE(s.spent, 0) as spent,
              ROUND(COALESCE(s.spent, 0) / b.amount * 100, 1) as usage_percent
       FROM budgets b
       LEFT JOIN (
         SELECT category, SUM(amount) as spent
         FROM transactions
         WHERE user_id = $1 AND type = 'debit'
           AND EXTRACT(MONTH FROM date) = $2
           AND EXTRACT(YEAR FROM date) = $3
         GROUP BY category
       ) s ON s.category = b.category
       WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3
       ORDER BY usage_percent DESC`,
      [req.user.id, m, y]
    );

    // Flag over-budget and near-budget (>80%) categories
    const budgets = result.rows.map(b => ({
      ...b,
      status: b.usage_percent >= 100 ? 'over' : b.usage_percent >= 80 ? 'warning' : 'ok',
      remaining: Math.max(0, b.budget_amount - b.spent)
    }));

    res.json({ budgets, month: m, year: y });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Set/update a budget
router.post('/', authenticate, [
  body('category').trim().notEmpty(),
  body('amount').isFloat({ min: 1 }),
  body('month').isInt({ min: 1, max: 12 }),
  body('year').isInt({ min: 2020, max: 2100 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { category, amount, month, year } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO budgets (user_id, category, amount, month, year)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, category, month, year)
       DO UPDATE SET amount = $3
       RETURNING *`,
      [req.user.id, category, amount, month, year]
    );
    res.status(201).json({ budget: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

// Delete a budget
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// AI budget recommendations based on spending history
router.get('/recommendations', authenticate, async (req, res) => {
  try {
    const spending = await pool.query(
      `SELECT category, AVG(monthly_total) as avg_monthly
       FROM (
         SELECT category, EXTRACT(MONTH FROM date) as m, EXTRACT(YEAR FROM date) as y, SUM(amount) as monthly_total
         FROM transactions
         WHERE user_id = $1 AND type = 'debit' AND date >= NOW() - INTERVAL '3 months'
         GROUP BY category, m, y
       ) sub
       GROUP BY category ORDER BY avg_monthly DESC`,
      [req.user.id]
    );

    if (spending.rows.length === 0) {
      return res.json({ recommendations: [], message: 'Upload more statements to get personalized recommendations' });
    }

    const recommendations = await generateBudgetRecommendations(spending.rows);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Budget alerts — over budget or near limit
router.get('/alerts', authenticate, async (req, res) => {
  const m = new Date().getMonth() + 1;
  const y = new Date().getFullYear();

  try {
    const result = await pool.query(
      `SELECT b.category, b.amount as budget_amount, COALESCE(s.spent, 0) as spent,
              ROUND(COALESCE(s.spent, 0) / b.amount * 100, 1) as usage_percent
       FROM budgets b
       LEFT JOIN (
         SELECT category, SUM(amount) as spent FROM transactions
         WHERE user_id = $1 AND type = 'debit'
           AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3
         GROUP BY category
       ) s ON s.category = b.category
       WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3
         AND COALESCE(s.spent, 0) >= b.amount * 0.8`,
      [req.user.id, m, y]
    );

    const alerts = result.rows.map(r => ({
      ...r,
      level: r.usage_percent >= 100 ? 'exceeded' : 'warning',
      message: r.usage_percent >= 100
        ? `You've exceeded your ${r.category} budget by KSH ${(r.spent - r.budget_amount).toFixed(2)}`
        : `You've used ${r.usage_percent}% of your ${r.category} budget`
    }));

    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

module.exports = router;