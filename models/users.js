const mongoose = require('mongoose')
const ProductsInCart = require('./productsInCart').schema

const UserSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	points: {type: Number, default: 0},
	cart: [ProductsInCart],
	deliveryDetails: {
		name: String,
		surname: String,
		street: String,
		houseNum: Number,
		flatNum: Number,
		city: String,
		zip: String
	}
})

const User = mongoose.model('users', UserSchema)

module.exports = User
