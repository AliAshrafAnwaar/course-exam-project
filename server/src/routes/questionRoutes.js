const express = require('express');
const router = express.Router({ mergeParams: true });
const questionController = require('../controllers/questionController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate, questionRules, idParam, chapterIdParam } = require('../middleware/validation');

// GET /api/v1/chapters/:chapterId/questions
router.get('/', auth, authorize('read_question'), chapterIdParam, validate, questionController.getAllByChapter);

// GET /api/v1/chapters/:chapterId/questions/stats
router.get('/stats', auth, authorize('read_question'), chapterIdParam, validate, questionController.getStats);

// POST /api/v1/chapters/:chapterId/questions
router.post('/', auth, authorize('create_question'), chapterIdParam, questionRules, validate, questionController.create);

// Standalone question routes
const standaloneRouter = express.Router();

// GET /api/v1/questions/:id
standaloneRouter.get('/:id', auth, authorize('read_question'), idParam, validate, questionController.getById);

// PUT /api/v1/questions/:id
standaloneRouter.put('/:id', auth, authorize('update_question'), idParam, questionRules, validate, questionController.update);

// DELETE /api/v1/questions/:id
standaloneRouter.delete('/:id', auth, authorize('delete_question'), idParam, validate, questionController.remove);

module.exports = { nestedRouter: router, standaloneRouter };
