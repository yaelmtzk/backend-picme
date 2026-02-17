import 'dotenv/config'
import http from 'http'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { storyRoutes } from './api/story/story.routes.js'
import { setupSocketAPI } from './services/socket.service.js'
import { dbService } from './services/db.service.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

const app = express()
const server = http.createServer(app)

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// Express App Config
app.use(cookieParser())
app.use(express.json())

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, origin)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

app.use(cors(corsOptions))

app.all('*all', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/story', storyRoutes)

setupSocketAPI(server)

import { logger } from './services/logger.service.js'
const port = process.env.PORT || 3030

await dbService.connect()

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})