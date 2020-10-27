const mongoose = require('mongoose')
const productsInCart = require('./productsInCart').schema

const OrderSchema = new mongoose.Schema({
    email: String,
    products: [productsInCart],
    deliveryDetails: {
		name: String,
		surname: String,
		street: String,
		houseNum: Number,
		flatNum: Number,
		city: String,
		zip: String
    },
    value: Number,
	status: String,
	date: Date
})

const Order = mongoose.model('orders', OrderSchema)

module.exports = Order