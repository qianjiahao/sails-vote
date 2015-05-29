/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	new: function (req, res, next) {

		res.view();
	},

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

	index: function (req, res, next) {

		var createBy = req.session.User.id;
		var page = req.param('page') ? parseInt(req.param('page')) : 1;
		var limit = 5;
		var skip = (page - 1);

		Item.count(function (err, total) {
			if(err) return next(err);

			Item.find({ where: { createBy:createBy }, limit: limit, skip: skip }, function (err, items) {
				if(err) return next(err);
				
				if(!items) {
					req.session.flash = {
						failure:'item don\' exist'
					};
					return res.redirect('/item/index');	
				}
				res.view({
					items: items,
					page: page,
					isNext: (total - (page - 1) * limit + items.length) ? true : false,
					isPrevious: page - 1 ? true : false 
				});
			});	
		})
		
	},

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

	destroy: function (req, res, next) {
		if(req.session.User.id === req.param('id')) {
			Item.destroy(req.param('id'), function (err) {
				if(err) return next(err);

				req.session.flash = {
					success:'destroy success'
				};
				res.redirect('/item/index');
			});
		}
		
	}
};

