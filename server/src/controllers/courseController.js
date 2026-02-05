const courseService = require('../services/courseService');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await courseService.getAll(
      { 
        page: parseInt(page) || 1, 
        limit: parseInt(limit) || 10,
        search 
      },
      req.user.id,
      req.isAdmin
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
    const course = await courseService.getById(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const course = await courseService.create(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const course = await courseService.update(
      req.params.id, 
      req.body, 
      req.user.id,
      req.isAdmin
    );
    res.json({
      success: true,
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await courseService.delete(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await courseService.getAllQuestions(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: { questions }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getAllQuestions
};
