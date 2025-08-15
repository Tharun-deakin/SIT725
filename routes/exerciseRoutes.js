// routes/exerciseRoutes.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

router.get('/', exerciseController.getExercises);
router.post('/', exerciseController.createExercise);
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router;
