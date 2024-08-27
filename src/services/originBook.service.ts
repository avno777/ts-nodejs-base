import { Request } from 'express'
import originBookModel from '../models/database/originBook.model'
import logger from '../configs/logger'
import { FilterQuery } from 'mongoose'

interface IOriginBookService {
  createData(data: any): Promise<any>
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

    const _data = await originBookModel.find({ $and: conditions }).skip(skip).limit(limit).lean().exec()
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
