"use strict";

//mysql connection
const mysql = require("mysql");
const DBConfig = require("./../config/DBConfig");
const pool = mysql.createPool(DBConfig);

//cipher
const jwt = require("jsonwebtoken");
const config = require("../config/config");

/*******************
 *  Register
 *  @param: userData = {email, pw, name, age, gender, profile, height, weight, private}
 ********************/
exports.register = userData => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO users(email, pw, name, age, gender, profile, height, weight, private) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ";

    pool.query(
      sql,
      [
        userData.email,
        userData.pw,
        userData.name,
        userData.age,
        userData.gender,
        userData.profile,
        userData.height,
        userData.weight,
        userData.private
      ],
      (err, rows) => {
        // 가입 시도
        if (err) {
          reject(err);
        } else {
          if (rows.affectedRows === 1) {
            resolve(rows);
          } else {
            const _err = new Error("User Register Custom error");
            reject(_err);
          }
        }
      }
    );
  }).then(result => {
    return new Promise((resolve, reject) => {
      /*******************
       *  id, email, name, profile
       ********************/
      const sql =
        "SELECT id, email, name, profile " + "FROM users " + "WHERE id = ?";

      pool.query(sql, result.insertId, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });
};

exports.login = userData => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT email FROM users WHERE email = ?";

    pool.query(sql, [userData.email], (err, rows) => {
      console.log(rows);
      // 아이디 존재 검사
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) {
          // 아이디 없음
          reject(1402);
        } else {
          resolve(null);
        }
      }
    });
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        /*******************
         *  id, email, name, profile
         ********************/
        const sql =
          "SELECT email, name, id, profile " +
          "FROM users " +
          "WHERE email = ? and pw = ?";

        pool.query(sql, [userData.email, userData.pw], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) {
              // 비밀번호 틀림
              reject(1403);
            } else {
              const profile = {
                email: rows[0].email,
                nickname: rows[0].nickname,
                profile: rows[0].profile,
                id: rows[0].id
              };
              const token = jwt.sign(profile, config.jwt.cert, {
                expiresIn: "10h"
              });

              const result = {
                profile,
                token
              };
              resolve(result);
            }
          }
        });
      });
    })
    .then(result => {
      return new Promise((resolve, reject) => {
        const sql = "UPDATE users SET token = ? WHERE id = ?";
        pool.query(sql, [userData.token, result.profile.id], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
};
