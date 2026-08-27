'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('raw_materials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      category: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      unit_of_measure: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });

    // Add CHECK constraints
    await queryInterface.sequelize.query(`
      ALTER TABLE raw_materials ADD CONSTRAINT "quantity_check" CHECK (quantity >= 0);
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE raw_materials ADD CONSTRAINT "status_check" CHECK (status IN ('active', 'inactive'));
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('raw_materials');
  }
};
