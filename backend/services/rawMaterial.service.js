class RawMaterialService {
  constructor(rawMaterialRepository) {
    this.rawMaterialRepository = rawMaterialRepository;
  }

  async getRawMaterials(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;

    const { count, rows } = await this.rawMaterialRepository.findAll({
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
    const item = await this.rawMaterialRepository.findById(id);
    if (!item) {
      const error = new Error('Raw material not found');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async createRawMaterial(data) {
    const existing = await this.rawMaterialRepository.findByCodeOrName(data.code, data.name);
    if (existing) {
      const error = new Error('A raw material with this name or code already exists.');
      error.statusCode = 409;
      throw error;
    }

    return await this.rawMaterialRepository.create(data);
  }

  async updateRawMaterial(id, data) {
    if (data.code || data.name) {
      const existing = await this.rawMaterialRepository.findByCodeOrName(data.code, data.name);
      if (existing && existing.id !== parseInt(id, 10)) {
        const error = new Error('A raw material with this name or code already exists.');
        error.statusCode = 409;
        throw error;
      }
    }

    const updated = await this.rawMaterialRepository.update(id, data);
    if (!updated) {
      const error = new Error('Raw material not found');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  async deleteRawMaterial(id) {
    const deleted = await this.rawMaterialRepository.delete(id);
    if (!deleted) {
      const error = new Error('Raw material not found');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

module.exports = RawMaterialService;
