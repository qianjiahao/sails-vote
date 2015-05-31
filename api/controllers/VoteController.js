/**
 * VoteController
 *
 * @description :: Server-side logic for managing votes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * GET return the vote list in the index.ejs page .
	 * 	   pager : page , limit , skip
	 */
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
				});
			});
		});
	},

	/**
	 * GET return the new.ejs page . 
	 */
	new: function(req, res, next) {

		res.view();
	},

	/**
	 * POST create vote with param from new.ejs page .
	 */
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

	/**
	 * GET return the item information from vote content ,
	 * 	   pager : page , limit , skip , start , end .
	 */
	show: function (req,res, next) {

		var voteId = req.param('id');
		req.session.voteId = voteId;
		var page = req.param('page') ? parseInt(req.param('page')) : 1;
		var limit = 5;
		var skip = 5;
		var start = (page - 1) * skip;
		var end = start + limit;

		Vote.findOne(voteId, function (err, vote) {
			if(err) return next(err);

				var items = vote.content.slice(start,end);
				var total = vote.content.length;

				res.view({
					vote: vote,
					items: items,
					page: page,
					isNext: total - start - vote.content.length ? true : false,
					isPrevious: start ? true : false
				});
		});
	},

	/**
	 * GET return item from vote content .
	 */
	showItem: function (req, res, next) {

		var voteId = req.session.voteId;
		var itemId = req.param('id');

		Vote.findOne(voteId, function (err, vote) {
			if(err) return next(err);

			vote.content.map(function (ele) {
				 if(ele.id == itemId) {
				 	
				 	res.view({
						vote: vote,
						item: ele
					});
				 }
			});
		});
	},

	/**
	 * GET return the item from vote content and ready to edit .
	 */
	editItem: function (req, res, next) {
		
		var voteId = req.session.voteId;
		var itemId = req.param('id');

		Vote.findOne(voteId, function (err, vote) {
			if(err) return next(err);

			vote.content.map(function (ele) {
				 if(ele.id == itemId) {

				 	res.view({
						vote: vote,
						item: ele
					});
				 }
			});
		});
	},

	/**
	 * POST post the param from edit page and update into vote content .
	 */
	updateItem: function (req, res, next) {

		var voteId = req.session.voteId;
		var itemId = req.param('id');

		Vote.findOne(voteId, function (err, vote) {
			if(err) return next(err);

			vote.content.map(function (ele) {
				if(ele.id === itemId) {
					ele.title = req.param('title');
					ele.content = req.param('option');
				}
			});
			Vote.update(voteId, vote, function (err) {
				if(err) return next(err);

				res.redirect('/vote/showItem/' + itemId);
			});
		});
	},

	/**
	 * POST destroy the item from vote content .
	 */
	destroyItem: function (req, res, next) {

		var voteId = req.session.voteId;
		var itemId = req.param('id');

		Vote.findOne(voteId, function (err, vote) {
			if(err) return next(err);

			var item = [];
			vote.content.map(function (ele) {
				 if(ele.id != itemId) {
				 	item.push(ele);
				 }
			});

			vote.content = item;
			vote.save(function (err) {
				if(err) return next(err);

				res.redirect('/vote/show/' + voteId);
			});
		});
	},

	/**
	 * POST add item into vote content .
	 */
	addOne: function(req, res, next) {

		Item.findOne(req.param('id'), function (err, item) {
			if (err) return next(err);

			if (!item) {
				req.session.flash = {
					failure: 'item don\' exist'
				}
				return res.redirect('back');
			}

			Vote.findOne(req.session.voteId, function (err, vote) {
				if(err) return next(err);

				/*
				save the modify into the vote .
				 */
				vote.content.push(item);
				vote.save(function (err, vote) {
					if(err) return next(err);

					res.redirect('back');
				});
			});
		});
	},

	/**
	 * POST destroy the vote .
	 */
	destroy: function (req, res, next) {

		Vote.destroy(req.param('id'), function (err) {
			if(err) return next(err);

			req.session.flash = {
				success:'destroy vote success'
			};

			res.redirect('back');
		});
	}
};