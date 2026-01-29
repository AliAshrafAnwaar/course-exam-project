'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exams', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      total_questions: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      simple_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      difficult_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      reminding_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      understanding_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      creativity_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('exams', ['course_id']);
    await queryInterface.addIndex('exams', ['created_by']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exams');
  }
};
