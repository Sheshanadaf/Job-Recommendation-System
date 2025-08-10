const express = require("express");
const manageJobPost = require("../controller/manageJobPost");
const manageUserProfileDetails = require("../controller/manageUserProfileDetails");
const upload = require("../middleware/upload");

const router = express.Router();

// jobpost
router.post("/add-jobpost", manageJobPost.createJobpost);
router.get("/get-jobpost", manageJobPost.getjobpostdetails);

// user profile Details
router.post(
  "/add-userprofile/:id",
  upload.single("cv_files"),
  manageUserProfileDetails.createCvData
);

// Read CV by MongoDB ID
router.get(
  "/read-user-profile/:id",
  manageUserProfileDetails.getUserProfileDetails
);

// Read predict details
router.get(
  "/read-predict-details/:id",
  manageUserProfileDetails.getPredictDetails
);

module.exports = router;
