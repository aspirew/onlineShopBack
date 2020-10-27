const mongoose = require('mongoose')

const ReservationsSchema = new mongoose.Schema({
	email: String,
	service: String,
	date: String,
	beginHour: String,
	finishHour: String,
	status: String
})

const Reservation = mongoose.model('reservations', ReservationsSchema)

module.exports = Reservation
