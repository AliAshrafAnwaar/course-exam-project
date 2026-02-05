/**
 * Fitness function for evaluating exam question selection
 * Evaluates how well a chromosome (set of questions) meets exam requirements
 */

class FitnessFunction {
  /**
   * Calculate fitness score for a chromosome
   * @param {Array} chromosome - Array of question objects
   * @param {Object} requirements - Exam requirements
   * @returns {number} Fitness score between 0 and 1
   */
  evaluate(chromosome, requirements) {
    const {
      chapterRequirements,
      reqSimpleCount,
      reqDifficultCount,
      reqRemindingCount,
      reqUnderstandingCount,
      reqCreativityCount,
      totalQuestions
    } = requirements;

    // If chromosome is empty or wrong size, return 0
    if (!chromosome || chromosome.length !== totalQuestions) {
      return 0;
    }

    // Check for duplicates
    const questionIds = chromosome.map(q => q.id);
    const uniqueIds = new Set(questionIds);
    if (uniqueIds.size !== chromosome.length) {
      return 0; // Penalize duplicates heavily
    }

    let score = 0;
    const weights = {
      chapter: 0.4,
      difficulty: 0.3,
      objective: 0.3
    };

    // 1. Chapter distribution score
    const chapterScore = this.calculateChapterScore(chromosome, chapterRequirements);
    score += weights.chapter * chapterScore;

    // 2. Difficulty distribution score
    const difficultyScore = this.calculateDifficultyScore(
      chromosome,
      reqSimpleCount,
      reqDifficultCount
    );
    score += weights.difficulty * difficultyScore;

    // 3. Objective distribution score
    const objectiveScore = this.calculateObjectiveScore(
      chromosome,
      reqRemindingCount,
      reqUnderstandingCount,
      reqCreativityCount
    );
    score += weights.objective * objectiveScore;

    return score;
  }

  /**
   * Calculate how well chapter requirements are met
   */
  calculateChapterScore(chromosome, chapterRequirements) {
    if (!chapterRequirements || chapterRequirements.length === 0) {
      return 1; // No chapter requirements = perfect score
    }

    let totalDeviation = 0;
    let totalRequired = 0;

    for (const req of chapterRequirements) {
      const actual = chromosome.filter(q => q.chapter_id === req.chapterId).length;
      const required = req.questionCount;
      totalDeviation += Math.abs(actual - required);
      totalRequired += required;
    }

    if (totalRequired === 0) return 1;
    
    // Convert deviation to score (0 deviation = 1, more deviation = lower score)
    return Math.max(0, 1 - (totalDeviation / totalRequired));
  }

  /**
   * Calculate how well difficulty requirements are met
   */
  calculateDifficultyScore(chromosome, reqSimple, reqDifficult) {
    if (reqSimple === 0 && reqDifficult === 0) {
      return 1; // No difficulty requirements
    }

    const actualSimple = chromosome.filter(q => q.difficulty === 'simple').length;
    const actualDifficult = chromosome.filter(q => q.difficulty === 'difficult').length;

    const totalRequired = reqSimple + reqDifficult;
    const deviation = Math.abs(actualSimple - reqSimple) + Math.abs(actualDifficult - reqDifficult);

    return Math.max(0, 1 - (deviation / totalRequired));
  }

  /**
   * Calculate how well objective requirements are met
   */
  calculateObjectiveScore(chromosome, reqReminding, reqUnderstanding, reqCreativity) {
    if (reqReminding === 0 && reqUnderstanding === 0 && reqCreativity === 0) {
      return 1; // No objective requirements
    }

    const actualReminding = chromosome.filter(q => q.objective === 'reminding').length;
    const actualUnderstanding = chromosome.filter(q => q.objective === 'understanding').length;
    const actualCreativity = chromosome.filter(q => q.objective === 'creativity').length;

    const totalRequired = reqReminding + reqUnderstanding + reqCreativity;
    const deviation = 
      Math.abs(actualReminding - reqReminding) +
      Math.abs(actualUnderstanding - reqUnderstanding) +
      Math.abs(actualCreativity - reqCreativity);

    return Math.max(0, 1 - (deviation / totalRequired));
  }
}

module.exports = new FitnessFunction();
