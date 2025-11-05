const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const GetProductData = async (searchKeyword = '', sortOrder = 'ASC', page = 1, pageSize = 10) => {
    try {
         const where = {};
    if (searchKeyword) {
      where.name = { [Op.like]: `%${searchKeyword}%` };
    }

    const include = [];
    if (searchKeyword) {
      include.push({
        model: Category,
        where: { name: { [Op.like]: `%${searchKeyword}%` } },
        attributes: ['id', 'name'],
      });
    } else {
      include.push({
        model: Category,
        attributes: ['id', 'name'],
      });
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include,
      order: [['price', sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return {
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      products: rows,
    };  
    } catch (error) {
        console.log(error);
        throw new Error('Internal Server Error');  // Throw error to be handled in the controller
    }
};

const GetProductById = async (id) => {
    try {
        const product = await Product.findAll({
            where: { id },
            include: [{ model: Category }]
        });
        return product;  // Return product data
    } catch (error) {
        console.log(error);
        throw new Error('Internal Server Error');
    }
};
const BulkInsertProducts = async (productsArray) => {
  try {
    // productsArray: [{ name, image, price, categoryId }, ...]
    await Product.bulkCreate(productsArray, { validate: true });
    return { message: 'Bulk products uploaded successfully' };
  } catch (error) {
    console.log(error);
    throw new Error('Bulk upload failed');
  }
};
const UpsertProduct = async (productData) => {
  try {
    if (productData.id) {
      // Update or deactivate existing product
      const product = await Product.findByPk(productData.id);
      if (!product) return { error: 'Product not found' };
      await product.update({
        name: productData.name !== undefined ? productData.name : product.name,
        image: productData.image !== undefined ? productData.image : product.image,
        price: productData.price !== undefined ? productData.price : product.price,
        categoryId: productData.categoryId !== undefined ? productData.categoryId : product.categoryId,
        is_active: productData.is_active !== undefined ? productData.is_active : (product.is_active !== undefined ? product.is_active : true)
      });
      return { message: 'Product updated successfully' };
    } else {
      // Insert new product
      const result = await Product.create({
        name: productData.name,
        image: productData.image,
        price: productData.price,
        categoryId: productData.categoryId,
        is_active: productData.is_active !== undefined ? productData.is_active : true
      });
      return { message: 'Product added successfully', result };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Internal Server Error');
  }
};



module.exports = {
    GetProductData,
    GetProductById,
    InsertProduct,
    UpdateProduct,
    DeleteProduct,
    BulkInsertProducts,
};
