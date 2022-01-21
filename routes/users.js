const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const passport = require('passport')

router.get('/register', usersController.renderRegister)

router.post('/register', catchAsync(usersController.register))

router.get('/login', usersController.renderLogin)

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  usersController.login
)

router.get('/logout', usersController.logout)

module.exports = router
