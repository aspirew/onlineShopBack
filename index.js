require('dotenv').config()
const express = require('express')
const fs = require('fs')
const https = require('https')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const signingServices = require('./services/signingServices')
const servicesInfo = require('./services/servicesInfo')
const productsInfo = require('./services/productsInfo')
const userManage = require('./services/userManage')
const adminDashboard = require('./services/admin')
const ordersService = require('./services/orders')
const imageManage = require('./services/imageManage')

const constants = require('./constants')

const app = express()

const httpOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem'))
}

const dbConnOptions = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'db.json')))

app.use(session({
    secret: process.env.session_secret,
    saveUnitialized: false,
    resave: false
}))

mongoose.Promise = Promise
mongoose.connect(dbConnOptions.addr + '/' + dbConnOptions.db, 
{user: dbConnOptions.user, pass: dbConnOptions.pass })
.then((err) => {
    console.log('Mongoose up')
})

app.use(bodyParser.json())

app.post('/api/login', (req, res) => signingServices.login(req, res))
app.post('/api/register', (req, res) => signingServices.register(req, res))
app.get('/api/isLoggedIn', (req, res) => res.json({ status: !!req.session.email }))
app.get('/api/logout', (req, res) => signingServices.logout(req, res))
app.post('/api/changePass', (req, res) => userManage.changePass(req, res))

app.get('/api/data', (req, res) => userManage.userInfo(req, res))
app.post('/api/data', (req, res) => userManage.userInfo(req, res))
app.get('/api/services', (req, res) => servicesInfo.allServices(req, res))
app.get('/api/services/:id', (req, res) => servicesInfo.serviceById(req, res))
app.get('/api/reservations', (req, res) => servicesInfo.currentReservations(req, res))
app.post('/api/deleteReservation', (req, res) => servicesInfo.deleteReservation(req, res))
app.post('/api/cancelReservation', (req, res) => servicesInfo.cancelReservation(req, res))
app.get('/api/visits', (req, res) => servicesInfo.allUserReservations(req, res))
app.post('/api/makeReservation', (req, res) => servicesInfo.makeReservation(req, res))
app.post('/api/setDeliveryData', (req, res) => userManage.setDelivery(req, res))
app.post('/api/updateCart', (req, res) => userManage.updateUserCart(req, res))

app.get('/api/products', (req, res) => productsInfo.allProducts(req, res))
app.post('/api/product', (req, res) => productsInfo.oneProductByName(req, res))
app.post('/api/productID', (req, res) => productsInfo.oneProductById(req, res))
app.post('/api/product/:id/edit', (req, res) => productsInfo.editProduct(req, res))
app.post('/api/products/:page', (req, res) => productsInfo.someProducts(req, res))
app.get('/api/productsQuantity', (req, res) => productsInfo.numOfAllProducts(req, res))
app.post('/api/productsSearch', (req, res) => productsInfo.searchProducts(req, res))
app.post('/api/product/addImage', imageManage.upload.single('file'), (req, res, err) => imageManage.imageUpload(req, res, err))
app.post('/api/product/add', imageManage.upload.single('file'), (req, res) => productsInfo.addNewProduct(req, res))

app.post('/api/order/create', (req, res) => ordersService.createNewOrder(req, res))
app.get('/api/order/:id', (req, res) => ordersService.getOrder(req, res))
app.post('/api/order/:id/confirm', (req, res) => ordersService.confirmOrder(req, res))
app.get('/api/orders', (req, res) => ordersService.getAllOrders(req, res))

app.post('/api/admin/login', (req, res) => adminDashboard.login(req, res))
app.get('/api/admin/isLoggedIn', (req, res) => adminDashboard.isLoggedIn(req, res))

app.get('/api/images/:name', (req, res) => imageManage.getImage(req, res))
app.get('/api/images/delete/:name', (req, res) => imageManage.deleteImage(req, res))


app.get('/api/constants', (req, res) => res.json({
    STANDARD_HOURS: constants.standard_hours,
    CLOSED_AT: constants.closed_at,
    OPENED_UNTIL: constants.opened_until
}))

//app.use(express.static(path.join(__dirname, './dist')))

// app.get('*', (req, res) => {
//  return res.sendFile(path.join(__dirname, './dist/index.html'))
// })

https.createServer(httpOptions, app)
    .listen(1234, () => {
        console.log('Server listening at 1234')
        })