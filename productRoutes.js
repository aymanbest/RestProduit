const express = require('express')
const verifyToken = require("./auth").verifyToken;
const { ObjectId } = require('mongodb')
const productController = require('./productsController')
const router = express.Router()

// Get all products
router.get('/', verifyToken, productController.allProducts)

// Get a specific product by ID
router.get('/:id',verifyToken, productController.getProductById)

// Create a new product
router.post('/', verifyToken, productController.createProduct)

// Update a product by ID
router.put('/:id', verifyToken, productController.updateProduct)

// Delete a product by ID
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router
