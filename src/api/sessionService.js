import { request } from './client';

export const sessionService = {
  getAll: () => request('GET', '/sessions?_expand=course'),
  getById: (id) => request('GET', `/sessions/${id}?_expand=course`),
  update: (id, data) => request('PATCH', `/sessions/${id}`, data),
  create: (data) => request('POST', '/sessions', data),
};

export default sessionService;
