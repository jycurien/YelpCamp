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
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return cb(new Error('Only jpeg or png images allowed'))
    }

    cb(undefined, true)
  },
})

router
  .route('/')
  .get(catchAsync(campgroundsController.index))
  .post(
    isLoggedIn,
    upload.single('image'),
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
    upload.single('image'),
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
