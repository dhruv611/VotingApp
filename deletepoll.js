var db = require('./db');

 var deletePoll = {
   delete: function delete(req, res, next) {
     var options = {
       name: req.name
     };

     db.delete(options, function (err, response) {
       if (err || !response || !response.length) {
         console.log(err+'Error while deleting Poll.');
       } else {
         req.pollDeleted = response;
       }

       next(err);
     });
   }
 };

 module.exports = deletePoll;
