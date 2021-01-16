
(function($) {
	"use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
    // $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
    // 	if (this.href === path) {
    // 		$(this).addClass("active");
    // 		return;
    // 	}
    // });

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
  	}, 300, 'easeInOutExpo');
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
	
	if(bu==undefined)
		bu=this
	var self = $(bu), form = self.parents('form:eq(0)'), focusable, next;
	focusable = form.find('input,a,select,button,textarea').filter(':visible')
	next = focusable.eq(focusable.index(bu)+1);
	if (next.length) {
		
		var readonly=next.prop('readonly') || false
		var disabled=next.prop('disabled') || false
		var cl=next.prop('class') || ''

		if(cl.indexOf('btn-collapse')>-1 || cl.indexOf('skip-enter-next')>-1 || cl.indexOf('no-enter-next')>-1)
			return enterNext(next)

		if(readonly || disabled )
			return enterNext(next)
		

		
		next.focus()
		if(typeof next.select === 'function')
			next.select()
	} else {
		//form.submit();
	}
	return false
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


function load_card_collapses(){

	var kartlar=document.getElementsByClassName('card-collapse')
	var i=0
	while(i<kartlar.length){
		if(pageSettings.getItem(`collapse_${kartlar[i].id}`)){
			$(`#${kartlar[i].id}`).collapse(pageSettings.getItem(`collapse_${kartlar[i].id}`))			
		}

		i++
	}
}
load_card_collapses()


$('.card-collapse').on('show.bs.collapse',(e)=>{
	pageSettings.setItem(`collapse_${e.target.id}`,e.type)
	// save_form_settings(e)	
})
$('.card-collapse').on('hide.bs.collapse',(e)=>{
	// save_form_settings(e)
	pageSettings.setItem(`collapse_${e.target.id}`,e.type)
})

$('.modal .card-collapse').on('show.bs.collapse',(e)=>{
	pageSettings.setItem(`collapse_${e.target.id}`,e.type)
})
$('.modal .card-collapse').on('hide.bs.collapse',(e)=>{
	pageSettings.setItem(`collapse_${e.target.id}`,e.type)
})



// jQuery('document').ready(function(){
	/* For disabling Chrome Autocomplete */
	//setTimeout(()=>{
		//jQuery( ":text" ).attr('autocomplete','pre'+Math.random(0,100000000))
		//jQuery( ":text" ).attr('autocomplete','chrome-off')
	//},200)
	
	
// })

$(document).ready(function(){
	// $('input[type="text"]' ).attr('autocomplete','pre'+Math.random(0,100000000))
	// $('input[type="search"]' ).attr('autocomplete','pre'+Math.random(0,100000000))
	// $('input[type="text"]' ).attr('autocomplete','pre'+Math.random(0,100000000))
	// $('input[type="search"]' ).attr('autocomplete','none' + (new Date()).getTime())
	// $('input[type="text"]' ).attr('autocomplete','none' + (new Date()).getTime())
	//$('input' ).attr('autocomplete','off')
	// $('input' ).attr('autofill','off')
	// $('input[type="text"]' ).attr('autocomplete','none')
	
	// $('input[type="search"]' ).attr('autocorrect','none')
	// $('input[type="text"]' ).attr('autocorrect','none')

	// $('input[type="search"]' ).attr('spellcheck','false')
	// $('input[type="text"]' ).attr('spellcheck','false')
	// let tagArr = document.getElementsByTagName("input");
 //  for (let i = 0; i < tagArr.length; i++) {
 //    tagArr[i].autocomplete ='off' // 'pre'+(new Date()).getTime().toString()+Math.random(0,100000000);
 //  }
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})