/**
 * VoteController
 *
 * @description :: Server-side logic for managing votes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	new: function (req, res, next) {

		var createBy = req.session.User.id;
		var page = req.param('page') ? parseInt(req.param('page')) : 1;
		var skip = (page - 1) * 5;
		var limit = 5;
		Item.count(function (err, total) {
			if(err) return next(err);

			Item.find({ where: { createBy:createBy },limit: limit,skip: skip }, function (err, items) {
				res.view({
					items: items,
					page: page,
					isNext: total- ((page - 1)* limit + items.length) ? true : false,
					isPrevious: page - 1 ? true : false
				});
			});	
		});
		
	}	
};

