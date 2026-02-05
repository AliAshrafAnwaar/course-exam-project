const { Chapter, Course, Question } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class ChapterService {
  async getAllByCourse(courseId) {
    const course = await Course.findByPk(courseId);
    
    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }

    return Chapter.findAll({
      where: { course_id: courseId },
      include: [{
        model: Question,
        as: 'questions',
        attributes: ['id', 'difficulty', 'objective']
      }],
      order: [['chapterNumber', 'ASC']]
    });
  }

  async getById(id, userId = null, isAdmin = false) {
    const chapter = await Chapter.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name', 'created_by']
        },
        {
          model: Question,
          as: 'questions'
        }
      ]
    });

    if (!chapter) {
      throw new AppError('Chapter not found', 404, 'NOT_FOUND');
    }

    // Check course ownership for non-admin users
    if (!isAdmin && userId && chapter.course.created_by !== userId) {
      throw new AppError('Not authorized to view this chapter', 403, 'FORBIDDEN');
    }

    return chapter;
  }

  async create(courseId, data, userId, isAdmin = false) {
    const course = await Course.findByPk(courseId);

    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }

    // Check ownership (admin bypass)
    if (!isAdmin && course.created_by !== userId) {
      throw new AppError('Not authorized to add chapters to this course', 403, 'FORBIDDEN');
    }

    const { chapterNumber, title } = data;

    // Check if chapter number exists
    const existing = await Chapter.findOne({
      where: { course_id: courseId, chapterNumber: chapterNumber }
    });

    if (existing) {
      throw new AppError('Chapter number already exists in this course', 409, 'CONFLICT');
    }

    const chapter = await Chapter.create({
      course_id: courseId,
      chapterNumber: chapterNumber,
      title
    });

    return this.getById(chapter.id);
  }

  async update(id, data, userId, isAdmin = false) {
    const chapter = await Chapter.findByPk(id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!chapter) {
      throw new AppError('Chapter not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && chapter.course.created_by !== userId) {
      throw new AppError('Not authorized to update this chapter', 403, 'FORBIDDEN');
    }

    const { chapterNumber, title } = data;

    // Check if new chapter number conflicts
    if (chapterNumber && chapterNumber !== chapter.chapterNumber) {
      const existing = await Chapter.findOne({
        where: { 
          course_id: chapter.course_id, 
          chapterNumber: chapterNumber 
        }
      });

      if (existing) {
        throw new AppError('Chapter number already exists in this course', 409, 'CONFLICT');
      }
    }

    await chapter.update({
      ...(chapterNumber && { chapterNumber: chapterNumber }),
      ...(title !== undefined && { title })
    });

    return this.getById(id);
  }

  async delete(id, userId, isAdmin = false) {
    const chapter = await Chapter.findByPk(id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!chapter) {
      throw new AppError('Chapter not found', 404, 'NOT_FOUND');
    }

    // Check course ownership (admin bypass)
    if (!isAdmin && chapter.course.created_by !== userId) {
      throw new AppError('Not authorized to delete this chapter', 403, 'FORBIDDEN');
    }

    await chapter.destroy();

    return { message: 'Chapter deleted successfully' };
  }
}

module.exports = new ChapterService();
