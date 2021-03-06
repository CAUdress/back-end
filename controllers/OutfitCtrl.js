"use strict";

const outfitModel = require("../models/OutfitModel");
const userModel = require("../models/UserModel");
const commentModel = require("../models/CommentModel");
const likeModel = require("../models/LikeModel");
const itemModel = require("../models/ItemModel");

/*******************
 *  outfitcard  상세보기
 ********************/
exports.outfitDetail = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).end();
  }

  let result = {
    outfit: {},
    items: [],
    comments: [],
    reviews: []
  };

  try {
    result.outfit = await outfitModel.outfit(req.params.id);
    result.outfit.writer = await userModel.findNameById(result.outfit.users_id);
    result.items = await itemModel.items(req.params.id, "outfit");
    result.comments = await commentModel.Comments(req.params.id, "outfit");
    result.outfit.like = await likeModel.checkLike(
      req.params.id,
      req.userId,
      "outfit"
    );
    result.reviews = await outfitModel.outfitReviews(req.params.id);
  } catch (error) {
    return next(error);
  }
  return res.r(result);
};

exports.like = async (req, res, next) => {
  if (!req.body.id || req.body.userId) {
    return res.status(400).end();
  }

  try {
    await likeModel.like(req.body.id, req.userId, "outfit");
  } catch (error) {
    return next(error);
  }
  return res.r();
};

exports.unlike = async (req, res, next) => {
  if (!req.body.id || req.body.userId) {
    return res.status(400).end();
  }

  try {
    await likeModel.unlike(req.body.id, req.userId, "outfit");
  } catch (error) {
    return next(error);
  }
  return res.r();
};
