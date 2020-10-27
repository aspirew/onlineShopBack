const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
	title: String,
	duration: Number,
	description: String,
	image: String,
	price: Number
})

const Service = mongoose.model('services', ServiceSchema)

module.exports = Service
