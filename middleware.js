const { siteSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utilities/ExpressError");
const Site = require("./models/site");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash(
      "error",
      "Cyclops (o~) Says, You got to sign in to do that . Have a great day"
    );
    return res.redirect("/login");
  }
  next();
};
module.exports.validateSite = (req, res, next) => {
  const { error } = siteSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const site = await Site.findById(id);
  if (!site.author.equals(req.user._id)) {
    req.flash("error", "Sorry Buddy:0( not permissable");
    return res.redirect(`/sites/${site._id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/sites/${id}`);
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
