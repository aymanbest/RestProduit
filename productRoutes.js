const express = require('express')
const verifyToken = require("./auth").verifyToken;
const { ObjectId } = require('mongodb')
const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
    const db = req.app.locals.db
    const collection = db.collection('produits')
    try { 
        const products = await collection.find().toArray()
        res.json(products)
    } catch(e) {
        console.log(e.message);
    }
    
})

router.get('/:id',verifyToken, async (req, res) => {
    const db = req.app.locals.db
    const collection = db.collection('produits')
    try {
        const product = await collection.findOne({ _id: new ObjectId(req.params.id) })
        res.json(product)
    } catch(e) {
        res.json(e.message);
    }
})

router.post('/', verifyToken, async (req, res) => {
    const db = req.app.locals.db
    const collection = db.collection('produits')
    try {
        const result = await collection.insertOne(req.body)
        res.json(result.ops[0])
    } catch(e) {
        console.log(e.message);
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    const db = req.app.locals.db
    const collection = db.collection('produits')
    try {
        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body },
            { returnOriginal: false }
        )
        res.json(result.value)
    } catch(e) {
        console.log(e.message);
    }
})


router.delete('/:id', async (req, res) => {
    const db = req.app.locals.db;
    const collection = db.collection('produits');
    const id = parseInt(req.params.id);
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 1) {
            res.status(200).send('produit deleted successfully');
        } else {
            res.status(404).send('produit not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting produit');
    }
});


module.exports = router




