const express = require('express')
const router = express.Router()
const campgroundsController = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
  validateImageFile,
} = require('../middleware')
const upload = require('../multerDiskUpload')

router
  .route('/')
  .get(catchAsync(campgroundsController.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    validateImageFile,
    catchAsync(campgroundsController.createCampground)
  )

router.get('/new', isLoggedIn, campgroundsController.renderNewForm)

router
  .route('/:id')
  .get(catchAsync(campgroundsController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgroundsController.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundsController.deleteCampground)
  )

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsController.renderEditForm)
)

module.exports = router
