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

		Item.find({ 
			createBy:createBy
		}, function (err, items) {
			if(err) return next(err);
			
			if(!items) {
				req.session.flash = {
					failure:'item don\' exist'
				};
				return res.redirect('/item/index');	
			}
			res.view({
				items: items
			});
		});
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

