import { request } from './client';

export const gradeService = {
  getAll: () => request('GET', '/grades?_expand=course'),
  getById: (id) => request('GET', `/grades/${id}?_expand=course`),
  update: (id, data) => request('PATCH', `/grades/${id}`, data),
  create: (data) => request('POST', '/grades', data),
};

export default gradeService;
