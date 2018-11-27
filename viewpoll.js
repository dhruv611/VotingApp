var db = require('./db');

 var viewpoll = {
   fetchAll: function fetchAll(req, res, next) {
     var options = {
       name: req.name
     };

     db.getAll(options, function (err, response) {
       if (err || !response || !response.length) {
         console.log(err+'Error while fetching Polls: No data found');
       } else {
         req.allPolls = response;
       }

       next(err);
     });
   },

   fetchSingle: function fetchSingle(req, res, next) {
     var options = {
       name: req.name
     };

     db.getSingle(options, function (err, response) {
       if (err || !response || !response.length) {
         console.log(err+'Error while fetching Poll: No data found');
       } else {
         req.singlePoll = response;
       }

       next(err);
     });
   }
 };

 module.exports = viewpoll;
