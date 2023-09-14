const express = require("express");
const router = express.Router();
const sites = require("../controllers/sites");
const catchAsync = require("../utilities/catchAsync");
const { siteSchema } = require("../schemas.js");
const { isLoggedIn, isAuthor, validateSite } = require("../middleware");
const { index } = require("../controllers/sites");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const site = require("../models/site");

router
  .route("/")
  .get(catchAsync(sites.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateSite,
    catchAsync(sites.createSite)
  );



router.get("/new", isLoggedIn, sites.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(sites.showSite))
  .put(
    isLoggedIn, 
    isAuthor,
    upload.array("image"),
    validateSite,
    catchAsync(sites.updateSite)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(sites.deleteSite));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(sites.renderEditForm)
);

module.exports = router;
