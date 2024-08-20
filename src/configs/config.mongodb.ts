type ConfigDatabaseMongo = {
  app: {
    PORT: number | string
  }
  db: {
    PORT: number | string
    HOST: string
    NAME: string
  }
}

const dev: ConfigDatabaseMongo = {
  app: {
    PORT: process.env.DEV_APP_PORT || 3456
  },
  db: {
    PORT: process.env.DEV_DB_PORT || 27017,
    HOST: process.env.DEV_DB_HOST || 'localhost',
    NAME: process.env.DEV_DB_NAME || 'shopDev'
  }
} as const

const pro: ConfigDatabaseMongo = {
  app: {
    PORT: process.env.PRO_APP_PORT || 3333
  },
  db: {
    PORT: process.env.PRO_DB_PORT || 27017,
    HOST: process.env.PRO_DB_HOST || 'localhost',
    NAME: process.env.PRO_DB_NAME || 'shopPro'
  }
} as const

const env = process.env.NODE_ENV || 'dev'
const config: { [key: string]: ConfigDatabaseMongo } = { pro, dev }
export default config[env]
