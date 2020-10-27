const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
	name: String,
	price: Number,
	description: String,
	quantity: Number,
	tags: [String],
	imageURL: String
})

const Products = mongoose.model('products', ProductsSchema)

module.exports = Products
