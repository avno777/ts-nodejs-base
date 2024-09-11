import { Request, Response } from 'express'
import authorService from '../services/author.service' // Đảm bảo rằng bạn đã import đúng service
import { IRequest } from '../models/interfaces/req.interface'
import { response200, response400, response500 } from '~/utils/apiResponse'
import jsonRes from '~/utils/jsonRes'

const AuthorController = {
  createData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const createdData = await authorService.createData(req)
      res.status(201).json({ message: 'Create data successfully', createdData })
    } catch (error: any) {
      response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  getData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const _data = await authorService.getData(req)
      res.status(200).json({ message: 'Get data successfully', _data })
    } catch (error: any) {
      response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  getDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const dataId: string = req.user?._id ?? ''
      const user = await authorService.getDataById(dataId)
      if (!user) {
        res.status(404).json({ message: 'Data not found' })
        response400(res, jsonRes.USER_NOT_FOUND)
      }
      const { _id, fullname, email, avatarUrl, phone } = user
      res.status(200).json({
        message: 'Get data successfully',
        data: { _id, fullname, email, avatarUrl, phone }
      })
    } catch (error: any) {
      response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  updateDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const dataId: string = req.user?._id ?? ''
      const updatedData = await authorService.updateDataById(dataId, req)
      if (!updatedData) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Update data successfully', updatedData })
    } catch (error: any) {
      response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  deleteDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const deletedData = await authorService.deleteDataById(req)
      if (!deletedData) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Delete data successfully' })
    } catch (error: any) {
      response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  }
}

export default AuthorController
