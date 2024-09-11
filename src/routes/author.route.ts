import express, { Router } from 'express'
import authorController from '../controllers/author.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, authorController.createData)

router.get('/', authMiddleware, authorController.getData)

router.get('/:id', authMiddleware, authorController.getDataById)

router.put('/:id', authMiddleware, authorController.updateDataById)

router.delete('/:id', authMiddleware, authorController.deleteDataById)

export default router
