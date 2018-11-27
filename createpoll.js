var db = require('./db');

 var createPoll = {
   create: function create(req, res, next) {
     var options = {
       name: req.name,
       items: req.items
     };

     db.insert(options, function (err, response) {
       if (err || !response || !response.length) {
         console.log(err+'Error while creating Poll.');
       } else {
         req.pollCreated = response;
       }

       next(err);
     });
   }
 };

 module.exports = createPoll;
