import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
  auth: {
    login: `${environment.apiUrl}/auth/login`,
    register: `${environment.apiUrl}/auth/register`
  },
  rawMaterials: {
    base: `${environment.apiUrl}/raw-materials`,
    byId: (id: number) => `${environment.apiUrl}/raw-materials/${id}`
  }
};
