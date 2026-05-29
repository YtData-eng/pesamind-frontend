const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { generateFinancialSummary } = require('../services/aiService');

// Spending overview (totals, by category, by month)
router.get('/overview', authenticate, async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user.id;

  try {
    // Date filter
    let dateFilter = '';
    const params = [userId];
    if (month && year) {
      dateFilter = `AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3`;
      params.push(parseInt(month), parseInt(year));
    } else if (year) {
      dateFilter = `AND EXTRACT(YEAR FROM date) = $2`;
      params.push(parseInt(year));
    }

    // Total income and expenses
    const totals = await pool.query(
      `SELECT
         SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_income,
         SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_expenses,
         COUNT(*) as transaction_count
       FROM transactions WHERE user_id = $1 ${dateFilter}`,
      params
    );

    // Spending by category
    const byCategory = await pool.query(
      `SELECT category,
         SUM(amount) as total,
         COUNT(*) as count,
         ROUND(AVG(amount)::numeric, 2) as avg_amount
       FROM transactions
       WHERE user_id = $1 AND type = 'debit' ${dateFilter}
       GROUP BY category ORDER BY total DESC`,
      params
    );

    // Monthly trend (last 6 months)
    const trend = await pool.query(
      `SELECT
         EXTRACT(YEAR FROM date) as year,
         EXTRACT(MONTH FROM date) as month,
         SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as income,
         SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as expenses
       FROM transactions
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '6 months'
       GROUP BY year, month ORDER BY year, month`,
      [userId]
    );

    // Top 10 transactions
    const topTransactions = await pool.query(
      `SELECT date, description, amount, type, category
       FROM transactions WHERE user_id = $1 AND type = 'debit' ${dateFilter}
       ORDER BY amount DESC LIMIT 10`,
      params
    );

    const t = totals.rows[0];
    const savingsRate = t.total_income > 0
      ? Math.round(((t.total_income - t.total_expenses) / t.total_income) * 100)
      : 0;

    res.json({
      totals: {
        income: parseFloat(t.total_income) || 0,
        expenses: parseFloat(t.total_expenses) || 0,
        savings: (parseFloat(t.total_income) || 0) - (parseFloat(t.total_expenses) || 0),
        savingsRate,
        transactionCount: parseInt(t.transaction_count)
      },
      byCategory: byCategory.rows,
      monthlyTrend: trend.rows,
      topTransactions: topTransactions.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// AI-powered monthly summary
router.get('/summary', authenticate, async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user.id;

  try {
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();

    const result = await pool.query(
      `SELECT
         SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_income,
         SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_expenses,
         COUNT(*) as transaction_count
       FROM transactions
       WHERE user_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3`,
      [userId, m, y]
    );

    const catResult = await pool.query(
      `SELECT category, SUM(amount) as total FROM transactions
       WHERE user_id = $1 AND type = 'debit' AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3
       GROUP BY category ORDER BY total DESC LIMIT 5`,
      [userId, m, y]
    );

    const stats = result.rows[0];
    const income = parseFloat(stats.total_income) || 0;
    const expenses = parseFloat(stats.total_expenses) || 0;
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

    const summary = await generateFinancialSummary({
      period: `${new Date(y, m - 1).toLocaleString('default', { month: 'long' })} ${y}`,
      totalIncome: income,
      totalExpenses: expenses,
      savingsRate,
      topCategories: catResult.rows,
      transactionCount: parseInt(stats.transaction_count)
    });

    res.json({ summary, month: m, year: y, stats: { income, expenses, savingsRate } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Transaction search and filter
router.get('/transactions', authenticate, async (req, res) => {
  const { category, type, start_date, end_date, min_amount, max_amount, page = 1, limit = 20 } = req.query;
  const userId = req.user.id;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = ['user_id = $1'];
    const params = [userId];
    let i = 2;

    if (category) { conditions.push(`category = $${i++}`); params.push(category); }
    if (type) { conditions.push(`type = $${i++}`); params.push(type); }
    if (start_date) { conditions.push(`date >= $${i++}`); params.push(start_date); }
    if (end_date) { conditions.push(`date <= $${i++}`); params.push(end_date); }
    if (min_amount) { conditions.push(`amount >= $${i++}`); params.push(parseFloat(min_amount)); }
    if (max_amount) { conditions.push(`amount <= $${i++}`); params.push(parseFloat(max_amount)); }

    const whereClause = conditions.join(' AND ');

    const countResult = await pool.query(`SELECT COUNT(*) FROM transactions WHERE ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit), offset);
    const result = await pool.query(
      `SELECT id, date, description, amount, type, category, subcategory, balance, is_flagged
       FROM transactions WHERE ${whereClause}
       ORDER BY date DESC LIMIT $${i} OFFSET $${i + 1}`,
      params
    );

    res.json({
      transactions: result.rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;