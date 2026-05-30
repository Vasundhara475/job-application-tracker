// 📊 Stats Routes
const express = require('express');
const { getSummary, getFunnel, getWeekly } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/funnel', getFunnel);
router.get('/weekly', getWeekly);

module.exports = router;