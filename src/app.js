import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import videoRouter from './routes/videoRoutes.js'

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use("/api/videos", videoRouter)

export default app;