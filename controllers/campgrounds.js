const fs = require('fs')
const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground({
    ...req.body.campground,
    images: req.files.map((f) => f.path.slice(6)),
  })
  campground.author = req.user._id
  await campground.save()
  req.flash('success', 'Successfuly made a new campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author', // review author
      },
    })
    .populate('author') // campground author
  if (!campground) {
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  let images = campground.images
  if (req.files.length) {
    for (let image of images) {
      fs.unlink(`public${image}`, (err) => console.log(err))
    }
    images = req.files.map((f) => f.path.slice(6))
  }
  await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
    images,
  })
  req.flash('success', 'Successfuly updated campground!')
  res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted campground!')
  res.redirect('/campgrounds')
}
