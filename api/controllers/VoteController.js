/**
 * VoteController
 *
 * @description :: Server-side logic for managing votes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	'new': function (req, res, next) {
		res.view();
	},

	create: function (req, res, next) {

		var vote = {
			title: req.param('title'),
			content: req.param('item')
		}

		Vote.create( vote, function (err, vote) {
			if(err) {
				req.session.flash = {
					failure: '添加失败',
					success:''
				};
				return res.redirect('/vote/new');
			}
			req.session.flash = {
				failure:'',
				success:'添加成功'
			};
			return res.redirect('/vote/new');
		});
	},

	index: function (req, res, next) {

		Vote.find(function (err, votes) {
			if(err) {

				req.session.flash = {
					failure:'显示失败',
					success:''
				};
				return res.redirect('/vote/index');
			}
			if(!votes) {
				req.session.flash = {
					failure:'暂无此投票',
					success:''
				};
				return res.redirect('/vote/index');	
			}
			res.view({
				votes: votes
			});
		});
	},

	show: function (req, res, next) {

		Vote.findOne( req.param('id'), function (err, vote) {
			if(err) {

				req.session.flash = {
					failure:'显示失败',
					success:''
				};
				return res.redirect('/vote/index');
			}
			if(!vote) {
				req.session.flash = {
					failure:'暂无此投票',
					success:''
				};
				return res.redirect('/vote/index');	
			}

			res.view({
				vote: vote
			});
		});
	},

	edit: function (req, res, next) {

		Vote.findOne( req.param('id'), function (err, vote) {
			if(err) {
				req.session.flash = {
					failure:'编辑失败',
					success:''
				};
				return res.redirect('/vote/index');
			}
			if(!vote) {
				req.session.flash = {
					failure:'暂无此投票',
					success:''
				};
				return res.redirect('/vote/index');	
			}

			res.view({
				vote: vote
			});
		});
	},

	update: function (req, res, next) {

		var vote = {
			title: req.param('title'),
			content: req.param('item')
		}

		Vote.update( req.param('id'), vote, function (err) {
			if(err) {
				req.session.flash = {
					failure:'更新失败',
					success:''
				};
				return res.redirect('/vote/edit/' + req.param('id'));
			}
			req.session.flash = {
				failure:'',
				success:'更新成功'
			};
			
			res.redirect('/vote/show/' + req.param('id'));

		});
	},

	destroy: function (req, res, next) {

		Vote.destroy(req.param('id'), function (err) {
			if(err) {
				req.session.flash = {
					failure:'删除失败',
					success:''
				};
				return res.redirect('/vote/index');
			}

			req.session.flash = {
				failure:'',
				success:'删除成功'
			};
			return res.redirect('/vote/index');
		})
	}
};

