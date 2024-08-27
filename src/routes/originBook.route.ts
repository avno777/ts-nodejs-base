import express, { Router } from 'express'
import originBookController from '../controllers/originBook.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, originBookController.createData)

router.get('/', authMiddleware, originBookController.getData)

router.get('/:id', authMiddleware, originBookController.getDataById)

router.put('/:id', authMiddleware, originBookController.updateDataById)

router.delete('/:id', authMiddleware, originBookController.deleteDataById)

export default router
