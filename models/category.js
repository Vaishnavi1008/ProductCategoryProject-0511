const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConnection');

const Category = sequelize.define('Category', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },    
},{
    tableName: 'Categories',
  timestamps: true, 
});

module.exports = Category;