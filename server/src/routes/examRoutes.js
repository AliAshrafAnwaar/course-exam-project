const express = require('express');
const router = express.Router({ mergeParams: true });
const examController = require('../controllers/examController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate, examRules, idParam, courseIdParam } = require('../middleware/validation');

// GET /api/v1/courses/:courseId/exams
router.get('/', auth, authorize('read_exam'), courseIdParam, validate, examController.getAllByCourse);

// POST /api/v1/courses/:courseId/exams
router.post('/', auth, authorize('create_exam'), courseIdParam, examRules, validate, examController.create);

// Standalone exam routes
const standaloneRouter = express.Router();

// GET /api/v1/exams/:id
standaloneRouter.get('/:id', auth, authorize('read_exam'), idParam, validate, examController.getById);

// PUT /api/v1/exams/:id
standaloneRouter.put('/:id', auth, authorize('update_exam'), idParam, validate, examController.update);

// POST /api/v1/exams/:id/generate
standaloneRouter.post('/:id/generate', auth, authorize('create_exam'), idParam, validate, examController.generate);

// POST /api/v1/exams/:id/questions - Set questions manually
standaloneRouter.post('/:id/questions', auth, authorize('update_exam'), idParam, validate, examController.setQuestions);

// DELETE /api/v1/exams/:id
standaloneRouter.delete('/:id', auth, authorize('delete_exam'), idParam, validate, examController.remove);

module.exports = { nestedRouter: router, standaloneRouter };
