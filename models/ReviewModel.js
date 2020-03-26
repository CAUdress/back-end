"use strict";

//mysql connection
const mysql = require("mysql");
const DBConfig = require("./../config/DBConfig");
const pool = mysql.createPool(DBConfig);

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

//해당 id의 리뷰 아이템들 조회
exports.reviewItems = id => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM review_items WHERE review_id = ?";

    pool.query(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

//해당 id의 리뷰 댓글 조회
exports.reviewComments = id => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM review_comment WHERE review_id = ?";

    pool.query(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

//해당 id의 리뷰 공감 확인
exports.checkLike = (reviewId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id FROM review_like WHERE review_id = ? && users_id";

    pool.query(sql, [reviewId, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        //공감눌렀으면 true 아니면 false
        if (rows[0]) resolve(true);
        else resolve(false);
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
