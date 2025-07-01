const path = require("path")
const express = require("express")
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')
const helmet = require("helmet")
const morgan = require("morgan")

const api = require("./api")
const convertErrors = require('./middleware/convertErrors')
const handleErrors = require('./middleware/handleErrors')
const app = express()

// parsing cookies for auth
app.use(cookieParser())

// setting up logger
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// opening cors for development
app.use(cors())

// setting security HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: false,
}))

// parsing incoming requests with JSON body payloads
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// gzip compression
app.use(compression())

// redirecting API
app.use(`/api/${process.env.API_VERSION}`, api)

// 404 fallback
app.all("*", (req, res, next) => {
    res.status(404).end()
})

// errors
app.use(convertErrors)
app.use(handleErrors)

module.exports = app
