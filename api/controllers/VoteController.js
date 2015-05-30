/**
 * VoteController
 *
 * @description :: Server-side logic for managing votes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res, next) {

		var createBy = req.session.User.id;
		var page = req.param('page') ? parseInt(req.param('page')) : 1;
		var limit = 5;
		var skip = 5 * (page - 1);

		Vote.count({
			where: {
				createBy: createBy
			}
		}, function (err, total) {
			if (err) return next(err);

			if (!total) {
				req.session.flash = {
					success: 'there is no vote right now'
				};
				return res.redirect('/vote/new');
			}
			Vote.find({
				where: {
					createBy: createBy
				},
				skip: skip,
				limit: limit
			}, function (err, votes) {
				if (err) return next(err);

				Admin.findOne(createBy, function (err, user) {
					if(err) return next(err);

					res.view({
						votes: votes,
						user: user,
						page: page,
						isNext: total - ((page - 1) * limit + votes.length) ? true : false,
						isPrevious: page - 1 ? true : false
					});	
				})
				
			});
		});
	},

	new: function(req, res, next) {

		res.view();
	},

	create: function (req, res, next) {

		var vote = {
			createBy:req.session.User.id,
			name:req.param('name')
		};
		Vote.create(vote, function (err, vote) {
			if(err) return next(err);

			if(!vote) {
				req.session.flash = {
					failure:'create vote failure'
				};
				return res.redirect('/vote/new');
			}
			req.session.voteId = vote.id;
			res.redirect('/vote/index');
		});
	},

	addOne: function(req, res, next) {

		var voteId = req.session.voteId;
		Item.findOne(req.param('id'), function (err, item) {
			if (err) return next(err);

			if (!item) {
				req.session.flash = {
					failure: 'item don\' exist'
				}
				return res.redirect('back');
			}

			Vote.findOne(voteId, function (err, vote) {
				if(err) return next(err);

				vote.content.push(item);
				vote.save(function (err, vote) {
					if(err) return next(err);

					res.redirect('back');
				});
			});
		});
	},
	addAll: function (req, res, next) {

		var voteId = req.session.voteId;
		var items = req.param('items');
		console.log(items);
	}
};