"use strict";

const userCtrl = require("../controllers/UserCtrl");
const imageCtrl = require("../controllers/ImageCtrl");

module.exports = router => {
  //users register
  router
    .route("/users/register")
    .post(imageCtrl.uploadSingle, userCtrl.register);

  //users login
  router.route("/users/login").post(userCtrl.login);

  return router;
};
