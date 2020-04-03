"use strict";

//mysql connection
const mysql = require("mysql");
const DBConfig = require("./../config/DBConfig");
const pool = mysql.createPool(DBConfig);
const dateCtrl = require("../controllers/DateCtrl");

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
exports.post = postData => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO reviews(comment, date, brand, size, product, users_id) " +
      "VALUES (?, ?, ?, ?, ?, ?) ";

    pool.query(
      sql,
      [
        postData.comment,
        dateCtrl.date,
        postData.brand,
        postData.size,
        postData.product,
        postData.users_id
      ],
      (err, rows) => {
        // 가입 시도
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].id);
        }
      }
    );
  });
};

exports.postItems = items => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO reviews_items (item, score, review_id) " + "VALUES ? ";

    pool.query(sql, items, (err, rows) => {
      // 가입 시도
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.connectOutfit = (outfitId, review_id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO review_outfit (outfit_id, review_id) " + "VALUES (?, ?) ";

    pool.query(sql, [outfitId, review_id], (err, rows) => {
      // 가입 시도
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
