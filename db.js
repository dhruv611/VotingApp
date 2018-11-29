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

    /* First parameter will contain the values that you passed while calling this function
    db.getAll(options, function (err, response) {}); 
    so basically whatever you passed as options will be accessible in first parameter */
    getAll : function (ops, cb) {
      
      /* First initiate your db connection */
      doconnect(function(connectionErr, connection) {
        if (connectionErr) {
          return cb(connectionErr);
        }

        /* If no connection error, then execute your query now */

        /* Please cross check if this query will be a string or an object */
        var query = `SELECT A.POLL_NAME,B.POLL_ITEM FROM POLLS A, POLL_ITEMS B
          WHERE A.POLL_ID = B.POLL_ID AND A.DELETED IS NULL AND B.DELETED IS NULL`;

        connection.execute(query, function(queryErr, queryRes) {
          /* Once query is successfully done, you can safely release the connection
          whether it returned an error or not, you must release the db connection */
          dorelease(connection);

          if (queryErr) {
            return cb(queryErr);
          }

          return (null, queryRes);
        });
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

/* Need to export this db object otherwise it will not be accessible from other files */
module.exports = db;

/* Removed async waterfall because you have to call specific functions (not complete object) inside a waterfall */
