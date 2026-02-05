const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const { nestedRouter: chapterNestedRoutes, standaloneRouter: chapterRoutes } = require('./chapterRoutes');
const { nestedRouter: questionNestedRoutes, standaloneRouter: questionRoutes } = require('./questionRoutes');
const { nestedRouter: examNestedRoutes, standaloneRouter: examRoutes } = require('./examRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Course routes
router.use('/courses', courseRoutes);

// Nested routes under courses
router.use('/courses/:courseId/chapters', chapterNestedRoutes);
router.use('/courses/:courseId/exams', examNestedRoutes);

// Standalone chapter routes
router.use('/chapters', chapterRoutes);

// Nested routes under chapters
router.use('/chapters/:chapterId/questions', questionNestedRoutes);

// Standalone question routes
router.use('/questions', questionRoutes);

// Standalone exam routes
router.use('/exams', examRoutes);

module.exports = router;
