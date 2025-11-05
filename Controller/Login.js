const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const LoginInsert = async (req, res) => {
  try {
    const saltRounds = 10;
    let { id, email, password } = req.body;
    console.log(id,email,password,'logs')
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const passwordEncrypted = await bcrypt.hash(password, saltRounds);

    let user;
    if (id) {
      // Update existing user
      user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.update({
        email,
        encryptedPassword: passwordEncrypted,
      });
    } else {
      // Create new user
      user = await User.create({
        email,
        encryptedPassword: passwordEncrypted,
        
      });
    }

    return res.json({ success: "User saved successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const LoginGet = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['encryptedPassword'] }
    });
    return res.json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const LoginGetByEmail = async (req, res) => {
  try {
    let { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.encryptedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.AccessToken_SecretKey,
      { expiresIn: '1h' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 60 * 1000
    });

    return res.json({ success: "Login successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const roleCheck = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission' });
    }
    next();
  };
};

module.exports = {
  LoginInsert,
  LoginGet,
  LoginGetByEmail,
  roleCheck
};