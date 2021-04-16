const authenticate = require("../../middlewares/authenticate");
const { secondaryAuthorization } = require("../../middlewares/authorize");
const uploadAdImage = require("../../middlewares/upload.ad");
const adModel = require("../../models/ad.model");
const router = require("express").Router();

router
  .route("/")
  .post(
    authenticate,
    secondaryAuthorization,
    uploadAdImage.single("image"),
    async function (req, res, next) {
      let newPost = new adModel({});
      newPost.title = req.body.title;
      let adImages = await uploadCloudinary.uploadCloudinary(
        [req.file],
        "ads"
      );
      if (adImages.msg === "err") {
        return next(adImages.err);
      }
      newPost.image = adImages.urls[0];

      newPost
        .save()
        .then((post) => res.status(200).json(post))
        .catch((err) => next(err));
    }
  )
  .get(function (req, res, next) {
    adModel
      .find({})
      .sort({ updatedAt: -1 })
      .exec(function (err, ads) {
        if (err) {
          return next(err);
        }
        if (!ads) {
          return next({
            msg: "no adds posted yet",
          });
        }
        res.status(200).json(ads[0]);
      });
  });
module.exports = router;
