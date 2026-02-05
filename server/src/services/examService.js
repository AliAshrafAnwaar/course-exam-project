const { Exam, ExamChapterRequirement, ExamQuestion, Course, Chapter, Question, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { sequelize } = require('../config/database');

class ExamService {
  async getAllByCourse(courseId, options = {}) {
    const course = await Course.findByPk(courseId);
    
    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }

    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await Exam.findAndCountAll({
      where: { course_id: courseId },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'full_name']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      exams: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  async getById(id, userId = null, isAdmin = false) {
    const exam = await Exam.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name', 'created_by']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'full_name']
        },
        {
          model: ExamChapterRequirement,
          as: 'chapterRequirements',
          include: [{
            model: Chapter,
            as: 'chapter',
            attributes: ['id', 'chapterNumber', 'title']
          }]
        },
        {
          model: Question,
          as: 'questions',
          through: { attributes: ['question_order'] },
          include: [{
            model: Chapter,
            as: 'chapter',
            attributes: ['id', 'chapterNumber', 'title']
          }]
        }
      ]
    });

    if (!exam) {
      throw new AppError('Exam not found', 404, 'NOT_FOUND');
    }

    // Check course ownership for non-admin users
    if (!isAdmin && userId && exam.course.created_by !== userId) {
      throw new AppError('Not authorized to view this exam', 403, 'FORBIDDEN');
    }

    return exam;
  }

  async create(courseId, data, userId, isAdmin = false) {
    const course = await Course.findByPk(courseId, {
      include: [{ model: Chapter, as: 'chapters' }]
    });

    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && course.created_by !== userId) {
      throw new AppError('Not authorized to create exams for this course', 403, 'FORBIDDEN');
    }

    const { 
      name, 
      chapterRequirements, 
      difficultyRequirements = {}, 
      objectiveRequirements = {} 
    } = data;

    // Calculate totals
    const totalQuestions = chapterRequirements.reduce(
      (sum, req) => sum + req.questionCount, 0
    );

    const reqSimple = difficultyRequirements.simple || 0;
    const reqDifficult = difficultyRequirements.difficult || 0;
    const reqReminding = objectiveRequirements.reminding || 0;
    const reqUnderstanding = objectiveRequirements.understanding || 0;
    const reqCreativity = objectiveRequirements.creativity || 0;

    // Validate totals match
    if (reqSimple + reqDifficult !== 0 && reqSimple + reqDifficult !== totalQuestions) {
      throw new AppError(
        'Difficulty counts must equal total questions',
        400,
        'VALIDATION_ERROR'
      );
    }

    if (reqReminding + reqUnderstanding + reqCreativity !== 0 && 
        reqReminding + reqUnderstanding + reqCreativity !== totalQuestions) {
      throw new AppError(
        'Objective counts must equal total questions',
        400,
        'VALIDATION_ERROR'
      );
    }

    // Validate chapter IDs belong to course
    const courseChapterIds = course.chapters.map(c => c.id);
    for (const req of chapterRequirements) {
      if (!courseChapterIds.includes(req.chapterId)) {
        throw new AppError(
          `Chapter ${req.chapterId} does not belong to this course`,
          400,
          'VALIDATION_ERROR'
        );
      }
    }

    // Create exam in transaction
    const exam = await sequelize.transaction(async (t) => {
      const newExam = await Exam.create({
        name,
        course_id: courseId,
        created_by: userId,
        total_questions: totalQuestions,
        req_simple_count: reqSimple,
        req_difficult_count: reqDifficult,
        req_reminding_count: reqReminding,
        req_understanding_count: reqUnderstanding,
        req_creativity_count: reqCreativity
      }, { transaction: t });

      // Create chapter requirements
      await Promise.all(
        chapterRequirements.map(req =>
          ExamChapterRequirement.create({
            exam_id: newExam.id,
            chapter_id: req.chapterId,
            required_question_count: req.questionCount
          }, { transaction: t })
        )
      );

      return newExam;
    });

    return this.getById(exam.id);
  }

  async delete(id, userId, isAdmin = false) {
    const exam = await Exam.findByPk(id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!exam) {
      throw new AppError('Exam not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && exam.course.created_by !== userId) {
      throw new AppError('Not authorized to delete this exam', 403, 'FORBIDDEN');
    }

    await exam.destroy();

    return { message: 'Exam deleted successfully' };
  }

  async saveGeneratedQuestions(examId, questionIds) {
    const exam = await Exam.findByPk(examId);

    if (!exam) {
      throw new AppError('Exam not found', 404, 'NOT_FOUND');
    }

    // Clear existing questions
    await ExamQuestion.destroy({ where: { exam_id: examId } });

    // Add new questions with order
    await Promise.all(
      questionIds.map((questionId, index) =>
        ExamQuestion.create({
          exam_id: examId,
          question_id: questionId,
          question_order: index + 1
        })
      )
    );

    return this.getById(examId);
  }

  async update(id, data, userId, isAdmin = false) {
    const exam = await Exam.findByPk(id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!exam) {
      throw new AppError('Exam not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && exam.course.created_by !== userId) {
      throw new AppError('Not authorized to update this exam', 403, 'FORBIDDEN');
    }

    await exam.update({
      name: data.name
    });

    return this.getById(id);
  }

  async setQuestions(examId, questionIds, userId, isAdmin = false) {
    const exam = await Exam.findByPk(examId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!exam) {
      throw new AppError('Exam not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && exam.course.created_by !== userId) {
      throw new AppError('Not authorized to modify this exam', 403, 'FORBIDDEN');
    }

    // Clear existing questions
    await ExamQuestion.destroy({ where: { exam_id: examId } });

    // Add new questions with order
    if (questionIds && questionIds.length > 0) {
      await Promise.all(
        questionIds.map((questionId, index) =>
          ExamQuestion.create({
            exam_id: examId,
            question_id: questionId,
            question_order: index + 1
          })
        )
      );
    }

    // Update total_questions count
    await exam.update({ total_questions: questionIds?.length || 0 });

    return this.getById(examId);
  }
}

module.exports = new ExamService();
