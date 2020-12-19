const User = require('../models/users')
const bcrypt = require('bcrypt')

module.exports = {

	login: async (req, res) => {

		const {email, password} = req.body
		const result = await User.findOne({email : email})

		const isSame = await bcrypt.compare(password, result.password);

		console.log(result)

		if(!isSame){
			console.log("incorrect details!")
			res.json({
				success: false,
				message: "Incorrect details"
			})
		} else {
			console.log("logging in")
			res.json({
				success: true
			})
			req.session.orderId = null
			req.session.email = email
			req.session._id = result._id
			req.session.save()
		}
	},

	logout: (req, res) => {
		console.log("logging out")
		req.session.destroy()
		res.json({
			success: true
		})
	},

	register: async (req, res) => {

		const {username, email, password} = req.body

		const existingUser = await User.findOne({email : email})

		if(existingUser) {
			res.json({
				success: false,
				message: "Email already in use"
			})
			return
		}

		const salt = await bcrypt.genSalt(Math.random() * 10 + 1)

		const hash = await bcrypt.hash(password, salt)

		console.log(hash)

		console.log(req.body)
		const user = new User({
			username: username,
			email: email,
			password: hash
		})

		const result = await user.save()
		console.log(result)
		res.json({
			success: true,
			message: "Welcome!"
		})
	}

}