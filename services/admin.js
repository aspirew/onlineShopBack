module.exports = {

    isLoggedIn: (req, res) => {
        res.json({ status: req.session.active })
    },

	login: (req, res) => {
        if(req.body.password == process.env.shadow){
            req.session.active = true
			req.session.save()
            res.json({status: true})
        }
        else res.json({status: false})
    },

    logout: (req, res) => {
        req.session.destroy()
        return res.json({status: true})
    }
}