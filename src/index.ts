import express, { Express, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import session from 'express-session'
//import passport from 'passport'
import routes from './routes'
import { config } from './configs/config'
import dbConnection from './configs/dbConnection'
import authLimiter from './middlewares/rateLimit.middleware'
import './utils/genKey'
import passport from './passport'
dotenv.config()

const port: string | number = config.port || 6060
const app: Express = express()
dbConnection()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.setHeader('Access-Control-Allow-Origin', '*') // Enable CORS
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//   //res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
//   next()
// })
app.use(cors())
app.use(function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log('..Error Handler..', err)
  if (err.name === 'ValidationError') {
    return res.status(400).send(err)
  }
  return res.status(500).send(err)
})
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
)
app.use(passport.initialize())
app.use(passport.session())
//app.use(passport.authenticate('session'))
app.use(compression())
app.use('/v1/api', routes)
const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(helmet())

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
