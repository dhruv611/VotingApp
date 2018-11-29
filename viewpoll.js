var db = require('./db');

 var viewpoll = {
   fetchAll: function fetchAll(req, res, next) {
    /* Since this function is being called by a "GET" api, any options passed in url will be accessed by 
    either req.params (for parameters in url) or req.query(parameters that we pass after "?" in url) */

    /* You do not have any parameter in url, so your options will remain empty,
    or you may choose not to pass options at all*/
     var options = {};

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
