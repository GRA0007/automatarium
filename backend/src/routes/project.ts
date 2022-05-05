import express from 'express'

import { createProject, getProject, getProjects, updateProject } from 'controllers/project'
import { isAuthenticated } from 'middleware'

const app = express.Router()

app.post('', isAuthenticated, createProject)
app.get('/:pid', getProject)
app.post('/:pid', isAuthenticated, updateProject)
app.get('', isAuthenticated, getProjects)

export default app
