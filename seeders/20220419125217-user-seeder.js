'use strict';
const bcrypt = require("bcrypt")

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        email: 'hayatullah@binaracademy.org',
        password: await bcrypt.hash("123456", 10), //setup with bcrypt encrypt
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: null,
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};