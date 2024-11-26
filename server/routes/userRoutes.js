const express = require('express');
const {
  registerUser
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/auth/register', registerUser);

module.exports = userRouter;
