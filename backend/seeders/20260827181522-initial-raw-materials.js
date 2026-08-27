'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('raw_materials', [
      {
        name: 'Water',
        code: 'RM-001',
        category: 'solvent',
        unit_of_measure: 'l',
        quantity: 500.00,
        status: 'active',
        description: 'Purified water for cosmetic formulations.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Glycerin',
        code: 'RM-002',
        category: 'humectant',
        unit_of_measure: 'kg',
        quantity: 25.50,
        status: 'active',
        description: 'Vegetable glycerin.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sodium Laureth Sulfate',
        code: 'RM-003',
        category: 'surfactant',
        unit_of_measure: 'kg',
        quantity: 100.00,
        status: 'active',
        description: 'SLES, primary foaming agent.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Phenoxyethanol',
        code: 'RM-004',
        category: 'preservative',
        unit_of_measure: 'kg',
        quantity: 5.00,
        status: 'active',
        description: 'Broad spectrum preservative.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Discontinued Perfume',
        code: 'RM-005',
        category: 'fragrance',
        unit_of_measure: 'g',
        quantity: 0.00,
        status: 'inactive',
        description: 'Old fragrance formulation.',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('raw_materials', null, {});
  }
};
