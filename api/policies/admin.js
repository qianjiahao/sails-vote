/**
 * passing the policy only if user is admin .
 */

module.exports = function (req, res, next) {

	var isAdmin = req.session.User.admin === 'admin';



	if(!isAdmin) {

		return res.forbidden('You are not permitted to perform this action.');
	}

	next();
}