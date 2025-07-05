const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize('nodejs_login', 'user', '1234', {
  host: 'mysql-app-sayt3',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('✅ Connection has been established successfully.')
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message)
    process.exit(1) // Остановить сервер, если БД не подключена
  }
}

connectDB()

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
