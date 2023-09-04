require('dotenv').config()

module.exports = {
  db_info: {
    host: process.env.HOST,
    port: process.env.PORT,
    database_name: process.env.DATABASE,
    database_url: process.env.DATABASE_URL,
    secret_key:process.env.SECRET_KEY
  }
}