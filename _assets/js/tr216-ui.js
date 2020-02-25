(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  // $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
  //   $("body").toggleClass("sidebar-toggled");
  //   $(".sidebar").toggleClass("toggled");
  //   if ($(".sidebar").hasClass("toggled")) {
  //     $('.sidebar .collapse').collapse('hide');
  //   };
  // });

  // Close any open menu accordions when window is resized below 768px
  // $(window).resize(function() {
  //   if ($(window).width() < 768) {
  //     $('.sidebar .collapse').collapse('hide');
  //   };
  // });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

})(jQuery); // End of use strict

(function(){
            var originalAddClassMethod = jQuery.fn.addClass;
            var originalRemoveClassMethod = jQuery.fn.removeClass;
            jQuery.fn.addClass = function(){
                var result = originalAddClassMethod.apply( this, arguments );
                jQuery(this).trigger('classChanged');
                return result;
            }
            jQuery.fn.removeClass = function(){
                var result = originalRemoveClassMethod.apply( this, arguments );
                jQuery(this).trigger('classChanged');
                return result;
            }
        })();

  $(document).ready(function(){
        // if(localStorage.getItem('sidebar.toggled')=='true'){

        //     if($('#sidebar').attr('class').indexOf('toggled')<0){
        //         $('#sidebar').addClass('toggled');
        //     }
        // }else{
        //     if($('#sidebar').attr('class').indexOf('toggled')>-1){
        //         $('#sidebar').removeClass('toggled');
        //     }
        // }


        // $('#sidebar').on('classChanged',function(){
        //     if($('#sidebar').attr('class').indexOf('toggled')>-1){
        //         localStorage.setItem('sidebar.toggled',true);
        //     }else{
        //         localStorage.setItem('sidebar.toggled',false);
        //     }
            
        // });
    });

    
function openUrl(url,_id,target,popup){
        url=url.replaceAll('{_id}',_id);
        if(target=='_blank' && popup!=true){
            window.open(url,target);
        }else if(popup){
            popupCenter(url,'Goster','900','600');
        }else{
            localStorage.setItem('returnUrl',window.location.href);
            window.location.href=url;
        }
        
    }
function popupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var systemZoom = width / window.screen.availWidth;
var left = (width - w) / 2 / systemZoom + dualScreenLeft
var top = (height - h) / 2 / systemZoom + dualScreenTop
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) newWindow.focus();
}