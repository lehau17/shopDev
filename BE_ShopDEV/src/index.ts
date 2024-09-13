import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { Request, Response, NextFunction } from 'express'
import { checkOverLoad } from './helpers/check.connect'
import 'dotenv/config'
import { getRedis, initRedis } from './configs/redis.config'
// create a server
const app = express()

//config server
const PORT = process.env.PORT || 3000

//connect database and config
import './db/init.mongo'

//redis
initRedis()
//
import router from './routes'
import { ErrorResponse } from './core/error.response'
import { configProductTypeRegiter } from './configs/config.prroduct'
checkOverLoad()
//middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
//copnfig model
configProductTypeRegiter()
//router
app.use('/api/v1', router)

//handle error
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorResponse('Not Found', 404)
  next(error)
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log('check error handler', error)
  const statusCodeResponse = error.statusCode || 500
  res.status(statusCodeResponse).json({
    status: error.status || 'error',
    message: error.message || 'Internal Server Error'
  })
})

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT)
})

export default app
