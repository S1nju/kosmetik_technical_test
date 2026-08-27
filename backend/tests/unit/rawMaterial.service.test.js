const rawMaterialService = require('../../services/rawMaterial.service');
const rawMaterialRepository = require('../../repositories/rawMaterial.repository');

jest.mock('../../repositories/rawMaterial.repository');

describe('RawMaterial Service (Unit)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRawMaterials', () => {
    it('should return paginated results', async () => {
      rawMaterialRepository.findAll.mockResolvedValue({
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
      rawMaterialRepository.findByCodeOrName.mockResolvedValue({ id: 2, name: 'Water' });

      await expect(rawMaterialService.createRawMaterial({ code: 'RM-001', name: 'Water' }))
        .rejects.toThrow('A raw material with this name or code already exists.');
    });

    it('should create new material if valid', async () => {
      rawMaterialRepository.findByCodeOrName.mockResolvedValue(null);
      rawMaterialRepository.create.mockResolvedValue({ id: 1, name: 'New Material' });

      const result = await rawMaterialService.createRawMaterial({ code: 'RM-001', name: 'New Material' });
      expect(result.id).toBe(1);
      expect(result.name).toBe('New Material');
    });
  });
});
