"use strict";

const userCtrl = require("../controllers/UserCtrl");
const imageCtrl = require("../controllers/ImageCtrl");
const authCtrl = require("../controllers/authCtrl");
const reviewCtrl = require("../controllers/ReviewCtrl");

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

  return router;
};
