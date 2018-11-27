var db = require('./db');

 var pollResult = {
   result: function result(req, res, next) {
     var options = {
       name: req.name
     };

     db.result(options, function (err, response) {
       if (err || !response || !response.length) {
         console.log(err+'Error while fetching the poll result.');
       } else {
         req.pollResult = response;
       }

       next(err);
     });
   }
 };

 module.exports = pollResult;
