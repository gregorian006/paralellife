const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiControllers');

// Endpoint: POST http://localhost:3000/api/ai/predict
router.post('/predict', aiController.getPrediction);

module.exports = router;