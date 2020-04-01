"use strict";

const userCtrl = require("../controllers/UserCtrl");
const imageCtrl = require("../controllers/ImageCtrl");
const authCtrl = require("../controllers/AuthCtrl");
const reviewCtrl = require("../controllers/ReviewCtrl");
const outfitCtrl = require("../controllers/OutfitCtrl");

module.exports = router => {
  //users register
  router
    .route("/users/register")
    .post(imageCtrl.uploadSingle, userCtrl.register);

  //users login
  router.route("/users/login").post(userCtrl.login);

  //review 상세보기
  router
    .route("/reviews/review/:id")
    .get(authCtrl.auth, reviewCtrl.reviewDetail);

  //review 좋아요
  router.route("/reviews/like/:id").get(authCtrl.auth, reviewCtrl.like);

  //review 좋아요
  router.route("/reviews/unlike/:id").get(authCtrl.auth, reviewCtrl.unlike);

  //outfit 상세보기
  router
    .route("/outfits/outfit/:id")
    .get(authCtrl.auth, outfitCtrl.outfitDetail);

  //outfit 좋아요
  router.route("/outfits/like/:id").get(authCtrl.auth, outfitCtrl.like);

  //outfit 좋아요취소
  router.route("/outfits/like/:id").get(authCtrl.auth, outfitCtrl.unlike);

  return router;
};
