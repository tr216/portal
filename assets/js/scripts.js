
(function($) {
	"use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
    $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
    	if (this.href === path) {
    		$(this).addClass("active");
    		return;
    	}
    });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
    	e.preventDefault();
    	$("body").toggleClass("sb-sidenav-toggled");
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
})(jQuery);


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
	$('body').on('keydown', 'input, select', function(e) {
		if(e)
			if(e.key)
				if (e.key === "Enter") {
					return enterNext(this);
				}
			})
});

function enterNext(bu){
	var self = $(bu), form = self.parents('form:eq(0)'), focusable, next;
	focusable = form.find('input,a,select,button,textarea').filter(':visible');
	next = focusable.eq(focusable.index(bu)+1);
	if (next.length) {
		var readonly=next.prop('readonly') || false;
		var disabled=next.prop('disabled') || false;
		if(readonly || disabled) return enterNext(next);
		next.focus();
		if(typeof next.select === 'function') next.select();
	} else {
		form.submit();
	}
	return false;
}

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
function popupCenter(url, title, w, h,isDialog=false) {
	var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
	var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

	var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	var systemZoom = width / window.screen.availWidth;
	var left = (width - w) / 2 / systemZoom + dualScreenLeft
	var top = (height - h) / 2 / systemZoom + dualScreenTop
	if(!isDialog){
		var newWindow=window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
		if (window.focus)
			newWindow.focus();
	}else{
		var newWindow=openDialog(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
		if (window.focus)
			newWindow.focus();
	}

}


function save_form_settings(e){
	if(q){
		if(q.mid && e.target.id){
			var sbuf=localStorage.getItem(`collapse_settings_${q.mid}`)
			var collapse_settings={}
			if(sbuf){
				collapse_settings=JSON.parse(sbuf)
			}
			collapse_settings[`${e.target.id}`]=e.type
			localStorage.setItem(`collapse_settings_${q.mid}`,JSON.stringify(collapse_settings))
		}
	}
}

function load_form_settings(){
	var q=getAllUrlParams();
	if(q.mid){
		var sbuf=localStorage.getItem(`collapse_settings_${q.mid}`)
		var collapse_settings={}
		if(sbuf){
			collapse_settings=JSON.parse(sbuf)
		}
		Object.keys(collapse_settings).forEach((e)=>{
			$(`#${e}`).collapse(collapse_settings[e])
		})
	}
}

load_form_settings()

$('.card-collapse').on('show.bs.collapse',(e)=>{
	console.log(`show.bs.collapse e1:`,e)
	save_form_settings(e)	
})
$('.card-collapse').on('hide.bs.collapse',(e)=>{
	console.log(`hide.bs.collapse e1:`,e)
	save_form_settings(e)
})

$('.modal .card-collapse').on('show.bs.collapse',(e)=>{
	console.log(`modal show.bs.collapse e1:`,e)
	save_form_settings(e)	
})
$('.modal .card-collapse').on('hide.bs.collapse',(e)=>{
	console.log(`modal hide.bs.collapse e1:`,e)
	save_form_settings(e)
})
