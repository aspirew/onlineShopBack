const Order = require("../models/order")

const mongoose = require('mongoose');
const constants = require("../constants");
const Products = require("../models/products");

module.exports = {

    createNewOrder: async (req, res) => {

        const email = req.session.email || undefined
        const cartData = req.body.products
		const value = req.body.value

		console.log(cartData)

		await cartData.forEach(async p => {
			await Products.findByIdAndUpdate(p.productID, {"$inc" : {"quantity": -p.quantity}})
		})

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
		  	else {
				if(!req.session.email){
					req.session.orderId = entity._id
					req.session.save()
				}
				  res.json({success: true, message: "zamówienie utworzone", id: entity.id})
			  }
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

	getSomeOrders: async (req, res) => {
		const { perPage } = req.body
		console.log(req.body)

		const result = await Order.find()
		.skip(perPage * (req.params.page - 1))
		.limit(perPage)

		 res.json(result)
	},

	searchOrder:  async (req, res) =>{
		const { searchPhrase } = req.body
		console.log(req.body)

		let result

		if (mongoose.Types.ObjectId.isValid(searchPhrase)){
			result = [await Order.findById(searchPhrase)]
		}
		else{
			result = await Order.find({email: searchPhrase})
		}

		if(result){
			res.json({
				success: true,
				result: result
			})
		}
		else{
			res.json({
				success: false,
				result: result
			})
		}
	},
	
	changeStatus: async (req, res) => {
		const {id, status} = req.body
		await Order.findByIdAndUpdate(id, {
			status: status
		}).then((err, result) =>{
			if(!result)
				res.json({success: true, message: "Zmieniono status"})
			else res.json({success: false, message: "Coś poszło nie tak"})
		})
	},

	confirmOrder: async (req, res) => {
		console.log(req.body)
		const id = req.params.id
		const {email, products, deliveryData} = req.body
		await Order.findByIdAndUpdate(id, {
			email: email,
			deliveryDetails: deliveryData,
			status: constants.order_status[1]
		}).then((err, result) =>{
			if(!result){
				res.json({success: true, message: "Zamówienie potwierdzone"})
				req.session.orderId = null
			}
			else res.json({success: false, message: "Coś poszło nie tak"})
		})
	}

}
