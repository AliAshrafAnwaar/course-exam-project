'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      chapter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'chapters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      choice_1: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      choice_2: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      choice_3: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      correct_choice: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      difficulty: {
        type: Sequelize.ENUM('simple', 'difficult'),
        allowNull: false
      },
      objective: {
        type: Sequelize.ENUM('reminding', 'understanding', 'creativity'),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('questions', ['chapter_id']);
    await queryInterface.addIndex('questions', ['difficulty']);
    await queryInterface.addIndex('questions', ['objective']);
    await queryInterface.addIndex('questions', ['chapter_id', 'difficulty', 'objective']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  }
};
