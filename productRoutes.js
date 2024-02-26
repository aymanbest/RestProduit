const express = require('express')
const { ObjectId } = require('mongodb')
const router = express.Router()

router.get('/', async (req, res) => {
    const db = req.app.locals.db
    const collection = db.collection('produits')
    try { 
        const products = await collection.find().toArray()
        res.json(products)
    } catch(e) {
        console.log(e.message);
    }
    
})

router.get('/:id', async (req, res) => {
    const db = req.app.locals.db
    const collection = db.collection('produits')
    try {
        const product = await collection.findOne({ _id: new ObjectId(req.params.id) })
        res.json(product)
    } catch(e) {
        console.log(e.message);
    }
})


module.exports = router