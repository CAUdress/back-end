"use strict";

const resMsg = require("../errors.json");

const reviewModel = require("../models/ReviewModel");
const userModel = require("../models/UserModel");
const commentModel = require("../models/CommentModel");
const likeModel = require("../models/LikeModel");
const itemModel = require("../models/ItemModel");

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
    result.items = await itemModel.items(req.params.id, "review");
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

//review 좋아요
exports.like = async (req, res, next) => {
  if (!req.body.id || req.body.userId) {
    return res.status(400).end();
  }

  try {
    await likeModel.like(req.body.id, req.userId, "review");
  } catch (error) {
    return next(error);
  }
  return res.r();
};

//review 좋아요 취소
exports.unlike = async (req, res, next) => {
  if (!req.body.id || req.body.userId) {
    return res.status(400).end();
  }

  try {
    await likeModel.unlike(req.body.id, req.userId, "review");
  } catch (error) {
    return next(error);
  }
  return res.r();
};

exports.post = async (req, res, next) => {
  //TODO 필수정보 확인 후 수정
  if (!req.body.product) {
    return res.status(400).end();
  }
  let postData = {
    comment: req.body.comment ? req.body.comment : null,
    brand: req.body.brand ? req.body.brand : null,
    size: req.body.size ? req.body.size : null,
    product: req.body.product,
    users_id: req.userId,
    outfit: req.body.outfit ? req.body.outfit : 0,
    items: req.body.items ? req.body.items : []
  };

  try {
    await reviewModel.postAuto(postData);
  } catch (err) {
    return next(err);
  }

  return res.r();
};
