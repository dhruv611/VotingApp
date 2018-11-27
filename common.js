var common = {
	sendJSON: function(req, res, next) {
		if ((req.url & req.url.indexOf('jsonp') > -1) ||
			(req.query && (req.query.callback || req.query.CALLBACK))) {
			res.jsonp(req.res_data);
		} else {
			res.json(req.res_data);
		}
	};

	module.exports = common;
