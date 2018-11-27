var viewpoll = require('./viewpoll');
var createpoll = require('./createpoll');
var deletepoll = require('./deletepoll');
var modifypoll = require('./modifypoll');
var pollresult = require('./pollresult');
var error = require('./error');

module.exports = function(app){
  console.log('App is running.');

  app.get('/viewpoll',viewpoll.fetchAll,common.sendJSON,error);

  app.get('/viewpoll/:name',viewpoll.fetchSingle,common.sendJSON,error);

  app.get('/createpoll/:name/:items',createpoll.create,common.sendJSON,error);

  app.get('/deletepoll/:name',deletepoll.delete,common.sendJSON,error);

  app.get('/modifypoll/:name/:newname',modifypoll.modify,common.sendJSON,error);

  app.get('/pollresult/:name',pollresult.result,common.sendJSON,error);

};
