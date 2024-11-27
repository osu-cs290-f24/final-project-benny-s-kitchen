const express = require('express');
const {
  registerUser,
  loginUser,
  authenticateToken,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authenticateToken, getUserProfile);
userRouter.put('/profile', authenticateToken, updateUserProfile);

module.exports = userRouter;
