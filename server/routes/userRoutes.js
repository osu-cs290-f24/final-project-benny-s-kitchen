const express = require('express');
const {
  registerUser,
  loginUser,
  authenticateToken,
  getUserProfile
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authenticateToken, getUserProfile);

module.exports = userRouter;
