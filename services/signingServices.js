const User = require('../models/users')

module.exports = {

	login: async (req, res) => {

		const {email, password} = req.body
		const result = await User.findOne({email : email, password : password})

		if(!result){
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

		console.log(existingUser)

		if(existingUser) {
			res.json({
				success: false,
				message: "Email already in use"
			})
			return
		}

		console.log(req.body)
		const user = new User({
			username,
			email,
			password
		})

		const result = await user.save()
		console.log(result)
		res.json({
			success: true,
			message: "Welcome!"
		})
	}

}