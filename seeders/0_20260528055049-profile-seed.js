'use strict';
const fs = require('fs')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    let allData = await fs.promises.readFile("./data/profile.json", "utf-8")
    allData = JSON.parse(allData)
    allData.forEach(element => {
      delete element.id
      element.createdAt = new Date()
      element.updatedAt = new Date()
    });
    await queryInterface.bulkInsert("Profiles", allData, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Profiles", null, {})
  }
};
