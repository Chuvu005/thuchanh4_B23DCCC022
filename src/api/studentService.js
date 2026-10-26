import { request } from './client';

export const studentService = {
  getAll: () => request('GET', '/students'),
  getById: (id = 1) => request('GET', `/students/${id}`),
  update: (id = 1, data) => request('PATCH', `/students/${id}`, data),
  create: (data) => request('POST', '/students', data),
};

export default studentService;
