/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'new': function (req, res, next) {
		res.view();
	},

	create: function (req, res, next) {

		var item = {
			title: req.param('title'),
			content: req.param('option')
		}

		Item.create( item, function (err, item) {
			if(err) {
				req.session.flash = {
					failure: '添加失败',
					success:''
				};
				return res.redirect('/item/new');
			}
			req.session.flash = {
				failure:'',
				success:'添加成功'
			};
			return res.redirect('/item/new');
		});
	},

	index: function (req, res, next) {

		Item.find(function (err, items) {
			if(err) {

				req.session.flash = {
					failure:'显示失败',
					success:''
				};
				return res.redirect('/item/index');
			}
			if(!items) {
				req.session.flash = {
					failure:'暂无此投票',
					success:''
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
			if(err) {

				req.session.flash = {
					failure:'显示失败',
					success:''
				};
				return res.redirect('/item/index');
			}
			if(!item) {
				req.session.flash = {
					failure:'暂无此投票',
					success:''
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
			if(err) {
				req.session.flash = {
					failure:'编辑失败',
					success:''
				};
				return res.redirect('/item/index');
			}
			if(!item) {
				req.session.flash = {
					failure:'暂无此投票',
					success:''
				};
				return res.redirect('/item/index');	
			}

			res.view({
				item: item
			});
		});
	},

	update: function (req, res, next) {

		var item = {
			title: req.param('title'),
			content: req.param('option')
		}

		Item.update( req.param('id'), item, function (err) {
			if(err) {
				req.session.flash = {
					failure:'更新失败',
					success:''
				};
				return res.redirect('/item/edit/' + req.param('id'));
			}
			req.session.flash = {
				failure:'',
				success:'更新成功'
			};
			
			res.redirect('/item/show/' + req.param('id'));

		});
	},

	destroy: function (req, res, next) {

		Item.destroy(req.param('id'), function (err) {
			if(err) {
				req.session.flash = {
					failure:'删除失败',
					success:''
				};
				return res.redirect('/item/index');
			}

			req.session.flash = {
				failure:'',
				success:'删除成功'
			};
			return res.redirect('/item/index');
		})
	}
};

