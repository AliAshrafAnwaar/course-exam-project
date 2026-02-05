const { validationResult, body, param, query } = require('express-validator');
const { AppError } = require('./errorHandler');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const details = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details
      }
    });
  }
  
  next();
};

// Auth validation rules
const registerRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Full name must be less than 100 characters')
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Course validation rules
const courseRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Course name is required')
    .isLength({ max: 255 }).withMessage('Course name must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
];

// Chapter validation rules
const chapterRules = [
  body('chapterNumber')
    .notEmpty().withMessage('Chapter number is required')
    .isInt({ min: 1 }).withMessage('Chapter number must be a positive integer'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Title must be less than 255 characters')
];

// Question validation rules
const questionRules = [
  body('questionText')
    .trim()
    .notEmpty().withMessage('Question text is required'),
  body('choice1')
    .trim()
    .notEmpty().withMessage('Choice 1 is required')
    .isLength({ max: 500 }).withMessage('Choice must be less than 500 characters'),
  body('choice2')
    .trim()
    .notEmpty().withMessage('Choice 2 is required')
    .isLength({ max: 500 }).withMessage('Choice must be less than 500 characters'),
  body('choice3')
    .trim()
    .notEmpty().withMessage('Choice 3 is required')
    .isLength({ max: 500 }).withMessage('Choice must be less than 500 characters'),
  body('correctAnswer')
    .notEmpty().withMessage('Correct answer is required')
    .isInt({ min: 1, max: 3 }).withMessage('Correct answer must be 1, 2, or 3'),
  body('difficulty')
    .notEmpty().withMessage('Difficulty is required')
    .isIn(['simple', 'difficult']).withMessage('Difficulty must be simple or difficult'),
  body('objective')
    .notEmpty().withMessage('Objective is required')
    .isIn(['reminding', 'understanding', 'creativity']).withMessage('Invalid objective')
];

// Exam validation rules
const examRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Exam name is required')
    .isLength({ max: 255 }).withMessage('Exam name must be less than 255 characters'),
  body('chapterRequirements')
    .isArray({ min: 1 }).withMessage('At least one chapter requirement is needed'),
  body('chapterRequirements.*.chapterId')
    .notEmpty().withMessage('Chapter ID is required')
    .isInt().withMessage('Chapter ID must be an integer'),
  body('chapterRequirements.*.questionCount')
    .notEmpty().withMessage('Question count is required')
    .isInt({ min: 1 }).withMessage('Question count must be at least 1'),
  body('difficultyRequirements.simple')
    .optional()
    .isInt({ min: 0 }).withMessage('Simple count must be non-negative'),
  body('difficultyRequirements.difficult')
    .optional()
    .isInt({ min: 0 }).withMessage('Difficult count must be non-negative'),
  body('objectiveRequirements.reminding')
    .optional()
    .isInt({ min: 0 }).withMessage('Reminding count must be non-negative'),
  body('objectiveRequirements.understanding')
    .optional()
    .isInt({ min: 0 }).withMessage('Understanding count must be non-negative'),
  body('objectiveRequirements.creativity')
    .optional()
    .isInt({ min: 0 }).withMessage('Creativity count must be non-negative')
];

// ID param validation
const idParam = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid ID')
];

const courseIdParam = [
  param('courseId')
    .isInt({ min: 1 }).withMessage('Invalid course ID')
];

const chapterIdParam = [
  param('chapterId')
    .isInt({ min: 1 }).withMessage('Invalid chapter ID')
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  courseRules,
  chapterRules,
  questionRules,
  examRules,
  idParam,
  courseIdParam,
  chapterIdParam
};
