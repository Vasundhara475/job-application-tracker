// 📊 Stats Controller
const Application = require('../models/Application');

// @desc    Get summary stats
// @route   GET /api/stats/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Application.countDocuments({ user: userId });
    const applied = await Application.countDocuments({ user: userId, status: 'Applied' });
    const interviews = await Application.countDocuments({ user: userId, status: 'Interview' });
    const offers = await Application.countDocuments({ user: userId, status: 'Offer' });
    const rejected = await Application.countDocuments({ user: userId, status: 'Rejected' });
    const accepted = await Application.countDocuments({ user: userId, status: 'Accepted' });

    // Response rate: (interview + offer + accepted) / total * 100
    const responseRate = total > 0 ? (((interviews + offers + accepted) / total) * 100).toFixed(1) : 0;

    // Recent applications (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = await Application.countDocuments({
      user: userId,
      createdAt: { $gte: weekAgo },
    });

    res.json({
      total,
      applied,
      interviews,
      offers,
      rejected,
      accepted,
      responseRate,
      recentCount,
    });
  } catch (error) {
    res.status(500).json({ message: '💥 Error fetching stats' });
  }
};

// @desc    Get funnel data
// @route   GET /api/stats/funnel
// @access  Private
const getFunnel = async (req, res) => {
  try {
    const stages = ['Saved', 'Applied', 'OA', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected'];

    const funnel = await Promise.all(
      stages.map(async (stage) => ({
        stage,
        count: await Application.countDocuments({ user: req.user._id, status: stage }),
      }))
    );

    // Source breakdown
    const sources = await Application.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ funnel, sources });
  } catch (error) {
    res.status(500).json({ message: '💥 Error fetching funnel' });
  }
};

// @desc    Get weekly application counts
// @route   GET /api/stats/weekly
// @access  Private
const getWeekly = async (req, res) => {
  try {
    const sixWeeksAgo = new Date(Date.now() - 42 * 24 * 60 * 60 * 1000);

    const weekly = await Application.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: sixWeeksAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ weekly });
  } catch (error) {
    res.status(500).json({ message: '💥 Error fetching weekly data' });
  }
};

module.exports = { getSummary, getFunnel, getWeekly };