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
      'create_course', 'read_course', 'update_course',
      'create_chapter', 'read_chapter', 'update_chapter',
      'create_question', 'read_question', 'update_question',
      'create_exam', 'read_exam', 'update_exam'
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
    const studentPerms = ['read_course', 'read_chapter', 'read_exam'];
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
