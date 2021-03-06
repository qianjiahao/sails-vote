/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * GET return new.ejs page .
	 */
	new: function (req, res, next) {

		res.view();
	},

	/**
	 * POST post information to create item .
	 */
	create: function (req, res, next) {
		var item = {
			title: req.param('title'),
			content: req.param('option'),
			createBy: req.session.User.id
		}
		Item.create( item, function (err, item) {
			if(err) return next(err);

			if(!item) {
				req.session.flash = {
					failure: 'create failure'
				};
				return res.redirect('/item/new');
			}
			req.session.flash = {
				success:'create success'
			};
			res.redirect('/item/new');
		});
	},

	/**
	 * GET return item information , ready to operate it by show , edit , destroy , addItem ,
	 *     pager : page , skip , limit .
	 */
	index: function (req, res, next) {
		var voteId = req.param('voteId');
		req.session.voteId = voteId;
		Vote.findOne(voteId, function (err, vote) {
			if(err) return next(err);

			/*
			save the exist item id .
			 */
			var existItemsMap = [];
			vote.content.map(function(ele) {
				this.push(ele.id);
			},existItemsMap);

			var createBy = req.session.User.id;
			var page = req.param('page') ? parseInt(req.param('page')) : 1;
			var skip = ( page - 1 ) * 5;
			var limit = 5;

			/*
			distinguish item by existItemMap .
			 */
			Item.count({
				where:{
					createBy: createBy,
					id: {
						'!': existItemsMap
					}
				}
			}, function (err, total) {
				if(err) return next(err);

				Item.find({
					where:{
						createBy: createBy,
						id: {
							'!': existItemsMap
						}
					},
					limit: limit,
					skip: skip
				}, function (err, items) {
					if(err) return next(err);

					res.view({
						vote: vote,
						items: items,
						page: page,
						isNext: total - ((page - 1) * limit + items.length) ? true : false,
						isPrevious: page - 1 ? true : false
					});
				});
			});	
		});
	},

	/**
	 * GET return item detail .
	 */
	show: function (req, res, next) {
		Item.findOne( req.param('id'), function (err, item) {
			if(err) return next(err);

			if(!item) {
				req.session.flash = {
					failure:'item don\' exist'
				};
				return res.redirect('/item/index');	
			}
			res.view({
				item: item
			});
		});
	},

	/**
	 * GET return item detail and ready to edit .
	 */
	edit: function (req, res, next) {
		Item.findOne( req.param('id'), function (err, item) {
			if(err) return next(err);

			if(!item) {
				req.session.flash = {
					failure:'item don\' exist'
				};
				return res.redirect('/item/index');	
			}
			res.view({
				item: item
			});
		});
	},

	/**
	 * POST post the information and update it into database .
	 */
	update: function (req, res, next) {
		Item.findOne(req.param('id'), function (err, item) {
			if(err) return next(err);

			if(!item) {
				req.session.flash = {
					failure:'item don\' exist'
				};
				return res.redirect('/item/edit');
			}
			var item = {
				title: req.param('title'),
				content: req.param('option')
			};
			Item.update( req.param('id'), item, function (err) {
				if(err) return next(err);

				req.session.flash = {
					success:'update item success'
				};
				res.redirect('/item/show/' + req.param('id'));
			});
		});
	},

	/**
	 * POST destroy item .
	 */
	destroy: function (req, res, next) {
		var voteId = req.session.voteId;

		Item.destroy(req.param('id'), function (err) {
			if(err) return next(err);

			req.session.flash = {
				success:'destroy success'
			};
			res.redirect('/item/index?voteId=' + voteId);
		});	
	}
};

