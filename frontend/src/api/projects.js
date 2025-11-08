import client from './client.js'

export const listProjects = () => client.get('/projects').then(r => r.data)

export const getProject = (id) => client.get(`/projects/${id}`).then(r => r.data)

export const createProject = (name) => client.post('/projects/create', { name }).then(r => r.data)

export const updateProject = (id, name) => client.patch(`/projects/${id}/update`, { name }).then(r => r.data)

export const deleteProject = (id) => client.delete(`/projects/${id}/delete`).then(r => r.data)
