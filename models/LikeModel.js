"use strict";

//mysql connection
const mysql = require("mysql");
const DBConfig = require("./../config/DBConfig");
const pool = mysql.createPool(DBConfig);

//해당 id의 리뷰 공감 확인
exports.checkLike = (id, userId, name) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM ${name}_like WHERE ${name}_id = ? && users_id`;

    pool.query(sql, [id, userId], (err, rows) => {
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

//좋아요 누르기
exports.like = (id, userId, name) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ${name}_like(review_id, user_id) VALUES (?, ?)`;

    pool.query(sql, [id, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//좋아요 취소
exports.unlike = (id, userId, name) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM ${name}_like WHERE id = ? && userId = ?`;

    pool.query(sql, [id, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
