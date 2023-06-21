import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/routes.js'

dotenv.config()

const PORT = process.env.PORT

const app = express()

app.use(express.static('./upload'))


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/ecommerce/v1', router)

app.listen(PORT, () => {
    console.log('Server is running on ' + PORT)
})