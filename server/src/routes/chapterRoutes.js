const express = require('express');
const router = express.Router({ mergeParams: true });
const chapterController = require('../controllers/chapterController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate, chapterRules, idParam, courseIdParam } = require('../middleware/validation');

// GET /api/v1/courses/:courseId/chapters
router.get('/', auth, authorize('read_chapter'), courseIdParam, validate, chapterController.getAllByCourse);

// POST /api/v1/courses/:courseId/chapters
router.post('/', auth, authorize('create_chapter'), courseIdParam, chapterRules, validate, chapterController.create);

// Standalone chapter routes
const standaloneRouter = express.Router();

// GET /api/v1/chapters/:id
standaloneRouter.get('/:id', auth, authorize('read_chapter'), idParam, validate, chapterController.getById);

// PUT /api/v1/chapters/:id
standaloneRouter.put('/:id', auth, authorize('update_chapter'), idParam, chapterRules, validate, chapterController.update);

// DELETE /api/v1/chapters/:id
standaloneRouter.delete('/:id', auth, authorize('delete_chapter'), idParam, validate, chapterController.remove);

module.exports = { nestedRouter: router, standaloneRouter };
