const express = require('express');
const { body, query, param } = require('express-validator');
const validateRequest = require('../middlewares/validate');

// Import classes
const RawMaterialRepository = require('../repositories/rawMaterial.repository');
const RawMaterialService = require('../services/rawMaterial.service');
const RawMaterialController = require('../controllers/rawMaterial.controller');

// Instantiate dependencies (Dependency Injection)
const rawMaterialRepository = new RawMaterialRepository();
const rawMaterialService = new RawMaterialService(rawMaterialRepository);
const rawMaterialController = new RawMaterialController(rawMaterialService);

const router = express.Router();

const materialValidationRules = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 150 }).withMessage('Max length is 150 characters'),
  body('code').notEmpty().withMessage('Code is required').isLength({ max: 50 }).withMessage('Max length is 50 characters'),
  body('category').notEmpty().withMessage('Category is required').isLength({ max: 80 }).withMessage('Max length is 80 characters'),
  body('unit_of_measure').notEmpty().withMessage('Unit of measure is required').isLength({ max: 20 }),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('status').isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),
  body('description').optional().isString()
];

/**
 * @swagger
 * tags:
 *   name: RawMaterials
 *   description: Raw material inventory management
 * 
 * /api/raw-materials:
 *   get:
 *     summary: Retrieve paginated raw materials
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of raw materials
 *   post:
 *     summary: Create a new raw material
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RawMaterial'
 *     responses:
 *       201:
 *         description: Created successfully
 *       400:
 *         description: Validation failed
 * 
 * /api/raw-materials/{id}:
 *   get:
 *     summary: Get raw material by ID
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Found material
 *       404:
 *         description: Material not found
 *   put:
 *     summary: Update raw material by ID
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RawMaterial'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Material not found
 *   delete:
 *     summary: Delete raw material by ID
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Material not found
 */

router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest
], rawMaterialController.getAll);

router.get('/:id', [
  param('id').isInt(),
  validateRequest
], rawMaterialController.getById);

router.post('/', [...materialValidationRules, validateRequest], rawMaterialController.create);

router.put('/:id', [
  param('id').isInt(),
  ...materialValidationRules,
  validateRequest
], rawMaterialController.update);

router.delete('/:id', [
  param('id').isInt(),
  validateRequest
], rawMaterialController.delete);

module.exports = router;
