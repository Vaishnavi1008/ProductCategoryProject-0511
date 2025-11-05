
const Product = require('./Product');
const Category = require('./Category');
const User = require('./User');


Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

const sequelize = require('../Config/DBConnection');

async function syncModels() {
  await sequelize.sync({ alter: true }); 
  console.log('Database & tables created!');
}

module.exports = { Product, Category, User, syncModels };