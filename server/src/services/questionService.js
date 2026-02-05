const { Question, Chapter, Course, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class QuestionService {
  async getAllByChapter(chapterId, options = {}) {
    const chapter = await Chapter.findByPk(chapterId);
    
    if (!chapter) {
      throw new AppError('Chapter not found', 404, 'NOT_FOUND');
    }

    const { difficulty, objective } = options;
    const where = { chapter_id: chapterId };
    
    if (difficulty) where.difficulty = difficulty;
    if (objective) where.objective = objective;

    return Question.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'full_name']
      }],
      order: [['created_at', 'ASC']]
    });
  }

  async getById(id, userId = null, isAdmin = false) {
    const question = await Question.findByPk(id, {
      include: [
        {
          model: Chapter,
          as: 'chapter',
          include: [{
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'created_by']
          }]
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'full_name']
        }
      ]
    });

    if (!question) {
      throw new AppError('Question not found', 404, 'NOT_FOUND');
    }

    // Check course ownership for non-admin users
    if (!isAdmin && userId && question.chapter.course.created_by !== userId) {
      throw new AppError('Not authorized to view this question', 403, 'FORBIDDEN');
    }

    return question;
  }

  async create(chapterId, data, userId, isAdmin = false) {
    const chapter = await Chapter.findByPk(chapterId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!chapter) {
      throw new AppError('Chapter not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && chapter.course.created_by !== userId) {
      throw new AppError('Not authorized to create questions for this course', 403, 'FORBIDDEN');
    }

    const { questionText, choice1, choice2, choice3, correctAnswer, difficulty, objective } = data;

    const question = await Question.create({
      chapter_id: chapterId,
      question_text: questionText,
      choice_1: choice1,
      choice_2: choice2,
      choice_3: choice3,
      correct_answer: correctAnswer,
      difficulty,
      objective,
      created_by: userId
    });

    return this.getById(question.id);
  }

  async update(id, data, userId, isAdmin = false) {
    const question = await Question.findByPk(id, {
      include: [{
        model: Chapter,
        as: 'chapter',
        include: [{ model: Course, as: 'course' }]
      }]
    });

    if (!question) {
      throw new AppError('Question not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && question.chapter.course.created_by !== userId) {
      throw new AppError('Not authorized to update this question', 403, 'FORBIDDEN');
    }

    const updateData = {};
    if (data.questionText) updateData.question_text = data.questionText;
    if (data.choice1) updateData.choice_1 = data.choice1;
    if (data.choice2) updateData.choice_2 = data.choice2;
    if (data.choice3) updateData.choice_3 = data.choice3;
    if (data.correctAnswer) updateData.correct_answer = data.correctAnswer;
    if (data.difficulty) updateData.difficulty = data.difficulty;
    if (data.objective) updateData.objective = data.objective;

    await question.update(updateData);

    return this.getById(id);
  }

  async delete(id, userId, isAdmin = false) {
    const question = await Question.findByPk(id, {
      include: [{
        model: Chapter,
        as: 'chapter',
        include: [{ model: Course, as: 'course' }]
      }]
    });

    if (!question) {
      throw new AppError('Question not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && question.chapter.course.created_by !== userId) {
      throw new AppError('Not authorized to delete this question', 403, 'FORBIDDEN');
    }

    await question.destroy();

    return { message: 'Question deleted successfully' };
  }

  async getStatsByChapter(chapterId) {
    const chapter = await Chapter.findByPk(chapterId);
    
    if (!chapter) {
      throw new AppError('Chapter not found', 404, 'NOT_FOUND');
    }

    const questions = await Question.findAll({
      where: { chapter_id: chapterId },
      attributes: ['difficulty', 'objective']
    });

    const stats = {
      total: questions.length,
      byDifficulty: { simple: 0, difficult: 0 },
      byObjective: { reminding: 0, understanding: 0, creativity: 0 }
    };

    questions.forEach(q => {
      stats.byDifficulty[q.difficulty]++;
      stats.byObjective[q.objective]++;
    });

    return stats;
  }
}

module.exports = new QuestionService();
