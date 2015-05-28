$(document).ready(function(){

	$('#sign-up-form').validate({
		rules: {
			name: {
				required: true
			},

			email: {
				required: true
			},

			password: {
				required: true,
				minlength:6
			},

			confirmation: {
				equalTo: "#password"
			}
		},

		success: function (element) {
			element.text('OK').addClass('valid');
		}
	});

	if($('#name')) {
		$('#name').focus();
	}
});

