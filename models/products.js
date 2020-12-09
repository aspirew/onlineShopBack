const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
	name: {type: String, unique: true, dropDups: true}, //need to createIndex to make it work https://stackoverflow.com/questions/22602598/how-to-make-a-variable-a-unique-key-in-mongoose/56302405#56302405
	price: Number,
	description: String,
	quantity: {type: Number, default: 0},
	tags: [String],
	image_url: String
})

const Products = mongoose.model('products', ProductsSchema)

module.exports = Products
