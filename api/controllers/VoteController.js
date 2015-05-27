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

		// console.log(vote);

		Vote.create( vote, function (err, vote) {
			if(err) {
				req.session.flash = {

					failure: '添加失败',
					success:''
				};

				return res.redirect('/vote/new');
			}

			console.log(vote);

			req.session.flash = {
				failure:'',
				success:'添加成功'
			};
			return res.redirect('/vote/new');
		});
	}
};

