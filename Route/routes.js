const route = require('express').Router();
const {
    LoginInsert,
    LoginGet,
    LoginGetByEmail
} = require('../Controller/Login');
const {  
    GetCategory,
    UpsertCategoryController,
    GetCategoryById,
    DeactivateCategory
} = require('../Controller/CategoryController');
const {
    GetProducts,
    UpsertProductC,
    DeactivateProduct,
    GetProductDetailsById,
    BulkUploadProducts
} = require('../Controller/ProductController')

// Category Routes
route.post('/AddCategory', UpsertCategoryController); // Add new category
route.put('/EditCategory/:id', UpsertCategoryController); // Edit a category
route.put('/RemoveCategory/:id', DeactivateCategory); // Delete a category
route.get('/GetCategory', GetCategory); // Get all categories
route.get('/GetCategoryById/:id', GetCategoryById); // Get a category by ID

// Product Routes
route.post('/AddProduct', UpsertProductC); // Add new product
route.put('/EditProduct/:id', UpsertProductC); // Edit a product
route.delete('/RemoveProduct/:id', DeactivateProduct); // Delete a product
route.get('/GetProducts', GetProducts); // Get all products
route.get('/GetProductById/:id', GetProductDetailsById); // Get a product by ID
route.post('/BulkUploadProducts', BulkUploadProducts); // Bulk upload route

route.post('/Register', LoginInsert); // Register or update user
route.get('/Users', LoginGet); // Get all users (without passwords)
route.post('/Login', LoginGetByEmail); // Login user
module.exports = { route };
