const { deleteMany } = require('../models/products')
const Products = require('../models/products')
const Tags = require('../models/tags')

const newTagsAddFun = tags => {
	let skipped = 0

	tags.forEach(async element => {

		const tag = new Tags({
			name: element
		})

		tag.save((err) => {
			if(err) {
				console.log(`Couldnt add tag ${element}`)
				skipped++
				console.log(skipped)
			}
		})
	})

	return skipped
}

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
		const id = req.params.id
		const {name, price, quantity, image, description, tags} = req.body

		newTagsAddFun(tags)

		Products.findByIdAndUpdate(id, {
			"name": name,
			"price": price,
			"quantity": quantity,
			"image_url": image,
			"description": description,
			"tags": tags
		}).then((result, err) => {
			if(err) res.json({success: false})
			else res.json({success: true})
		})
		}
		else res.json({success:false, message:"where is the admin?"})
	},

	deleteProducts : async (req, res) => {
		if(req.session.active){
			const ids = req.body.ids
			Products.deleteMany({_id: {
				$in: ids
			}})
			.then((result, err) => {
				if(err) res.json({success: false, message: "something went wrong"})
				else res.json({success: true, message: `Succesfully deleted selected products` })
			})
		}
		else res.json({success:false, message:"where is the admin?"})
	},

	addNewProduct: async (req, res) => {
		const {name, price, description, quantity, tags} = req.body.productData
		const image = req.body.name

		newTagsAddFun(tags)

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
			image_url: image
		})

		const result = await product.save()
		console.log(result)


		res.json({
			success: true,
			message: "Product succesfully added"
		})
	},

	addNewTags: async (req, res) => {

		const tags = req.body.tags

		const skipped = newTagsAddFun(tags)

		res.json({message: `Added new tags. Skipped ${skipped} tags due to duplicates`})

	},

	getAllTags: async (req, res) => {
		const tags = await Tags.find()
		const productsTags = (await Products.find()).map(p => p.tags).flat()
		const resJson = []
		tags.forEach(t => {
			if(productsTags.includes(t.name)){
				resJson.push({
					tag: t,
					isBound: true
				})
			}
			else
				resJson.push({
					tag: t,
					isBound: false
				})
		})
		console.log(resJson)
		res.json(resJson)
	},

	deleteTags: async (req, res) =>{
		const tags = req.body.tags
		const errs = []

		tags.forEach(async element => {
			const del = Tags.findByIdAndDelete(element._id).then((result, err) => {
				if(err) errs.push(err)
			})
		})

		res.json({message: `deletion done, skipped ${errs.length} due to errors`})
	}
}
