const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate, courseRules, idParam } = require('../middleware/validation');

// GET /api/v1/courses
router.get('/', auth, authorize('read_course'), courseController.getAll);

// GET /api/v1/courses/:id
router.get('/:id', auth, authorize('read_course'), idParam, validate, courseController.getById);

// POST /api/v1/courses
router.post('/', auth, authorize('create_course'), courseRules, validate, courseController.create);

// PUT /api/v1/courses/:id
router.put('/:id', auth, authorize('update_course'), idParam, courseRules, validate, courseController.update);

// DELETE /api/v1/courses/:id
router.delete('/:id', auth, authorize('delete_course'), idParam, validate, courseController.remove);

// GET /api/v1/courses/:id/questions - Get all questions in a course
router.get('/:id/questions', auth, authorize('read_question'), idParam, validate, courseController.getAllQuestions);

module.exports = router;
