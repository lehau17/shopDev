import mongoose from 'mongoose'
import configMongodb from '~/configs/config.mongodb'
import { checkNumberConnect } from '~/helpers/check.connect'
const connectString = `mongodb://${configMongodb.db.HOST}:${configMongodb.db.PORT}/${configMongodb.db.NAME}`
class Database {
  static instance: Database
  constructor() {
    //check environment Dev
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', {
        color: true
      })
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 100
      })
      .then(() => {
        console.log('Connect success>>>' + connectString)
        checkNumberConnect()
      })
      .catch(() => {
        console.log('Failed to connect')
      })
  }

  static connectDb = (type = 'mongo') => {
    if (!this.instance) {
      this.instance = new Database()
    }
    return this.instance
  }
}

export default Database.connectDb()
