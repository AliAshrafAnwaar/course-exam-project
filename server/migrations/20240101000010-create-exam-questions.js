'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam_questions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      question_order: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint
    await queryInterface.addConstraint('exam_questions', {
      fields: ['exam_id', 'question_id'],
      type: 'unique',
      name: 'exam_questions_unique'
    });

    // Add indexes
    await queryInterface.addIndex('exam_questions', ['exam_id']);
    await queryInterface.addIndex('exam_questions', ['question_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_questions');
  }
};
