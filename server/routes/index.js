import express from 'express'
import authRoutes from './v1/auth.route.js'
import cateRoutes from './v1/category.route.js'
import seriesRoutes from './v1/series.route.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Api is ready' })
})

Router.use('/auth', authRoutes)
Router.use('/cate', cateRoutes)
Router.use('/series', seriesRoutes)

export default Router
