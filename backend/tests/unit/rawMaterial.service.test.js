const RawMaterialService = require('../../services/rawMaterial.service');

describe('RawMaterial Service (Unit with DI)', () => {
  let rawMaterialService;
  let mockRepository;

  beforeEach(() => {
    // Create a mock repository for dependency injection
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCodeOrName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Instantiate service with the mock repository
    rawMaterialService = new RawMaterialService(mockRepository);
  });

  describe('getRawMaterials', () => {
    it('should return paginated results', async () => {
      mockRepository.findAll.mockResolvedValue({
        count: 1,
        rows: [{ id: 1, name: 'Water' }]
      });

      const result = await rawMaterialService.getRawMaterials({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.currentPage).toBe(1);
    });
  });

  describe('createRawMaterial', () => {
    it('should throw error if code or name exists', async () => {
      mockRepository.findByCodeOrName.mockResolvedValue({ id: 2, name: 'Water' });

      await expect(rawMaterialService.createRawMaterial({ code: 'RM-001', name: 'Water' }))
        .rejects.toThrow('A raw material with this name or code already exists.');
    });

    it('should create new material if valid', async () => {
      mockRepository.findByCodeOrName.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({ id: 1, name: 'New Material' });

      const result = await rawMaterialService.createRawMaterial({ code: 'RM-001', name: 'New Material' });
      expect(result.id).toBe(1);
      expect(result.name).toBe('New Material');
    });
  });
});
