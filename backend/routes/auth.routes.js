const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validate');

const UserRepository = require('../repositories/user.repository');
const UserService = require('../services/user.service');
const AuthController = require('../controllers/auth.controller');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

const router = express.Router();

const authValidationRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

router.post('/register', [...authValidationRules, validateRequest], authController.register);
router.post('/login', [...authValidationRules, validateRequest], authController.login);

module.exports = router;
