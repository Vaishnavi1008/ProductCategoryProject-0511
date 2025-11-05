const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConnection');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
    tableName: 'Users',
  timestamps: true, // Adds createdAt and updatedAt columns automatically
});

module.exports = User;