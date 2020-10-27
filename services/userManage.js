
const User = require('../models/users')

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
    const result = await User.findOneAndUpdate({_id: req.session._id, password: req.body.cPass}, {password: req.body.newPass})
    if(result)
        res.json({status: true})
    else
        res.json({status: false})
}

}