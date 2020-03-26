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
