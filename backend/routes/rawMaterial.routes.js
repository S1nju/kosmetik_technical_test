const express = require('express');
const { body, query, param } = require('express-validator');
const rawMaterialController = require('../controllers/rawMaterial.controller');
const validateRequest = require('../middlewares/validate');

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
