$(document).ready(function(){

	$('#textarea').focus();
	$('#name'),focus();

	$('#all-checkbox').click(function(){
		var self = $(this);
		$('input[name="item"]').each(function(index) {
			if(self.is(':checked')) {
				$(this).prop('checked',true);		
			}else{
				$(this).prop('checked',false);		
			}
		});	
	});

});