const Order = require("../models/order")

const constants = require("../constants")

module.exports = {

    createNewOrder: (req, res) => {

		console.log(req.session)

        const email = req.session.email || undefined // set to logged in user or undefined
        const cartData = req.body.products
		const value = req.body.value
		
		console.log(email)

        newOrder = new Order({
			email: email,
            products: cartData,
			value: value,
			deliveryDetails: undefined,
			status: constants.order_status[0],
			date: Date.now()
		})

		newOrder.save((err, entity) => {
		  	if(err) res.json({success: false, message: "coś poszło nie tak"})
		  	else res.json({success: true, message: "zamówienie utworzone", id: entity.id})
		})
	},
	
	getOrder: async (req, res) => {
		const id = req.params.id
		const order = await Order.findById(id)
		res.json(order)
	},

	getAllOrders: async (req, res) => {
		res.json(await Order.find().sort({date: 'desc'}))
	},

	confirmOrder: async (req, res) => {
		console.log(req.body)
		const id = req.params.id
		const {email, products, deliveryData} = req.body
		await Order.findByIdAndUpdate(id, {
			email: email,
			deliveryDetails: deliveryData,
			status: constants.order_status[1]
		}).then((result, err) =>{
			if(!err)
				res.json({success: true, message: "Zamówienie potwierdzone"})
			else res.json({success: false, message: "Coś poszło nie tak"})
		})
	}

}
