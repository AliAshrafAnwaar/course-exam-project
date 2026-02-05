const chapterService = require('../services/chapterService');

const getAllByCourse = async (req, res, next) => {
  try {
    const chapters = await chapterService.getAllByCourse(req.params.courseId);
    res.json({
      success: true,
      data: { chapters }
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const chapter = await chapterService.getById(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: { chapter }
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const chapter = await chapterService.create(
      req.params.courseId, 
      req.body, 
      req.user.id,
      req.isAdmin
    );
    res.status(201).json({
      success: true,
      data: { chapter }
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const chapter = await chapterService.update(
      req.params.id, 
      req.body, 
      req.user.id,
      req.isAdmin
    );
    res.json({
      success: true,
      data: { chapter }
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await chapterService.delete(req.params.id, req.user.id, req.isAdmin);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllByCourse,
  getById,
  create,
  update,
  remove
};
