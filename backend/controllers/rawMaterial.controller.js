const rawMaterialService = require('../services/rawMaterial.service');

class RawMaterialController {
  async getAll(req, res, next) {
    try {
      const result = await rawMaterialService.getRawMaterials(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await rawMaterialService.getRawMaterialById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await rawMaterialService.createRawMaterial(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await rawMaterialService.updateRawMaterial(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await rawMaterialService.deleteRawMaterial(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RawMaterialController();
