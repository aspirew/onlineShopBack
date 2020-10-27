const Service = require('../models/services')
const Reservation = require('../models/reservations')

const constants = require('../constants')

module.exports = {

	allServices: async (req, res) => {
		const result = await Service.find()
		console.log(result)
		res.json(result)
	},

	serviceById: async (req, res) => {
		const result = await Service.findById(req.params.id)
		console.log(result)
		res.json(result)
	},

	allUserReservations: async (req, res) => {
		const email = req.session.email
		const result = await Reservation.find({email : email})
		res.json(result)
	},

	currentReservations: async (req, res) => {
		const result = await Reservation.find()
		console.log(result)
		res.json(result)
	},

	makeReservation: async (req, res) => {
		const {service, date, beginHour, email, status} = req.body

		if(!service || !date || !beginHour || !email || !status) 
			return res.json({success: false, message: "nieprawidłowy json"})
		
		const fetchedService = await Service.findById(service)
		if(!fetchedService) return res.json({success: false, message: "nie ma takiej usługi"})

		const finishHour = constants.standard_hours [
			constants.standard_hours.indexOf(beginHour) +
			fetchedService.duration / constants.hours_interval
		]

		console.log(finishHour)

		const allReservations = await Reservation.find({date: date})

		if(allReservations) {
			if(!constants.standard_hours.includes(beginHour)) 
				return res.json({success: false, message: "nieprawidłowa godzina"})

			let isCorrect = allReservations.every(r => 
			(r.finishHour && constants.standard_hours.indexOf(r.finishHour) <= constants.standard_hours.indexOf(beginHour))
			|| (finishHour && constants.standard_hours.indexOf(r.beginHour) >= constants.standard_hours.indexOf(finishHour)))
			if(!isCorrect) return res.json({success: false, message: "godziny na siebie nachodzą"})
		}
		else return res.json({success: false, message: "nieprawidłowa data"})

		newReservation = new Reservation({
			email: email,
			service: service,
			date: date,
			beginHour: beginHour,
			finishHour: finishHour || null,
			status: status
		})

		console.log(status)

		newReservation.save((err) => {
		 	if(err) res.json({success: false, message: "coś poszło nie tak"})
		 	else res.json({success: true, message: "rezerwacja udana"})
		})
	},

	deleteReservation: async (req, res) => {
		Reservation.findByIdAndDelete(req.body.resId).then(err =>{
			console.log(err)
			res.json({success: true})
		})
	},

	cancelReservation: async (req, res) => {
		Reservation.findByIdAndUpdate(req.body.resId, {status: req.body.status}).then(err =>{
			console.log(err)
			res.json({success: true})
		})
	}

	}
