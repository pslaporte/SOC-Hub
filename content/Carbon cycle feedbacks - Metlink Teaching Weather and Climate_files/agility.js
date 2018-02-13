/**
 * agility.js
 * 
 * The main javascript for Agility - Responsive WordPress theme by SevenSpark
 * 
 * Copyright 2012 Chris Mavricos, SevenSpark
 * http://sevenspark.com
 * 
 */

jQuery(document).ready(function($){

	/* Style for JS-enabled */
	$('body').addClass('js-enabled');	
	
	/* Keep track of the width for use in mobile browser displays */
	var currentWindowWidth = $(window).width();
	$(window).resize(function(){
		currentWindowWidth = $(window).width();
	});


	/***************************************************
	 *
	 *	FLEX SLIDER 
	 *
	 **************************************************/

	//Video Sliders (Vimeo)
	if( agilitySetting( 'sliderVideo', true , false) ){

		$( '.flexslider' ).has( 'iframe' ).addClass( 'slider-video' );

		// Vimeo API
		var vimeoPlayers = new Array();
		var numPlayers = 0;
		$( '.flexslider .video-vimeo iframe' ).each( function(){
			var $vid 	= $(this),
				iframe 	= $(this)[0],
				player 	= $f(iframe),
				src 	= $vid.attr( 'src' );
			if( src.indexOf( '?' ) > 0 ) src+= '&api=1';
			else src+= '?api=1';
			$vid.attr( 'src' , src );


			vimeoPlayers[numPlayers++] = player;
			
			// When the player is ready, add listeners for pause, finish, and playProgress
			player.addEvent('ready', function() {

				var $slider = $vid.parents( '.flexslider' );

				player.addEvent('play', function(){
					$slider.flexslider( 'pause' );
					var slider = $slider.data( 'flexslider' );
					slider.manualPause = true;	//pause even when hover out
				});

				resizeVideos();
				$( window ).resize();
			});
		});
		
	}


	//Slider Controllers first, if they exist
	$('.flexcarousel-controller').each( function(){
		var slider_id = $( this ).parent( '.flex-container' ).attr( 'data-slider-number' );
		$( this ).flexslider({
			animation: "slide",
			controlNav: false,
			directionNav: true,
			prevText: " ",
			nextText: " ",
			animationLoop: false,
			slideshow: false,
			itemWidth: 200,
			itemMargin: 10,
			asNavFor: '.flex-slider-count-' + slider_id + ' .flexslider'
		});
	});


	//Now initialize the Sliders
	var $flexSlider = $('.flexslider');

	//Default options
	var flexOptions = {

		controlsContainer: '.flexslider-nav-container',
		prevText: " ",
		nextText: " ",
		pauseOnHover: true,
		pauseText: " ",
		playText: ' ',

		smoothHeight		: agilitySetting( 'smoothHeight', true, false ),
		pausePlay			: agilitySetting( 'playPause', true, false ),
		directionNav		: agilitySetting( 'directionNav', true, false ),
		controlNav			: agilitySetting( 'controlNav', true, false ), //"thumbnails", //false
		slideshowSpeed 		: agilitySetting( 'slideshowSpeed', 7000, true ),
		animationSpeed 		: agilitySetting( 'animationSpeed', 600 , true ),
		animation 	   		: agilitySetting( 'animation', 'slide' , false ),
		slideshow 			: agilitySetting( 'autoplay', true , false ),
		video 				: agilitySetting( 'sliderVideo', true , false ),

		before:	function($slider){
			if( agilitySetting( 'sliderVideo', true , false) ){
				//Pause Vimeo
				for( var k = 0; k < vimeoPlayers.length; k++ ){
					vimeoPlayers[k].api('pause');
				}
				//Pause YouTube
				if( youTubeAPIready ){
					for( var j = 0; j < youTubePlayers.length; j++ ){
						var player = youTubePlayers[j];
						if( typeof player.pauseVideo !== 'undefined' ) player.pauseVideo();
					}
				}
			} 
			if( agilitySetting( 'animateCaptions', true , false ) ){
				$slider.find('.flex-caption').animate( { 'marginLeft' : '-100%', 'opacity': 0 } );			
			}
		},
		after: function($slider){
			$slider.manualPause = false;
			if( agilitySetting( 'animateCaptions', true , false ) ){
				$slider.find('.flex-caption').animate( { 'marginLeft' : 0, 'opacity' : 1 } );
			}
		}
		
	}

	//Actually create sliders
	$flexSlider.each( function(){
		var flexOps = flexOptions;

		//Check for Controllers for each slider
		var $flexContainer = $( this ).parent( '.flex-container' );
		if( $flexContainer.find( '.flexcarousel-controller' ).size() > 0 ){
			flexOps.sync = '#' + $flexContainer.attr( 'id' ) + ' .flexcarousel-controller';
			flexOps.controlNav = false;
			flexOps.directionNav = false;
			flexOps.pausePlay = false;
			flexOps.animationLoop = false;
		}

		$( this ).flexslider( flexOps );	//Build sliders
	});


	//Setup Carousels
	$( '.flexcarousel' ).flexslider({
		animation: "slide",
		animationLoop: false,
		controlsContainer: '.flexslider-nav-container',
		controlNav: false,
		directionNav: true,
		prevText: " ",
		nextText: " ",
		pausePlay:false,
		pauseOnHover:false,
		pauseText: " ",
		playText: ' ',
		/*before:	function($slider){
			$slider.find('.flex-caption').fadeOut('fast');			
		},
		after: function($slider){
			$slider.find('.flex-caption').fadeIn();			
		},*/
		slideshowSpeed 		: agilitySetting( 'slideshowSpeed', 7000, true ),
		animationSpeed 		: agilitySetting( 'animationSpeed', 600 , true ),
		animation 	   		: agilitySetting( 'animation', 'slide' , false ),
		slideshow 			: false,
		itemWidth: 300,
		itemMargin: 20,
		minItems: 1,
		maxItems: 3
		
	});

	
	

	
	
	/***************************************************
	 *
	 * 	DROP PANEL 
	 *
	 ***************************************************/

	$('#drop-panel-expando').click(function(e){
		e.preventDefault();
		$('.drop-panel').slideToggle();
	});


	
	/***************************************************
	 *
	 * PRETTY PHOTO 
	 *
	 ***************************************************/

	if( !jQuery.agility_mobile ){	//Don't use prettyPhoto on mobile device
		$("a[data-rel^='prettyPhoto']").prettyPhoto({
			social_tools: '<div class="prettyPhoto_links"></div>',
			overlay_gallery: false,
			default_width: agilitySetting( 'prettyPhoto_default_width' , 940 , true ),
			changepicturecallback: function( ){
				
				//Make sure lightbox doesn't run off the left of the screen
				var $pp = $('.pp_default');
				if( parseInt( $pp.css('left') ) < 0 ){
					$pp.css('left', 0 );
				}

				//Setup link based on {{link}} in description
				var $pp_desc = $( '.pp_description' );
				var desc = $pp_desc.text();
				var start = desc.indexOf( '{{' );
				if( start >= 0 ){
					var link = desc.substring( start + 2 , desc.indexOf( '}}' ) );
					desc = desc.substring( 0 , start );
					var anchor = '<a class="prettyPhoto-link" href="'+link+'"><i class="icon-link"></i></a>';
					$( '.prettyPhoto_links' ).html( anchor );

					$pp_desc.html( desc );
				}

			}
		});
	}
	else{
		//Mobile devices use alternative href
		$("a[data-rel^='prettyPhoto'][data-href-alt]").click( function(e){
			e.preventDefault();
			var href = $(this).attr( 'data-href-alt' );
			if( href ) window.location = href;
			return false;
		});
	}

	/* Expander for featured images */
	$('.single-post-feature-expander').click(function(){
		$(this).parents('.featured-image').toggleClass('full-width');
	});

	
	
	/***************************************************
	 *
	 * 	MOBILE MENU
	 *
	 ***************************************************/

	$('.mobile-menu-button').click(function(e){
		e.preventDefault();
		var $menu = $($(this).attr('href'));
		$menu.toggleClass('menu-open'); //toggle()
		
		if(typeof $navClose !== 'undefined' && !$menu.hasClass('menu-open') ){
			$navClose.hide();
		}
	});
	
	
	
	
	
	/***************************************************
	 *
	 * 	iOS - IPHONE, IPAD, IPOD
	 *
	 ***************************************************/	
	
	var deviceAgent = navigator.userAgent.toLowerCase();
	var is_iOS = deviceAgent.match(/(iphone|ipod|ipad)/);
	
	if (is_iOS) {
		
		$('#main-nav').prepend('<a href="#" class="nav-close">&times;</a>'); // Close Submenu
		
		var $navClose = $('.nav-close');
		$navClose.hide().click(function(e){
			e.preventDefault();
			if(currentWindowWidth >= 767){
				$(this).hide();
			}
		});
		
		$('#main-nav > ul > li').hover( function(e){
			e.preventDefault();
			if( $(this).has( 'ul' ).size() == 0 ){
				$navClose.hide();
			}
			else if( currentWindowWidth < 767 ){
				$navClose.css({ 
					top : $(this).position().top + 33,
					left : '',
					right : 0
				}).show();
			}
			else{
				$navClose.css({
					left : $(this).position().left + parseInt($(this).css('marginLeft')),
					top : '',
					right : 'auto'
				}).show();
			}
		});
			  
	}
	
	
	/***************************************************
	 *
	 * 	NON-iOS
	 *
	 ***************************************************/
	
	if(!is_iOS){
		//iOS doesn't like CSS3 transitioning preloader, so don't use it
		$('.preload').preloadImages({
			showSpeed: 200   // length of fade-in animation, should be .2 in CSS transition
		});	   
		$(':not(.flexslider) .video-container').addClass('video-flex');
	}
	
	
	/***************************************************
	 *
	 * 	ANDROID
	 *
	 ***************************************************/

	var is_Android = deviceAgent.match(/(android)/);
	if(is_Android){
		//Do something special with Android
	}
	
		
	/***************************************************
	 *
	 * 	IE Automatic Grid Clearers
	 *
	 ***************************************************/

	if( $( 'html' ).hasClass( 'ie' ) ){
		$('.portfolio.col-4 article:nth-child(4n+1)').addClass('clear-grid');
		$('.portfolio.col-3 article:nth-child(3n+1)').addClass('clear-grid');
		$('.portfolio.col-2 article:nth-child(2n+1)').addClass('clear-grid');
	}
	
	
	
	/***************************************************
	 *
	 * 	HTML5 Callbacks
	 *
	 ***************************************************/

	if(!Modernizr.input.placeholder){
		$('.fallback').show();
	}
	


	/***************************************************
	 *
	 * 	Google Maps
	 *
	 ***************************************************/

	if( typeof google != 'undefined' && 
		typeof google.maps != 'undefined' &&
		typeof google.maps.LatLng !== 'undefined' ){
		$('.map_canvas').each(function(){
			
			var $canvas = $(this);
			var dataZoom = $canvas.attr('data-zoom') ? parseInt($canvas.attr('data-zoom')) : 8;
			
			var latlng = $canvas.attr('data-lat') ? 
							new google.maps.LatLng($canvas.attr('data-lat'), $canvas.attr('data-lng')) :
							new google.maps.LatLng(40.7143528, -74.0059731);
					
			var myOptions = {
				zoom: dataZoom,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: latlng
			};
					
			var map = new google.maps.Map(this, myOptions);
			
			if($canvas.attr('data-address')){
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({ 
						'address' : $canvas.attr('data-address') 
					},
					function(results, status) {					
						if (status == google.maps.GeocoderStatus.OK) {
							map.setCenter(results[0].geometry.location);
							var marker = new google.maps.Marker({
								map: map,
								position: results[0].geometry.location,
								title: $canvas.attr('data-mapTitle')
							});
						}
				});
			}
		});
	}

	

	/***************************************************
	 *
	 * 	Twitter
	 *
	 ***************************************************/

	if($('#tweet').size() > 0){
		var account = $( '#tweet' ).attr( 'data-account' );
		if( !account ){
			$( '#tweet' ).html( '<div class="hint">please set a Twitter handle in the Agility Social Media Options</div>');
		}	
		else{
			getTwitters('tweet', { 
				id: account, 
				count: 1, 
				enableLinks: true, 
				ignoreReplies: true, 
				clearContents: true,
				template: '%text% <a href="http://twitter.com/%user_screen_name%/statuses/%id_str%/" class="tweet-time" target="_blank">%time%</a>'+
							'<a href="http://twitter.com/%user_screen_name%" class="twitter-account" title="Follow %user_screen_name% on Twitter" target="_blank" ><img src="%user_profile_image_url%" /></a>'
			});
		}
	}



	/***************************************************
	 *
	 * 	UI Elements - Toggle, Accordion, Tabs
	 *
	 ***************************************************/

	//Toggles
	$('.toggle-closed .toggle-body').hide();
	$('.toggle-header a').click(function(e){
		e.preventDefault();
		$(this).parent('.toggle-header').siblings('.toggle-body').slideToggle().parents( '.toggle' ).toggleClass('toggle-open');
	});

	//Accordion
	$('.accordion .toggle-header a').click(function(e){
		e.preventDefault();
		var $accordion = $(this).parents('.accordion');
		$accordion.find( '.toggle' ).removeClass( 'current-accordion' );
		$(this).parents( '.toggle' ).addClass( 'current-accordion' );
		$accordion.find( '.toggle:not(.current-accordion)' ).find( '.toggle-body' ).slideUp().parents( '.toggle' ).removeClass('toggle-open');
	});

	//Tabs
	$('body').on('click', 'ul.tabs > li > a', function(e) {

		//Get Location of tab's content
		var contentLocation = $(this).attr('href');
		if( contentLocation.indexOf( '#' ) > 0 ) contentLocation = contentLocation.substring( contentLocation.indexOf( '#' ) );

		//Let go if not a hashed one
		if(contentLocation.charAt(0)=="#") {

			e.preventDefault();

			//Make Tab Active
			$(this).parent().siblings().children('a').removeClass('active');
			$(this).addClass('active');

			//Show Tab Content & add active class
			$(contentLocation).show().addClass('active').siblings().hide().removeClass('active');

		}
	});


	/***************************************************
	 *
	 * 	EMBEDDED VIDEOS (YouTube/Vimeo)
	 *	inspired by http://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
	 *
	 ***************************************************/

	var $allVideos = $("iframe[src^='http://www.youtube.com'], iframe[src^='http://player.vimeo.com']");

	// Figure out and save aspect ratio for each video
	$allVideos.each( function() {
		$(this).data( 'aspectRatio', $(this).attr( 'height' ) / $( this ).attr( 'width' ) );
	});

	$(window).resize(function() {
		resizeVideos();
		// Kick off one resize to fix all videos on page load
	}).resize();

	function resizeVideos(){
		$allVideos.each(function() {
			var $el = $(this);
			$el.height( $el.width() * $el.data('aspectRatio') );
		});
	}



	/***************************************************
	 *
	 * 	SELF-HOSTED VIDEOS (jPlayer)
	 *
	 ***************************************************/

	if( $().jPlayer ){

		$( '.jp-video' ).each( function(){

			$( this ).data( 'aspect_ratio' , $(this).attr( 'data-player-width' ) / $(this).attr( 'data-player-height' ) );
			
			var media_src = {};
			var supplied_media = new Array();
			var width = "640px";
			var height = "264px";

			var id = $( this ).attr( 'data-player-id' );

			if( $( this ).attr( 'data-player-m4v' ) ){
				media_src.m4v = $( this ).attr( 'data-player-m4v' );
				supplied_media.push( 'm4v' );
			}
			if( $( this ).attr( 'data-player-ogv' ) ){
				media_src.ogv = $( this ).attr( 'data-player-ogv' );
				supplied_media.push( 'ogv' );
			}
			if( $( this ).attr( 'data-player-webmv' ) ){
				media_src.webmv = $( this ).attr( 'data-player-webmv' );
				supplied_media.push( 'webmv' );
			}
			if( $( this ).attr( 'data-player-poster' ) ){
				media_src.poster = $( this ).attr( 'data-player-poster' );
			}
			if( $( this ).attr( 'data-player-width' ) ){
				width = $( this ).attr( 'data-player-width' ) + 'px';
			}
			if( $( this ).attr( 'data-player-height' ) ){
				height = $( this ).attr( 'data-player-height' ) + 'px';
			}

			var $jpPlayer = $( this ).find( '.jp-jplayer' );
			
			//Initialize player
			$jpPlayer.jPlayer({
				ready: function () {
					$( this ).jPlayer( 'setMedia' , media_src );
					resizejPlayer( $(this).parents( '.jp-video' ) );
				},
				size: {
					width: width,
					height: height
				},
				swfPath: agilitySetting( 'jplayer_swf', '/wp-content/themes/agility/modules/video/jplayer/Jplayer.swf', false ),
				supplied: supplied_media.join( ',' ), // "m4v", //, ogv",
				preload: "none",
				autohide: {
					restored: false,
					full: false
				},
				play: function() { // To avoid both jPlayers playing together.
					$(this).jPlayer( 'pauseOthers' );
				},
				cssSelectorAncestor: '#jp_container_'+id
				//solution:'html, flash', supplied:'m4v
				//errorAlerts: true
			});

			//Full Screen - adjust containers to allow expansion
			$jpPlayer.bind( $.jPlayer.event.resize, function(event) { // Add a listener to report the time play began
				if( event.jPlayer.options.fullScreen || $( '.jp-video' ).hasClass( 'jp-video-full' ) ) {
					$( 'body' ).addClass( 'fullScreenVideo' );
				}
				else{
					$( 'body' ).removeClass( 'fullScreenVideo' );
				}
			});

		});

		$(window).resize(function(){
			$('.jp-video').each(function(){
				resizejPlayer( $(this) );
			});
		});


		/*
		//Native Full Screen with Screenfull
		var target = $('#jquery_jplayer_1 video')[0]; // Get DOM element from jQuery collection
		$('.jp-full-screen-toggle').click(function() {
			if ( screenfull ) {
				screenfull.request( target );
			}
		});*/

	}

	function resizejPlayer( $jplayer ){
		var new_height = $jplayer.width() / $jplayer.data( 'aspect_ratio' );
		var new_width = $jplayer.width();
		$jplayer.find( 'img, .jp-jplayer, video' ).height( new_height );
		//console.log( new_width + ' | ' + new_height );
		$jplayer.find( '.jp-jplayer' ).jPlayer( 'option', 'size', { width: new_width, height: new_height } );
	}
	


	/***************************************************
	 *
	 * 	Back to Top - based on Scroll To Top by Cudazi
	 *
	 ***************************************************/

	var upperLimit = 100;
	var scrollElem = $('a#back-to-top');
	var scrollSpeed = 500;
	
	// Show and hide the scroll to top link based on scroll position	
	scrollElem.hide();
	$( window ).scroll( function () { 			
		var scrollTop = $(document).scrollTop();
		if ( scrollTop > upperLimit ) {
			$( scrollElem ).stop().fadeTo( 300, .7 );
		}
		else{		
			$( scrollElem ).stop().fadeTo( 300, 0 , function(){
				setTimeout( function(){ scrollElem.hide(); } , 200 );
			});
		}
	});

	// Scroll to top animation on click
	$( scrollElem ).click(function(){ 
		$( 'html, body' ).animate( { scrollTop:0 }, scrollSpeed ); 
		return false; 
	});


	/***************************************************
	 *
	 * 	UTILITY
	 *
	 ***************************************************/

	$('.height-expand').each(function(){
		$(this).height($(this).prev().height());
	});

	//Size images in IE
	imgSizer.collate();


	function agilitySetting( key , fallback , numeric ){
		if( typeof agilitySettings != 'undefined' ){
			if( key in agilitySettings ){
				if( numeric ) return parseInt( agilitySettings[key] );
				//if( bool ) return agilitySettings[key] == 'true' ? true : false;
				var val = agilitySettings[key];
				if( val == 'true' ) return true;
				if( val == 'false') return false;
				return val;
			}
		}
		return fallback;
	}
	
});


/***************************************************
 *
 * 	YOUTUBE API
 *
 ***************************************************/

var youTubePlayers = new Array();
var numYouTubePlayers = 0;
var youTubeAPIready = false;

//This function runs as soon as the API is ready
function onYouTubeIframeAPIReady() {
	youTubeAPIready = true;
	
	var ytnum = 0,
		ytid;

	jQuery( '.flexslider .video-youtube iframe' ).each( function(){

		ytid = 'youtube-iframe-'+ (ytnum++);
		jQuery( this ).attr( 'id', ytid );
		var $slider = jQuery( this ).parents( '.flexslider' );

		var player;
		//console.log( ytid );
		
		player = new YT.Player( ytid, {
			events: {
				'onStateChange' : function( event ){
					//event.target.playVideo();
					//event.target.pauseVideo()

					if ( event.data == YT.PlayerState.PLAYING ) {
						//console.log( 'video played, need to pause slider' );

						//Pause the slider
						$slider.flexslider( 'pause' );
						var slider = $slider.data( 'flexslider' );
						slider.manualPause = true;	//pause even when hover out
					}
				}
			}
		});

		youTubePlayers[numYouTubePlayers++] = player;

	});

}

/***************************************************
 *
 * 	ISOTOPE
 *
 ***************************************************/

(function($){ 
	jQuery( '.isotope-container img' ).bind( 'load', function(){
		agility_isotope();
	});
})(jQuery); 

// On Window Ready, run isotope for iOS
jQuery( window ).ready( function( $ ){
	var deviceAgent = navigator.userAgent.toLowerCase();
	if( deviceAgent.match(/(iphone|ipod|ipad)/) ) {
		agility_isotope();
	}
});

function agility_isotope(){
	//Isotope
	var $isotopeContainer = jQuery( '.isotope-container' );
	$isotopeContainer.css( 'min-height' , $isotopeContainer.height() );
	// initialize isotope
	$isotopeContainer.isotope({
		layoutMode: 'fitRows'
	});

	// filter items when filter link is clicked
	jQuery('.isotope-filters a').click(function(e){
		e.preventDefault();
		var selector = jQuery(this).attr( 'data-filter' );
		$isotopeContainer.isotope( { filter: selector } );
		return false;
	});
}
agility_isotope();

/***************************************************
 *
 * 	IMAGE PRELOADER
 *
 ***************************************************/

jQuery.fn.preloadImages = function(options){

	var defaults = {
		showSpeed: 200
	};

	var options = jQuery.extend(defaults, options);

	return this.each(function(){
		var $container = jQuery(this);
		var $image = $container.find('img');

		$image.addClass('loading');	//hide image while loading
		 
		$image.bind('load error', function(){
			$image.removeClass('loading'); //allow image to display (will fade in with CSS3 trans)
			
			setTimeout(function(){ 
				$container.removeClass('preload'); //remove the preloading class to swap the bkg
			}, options.showSpeed);
			
		});
		
		if($image[0].complete || ( jQuery( 'html' ).hasClass( 'ie' ) )) { 
			$image.trigger('load');	//IE has glitchy load triggers, so trigger it automatically
		}
	});
}


/* IE Image Resizing - by Ethan Marcotte - http://unstoppablerobotninja.com/entry/fluid-images/ */
var imgSizer = {
	Config : {
		imgCache : []
		,spacer : "../images/spacer.gif"
	}

	,collate : function(aScope) {
		var isOldIE = (document.all && !window.opera && !window.XDomainRequest) ? 1 : 0;
		if (isOldIE && document.getElementsByTagName) {
			var c = imgSizer;
			var imgCache = c.Config.imgCache;

			var images = (aScope && aScope.length) ? aScope : document.getElementsByTagName("img");
			for (var i = 0; i < images.length; i++) {
				images[i].origWidth = images[i].offsetWidth;
				images[i].origHeight = images[i].offsetHeight;

				imgCache.push(images[i]);
				c.ieAlpha(images[i]);
				images[i].style.width = "100%";
			}

			if (imgCache.length) {
				c.resize(function() {
					for (var i = 0; i < imgCache.length; i++) {
						var ratio = (imgCache[i].offsetWidth / imgCache[i].origWidth);
						imgCache[i].style.height = (imgCache[i].origHeight * ratio) + "px";
					}
				});
			}
		}
	}

	,ieAlpha : function(img) {
		var c = imgSizer;
		if (img.oldSrc) {
			img.src = img.oldSrc;
		}
		var src = img.src;
		img.style.width = img.offsetWidth + "px";
		img.style.height = img.offsetHeight + "px";
		img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='scale')"
		img.oldSrc = src;
		img.src = c.Config.spacer;
	}

	// Ghettomodified version of Simon Willison's addLoadEvent() -- http://simonwillison.net/2004/May/26/addLoadEvent/
	,resize : function(func) {
		var oldonresize = window.onresize;
		if (typeof window.onresize != 'function') {
			window.onresize = func;
		} else {
			window.onresize = function() {
				if (oldonresize) {
					oldonresize();
				}
				func();
			}
		}
	}
};


/**
 * jQuery.agility_mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.agility_mobile will be true if the browser is a mobile device
 *
 **/
(function(a){jQuery.agility_mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
