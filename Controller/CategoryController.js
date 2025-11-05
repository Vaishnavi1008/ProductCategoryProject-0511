const {
  GetCategoryData,
  GetCategoryDataById,
  UpsertCategory
} = require("../Service/CategoryService");

const GetCategory = async (req, res) => {
  try {
    const categories = await GetCategoryData();
    return res.json({ data: categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const GetCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryById = await GetCategoryDataById(id);
    if (!categoryById) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ data: categoryById });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const UpsertCategoryController = async (req, res) => {
  try {
    const { id, name, is_active } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const result = await UpsertCategory({
      id,
      name,
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

const DeactivateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UpsertCategory({ id, is_active: false });
    if (result.error) {
      return res.status(404).json(result);
    }
    return res.json({ message: 'Category deactivated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  GetCategory,
  UpsertCategoryController,
  DeactivateCategory,
  GetCategoryById,
};