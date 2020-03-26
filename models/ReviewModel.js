"use strict";

//mysql connection
const mysql = require("mysql");
const DBConfig = require("./../config/DBConfig");
const pool = mysql.createPool(DBConfig);

//해당 id의 리뷰게시판 기본정보, 기본데이터 조회
exports.outfit = id => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM outfit WHERE id = ?";

    pool.query(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) {
          //게시물 id가 맞지않음
          reject(1700);
        } else {
          console.log(rows);
          resolve(rows[0]);
        }
      }
    });
  });
};

//해당 id의 리뷰와 연결된 outfit
exports.outfitReviews = id => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM review WHERE id in (SELECT review_id FROM review_outfit WHERE outfit_id  = ?)";

    pool.query(sql, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
