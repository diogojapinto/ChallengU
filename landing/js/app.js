////////////////////////////////////////////////////////
///////////////Floating menu///////////////////////////
////////////////////////////////////////////////////////


var num = 50; //number of pixels before modifying styles

$(window).bind('scroll', function () {
    if (jQuery(window).scrollTop() > num) {
        jQuery('.main-menu').addClass('floating-menu');
    } else {
        jQuery('.main-menu').removeClass('floating-menu');
    }
});

$(document).on("scroll", onScroll);

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#menu li a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#menu li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
}

$('#menu li a').click(function(e) {
  var $this = $(this);
  if (!$this.hasClass('active')) {
    $this.addClass('active');
  }
  e.preventDefault();
});

////////////////////////////////////////////////////////
///////////////Section equal height///////////////////////////
////////////////////////////////////////////////////////


function equalizeHeight() {
    var section = $('html').not('.ie6').find('.section'); // getting the sections in all but ie8
	section.css({'min-height': (($(window).height()-30))+'px'});
    $(window).resize(function(){
        section.css({'min-height': (($(window).height()-30))+'px'});
    });
}

equalizeHeight();


////////////////////////////////////////////////////////
///////////////on scroll animation effects///////////////////////////
////////////////////////////////////////////////////////


new WOW().init();

////////////////////////////////////////////////////////
///////////////Smooth scroll for top navbar///////////////////////////
////////////////////////////////////////////////////////


smoothScroll.init({
			speed: 1000,
			easing: 'easeInOutCubic',
			offset: 0,
			updateURL: false,
			callbackBefore: function ( toggle, anchor ) {},
			callbackAfter: function ( toggle, anchor ) {}
});



////////////////////////////////////////////////////////
///////////////Parallax effects///////////////////////////
////////////////////////////////////////////////////////


$('div.bgParallax').each(function(){
	var $obj = $(this);

	$(window).scroll(function() {
		var yPos = -($(window).scrollTop() / $obj.data('speed')); 

		var bgpos = '50% '+ yPos + 'px';

		$obj.css('background-position', bgpos );
 
	}); 
});


////////////////////////////////////////////////////////
///////////////Image hovers effects and captions///////////////////////////
////////////////////////////////////////////////////////


$(window).load(function(){
  $('.hcaption').hcaptions({effect: "fade"});
});


////////////////////////////////////////////////////////
///////////////nivo Lightbox///////////////////////////
////////////////////////////////////////////////////////


$(document).ready(function(){
    $('a.nivo-light').nivoLightbox({
		effect: 'fade',                             // The effect to use when showing the lightbox
    	theme: 'default',
		keyboardNav: true	
	});
});


////////////////////////////////////////////////////////
///////////////main slider ///////////////////////////
////////////////////////////////////////////////////////
						

jQuery(document).ready(function() {
    jQuery('#carousel-slider').carousel({
        interval: 5000
    })
});
jQuery(document).ready(function() {
    jQuery('#carousel-gallery').carousel();
});

////////////////////////////////////////////////////////
///////////////back to top ///////////////////////////
////////////////////////////////////////////////////////


jQuery(document).ready(function() {
				var offset = 220;
				var duration = 500;
				jQuery(window).scroll(function() {
					if (jQuery(this).scrollTop() > offset) {
						jQuery('.back-to-top').fadeIn(duration);
					} else {
						jQuery('.back-to-top').fadeOut(duration);
					}
				});
				
				jQuery('.back-to-top').click(function(event) {
					event.preventDefault();
					jQuery('html, body').animate({scrollTop: 0}, duration);
					return false;
			})
});

////////////////////////////////////////////////////////
///////////////contact form ///////////////////////////
////////////////////////////////////////////////////////

$('#contact-form').bootstrapValidator({
//        live: 'disabled',
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            Name: {
                validators: {
                    notEmpty: {
                        message: 'The Name is required and cannot be empty'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required'
                    },
                    emailAddress: {
                        message: 'The email address is not valid'
                    }
                }
            },
            Message: {
                validators: {
                    notEmpty: {
                        message: 'The Message is required and cannot be empty'
                    }
                }
            }
        }
    });