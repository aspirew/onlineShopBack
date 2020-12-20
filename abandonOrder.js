use mo16034_sklep;
var ords;
ords = db.orders.find({"status": "being carried out",
"date": { "$lt": new Date((new Date()).getTime() - (10*1000*60)) } }).toArray()

for (let o in ords){
        for(let p in ords[o].products){
                db.products.findOneAndUpdate({"_id": ords[o].products[p].productID },
                        {"$inc" : { "quantity" : ords[o].products[p].quantity } } )
        }
}

db.orders.updateMany(
        {"status": "being carried out", "date" : { "$lt": new Date((new Date()).getTime() - (10*1000*60)) } },
        {"$set": { "status" : "cancelled" }}
)