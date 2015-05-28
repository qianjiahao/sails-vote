/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt');

module.exports = {

	new: function(req, res, next) {

		res.view();
	},

	create: function(req, res, next) {

		var name = req.param('name');
		var password = req.param('password');
		var confirmation = req.param('confirmation');
		var email = req.param('email');
		var organization = req.param('organization');
		var admin = 'normal';
		
		if (!(name && email)) {
			req.session.flash = {
				failure: 'username or email required'
			}
			return res.redirect('/admin/new');
		}
		if (!password || !confirmation) {
			req.session.flash = {
				failure: 'password or confirmation required'
			}
			return res.redirect('/admin/new');
		}
		if (password != confirmation) {
			req.session.flash = {
				failure: 'password don\'t match confirmation'
			}
			return res.redirect('/admin/new');
		}

		bcrypt.hash(password, 10, function(err, encryptedPassword) {
			if (err) return next(err);

			Admin.findOneByEmail(email, function(err, user) {
				if (err) next(err);

				if (user) {
					req.session.flash = {
						failure: 'user already exist'
					}
					return res.redirect('/admin/new');
				} else {
					var user = {
						name: name,
						encryptedPassword: encryptedPassword,
						email: email,
						admin: admin,
						organization: organization
					};
					Admin.create(user, function(err, user) {
						if (err) return next(err);
						req.session.authenticated = true;
						req.session.User = user;
						res.redirect('/admin/show/' + user.id);
					});
				}
			});
		});
	},

	index: function(req, res, next) {

		Admin.find(function(err, users) {
			if (err) return next(err);

			if (!users) {
				req.session.flash = {
					failure: 'no users exist'
				};
				return res.redirect('/admin/new');
			}
			res.view({
				users: users
			});
		});

	},

	show: function(req, res, next) {

		Admin.findOne(req.param('id'), function(err, user) {
			if (err) return next(err);

			if (!user) {
				req.session.flash = {
					failure: 'user don\' exist'
				};
				return res.redirect('back');
			}
			res.view({
				user: user
			});
		});
	},

	edit: function(req, res, next) {

		Admin.findOne(req.param('id'), function(err, user) {
			if (err) return next(err);

			if (!user) {
				req.session.flash = {
					failure: 'user don\' exist'
				};
				return res.redirect('back');
			}
			res.view({
				user: user
			});
		});
	},

	update: function(req, res, next) {

		Admin.findOneByEmail(req.param('email'), function(err, user) {
			if (err) return next(err);

			if (!user) {
				req.session.flash = {
					failure: 'user don\' exist'
				};
				return res.redirect('/admin/edit/' + req.param('id'));
			}

			var user = {
				id: req.param('id'),
				name: req.param('name'),
				email: req.param('email'),
				organization: req.param('organization')
			};

			Admin.update(req.param('id'), user, function(err) {
				if (err) return next(err);

				req.session.flash = {
					success: 'update user success'
				};
				
				if (req.session.User.id == req.param('id')) {

					Admin.findOne(req.param('id'), function (err, user) {
						req.session.User = user;
					});
				}

				res.redirect('/admin/show/' + req.param('id'));
			});
		});
	},

	destroy: function(req, res, next) {

		Admin.destroy(req.param('id'), function(err) {
			if (err) return next(err);

			if (req.session.User.id === req.param('id')) {
				req.session.destroy();
				res.redirect('/');
			} else {
				req.session.flash = {
					success: 'destroy success'
				};
				res.redirect('/admin/index');
			}
		});
	},

	login: function(req, res, next) {

		Admin.findOneByEmail(req.param('email'), function(err, user) {
			if (err) next(err);

			if (!user) {
				req.session.flash = {
					failure: 'user don\' exist'
				};
				return res.redirect('back');
			}
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);

				if (!valid) {
					req.session.flash = {
						failure: 'email don\' match password'
					};
					return res.redirect('back');
				}
				req.session.authenticated = true;
				req.session.User = user;
				res.redirect('/admin/show/' + user.id);
			});
		});
	},

	logout: function(req, res, next) {

		req.session.destroy();
		res.redirect('/');
	}
};