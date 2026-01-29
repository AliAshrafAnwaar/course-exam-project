'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create sample course
    await queryInterface.bulkInsert('courses', [{
      name: 'Introduction to Programming',
      description: 'A beginner course covering programming fundamentals',
      total_chapters: 3,
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Get the course ID
    const courses = await queryInterface.sequelize.query(
      `SELECT id FROM courses WHERE name = 'Introduction to Programming'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const courseId = courses[0].id;

    // Create chapters
    await queryInterface.bulkInsert('chapters', [
      { course_id: courseId, name: 'Variables and Data Types', chapter_number: 1, created_at: new Date(), updated_at: new Date() },
      { course_id: courseId, name: 'Control Structures', chapter_number: 2, created_at: new Date(), updated_at: new Date() },
      { course_id: courseId, name: 'Functions and Methods', chapter_number: 3, created_at: new Date(), updated_at: new Date() }
    ]);

    // Get chapter IDs
    const chapters = await queryInterface.sequelize.query(
      `SELECT id, chapter_number FROM chapters WHERE course_id = ${courseId} ORDER BY chapter_number`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Question templates for each chapter
    // Each chapter needs 12 questions: 2 per difficulty-objective combination
    const difficulties = ['simple', 'difficult'];
    const objectives = ['reminding', 'understanding', 'creativity'];

    const chapterQuestions = {
      1: { // Variables and Data Types
        simple: {
          reminding: [
            { q: 'What is a variable in programming?', c1: 'A storage location for data', c2: 'A type of loop', c3: 'A function', correct: 1 },
            { q: 'Which of the following is a primitive data type?', c1: 'Integer', c2: 'Array', c3: 'Object', correct: 1 }
          ],
          understanding: [
            { q: 'Why do we need different data types?', c1: 'To optimize memory usage and operations', c2: 'To make code longer', c3: 'For decoration', correct: 1 },
            { q: 'What happens when you assign a value to a variable?', c1: 'The value is stored in memory', c2: 'The program crashes', c3: 'Nothing happens', correct: 1 }
          ],
          creativity: [
            { q: 'How would you store a person\'s age and name together?', c1: 'Use two separate variables', c2: 'Use only one integer', c3: 'It\'s not possible', correct: 1 },
            { q: 'What data type would you choose for storing currency?', c1: 'Decimal/Float', c2: 'String', c3: 'Boolean', correct: 1 }
          ]
        },
        difficult: {
          reminding: [
            { q: 'What is type coercion?', c1: 'Automatic type conversion', c2: 'Manual type declaration', c3: 'Variable deletion', correct: 1 },
            { q: 'What is the difference between null and undefined?', c1: 'Null is intentional absence, undefined is uninitialized', c2: 'They are the same', c3: 'Null is a number', correct: 1 }
          ],
          understanding: [
            { q: 'Why might implicit type conversion cause bugs?', c1: 'Unexpected value transformations', c2: 'It makes code faster', c3: 'It improves readability', correct: 1 },
            { q: 'When should you use constants instead of variables?', c1: 'When the value should not change', c2: 'Never', c3: 'Only for strings', correct: 1 }
          ],
          creativity: [
            { q: 'Design a variable naming strategy for a large project', c1: 'Use descriptive camelCase names', c2: 'Use single letters', c3: 'Use random names', correct: 1 },
            { q: 'How would you handle a value that could be multiple types?', c1: 'Use union types or type checking', c2: 'Ignore the problem', c3: 'Use only strings', correct: 1 }
          ]
        }
      },
      2: { // Control Structures
        simple: {
          reminding: [
            { q: 'What is an if statement?', c1: 'A conditional branch', c2: 'A loop', c3: 'A variable', correct: 1 },
            { q: 'What does a for loop do?', c1: 'Repeats code a specific number of times', c2: 'Declares a variable', c3: 'Ends the program', correct: 1 }
          ],
          understanding: [
            { q: 'When would you use a while loop instead of a for loop?', c1: 'When the number of iterations is unknown', c2: 'Never', c3: 'When counting', correct: 1 },
            { q: 'Why is the else clause optional?', c1: 'Not all conditions need an alternative', c2: 'It\'s deprecated', c3: 'It causes errors', correct: 1 }
          ],
          creativity: [
            { q: 'How would you check if a number is even or odd?', c1: 'Use modulo operator with if statement', c2: 'Use a string', c3: 'It\'s not possible', correct: 1 },
            { q: 'Design a loop to print numbers 1 to 10', c1: 'Use a for loop with counter', c2: 'Use 10 print statements', c3: 'Use recursion only', correct: 1 }
          ]
        },
        difficult: {
          reminding: [
            { q: 'What is a switch statement?', c1: 'Multi-way branch based on value', c2: 'A type of loop', c3: 'A variable declaration', correct: 1 },
            { q: 'What is short-circuit evaluation?', c1: 'Stopping evaluation when result is determined', c2: 'A type of error', c3: 'Fast loops', correct: 1 }
          ],
          understanding: [
            { q: 'Why might nested loops cause performance issues?', c1: 'Exponential time complexity', c2: 'They use more memory', c3: 'They are deprecated', correct: 1 },
            { q: 'When is recursion preferred over iteration?', c1: 'For tree structures and divide-conquer', c2: 'Never', c3: 'Always', correct: 1 }
          ],
          creativity: [
            { q: 'How would you find the largest number in an array?', c1: 'Loop through and compare each element', c2: 'Print the first element', c3: 'Use a string', correct: 1 },
            { q: 'Design a solution to check if a string is a palindrome', c1: 'Compare characters from both ends', c2: 'Count the letters', c3: 'Convert to number', correct: 1 }
          ]
        }
      },
      3: { // Functions and Methods
        simple: {
          reminding: [
            { q: 'What is a function?', c1: 'A reusable block of code', c2: 'A variable', c3: 'A data type', correct: 1 },
            { q: 'What is a parameter?', c1: 'Input to a function', c2: 'Output of a function', c3: 'A loop counter', correct: 1 }
          ],
          understanding: [
            { q: 'Why do we use functions?', c1: 'Code reusability and organization', c2: 'To slow down programs', c3: 'They are required', correct: 1 },
            { q: 'What is the difference between parameters and arguments?', c1: 'Parameters are declarations, arguments are values', c2: 'They are the same', c3: 'Arguments are declarations', correct: 1 }
          ],
          creativity: [
            { q: 'Write a function signature to calculate area of rectangle', c1: 'calculateArea(width, height)', c2: 'area()', c3: 'rectangle', correct: 1 },
            { q: 'How would you design a function to greet a user?', c1: 'greet(name) that returns greeting string', c2: 'Use a variable', c3: 'Use a loop', correct: 1 }
          ]
        },
        difficult: {
          reminding: [
            { q: 'What is a callback function?', c1: 'A function passed as an argument', c2: 'A function that returns', c3: 'A main function', correct: 1 },
            { q: 'What is function scope?', c1: 'Variables accessible within a function', c2: 'Global variables', c3: 'Loop counter', correct: 1 }
          ],
          understanding: [
            { q: 'Why use pure functions?', c1: 'Predictable, no side effects', c2: 'They are faster', c3: 'They use less memory', correct: 1 },
            { q: 'When should you use default parameters?', c1: 'When arguments are optional', c2: 'Never', c3: 'Always', correct: 1 }
          ],
          creativity: [
            { q: 'Design a function to validate email format', c1: 'Check for @ and domain pattern', c2: 'Count characters', c3: 'Convert to number', correct: 1 },
            { q: 'How would you implement a calculator function?', c1: 'Accept operation and operands as parameters', c2: 'Hardcode values', c3: 'Use only addition', correct: 1 }
          ]
        }
      }
    };

    // Generate questions for all chapters
    const questions = [];
    
    for (const chapter of chapters) {
      const chapterNum = chapter.chapter_number;
      const chapterId = chapter.id;
      const chapterData = chapterQuestions[chapterNum];

      for (const difficulty of difficulties) {
        for (const objective of objectives) {
          const questionsForCombo = chapterData[difficulty][objective];
          for (const q of questionsForCombo) {
            questions.push({
              chapter_id: chapterId,
              question_text: q.q,
              choice_1: q.c1,
              choice_2: q.c2,
              choice_3: q.c3,
              correct_choice: q.correct,
              difficulty: difficulty,
              objective: objective,
              created_at: new Date(),
              updated_at: new Date()
            });
          }
        }
      }
    }

    await queryInterface.bulkInsert('questions', questions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('chapters', null, {});
    await queryInterface.bulkDelete('courses', null, {});
  }
};
