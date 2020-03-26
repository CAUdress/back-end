"use strict";

const authModel = require("../models/AuthModel");

/*******************
 *  Authenticate
 ********************/
exports.auth = (req, res, next) => {
  if (!req.headers.token) {
    return next(401);
  } else {
    authModel.auth(req.headers.token, (err, userId) => {
      if (err) {
        return next(err);
      } else {
        req.userId = userId;
        return next();
      }
    });
  }
};
