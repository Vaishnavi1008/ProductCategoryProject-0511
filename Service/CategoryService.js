const { Category } = require('../models');

// Get all categories
const GetCategoryData = async () => {
  try {
    const categories = await Category.findAll();
    return categories;
  } catch (error) {
    console.log(error);
    throw new Error('Internal Server Error');
  }
};

// Get category by ID
const GetCategoryDataById = async (id) => {
  try {
    const category = await Category.findByPk(id);
    return category;
  } catch (error) {
    console.log(error);
    throw new Error('Internal Server Error');
  }
};

const UpsertCategory = async (categoryData) => {
  try {
    if (categoryData.id) {
      // Check if category exists
      const category = await Category.findByPk(categoryData.id);
      if (!category) return { error: 'Category not found' };
      // Update existing category
      await category.update({
        name: categoryData.name !== undefined ? categoryData.name : category.name,
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : category.is_active
      });
      return { message: 'Category updated successfully' };
    } else {
      // Insert new category
      const result = await Category.create({ 
        name: categoryData.name, 
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : true 
      });
      return { message: 'Category added successfully', result };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Internal Server Error');
  }
};


module.exports = {
  GetCategoryData,
  UpsertCategory,
  GetCategoryDataById
}