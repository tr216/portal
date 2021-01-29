
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


// $(document).ready(function(){
// 	$('body').on('keydown', 'input, select', function(e) {
// 		if(e)
// 			if(e.key)
// 				if (e.key === "Enter") {
// 					return enterNext(this);
// 				}
// 			})
// });

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
	console.log(`'show.bs.collapse:`,e.target.id)
	// save_form_settings(e)	
})
$('.card-collapse').on('hide.bs.collapse',(e)=>{
	// save_form_settings(e)
	pageSettings.setItem(`collapse_${e.target.id}`,e.type)
	console.log(`'hide.bs.collapse:`,e.target.id)
})

$('.modal .card-collapse').on('show.bs.collapse',(e)=>{
	pageSettings.setItem(`collapse_${e.target.id}`,e.type)
})
$('.modal .card-collapse').on('hide.bs.collapse',(e)=>{
	pageSettings.setItem(`collapse_${e.target.id}`,e.type)
})

var copyX_cb=null
var copyX_fields={}
function copyX(fields,title,cb=null){
	copyX_fields=fields
	copyX_cb=cb

	$('#modalCopyLabel').html(title)
	var s=``
	Object.keys(fields).forEach((key)=>{
		var field=fields[key]
		s+=`<div class="form-group">
		<label class="m-0 p-0">${field.title || ''}</label>
		<input type="text" class="form-control ${field.class || ''}" id="modalCopyField-${generateFormId(key)}" placeholder="${ field.placeholder || field.title || ''}" ${field.readonly==true?'readonly':''} autocomplete="off" autofill="off" spellcheck="false" value="${field.value}">
		</div>`
	})
	$('#modalCopy .modal-body').html(s)

	$('#modalCopy').modal('show')

}

function modalCopyOk(){
	$('#modalCopyOk').modal('hide')
	if(copyX_cb){
		var formData={}
		Object.keys(copyX_fields).forEach((key)=>{
			var field=copyX_fields[key]
			formData[key]=$(`#modalCopyField-${generateFormId(key)}`).val()
		})
		formData=listObjectToObject(clone(formData))

		copyX_cb(true,formData)

	}else{
		$('#modalCopyOk').modal('hide')
	}
}




function modalFormOptions(){
	$("#gridPrograms tr").remove()

	$.ajax({
		url:`/dbapi/programs?passive=false`,
		type:'GET',
		dataType: 'json',
		success: function(result) {
			if(result.success){
				$.ajax({
					url:`/dbapi/settings`,
					type:'GET',
					dataType: 'json',
					success: function(result2) {
						var secilmisOlanlar=[]
						
						
						if(result2.success){
							if(result2.data.settings){
								if(result2.data.settings.page){
									if(result2.data.settings.page[windowPathToFieldName()]){
										if(result2.data.settings.page[windowPathToFieldName()].programs){
											secilmisOlanlar=result2.data.settings.page[windowPathToFieldName()].programs
										}
									}
								}
							}
						}
						
						var lineGrid=document.getElementById('gridPrograms')
						result.data.docs.forEach((prg,index)=>{

							var newRow=lineGrid.insertRow(lineGrid.rows.length)
							var bChecked=false

							secilmisOlanlar.forEach((e)=>{
								if(e._id.toString()==prg._id.toString()){
									bChecked=true
									return
								}
							})
							
							if(bChecked){
								newRow.insertCell(0).innerHTML=`<input type="checkbox" class="programRow" name="programRow[${index}]" checked="true" value="${encodeURIComponent2(JSON.stringify(prg))}">`
							}else{
								newRow.insertCell(0).innerHTML=`<input type="checkbox" class="programRow" name="programRow[${index}]" value="${encodeURIComponent2(JSON.stringify(prg))}">`
							}
							
							
							newRow.insertCell(1).innerHTML=prg.name
							newRow.insertCell(2).innerHTML=prg.type
						})
						$('#modalFormOptions').modal('show')
					}
				})
			}
		},
		error:function(err){
			console.log('err:',err)
		}
	})
}

function modalFormOptions_OK(){
	var data={page:{}}
	data.page[windowPathToFieldName()]={programs:[null]}
	$(".programRow").each(function() {
		if(this.checked){
			var prg=JSON.parse(decodeURIComponent(this.value))

			data.page[windowPathToFieldName()].programs.push({_id:prg._id,type:prg.type,name:prg.name})
		}
	})
	
	
	$.ajax({
		url:`/dbapi/settings`,
		data:data,
		type:'POST',
		dataType: 'json',
		success: function(result) {
			
			if(result.success){
				
				window.location.href=`/changedb`
				
			}
		},
		error:function(err){
			console.log('err:',err)
		}
	})
	
}

function logout(){
	confirmX('Programdan çıkmak istiyor musunuz?',(resp)=>{
		
		if(resp)
			window.location.href=`${window.location.origin}/logout`
	})
}

$(document).ready(function(){
	var a=document.getElementById('main-container')
	var spinner=document.getElementById('spinner')
	a.style.display='initial'
	spinner.style.display='none'
})


var confirmX_response=false
function confirmX(message, type='info',cb){
	confirmX_response=false
	if(typeof type=='function'){
		cb=type
		type='info'
	}


	$('#modalConfirm .modal-content').removeClass('alert-warning')
	$('#modalConfirm .modal-content').removeClass('alert-info')
	$('#modalConfirm .modal-content').removeClass('alert-danger')

	$('#modalConfirm .modal-content').addClass(`alert-${type}`)

	$('#modalConfirm .message').html(message.replaceAll('\n','<br>'))
	
	$('#modalConfirm').modal('show')
	
	$('#modalConfirm').on('hidden.bs.modal', function (e) {
		$('#modalConfirm').unbind('hidden.bs.modal')
		if(cb)
			cb(confirmX_response)
	})
	$('#modalConfirmOk').on('click', function (e) {
		$('#modalConfirmOk').unbind('click')
		confirmX_response=true
		$('#modalConfirm').modal('hide')
	})
}
	// $('input').keypress(function(e) {
	// 	if(e.keyCode == 13){
	// 		$(this).next('input').focus()
	// 		e.preventDefault()
	// 	}
	// })



	function alertX(message, title='', type='info',cb){
		var icon='fas fa-exclamation-triangle'
		if(typeof title=='function'){
			cb=title
			title=''
			type='info'
		}else if(typeof type=='function'){
			cb=type
			type='info'
		}
		$('#modalMessageHeader').removeClass('alert-warning')
		$('#modalMessageHeader').removeClass('alert-info')
		$('#modalMessageHeader').removeClass('alert-danger')

		switch(type){
			case 'danger':
			icon='fas fa-skull-crossbones'
			$('#modalMessageHeader').addClass('alert-danger')
			break
			case 'warning':
			icon='fas fa-exclamation-triangle'
			$('#modalMessageHeader').addClass('alert-warning')
			break
			default:
			icon='fas fa-info-circle'
			$('#modalMessageHeader').addClass('alert-info')
			break
		}
		title=`<i class="${icon}"></i> ${title}`
		$('#modalMessageLabel').html(title)

		$('#modalMessage .modal-body').html(`${message.replaceAll('\n','<br>')}`)
		
		$('#modalMessage').modal('show')
		$('#modalMessage').on('hidden.bs.modal', function (e) {
			if(cb)
				cb('ok')
		})
	}



