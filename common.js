var common = {
	sendJSON: function(req, res, next) {
		/* You shall rewrite this function according to what you need.
		I think you can simply do this: */
		if (req.res_data) {
			res.json(req.res_data);
		} else {
			/* send empty object in response */
			res.json({});
		}
	}
};

module.exports = common;
