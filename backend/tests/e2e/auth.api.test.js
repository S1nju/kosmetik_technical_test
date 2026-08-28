const request = require('supertest');
const app = require('../../app');
const UserRepository = require('../../repositories/user.repository');
const bcrypt = require('bcryptjs');

// Mock the repository and bcrypt
jest.mock('../../repositories/user.repository');
jest.mock('bcryptjs');
jest.mock('../../config/database', () => ({
  authenticate: jest.fn().mockResolvedValue(),
  define: jest.fn()
}));
jest.mock('../../models/User', () => ({}));
jest.mock('../../models/RawMaterial', () => ({}));

describe('Auth API E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      UserRepository.prototype.create.mockResolvedValue({ id: 1, email: 'new_e2e@kosmetikon.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'new_e2e@kosmetikon.com', password: 'password123' });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id', 1);
    });

    it('should safely reject duplicate email registrations', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue({ id: 1 });
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'e2e@kosmetikon.com', password: 'password123' });
      
      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate correctly and return JWT token', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue({ id: 1, email: 'e2e@kosmetikon.com', password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'e2e@kosmetikon.com', password: 'password123' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should safely reject incorrect passwords', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue({ id: 1, email: 'e2e@kosmetikon.com', password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'e2e@kosmetikon.com', password: 'wrongpassword' });
      
      expect(res.status).toBe(401);
    });
  });
});
