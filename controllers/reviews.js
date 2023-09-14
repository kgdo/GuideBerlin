const Site = require("../models/site");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const site = await Site.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  site.reviews.push(review);
  await review.save();
  await site.save();
  req.flash("success", "thank you for adding info to the sites");
  res.redirect(`/sites/${site._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const review = await Review.findById(req.params.id);
  const { id } = req.params;
 
  if (!review) {
    req.flash("error", "Sorry :o( not found");
    res.redirect(`/review/${review._id}`);
  }


  res.render("sites/edit", { site });
};



module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Site.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " It is gone, bye bye ");
  res.redirect(`/sites/${id}`);
};
