class RawMaterialController {
  constructor(rawMaterialService) {
    this.rawMaterialService = rawMaterialService;
  }

  getAll = async (req, res, next) => {
    try {
      const result = await this.rawMaterialService.getRawMaterials(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  getById = async (req, res, next) => {
    try {
      const result = await this.rawMaterialService.getRawMaterialById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  create = async (req, res, next) => {
    try {
      const result = await this.rawMaterialService.createRawMaterial(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  update = async (req, res, next) => {
    try {
      const result = await this.rawMaterialService.updateRawMaterial(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req, res, next) => {
    try {
      await this.rawMaterialService.deleteRawMaterial(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RawMaterialController;
