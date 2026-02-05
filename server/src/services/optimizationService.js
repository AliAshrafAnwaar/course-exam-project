const GeneticAlgorithm = require('../algorithms/geneticAlgorithm');
const { Exam, ExamChapterRequirement, Question, Chapter } = require('../models');
const examService = require('./examService');
const { AppError } = require('../middleware/errorHandler');
const config = require('../config/app.config');

class OptimizationService {
  /**
   * Generate optimized exam using Genetic Algorithm
   * @param {number} examId - Exam ID
   * @param {Object} options - Algorithm options
   * @returns {Object} Generated exam with questions
   */
  async generateExam(examId, options = {}) {
    // Get exam with requirements
    const exam = await Exam.findByPk(examId, {
      include: [{
        model: ExamChapterRequirement,
        as: 'chapterRequirements',
        include: [{
          model: Chapter,
          as: 'chapter'
        }]
      }]
    });

    if (!exam) {
      throw new AppError('Exam not found', 404, 'NOT_FOUND');
    }

    // Get available questions from all required chapters
    const chapterIds = exam.chapterRequirements.map(req => req.chapter_id);
    
    const availableQuestions = await Question.findAll({
      where: {
        chapter_id: chapterIds
      },
      raw: true
    });

    if (availableQuestions.length < exam.total_questions) {
      throw new AppError(
        `Not enough questions available. Need ${exam.total_questions}, have ${availableQuestions.length}`,
        400,
        'INSUFFICIENT_QUESTIONS'
      );
    }

    // Prepare requirements for the algorithm
    const requirements = {
      totalQuestions: exam.total_questions,
      chapterRequirements: exam.chapterRequirements.map(req => ({
        chapterId: req.chapter_id,
        questionCount: req.required_question_count
      })),
      reqSimpleCount: exam.req_simple_count,
      reqDifficultCount: exam.req_difficult_count,
      reqRemindingCount: exam.req_reminding_count,
      reqUnderstandingCount: exam.req_understanding_count,
      reqCreativityCount: exam.req_creativity_count
    };

    // Configure algorithm
    const algorithmOptions = {
      populationSize: options.populationSize || config.geneticAlgorithm.populationSize,
      generations: options.generations || config.geneticAlgorithm.generations,
      mutationRate: options.mutationRate || config.geneticAlgorithm.mutationRate,
      elitismCount: options.elitismCount || config.geneticAlgorithm.elitismCount
    };

    // Run genetic algorithm
    const ga = new GeneticAlgorithm(algorithmOptions);
    const result = ga.run(availableQuestions, requirements);

    // Save generated questions to exam
    const questionIds = result.questions.map(q => q.id);
    const updatedExam = await examService.saveGeneratedQuestions(examId, questionIds);

    return {
      exam: updatedExam,
      statistics: result.statistics,
      fitness: result.fitness,
      algorithmUsed: 'genetic'
    };
  }

  /**
   * Preview exam generation without saving
   * @param {number} examId - Exam ID
   * @param {Object} options - Algorithm options
   * @returns {Object} Preview of generated questions
   */
  async previewGeneration(examId, options = {}) {
    const exam = await Exam.findByPk(examId, {
      include: [{
        model: ExamChapterRequirement,
        as: 'chapterRequirements'
      }]
    });

    if (!exam) {
      throw new AppError('Exam not found', 404, 'NOT_FOUND');
    }

    const chapterIds = exam.chapterRequirements.map(req => req.chapter_id);
    
    const availableQuestions = await Question.findAll({
      where: {
        chapter_id: chapterIds
      },
      include: [{
        model: Chapter,
        as: 'chapter',
        attributes: ['id', 'chapterNumber', 'title']
      }]
    });

    const requirements = {
      totalQuestions: exam.total_questions,
      chapterRequirements: exam.chapterRequirements.map(req => ({
        chapterId: req.chapter_id,
        questionCount: req.required_question_count
      })),
      reqSimpleCount: exam.req_simple_count,
      reqDifficultCount: exam.req_difficult_count,
      reqRemindingCount: exam.req_reminding_count,
      reqUnderstandingCount: exam.req_understanding_count,
      reqCreativityCount: exam.req_creativity_count
    };

    const algorithmOptions = {
      populationSize: options.populationSize || config.geneticAlgorithm.populationSize,
      generations: options.generations || config.geneticAlgorithm.generations,
      mutationRate: options.mutationRate || config.geneticAlgorithm.mutationRate
    };

    const ga = new GeneticAlgorithm(algorithmOptions);
    const result = ga.run(availableQuestions.map(q => q.toJSON()), requirements);

    // Get full question details for preview
    const questionIds = result.questions.map(q => q.id);
    const fullQuestions = await Question.findAll({
      where: { id: questionIds },
      include: [{
        model: Chapter,
        as: 'chapter',
        attributes: ['id', 'chapterNumber', 'title']
      }]
    });

    return {
      questions: fullQuestions,
      statistics: result.statistics,
      fitness: result.fitness,
      algorithmUsed: 'genetic',
      isSaved: false
    };
  }
}

module.exports = new OptimizationService();
