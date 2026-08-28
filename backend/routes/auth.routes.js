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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication operations
 * 
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registered successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already in use
 * 
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authenticated successfully returning JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/register', [...authValidationRules, validateRequest], authController.register);
router.post('/login', [...authValidationRules, validateRequest], authController.login);

module.exports = router;
