/**
 * Genetic Algorithm for optimized exam generation
 * Selects questions that best meet exam requirements
 */

const fitnessFunction = require('./fitnessFunction');

class GeneticAlgorithm {
  constructor(options = {}) {
    this.populationSize = options.populationSize || 100;
    this.generations = options.generations || 50;
    this.mutationRate = options.mutationRate || 0.1;
    this.elitismCount = options.elitismCount || 2;
    this.tournamentSize = options.tournamentSize || 5;
  }

  /**
   * Run the genetic algorithm to find optimal question selection
   * @param {Array} availableQuestions - All questions available for selection
   * @param {Object} requirements - Exam requirements
   * @returns {Object} Best solution found
   */
  run(availableQuestions, requirements) {
    const { totalQuestions } = requirements;


    // Group questions by chapter for smarter initialization
    const questionsByChapter = this.groupByChapter(availableQuestions);

    // Initialize population
    let population = this.initializePopulation(
      availableQuestions,
      questionsByChapter,
      requirements
    );

    let bestSolution = null;
    let bestFitness = 0;

    // Evolution loop
    for (let gen = 0; gen < this.generations; gen++) {
      // Evaluate fitness for all chromosomes
      const evaluated = population.map(chromosome => ({
        chromosome,
        fitness: fitnessFunction.evaluate(chromosome, requirements)
      }));

      // Sort by fitness (descending)
      evaluated.sort((a, b) => b.fitness - a.fitness);

      // Track best solution
      if (evaluated[0].fitness > bestFitness) {
        bestFitness = evaluated[0].fitness;
        bestSolution = [...evaluated[0].chromosome];
      }

      // Early termination if perfect solution found
      if (bestFitness >= 0.99) {
        break;
      }

      // Create new population
      const newPopulation = [];

      // Elitism: keep best solutions
      for (let i = 0; i < this.elitismCount; i++) {
        newPopulation.push([...evaluated[i].chromosome]);
      }

      // Fill rest with offspring
      while (newPopulation.length < this.populationSize) {
        const parent1 = this.tournamentSelection(evaluated);
        const parent2 = this.tournamentSelection(evaluated);
        
        let offspring = this.crossover(parent1, parent2, availableQuestions, totalQuestions);
        offspring = this.mutate(offspring, availableQuestions);
        
        newPopulation.push(offspring);
      }

      population = newPopulation;
    }

    return {
      questions: bestSolution,
      fitness: bestFitness,
      statistics: this.calculateStatistics(bestSolution, requirements)
    };
  }

  /**
   * Group questions by chapter ID
   */
  groupByChapter(questions) {
    const grouped = {};
    for (const q of questions) {
      if (!grouped[q.chapter_id]) {
        grouped[q.chapter_id] = [];
      }
      grouped[q.chapter_id].push(q);
    }
    return grouped;
  }

  /**
   * Initialize population with semi-random chromosomes
   */
  initializePopulation(allQuestions, questionsByChapter, requirements) {
    const population = [];
    const { totalQuestions, chapterRequirements } = requirements;

    for (let i = 0; i < this.populationSize; i++) {
      let chromosome = [];

      // Try to satisfy chapter requirements first
      if (chapterRequirements && chapterRequirements.length > 0) {
        for (const req of chapterRequirements) {
          const chapterQuestions = questionsByChapter[req.chapterId] || [];
          const shuffled = this.shuffle([...chapterQuestions]);
          const selected = shuffled.slice(0, req.questionCount);
          chromosome.push(...selected);
        }
      }

      // Fill remaining slots randomly if needed
      if (chromosome.length < totalQuestions) {
        const usedIds = new Set(chromosome.map(q => q.id));
        const remaining = allQuestions.filter(q => !usedIds.has(q.id));
        const shuffled = this.shuffle([...remaining]);
        const needed = totalQuestions - chromosome.length;
        chromosome.push(...shuffled.slice(0, needed));
      }

      // Trim if over
      if (chromosome.length > totalQuestions) {
        chromosome = chromosome.slice(0, totalQuestions);
      }

      population.push(chromosome);
    }

    return population;
  }

  /**
   * Tournament selection
   */
  tournamentSelection(evaluated) {
    let best = null;
    let bestFitness = -1;

    for (let i = 0; i < this.tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * evaluated.length);
      const candidate = evaluated[randomIndex];
      
      if (candidate.fitness > bestFitness) {
        bestFitness = candidate.fitness;
        best = candidate.chromosome;
      }
    }

    return best;
  }

  /**
   * Crossover two parents to create offspring
   */
  crossover(parent1, parent2, allQuestions, targetSize) {
    // Uniform crossover
    const offspring = [];
    const usedIds = new Set();

    for (let i = 0; i < targetSize; i++) {
      const source = Math.random() < 0.5 ? parent1 : parent2;
      const question = source[i];

      if (question && !usedIds.has(question.id)) {
        offspring.push(question);
        usedIds.add(question.id);
      }
    }

    // Fill missing slots
    if (offspring.length < targetSize) {
      const remaining = allQuestions.filter(q => !usedIds.has(q.id));
      const shuffled = this.shuffle([...remaining]);
      
      for (const q of shuffled) {
        if (offspring.length >= targetSize) break;
        offspring.push(q);
        usedIds.add(q.id);
      }
    }

    return offspring;
  }

  /**
   * Mutate chromosome by replacing random questions
   */
  mutate(chromosome, allQuestions) {
    const mutated = [...chromosome];
    const usedIds = new Set(mutated.map(q => q.id));

    for (let i = 0; i < mutated.length; i++) {
      if (Math.random() < this.mutationRate) {
        const available = allQuestions.filter(q => !usedIds.has(q.id));
        
        if (available.length > 0) {
          const randomIndex = Math.floor(Math.random() * available.length);
          const newQuestion = available[randomIndex];
          
          usedIds.delete(mutated[i].id);
          mutated[i] = newQuestion;
          usedIds.add(newQuestion.id);
        }
      }
    }

    return mutated;
  }

  /**
   * Fisher-Yates shuffle
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Calculate statistics for the solution
   */
  calculateStatistics(questions, requirements) {
    const stats = {
      totalQuestions: questions.length,
      byChapter: {},
      byDifficulty: { simple: 0, difficult: 0 },
      byObjective: { reminding: 0, understanding: 0, creativity: 0 }
    };

    for (const q of questions) {
      // Chapter count
      stats.byChapter[q.chapter_id] = (stats.byChapter[q.chapter_id] || 0) + 1;
      
      // Difficulty count
      stats.byDifficulty[q.difficulty]++;
      
      // Objective count
      stats.byObjective[q.objective]++;
    }

    return stats;
  }
}

module.exports = GeneticAlgorithm;
