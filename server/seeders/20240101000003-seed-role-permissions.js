'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get roles
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get permissions
    const permissions = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const roleMap = {};
    roles.forEach(r => roleMap[r.name] = r.id);

    const permMap = {};
    permissions.forEach(p => permMap[p.name] = p.id);

    const rolePermissions = [];

    // Admin gets all permissions
    permissions.forEach(p => {
      rolePermissions.push({
        role_id: roleMap['admin'],
        permission_id: p.id,
        created_at: new Date()
      });
    });

    // Teacher permissions
    const teacherPerms = [
      'course.create', 'course.read', 'course.update',
      'chapter.create', 'chapter.read', 'chapter.update',
      'question.create', 'question.read', 'question.update',
      'exam.create', 'exam.read', 'exam.update', 'exam.generate'
    ];
    teacherPerms.forEach(perm => {
      if (permMap[perm]) {
        rolePermissions.push({
          role_id: roleMap['teacher'],
          permission_id: permMap[perm],
          created_at: new Date()
        });
      }
    });

    // Student permissions
    const studentPerms = ['course.read', 'chapter.read', 'exam.read'];
    studentPerms.forEach(perm => {
      if (permMap[perm]) {
        rolePermissions.push({
          role_id: roleMap['student'],
          permission_id: permMap[perm],
          created_at: new Date()
        });
      }
    });

    await queryInterface.bulkInsert('role_permissions', rolePermissions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
