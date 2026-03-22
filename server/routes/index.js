import express from 'express'
import authRoutes from './v1/auth.route.js'
import cateRoutes from './v1/category.route.js'
import seriesRoutes from './v1/series.route.js'
import authorRoutes from './v1/author.route.js'
import publisherRoutes from './v1/publisher.route.js'
import bookRoutes from './v1/book.route.js'
import invenRoutes from './v1/inventory.route.js'
import wishlistRoutes from './v1/wishlist.route.js'
import cartRoutes from './v1/cart.route.js'
import userRoutes from './v1/user.route.js'
import orderRoutes from './v1/order.route.js'
import addressRoutes from './v1/address.route.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Api is ready' })
})

Router.use('/auth', authRoutes)
Router.use('/cate', cateRoutes)
Router.use('/series', seriesRoutes)
Router.use('/author', authorRoutes)
Router.use('/publisher', publisherRoutes)
Router.use('/book', bookRoutes)
Router.use('/inventory', invenRoutes)
Router.use('/wishlist', wishlistRoutes)
Router.use('/cart', cartRoutes)
Router.use('/user', userRoutes)
Router.use('/order', orderRoutes)
Router.use('/address', addressRoutes)

export default Router
