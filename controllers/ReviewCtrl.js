"use strict";

const config = require("../config/config");
const resMsg = require("../errors.json");

const reviewModel = require("../models/ReviewModel");
const userModel = require("../models/UserModel");
const commentModel = require("../models/CommentModel");
const likeModel = require("../models/LikeModel");

/*******************
 *  reviewDetail 리뷰상세보기
 ********************/
exports.reviewDetail = async (req, res, next) => {
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
    result.comments = await commentModel.Comments(req.params.id, "review");
    result.review.like = await likeModel.checkLike(
      req.params.id,
      req.userId,
      "review"
    );
    result.outfits = await reviewModel.reviewOutfits(req.params.id);
  } catch (error) {
    return next(error);
  }
  return res.r(result);
};
