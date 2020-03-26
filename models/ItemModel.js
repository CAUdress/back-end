"use strict";

//mysql connection
const mysql = require("mysql");
const DBConfig = require("./../config/DBConfig");
const pool = mysql.createPool(DBConfig);

//해당 id의 아이템들 조회
exports.items = (id, name) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${name}_items WHERE ${name}_id = ?`;

    pool.query(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
