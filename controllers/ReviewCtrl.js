"use strict";

const config = require("../config/config");
const resMsg = require("../errors.json");

const reviewModel = require("../models/ReviewModel");
const userModel = require("../models/UserModel");

/*******************
 *  reviewDetail 리뷰상세보기
 ********************/
exports.reviewDetail = async (req, res, next) => {
  console.log(req.params.id);
  if (!req.params.id) {
    return res.status(400).end();
  }

  let result = {
    review: {},
    items: [],
    comments: [],
    outfits: []
  };

  try {
    result.review = await reviewModel.review(req.params.id);
    result.review.writer = await userModel.findNameById(result.review.users_id);
    result.items = await reviewModel.review(req.params.id);
    result.comments = await reviewModel.reviewComments(req.params.id);
    result.review.like = await reviewModel.checkLike(req.params.id, req.userId);
    result.outfits = await reviewModel.reviewOutfits(req.params.id);
  } catch (error) {
    return next(error);
  }
  return res.r(result);
};
