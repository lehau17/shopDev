import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { checkOverLoad } from './helpers/check.connect'

// create a server
const app = express()

//config server
const PORT = 3000

//connect database and config
import './db/init.mongo'
checkOverLoad()
//middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
//

app.get('/', (req, res) => {
  const strResponse = 'hello'
  res.json(strResponse.repeat(100000))
})

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT)
})

export default app
