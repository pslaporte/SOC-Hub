jQuery(document).ready(function() {

	var $ = window.jQuery;
	var console = window.console || { log: function(t){ } };

	/* Ajax Forms */
	var $context;

	$(".mc4wp-ajax form").ajaxForm({
		data: { action: 'mc4wp_submit_form' },
		dataType: 'json',
		url: mc4wp_vars.ajaxurl,
		delegation: true,
		success: function(response, status) {

			$ajaxLoader = $context.find('.mc4wp-ajax-loader');
			$ajaxLoader.hide();
			
			if(response.success) {
				$message = $context.find('div.mc4wp-success-message').show();
				$context.find('form').trigger('reset');

				// Redirect to the specified location
				if(response.redirect) {
					window.setTimeout(function() {
						window.location.replace(response.redirect);
					}, 2500);
					
				}

				if(response.hide_form) {
					$context.find('form').hide();
				}

			} else {
				var e = (response.error == '') ? 'error' : response.error;
				$message = $context.find('.mc4wp-' + e + '-message').show();

				if(e == 'error' && response.show_error && response.mailchimp_error) {
					$('<div class="mc4wp-alert mc4wp-notice" id="mc4wp-mailchimp-error"><strong>MailChimp returned this error:</strong><br>' + response.mailchimp_error + '<br><br><em>this message is only visible to administrators</em></div>').insertAfter($message);
				}
			}

		},
		error: function(response) {
			console.log(response);
		},
		beforeSubmit: function(data, $form) {
			var $ajaxLoader, $submitButton;

			$context = $form.parent('div.mc4wp-form');
			$context.find('.mc4wp-alert').hide();
			$context.find("#mc4wp-mailchimp-error").remove();

			$ajaxLoader = $context.find('.mc4wp-ajax-loader');
			$submitButton = $form.find('input[type=submit]');

			$ajaxLoader.insertAfter($submitButton).css('display', 'inline-block'); 
			
			if( parseInt( $ajaxLoader.css( 'margin-left' ) ) < 5 ) { 
				$ajaxLoader.css('margin-left', '5px'); 
			}

			return true;
		}
	});
});