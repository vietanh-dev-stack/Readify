import express from 'express'
import authRoutes from './auth.route.js'
import cateRoutes from './category.route.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Api is ready' })
})

Router.use('/auth', authRoutes)
Router.use('/cate', cateRoutes)

export default Router
