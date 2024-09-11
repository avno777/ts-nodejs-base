import express, { Router } from 'express'
import multer from 'multer'
import originBookController from '../controllers/originBook.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/', authMiddleware, originBookController.createData)

router.post('/upload-pdf', upload.single('file'), originBookController.createByFile)

router.get('/', authMiddleware, originBookController.getData)

router.get('/:id', authMiddleware, originBookController.getDataById)

router.put('/:id', authMiddleware, originBookController.updateDataById)

router.delete('/:id', authMiddleware, originBookController.deleteDataById)

export default router
