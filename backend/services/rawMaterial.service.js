const rawMaterialRepository = require('../repositories/rawMaterial.repository');

class RawMaterialService {
  async getRawMaterials(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    
    const { count, rows } = await rawMaterialRepository.findAll({
      page,
      limit,
      name: query.name,
      category: query.category,
      status: query.status
    });

    return {
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    };
  }

  async getRawMaterialById(id) {
    const item = await rawMaterialRepository.findById(id);
    if (!item) {
      const error = new Error('Raw material not found');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async createRawMaterial(data) {
    // Check for unique code or name
    const existing = await rawMaterialRepository.findByCodeOrName(data.code, data.name);
    if (existing) {
      const error = new Error('A raw material with this name or code already exists.');
      error.statusCode = 409;
      throw error;
    }

    return await rawMaterialRepository.create(data);
  }

  async updateRawMaterial(id, data) {
    // Check if another record has the same name or code
    if (data.code || data.name) {
      const existing = await rawMaterialRepository.findByCodeOrName(data.code, data.name);
      if (existing && existing.id !== parseInt(id, 10)) {
        const error = new Error('A raw material with this name or code already exists.');
        error.statusCode = 409;
        throw error;
      }
    }

    const updated = await rawMaterialRepository.update(id, data);
    if (!updated) {
      const error = new Error('Raw material not found');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  async deleteRawMaterial(id) {
    const deleted = await rawMaterialRepository.delete(id);
    if (!deleted) {
      const error = new Error('Raw material not found');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

module.exports = new RawMaterialService();
