const {
    GetProductData,
    GetProductById,
    InsertProduct,
    UpdateProduct,
    DeleteProduct,
    BulkInsertProducts
} = require("../Service/ProductService");

// Updated: Accepts search by product name and category name, and sorting
const GetProducts = async (req, res) => {
    try {
        const {
            searchKeyword = '',
            sortOrder = 'ASC',
            page = 1,
            pageSize = 10,
            categoryName = ''
        } = req.query;
        const products = await GetProductData(searchKeyword, sortOrder, page, pageSize, categoryName);
        return res.json({ data: products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const GetProductDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await GetProductById(id);
        return res.json({ data: product });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpsertProduct = async (req, res) => {
    try {
        const { id, name, image, price, categoryId, is_active } = req.body;
        if (!name || !price || !categoryId) {
            return res.status(400).json({ error: 'Name, price, and categoryId are required' });
        }
        const result = await UpsertProduct({
            id,
            name,
            image,
            price,
            categoryId,
            is_active: is_active !== undefined ? is_active : true
        });
        if (result.error) {
            return res.status(404).json(result);
        }
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeactivateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await UpsertProduct({ id, is_active: false });
        if (result.error) {
            return res.status(404).json(result);
        }
        return res.json({ message: 'Product deactivated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const BulkUploadProducts = async (req, res) => {
  try {
    const { products } = req.body; // Expecting an array of product objects
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required' });
    }
    // Respond immediately if you want to process in background (advanced: use a queue)
    const result = await BulkInsertProducts(products);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Bulk upload failed' });
  }
};
module.exports = {
    GetProducts,
    GetProductDetailsById,
   UpsertProduct,
    BulkUploadProducts,
    DeactivateProduct
};