const request = require('supertest');
const app = require('../../app');
const RawMaterialRepository = require('../../repositories/rawMaterial.repository');

// Mock Auth Middleware
jest.mock('../../middlewares/auth.middleware', () => {
  return (req, res, next) => next();
});

// Mock the repository to avoid needing a real database connection during tests
jest.mock('../../repositories/rawMaterial.repository');
jest.mock('../../config/database', () => ({
  authenticate: jest.fn().mockResolvedValue(),
  define: jest.fn()
}));

describe('RawMaterial API (E2E)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/raw-materials', () => {
    it('should fetch paginated raw materials', async () => {
      RawMaterialRepository.prototype.findAll.mockResolvedValue({
        count: 1,
        rows: [{ id: 1, name: 'Water Test' }]
      });

      const response = await request(app).get('/api/raw-materials?page=1&limit=10');
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta.totalItems).toBe(1);
    });
  });

  describe('POST /api/raw-materials', () => {
    it('should return 400 for invalid data', async () => {
      const response = await request(app).post('/api/raw-materials').send({
        name: '', // Empty name triggers validation error
        code: 'RM-001',
        category: 'solvent',
        unit_of_measure: 'l',
        quantity: -5, // Invalid quantity
        status: 'active'
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 201 for valid data', async () => {
      RawMaterialRepository.prototype.findByCodeOrName.mockResolvedValue(null);
      RawMaterialRepository.prototype.create.mockResolvedValue({ id: 1, name: 'New Material' });

      const response = await request(app).post('/api/raw-materials').send({
        name: 'New Material',
        code: 'RM-X',
        category: 'solvent',
        unit_of_measure: 'l',
        quantity: 50,
        status: 'active'
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(1);
    });
  });
});
