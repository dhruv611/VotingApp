var db = require('./db');

 var modifyPoll = {
   modify: function update(req, res, next) {
     var options = {
       name: req.name,
       newname: req.newname
     };

     db.update(options, function (err, response) {
       if (err || !response || !response.length) {
         console.log(err+'Error while updating the Poll.');
       } else {
         req.pollUpdated = response;
       }

       next(err);
     });
   }
 };

 module.exports = modifyPoll;
