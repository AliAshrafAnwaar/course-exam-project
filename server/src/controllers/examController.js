const examService = require('../services/examService');

const getAllByCourse = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await examService.getAllByCourse(
      req.params.courseId,
      { page: parseInt(page) || 1, limit: parseInt(limit) || 10 }
    );
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const exam = await examService.getById(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const exam = await examService.create(
      req.params.courseId,
      req.body,
      req.user.id,
      req.isAdmin
    );
    res.status(201).json({
      success: true,
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await examService.delete(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const generate = async (req, res, next) => {
  try {
    // This will be implemented with the Genetic Algorithm in Phase 3
    const optimizationService = require('../services/optimizationService');
    const result = await optimizationService.generateExam(req.params.id, req.body.options);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const exam = await examService.update(req.params.id, req.body, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

const setQuestions = async (req, res, next) => {
  try {
    const { questionIds } = req.body;
    const exam = await examService.setQuestions(req.params.id, questionIds, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllByCourse,
  getById,
  create,
  remove,
  generate,
  update,
  setQuestions
};
