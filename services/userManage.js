const pass = require('secure-random-password')
const bcrypt = require('bcrypt')
const User = require('../models/users')

const emailService = require('./emailSerivce')

module.exports = {

userInfo: async (req, res) => {

    let user = null

    console.log(req.body.email)

    if(req.body.email) user = await User.findOne({email: req.body.email})	
    else user = await User.findOne({email: req.session.email})

    if(!user){
        res.json({
            success: false,
            message: "User doesn't exist"
        })
        return
    }

    res.json({
        success: true,
        email: user.email,
        username: user.username,
        points: user.points,
        deliveryDetails: user.deliveryDetails,
        cart: user.cart
    })
    },

setDelivery: async (req, res) => {
    console.log(req.body)

    console.log(req.session)

    User.findByIdAndUpdate(req.session._id, {deliveryDetails: req.body}, (err, res) => {
        if(err)
            console.log(err)
        else
            console.log(res)
    })

    res.json({status: true})

},

updateUserCart: async (req, res) => {
     User.findByIdAndUpdate(req.session._id, { $set: { cart: req.body }}, (err, res) => {
         if(err)
             console.log(err)
     })

     res.json({status: true})
},

changePass: async (req, res) => {

    const result = await User.findById(req.session._id)
    if(result){
        console.log(result.password)
        const isSame = await bcrypt.compare(req.body.cPass, result.password);
        console.log(isSame)
        if(isSame){
            console.log(req.body.newPass)
            const salt = await bcrypt.genSalt(Math.random() * 10 + 1)
            const hash = await bcrypt.hash(req.body.newPass, salt)
            await User.findByIdAndUpdate(req.session._id, {"$set" : {"password" : hash}})
            console.log(await bcrypt.compare(req.body.newPass, hash))
            console.log(hash)
            res.json({status: true})
        }
        else
            res.json({status: false})
    }
},

recoverPassword: async (req, res) => {
    const exists = await User.findOne({"email" : req.params.email})

    if(exists){
        const newPass = pass.randomPassword()
        const salt = await bcrypt.genSalt(Math.random() * 10 + 1)
        const hash = await bcrypt.hash(newPass, salt)

        await User.findByIdAndUpdate(exists._id, {"$set" : { "password": hash }})

        emailService.sendPassRecoveryEmail(req.params.email, newPass)

        res.json({status: true})

    }
    else{
        res.json({status: false})
    }
},

checkIfOrderInitialized: async (req, res) => {
    if(req.session.orderId){
        res.json({order_id: req.session.orderId, status: true})
    }
    else {
        res.json({order_id: null, status: false})
    }
}

}