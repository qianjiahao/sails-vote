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
				failure: 'username or email required',
				success: ''
			}
			return res.redirect('/admin/new');
		}
		if (!password || !confirmation) {
			req.session.flash = {
				failure: 'password or confirmation required',
				success: ''
			}
			return res.redirect('/admin/new');
		}
		if (password != confirmation) {
			req.session.flash = {
				failure: 'password don\'t match confirmation',
				success: ''
			}
			return res.redirect('/admin/new');
		}

		bcrypt.hash(password, 10, function(err, encryptedPassword) {
			if (err) return next(err);

			Admin.findOneByEmail(email, function(err, user) {
				if (err) next(err);

				if (user) {
					req.session.flash = {
						failure: 'user already exist',
						success: ''
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

						res.redirect('/item/index');
					});
				}
			});
		});
	},

	login: function(req, res, next) {

		Admin.findOneByEmail(req.param('email'), function(err, user) {
			if (err) next(err);

			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);

				if (!valid) {
					req.session.flash = {
						failure: 'email don\' match password',
						success: ''
					};
					return res.redirect('/item/index');
				}
				req.session.authenticated = true;
				req.session.User = user;

				res.redirect('/item/index');
			});
		});
	},

	logout: function(req, res, next) {

		req.session.destroy();

		return res.redirect('/item/index');
	}
};