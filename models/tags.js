const mongoose = require('mongoose')

const TagsSchema = new mongoose.Schema({
	name: {type : String, unique: true, required: true, dropDups: true}
})

const Service = mongoose.model('tags', TagsSchema)

module.exports = Service
