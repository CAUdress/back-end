"use strict";

//mysql connection
const mysql = require("mysql");
const DBConfig = require("./../config/DBConfig");
const pool = mysql.createPool(DBConfig);

//해당 id의 댓글 조회
exports.Comments = (id, name) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${name}_comment WHERE ${name}_id = ?`;

    pool.query(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
