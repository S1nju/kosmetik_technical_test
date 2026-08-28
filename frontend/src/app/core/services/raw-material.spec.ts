import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RawMaterialService, PaginatedResponse, RawMaterial } from './raw-material';
import { API_ENDPOINTS } from '../api/api-endpoints';

describe('RawMaterialService', () => {
  let service: RawMaterialService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RawMaterialService]
    });
    service = TestBed.inject(RawMaterialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should format get parameters properly and return paginated data', () => {
    const mockReponse: PaginatedResponse<RawMaterial> = { meta: { totalItems: 1, totalPages: 1, currentPage: 1, itemsPerPage: 20 }, data: [] };

    service.getMaterials(2, 20, { name: 'test', status: 'active' }).subscribe(res => {
      expect(res).toEqual(mockReponse);
    });

    const req = httpMock.expectOne(req => req.url.includes(API_ENDPOINTS.rawMaterials.base));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('20');
    expect(req.request.params.get('name')).toBe('test');
    expect(req.request.params.get('status')).toBe('active');
    
    req.flush(mockReponse);
  });

  it('should successfully post a new material', () => {
    const mockData = { name: 'New Material', code: 'NM-01', category: 'solvent', unit_of_measure: 'l', quantity: 10, status: 'active' as const };
    
    service.createMaterial(mockData).subscribe(res => {
      expect(res).toEqual({ id: 1, ...mockData });
    });

    const req = httpMock.expectOne(API_ENDPOINTS.rawMaterials.base);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush({ id: 1, ...mockData });
  });

  it('should successfully update a material by ID', () => {
    const mockUpdate = { quantity: 15 };
    
    service.updateMaterial(1, mockUpdate).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${API_ENDPOINTS.rawMaterials.base}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUpdate);
    req.flush({ id: 1, quantity: 15 });
  });

  it('should successfully transmit a DELETE request by ID', () => {
    service.deleteMaterial(5).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${API_ENDPOINTS.rawMaterials.base}/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
