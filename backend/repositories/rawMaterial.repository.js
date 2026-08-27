const RawMaterial = require('../models/RawMaterial');
const { Op } = require('sequelize');

class RawMaterialRepository {
  async findAll({ page = 1, limit = 10, name, category, status }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
    }

    return await RawMaterial.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }

  async findById(id) {
    return await RawMaterial.findByPk(id);
  }

  async findByCodeOrName(code, name) {
    return await RawMaterial.findOne({
      where: {
        [Op.or]: [
          { code },
          { name }
        ]
      }
    });
  }

  async create(data) {
    return await RawMaterial.create(data);
  }

  async update(id, data) {
    const material = await this.findById(id);
    if (!material) return null;
    return await material.update(data);
  }

  async delete(id) {
    const material = await this.findById(id);
    if (!material) return null;
    await material.destroy();
    return true;
  }
}

module.exports = RawMaterialRepository;
