const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.array("image"),validateListing , wrapAsync(listingController.createListing));
// .post(upload.single("listing[image]") , (req , res) => {
//     res.send(req.file);
// });

// new route
// keep it before :id . If we dont then it takes new as id
router.get("/new",isLoggedIn ,listingController.renderNewForm);

router.route("/:id")
.put(isLoggedIn,isOwner,upload.array("image"),validateListing,wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

router.get("/category/:category" ,wrapAsync(listingController.categoryListing));
router.get("/country/:country" ,wrapAsync(listingController.countryListing));

router.delete("/:id/image/:filename" , isLoggedIn , isOwner,wrapAsync(listingController.destroyImage));
module.exports = router;