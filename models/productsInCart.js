const mongoose = require('mongoose')

const ProductsInChartSchema = new mongoose.Schema({
	productID: mongoose.ObjectId,
	quantity: Number
})

const ProductsInCart = mongoose.model('productsInCart', ProductsInChartSchema)

module.exports = ProductsInCart
