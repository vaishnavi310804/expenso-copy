const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

// All transaction routes are protected
router.use(protect);

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get analytics for dashboard
// @route   GET /api/transactions/analytics
// @access  Private
router.get('/analytics', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Fallback logic for date boundaries
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const analytics = await Transaction.aggregate([
      { $match: { user: userId } },
      { 
        $addFields: { 
          parsedDate: { 
            $dateFromString: { 
              dateString: "$date", 
              format: "%Y-%m-%d", 
              onError: new Date(), 
              onNull: new Date() 
            } 
          }
        } 
      },
      {
        $facet: {
          currentMonth: [
            { $match: { parsedDate: { $gte: currentMonthStart } } },
            {
              $group: {
                _id: null,
                totalIncome: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
                totalExpense: { $sum: { $cond: [{ $lt: ["$amount", 0] }, { $abs: "$amount" }, 0] } }
              }
            }
          ],
          categoryDistribution: [
            { $match: { parsedDate: { $gte: currentMonthStart }, amount: { $lt: 0 } } },
            { $group: { _id: "$label", amount: { $sum: { $abs: "$amount" } } } },
            { $sort: { amount: -1 } }
          ],
          lastMonthCategoryDistribution: [
            { $match: { parsedDate: { $gte: lastMonthStart, $lt: currentMonthStart }, amount: { $lt: 0 } } },
            { $group: { _id: "$label", amount: { $sum: { $abs: "$amount" } } } }
          ],
          monthlyTrends: [
            { $match: { amount: { $lt: 0 } } },
            {
              $group: {
                _id: { year: { $year: "$parsedDate" }, month: { $month: "$parsedDate" } },
                expense: { $sum: { $abs: "$amount" } }
              }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
          ],
          weeklyTrends: [
            { $match: { amount: { $lt: 0 } } },
            {
              $group: {
                _id: { year: { $isoWeekYear: "$parsedDate" }, week: { $isoWeek: "$parsedDate" } },
                expense: { $sum: { $abs: "$amount" } }
              }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } }
          ]
        }
      }
    ]);

    const result = analytics[0];
    const currentMonthData = result.currentMonth[0] || { totalIncome: 0, totalExpense: 0 };
    const netSavings = currentMonthData.totalIncome - currentMonthData.totalExpense;

    const monthlyTrends = result.monthlyTrends.slice(-3);
    const predictedExpense = monthlyTrends.length > 0 
      ? monthlyTrends.reduce((sum, item) => sum + item.expense, 0) / monthlyTrends.length 
      : 0;

    const formatMonth = (m) => new Date(2000, m - 1).toLocaleString('default', { month: 'short' });
    const formattedMonthlyTrends = result.monthlyTrends.map(t => ({
      label: `${formatMonth(t._id.month)} ${t._id.year}`,
      expense: t.expense
    })).slice(-6);

    const formattedWeeklyTrends = result.weeklyTrends.map(t => ({
      label: `W${t._id.week} ${t._id.year}`,
      expense: t.expense
    })).slice(-8);

    const insights = [];
    const catCurr = result.categoryDistribution;
    const catLast = result.lastMonthCategoryDistribution;

    catCurr.forEach(curr => {
      const last = catLast.find(l => l._id === curr._id);
      if (last && last.amount > 0) {
        const percentChange = ((curr.amount - last.amount) / last.amount) * 100;
        if (percentChange > 20) {
          insights.push(`You are spending ${percentChange.toFixed(0)}% more on ${curr._id} compared to last month.`);
        } else if (percentChange < -20) {
          insights.push(`Great job! You spent ${Math.abs(percentChange).toFixed(0)}% less on ${curr._id} this month.`);
        }
      } else if (!last) {
         insights.push(`You spent ₹${curr.amount} on ${curr._id} this month, which is a new expense category.`);
      }
    });
    
    // Savings insight
    // Evaluate against last month's raw totals to generate a holistic message
    const lastMonthExpense = catLast.reduce((sum, l) => sum + l.amount, 0);
    if (lastMonthExpense > 0 && currentMonthData.totalExpense > lastMonthExpense) {
      insights.push(`Warning: Your total expenses this month are tracking higher than last month.`);
    }

    res.json({
      currentMonth: {
        income: currentMonthData.totalIncome,
        expense: currentMonthData.totalExpense,
        savings: netSavings
      },
      categoryDistribution: catCurr.map(c => ({ label: c._id, amount: c.amount })),
      monthlyTrends: formattedMonthlyTrends,
      weeklyTrends: formattedWeeklyTrends,
      predictedExpense: Math.round(predictedExpense),
      insights
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { label, amount, date, icon } = req.body;

    if (!label || amount === undefined || !date || !icon) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      label,
      amount,
      date,
      icon,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check for user ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check for user ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
