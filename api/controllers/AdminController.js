/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	'new': function (req, res, next) {
		res.view();
	},

	create: function (req, res, next) {
		var name = req.param('name');
		var password = req.param('password');
		var confirmation = req.param('confirmation');
		var email = req.param('email');
		var organization = req.param('organization');
		var admin = 'normal';
		var encryptedPassword = '';
		if(!(name &&  email)){
			req.session.flash = {
				failure:'username or email required',
				success:''
			}
			return res.redirect('/admin/new');
		}
		if(!password || !confirmation) {
			req.session.flash = {
				failure:'password or confirmation required',
				success:''
			}
			return res.redirect('/admin/new');
		}
		if(password != confirmation) {
			req.session.flash = {
				failure:'password don\'t match confirmation',
				success:''
			}
			return res.redirect('/admin/new');
		}

		require('bcrypt').hash(password, 10, function (err, encryptedPassword) {
			if(err) return next(err);
			encryptedPassword = encryptedPassword;
		});

		Admin.findOneByEmail( email, function (err, user) {
			if(err) next(err);

			if(user) {
				req.session.flash = {
					failure:'user already exist',
					success:''
				}
				return res.redirect('/admin/new');
			}else{

				var user = {
					name: name,
					encryptedPassword:encryptedPassword,
					email:email,
					admin:admin,
					organization:organization
				};

				Admin.create( user, function (err, user) {
					if(err) return next(err);
					
					console.log(user);
				});
			}
		});
	}
};

