import { Request } from 'express'
import originBookModel, { IOriginalBook } from '../models/database/originBook.model'
import logger from '../configs/logger'
import { FilterQuery } from 'mongoose'
import { processPDF } from '~/utils/pgfProcessor'

interface IOriginBookService {
  createData(data: any): Promise<any>
  createByFile(filePath: string, req: Request): Promise<any>
  getData(req: Request): Promise<{ total: number; data: any[] }>
  getDataById(req: Request): Promise<any>
  updateDataById(req: Request): Promise<any>
  deleteDataById(req: Request): Promise<any>
}
const OriginBookService: IOriginBookService = {
  async createData(data: any) {
    try {
      const createdData = await originBookModel.create(data)
      return createdData
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },
  async createByFile(filePath, req) {
    try {
      const chapterData = await processPDF(filePath)
      const bookData = {
        title: req.body.title, // Cập nhật title dựa trên nội dung thực tế
        author: req.body.author,
        imageCovers: req.body.imageCovers, // Gán authorId thực tế
        chapters: chapterData,
        description: 'Mô tả sách từ PDF'
      }
      // Lưu dữ liệu vào cơ sở dữ liệu
      const originalBook = await originBookModel.create(bookData)
      return originalBook
    } catch (error: any) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },
  async getData(req: Request) {
    const allowedFields = ['title', 'author']
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const conditions: FilterQuery<any>[] = allowedFields
      .map((field) => {
        if (field === 'title' || field === 'author') {
          if (req.query[field]) {
            return { [field]: { $regex: req.query[field], $options: 'i' } }
          }
        } else if (req.query[field]) {
          return { [field]: req.query[field] }
        }
      })
      .filter((condition): condition is FilterQuery<any> => condition !== null)

    const startDate = new Date(req.query.startDate as string)
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date()
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      endDate.setDate(endDate.getDate() + 1)
      conditions.push({
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      })
    }
    const projection = {
      title: 1,
      author: 1,
      images: 1,
      description: 1
    }
    const _data = await originBookModel.find({ $and: conditions }, projection).skip(skip).limit(limit).lean().exec()
    const count = await originBookModel.countDocuments({ $and: conditions })
    const totalPages = Math.ceil(count / limit)
    return {
      total: count,
      data: _data,
      totalPages,
      limit,
      currentPage: page
    }
  },

  async getDataById(req: Request) {
    try {
      const dataId = req.params.id
      const data = await originBookModel.findById(dataId)
      return data
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },
  async updateDataById(req: Request) {
    try {
      const dataId = req.body.id ? req.body.id : req.params.id
      const data = req.body
      const updatedData = await originBookModel.findByIdAndUpdate(dataId, data, { new: true })
      return updatedData
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },

  async deleteDataById(req: Request) {
    try {
      const dataId = req.body.id ? req.body.id : req.params.id
      await originBookModel.findByIdAndDelete(dataId)
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  }
}

export default OriginBookService
