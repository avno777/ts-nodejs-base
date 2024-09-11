import { Request, Response } from 'express'
import OriginBookService from '../services/originBook.service' // Đảm bảo rằng bạn đã import đúng service
import { IRequest } from '../models/interfaces/req.interface'

const OriginBookController = {
  createData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const createdData = await OriginBookService.createData(req)
      res.status(201).json({ message: 'Create new  data successfully', createdData })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  createByFile: async function (req: Request, res: Response) {
    try {
      const filePath = req.file?.path
      if (!filePath) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const bookData = await OriginBookService.createByFile(filePath, req)
      // const originalBook = new OriginalBook(bookData)
      // await originalBook.save()
      res.status(200).json({ message: 'File processed and data saved successfully' })
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while processing the PDF file' })
    }
  },
  getData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const _data = await OriginBookService.getData(req)
      res.status(200).json({ message: 'Get data successfully', _data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  getDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const data = await OriginBookService.getDataById(req)
      if (!data) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Get data successfully', data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  updateDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const updatedData = await OriginBookService.updateDataById(req)
      if (!updatedData) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Update data successfully', updatedData })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  deleteDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const deletedData = await OriginBookService.deleteDataById(req)
      if (!deletedData) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Delete data successfully' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default OriginBookController
