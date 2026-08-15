const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulation.controller');

router.get('/health', simulationController.health);
router.get('/algorithms', simulationController.getAlgorithms);
router.post('/simulate', simulationController.simulate);
router.post('/compare', simulationController.compare);

module.exports = router;
