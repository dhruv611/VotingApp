var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

var doconnect = function(cb) {
  oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    cb);
};

var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};

var db = {

    delete : function (conn, cb) {
      conn.execute(
        `UPDATE POLL_ITEMS SET DELETED = SYSDATE WHERE POLL_ID = (SELECT POLL_ID FROM POLLS WHERE POLL_NAME = :POLL_NAME)
         UPDATE POLLS SET DELETED = SYSDATE WHERE POLL_NAME = :POLL_NAME`,
        [OBJECT.POLL_NAME],
        { autoCommit: true },
        function(err) {
          if (err) {
            return cb(err, conn);
          } else {
            return cb(null, conn);
          }
        });
    },

    getAll : function (conn, cb) {
      conn.execute(
        `SELECT A.POLL_NAME,B.POLL_ITEM FROM POLLS A, POLL_ITEMS B
          WHERE A.POLL_ID = B.POLL_ID AND A.DELETED IS NULL AND B.DELETED IS NULL`,
        function(err) {
          if (err) {
            return cb(err, conn);
          } else {
            return cb(null, conn);
          }
        });
    },

    getSingle : function (conn, cb) {
      conn.execute(
        `SELECT A.POLL_NAME,B.POLL_ITEM FROM POLLS A, POLL_ITEMS B
          WHERE A.POLL_NAME = :POLL_NAME AND A.POLL_ID = B.POLL_ID AND A.DELETED IS NULL AND B.DELETED IS NULL`,
          [OBJECT.POLL_NAME],
        function(err) {
          if (err) {
            return cb(err, conn);
          } else {
            return cb(null, conn);
          }
        });
    },

    insert : function (conn, cb) {
      conn.execute(
        `DECLARE
          VAR NUMBER;
         BEGIN
          SELECT MAX(POLL_ID) INTO VAR FROM POLLS;
          INSERT INTO POLLS VALUES (VAR, :nm, :deleted);
          END;`,
        { nm : {val: OBJECT.POLL_NAME},deleted : {val: SYSDATE} },
        { autoCommit: true },
        function(err, result) {
          if (err) {
            return cb(err, conn);
          } else {
            console.log("Rows inserted: " + result.rowsAffected);  // 1
            return cb(null, conn);
          }
        });
    },

    update : function (conn, cb) {
      conn.execute(
        "UPDATE POLLS SET POLL_NAME = :NEW_NAME WHERE POLL_NAME = :POLL_NAME",
        {NEW_NAME : {VAL : OBJECT.NEWNAME}, POLL_NAME : {VAL : OBJECT.POLL_NAME}},
        { autoCommit: true },  // commit once for all DML in the script
        function(err, result) {
          if (err) {
            return cb(err, conn);
          } else {
            console.log("Rows updated: " + result.rowsAffected);
            return cb(null, conn);
          }
        });
    }
};

async.waterfall(
  [
    doconnect,
    db
  ],
  function (err, conn) {
    if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
    if (conn)
      dorelease(conn);
  });
