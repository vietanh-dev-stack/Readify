import express from 'express'
import cors from 'cors'
import env from './configs/environment.js'
import connectDB from './configs/mongodb.js'
import APIs from './routes/index.js'
import cookieParser from 'cookie-parser'


const app = express()
const hostname = env.APP_HOST
const port = env.APP_PORT

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/api', APIs)

connectDB()

app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
})