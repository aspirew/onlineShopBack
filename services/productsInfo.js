const Products = require('../models/products')
const imageManage = require('./imageManage')

module.exports = {

	allProducts: async (req, res) => {
		const result = await Products.find().sort({name: 'asc'})
		res.json(result)
	},

	someProducts: async (req, res) => {
		const { perPage } = req.body
		console.log(perPage)

		const result = await Products.find()
		.where('quantity').gt(0)
		.skip(perPage * (req.params.page - 1))
		.limit(perPage)
		.sort({name: 'asc'})

		res.json(result)
	},

	oneProductByName: async (req, res) => {
		const result = await Products.findOne({name: req.body.name})
		res.json(result)
	},

	oneProductById: async (req, res) => {
		const result = await Products.findById(req.body.ID)
		res.json(result)
	},

	numOfAllProducts: async (req, res) => {
		const result = await Products.countDocuments().where('quantity').gt(0)
		res.json(result)
	},

	searchProducts: async (req, res) => {
		const {searchPhrase} = req.body
		console.log(req.body)
		const phrases = searchPhrase.split(' ')
		const result = []
		for (phrase of phrases){
			const nameRes = await Products.find({name: {$regex: new RegExp(phrase.toLowerCase(), "i")} }).where('quantity').gt(0)
			if(nameRes.length > 0) result.push(...nameRes.filter(namesElem => !result.some(
				elem => elem._id.toString() == namesElem._id.toString())))

			const tagsRes = await Products.find({tags: phrase}).where('quantity').gt(0) // toLowerCase
			if(tagsRes.length > 0) result.push(...tagsRes.filter(tagsElem => !result.some(
					elem => elem._id.toString() == tagsElem._id.toString())))
		}
		res.json(result)
	},

	editProduct: async (req, res) =>{

	if(req.session.active){
		console.log(req.body)
		console.log(req.params)
		const id = req.params.id
		const {name, price, quantity} = req.body

		Products.findByIdAndUpdate(id, {
			"name": name,
			"price": price,
			"quantity": quantity
		}).then((result, err) => {
			if(err) res.json({success: false})
			else res.json({success: true})
		})
		}
		else res.json({success:false, message:"where is the admin?"})
	},

	addNewProduct: async (req, res) => {
		const {name, price, description, quantity, tags} = req.body.productData
		const image = req.body.name

		if(!name || !price ) {
			res.json({success: "false", message: "Brak wymaganych pól"})
			return
		}
		if(!image) {
			res.json({success: "false", message: "Brak zdjęcia"})
			return
		}

		const product = new Products({
			name: name,
			price: price,
			description: description,
			quantity: quantity,
			tags: tags,
			imageURL: image
		})

		const result = await product.save()
		console.log(result)


		res.json({
			success: true,
			message: "Product succesfully added"
		})

	  
	}
}
