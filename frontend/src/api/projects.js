import client from './client.js'
export const listProjects = () => client.get('/projects').then(r=>r.data)
export const createProject = (name) => client.post('/projects', { name }).then(r=>r.data)
export const deleteProject = (id) => client.delete(`/projects/${id}`).then(r=>r.data)
