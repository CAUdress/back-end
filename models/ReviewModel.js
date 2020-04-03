"use strict";

//mysql connection
const mysql = require("mysql");
const DBConfig = require("./../config/DBConfig");
const pool = mysql.createPool(DBConfig);
const dateCtrl = require("../controllers/DateCtrl");
const transactionWrapper = require("../models/TransactionWrapper");
const itemModel = require("../models/ItemModel");
const outfitModel = require("../models/OutfitModel");
const reviewModel = require("../models/ReviewModel");

//해당 id의 리뷰게시판 기본정보, 기본데이터 조회
exports.review = id => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM review WHERE id = ?";

    pool.query(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) {
          //게시물 id가 맞지않음
          reject(1700);
        } else {
          resolve(rows[0]);
        }
      }
    });
  });
};

//해당 id의 리뷰와 연결된 outfit
exports.reviewOutfits = id => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM outfit WHERE id in (SELECT outfit_id FROM review_outfit WHERE review_id  = ?)";

    pool.query(sql, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

//게시물 작성
exports.post = context => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO review(comment, date, brand, size, product, users_id) " +
      "VALUES (?, ?, ?, ?, ?, ?) ";

    context.conn.query(
      sql,
      [
        context.data.comment,
        "날짜날짜",
        context.data.brand,
        context.data.size,
        context.data.product,
        context.data.users_id
      ],
      (err, rows) => {
        // 가입 시도
        if (err) {
          context.error = err;
          reject(context);
        } else {
          context.data.review_id = rows.insertId;
          resolve(context);
        }
      }
    );
  });
};

exports.postItems = context => {
  return new Promise((resolve, reject) => {
    let items = [];
    for (let i = 0; i < context.data.items.length; i++) {
      items[i] = [];
      items[i][0] = context.data.items[i].item;
      items[i][1] = parseInt(context.data.items[i].score);
      items[i][2] = context.data.review_id;
    }
    const sql =
      "INSERT INTO review_items (item, score, review_id) " + "VALUES  ? ";
    context.conn.query(sql, [items], (err, rows) => {
      if (err) {
        context.error = err;
        reject(context);
      } else {
        resolve(context);
      }
    });
  });
};

exports.connectOutfit = context => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO review_outfit (outfit_id, review_id) " + "VALUES (?, ?) ";

    context.conn.query(
      sql,
      [context.data.outfit, context.data.review_id],
      (err, rows) => {
        if (err) {
          context.error = err;
          reject(context);
        } else {
          resolve(context);
        }
      }
    );
  });
};

exports.postAuto = postData => {
  return new Promise((resolve, reject) => {
    transactionWrapper
      .getConnection(pool, postData)
      .then(transactionWrapper.beginTransaction)
      .then(context => reviewModel.post(context))
      .then(context => reviewModel.postItems(context))
      .then(context => outfitModel.outfitCheckId(context))
      .then(context => reviewModel.connectOutfit(context))
      .then(transactionWrapper.commitTransaction)
      .then(context => {
        context.conn.release();
        resolve();
      })
      .catch(context => {
        context.conn.rollback(() => {
          context.conn.release();
          reject(context.error);
        });
      });
  });
};
