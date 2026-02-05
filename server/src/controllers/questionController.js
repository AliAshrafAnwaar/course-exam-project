const questionService = require('../services/questionService');

const getAllByChapter = async (req, res, next) => {
  try {
    const { difficulty, objective } = req.query;
    const questions = await questionService.getAllByChapter(
      req.params.chapterId,
      { difficulty, objective }
    );
    res.json({
      success: true,
      data: { questions }
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const question = await questionService.getById(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: { question }
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const question = await questionService.create(
      req.params.chapterId,
      req.body,
      req.user.id,
      req.isAdmin
    );
    res.status(201).json({
      success: true,
      data: { question }
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const question = await questionService.update(
      req.params.id,
      req.body,
      req.user.id,
      req.isAdmin
    );
    res.json({
      success: true,
      data: { question }
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await questionService.delete(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await questionService.getStatsByChapter(req.params.chapterId);
    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllByChapter,
  getById,
  create,
  update,
  remove,
  getStats
};
