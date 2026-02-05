const { Course, Chapter, User, Question } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class CourseService {
  async getAll(options = {}, userId = null, isAdmin = false) {
    const { page = 1, limit = 10, search } = options;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    // Non-admin users can only see their own courses
    if (!isAdmin && userId) {
      where.created_by = userId;
    }

    const { count, rows } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'full_name']
        },
        {
          model: Chapter,
          as: 'chapters',
          attributes: ['id', 'chapterNumber', 'title']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      courses: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  async getById(id, userId = null, isAdmin = false) {
    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'full_name']
        },
        {
          model: Chapter,
          as: 'chapters',
          attributes: ['id', 'chapterNumber', 'title'],
          include: [{
            model: Question,
            as: 'questions',
            attributes: ['id', 'difficulty', 'objective']
          }]
        }
      ]
    });

    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }

    // Check ownership for non-admin users
    if (!isAdmin && userId && course.created_by !== userId) {
      throw new AppError('Not authorized to view this course', 403, 'FORBIDDEN');
    }

    return course;
  }

  async create(data, userId) {
    const { name, description } = data;

    const course = await Course.create({
      name,
      description,
      created_by: userId
    });

    return this.getById(course.id);
  }

  async update(id, data, userId, isAdmin = false) {
    const course = await Course.findByPk(id);

    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }

    // Check ownership (admin bypass)
    if (!isAdmin && course.created_by !== userId) {
      throw new AppError('Not authorized to update this course', 403, 'FORBIDDEN');
    }

    await course.update(data);

    return this.getById(id);
  }

  async delete(id, userId, isAdmin = false) {
    const course = await Course.findByPk(id);

    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }

    // Check ownership (admin bypass)
    if (!isAdmin && course.created_by !== userId) {
      throw new AppError('Not authorized to delete this course', 403, 'FORBIDDEN');
    }

    await course.destroy();

    return { message: 'Course deleted successfully' };
  }

  async getAllQuestions(courseId, userId = null, isAdmin = false) {
    const course = await Course.findByPk(courseId, {
      include: [{
        model: Chapter,
        as: 'chapters',
        include: [{
          model: Question,
          as: 'questions'
        }]
      }]
    });

    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }

    // Check course ownership for non-admin users
    if (!isAdmin && userId && course.created_by !== userId) {
      throw new AppError('Not authorized to view questions for this course', 403, 'FORBIDDEN');
    }

    // Flatten questions from all chapters
    const questions = [];
    for (const chapter of course.chapters) {
      for (const question of chapter.questions) {
        questions.push({
          ...question.toJSON(),
          chapter: {
            id: chapter.id,
            chapterNumber: chapter.chapterNumber,
            title: chapter.title
          }
        });
      }
    }

    return questions;
  }
}

module.exports = new CourseService();
