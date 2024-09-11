import { IAuthor } from './../models/database/author.model'
import { Request } from 'express'
import authorModel from '../models/database/author.model'
import logger from '../configs/logger'
import { FilterQuery } from 'mongoose'
import { IRequest } from '~/models/interfaces/req.interface'
// import createTimestamp from '../config/createTimestamp'
// import logger from '../config/winston'
// import { ICustomer } from '../models/database/driver.model'
// import { ITimeStamp } from '../models/interfaces/timeStamp.interface'

interface IAuthorService {
  createData(data: any): Promise<any>
  getData(req: Request): Promise<{ total: number; data: any[] }>
  getDataById(_id: string): Promise<any>
  updateDataById(_id: string, req: Request): Promise<any>
  deleteDataById(req: Request): Promise<any>
}
interface RequestWithUser extends Request {
  user?: {
    _id: string
  }
}

const AuthorService: IAuthorService = {
  async createData(data: any) {
    try {
      const createdData = await authorModel.create(data)
      return createdData
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },
  async getData(req: Request) {
    const allowedFields = ['fullname', 'displayName', 'email', 'phone']
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const conditions: FilterQuery<any>[] = allowedFields
      .map((field) => {
        if (field === 'fullName' || field === 'email' || field === 'phone' || field === 'displayName') {
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

    const _data = await authorModel.find({ $and: conditions }).skip(skip).limit(limit).lean().exec()
    const count = await authorModel.countDocuments({ $and: conditions })
    const totalPages = Math.ceil(count / limit)
    return {
      total: count,
      data: _data,
      totalPages,
      limit,
      currentPage: page
    }
  },

  async getDataById(_id: string) {
    try {
      const data = await authorModel.findById(_id)
      return data
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },
  async updateDataById(_id: string, req: Request) {
    try {
      const data = req.body
      const updatedData = await authorModel.findByIdAndUpdate(_id, data, { new: true })
      return updatedData
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },

  async deleteDataById(req: IRequest) {
    try {
      const dataId = req.user?._id ?? ''
      await authorModel.findByIdAndDelete(dataId)
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  }
}

export default AuthorService
