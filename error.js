module.exports = function(err, req, res, next){
	var code = err.status;
	var title = err.title;
	var response = {
    error: err.message,
    status: {
      result: 'failure',
      message: {
        title: title,
        message: err.message,
      }
    },
    code: code
  };
	console.log('Error with code: '+code+' and type: '+title);
	res.status(code).json(response);
};
