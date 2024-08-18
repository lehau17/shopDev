import mongoose from 'mongoose'
import { checkNumberConnect } from '~/helpers/check.connect'

const _URLDB = 'mongodb://localhost:27017/shopDev'
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
      .connect(_URLDB, {
        maxPoolSize: 100
      })
      .then(() => {
        console.log('Connect success')
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
