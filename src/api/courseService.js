import { request } from './client';

export const courseService = {
  getAll: () => request('GET', '/courses'),
  getById: (id) => request('GET', `/courses/${id}`),
  update: (id, data) => request('PATCH', `/courses/${id}`, data),
  create: (data) => request('POST', '/courses', data),
};

export default courseService;
