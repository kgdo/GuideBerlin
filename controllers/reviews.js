const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "thank you for adding info to the site");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const review = await Review.findById(req.params.id);
  const { id } = req.params;
 
  if (!review) {
    req.flash("error", "Sorry :o( not found");
    res.redirect(`/review/${review._id}`);
  }


  res.render("campgrounds/edit", { campground });
};



module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " It is gone, bye bye ");
  res.redirect(`/campgrounds/${id}`);
};
