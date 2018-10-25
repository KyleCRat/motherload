$(function() {
  $("aside").css("left","-325px");

  $("#asideNav, #asideText").toggle(function() {       
      $('aside').animate({ left: '0' }, 500);
  }, function() {       
      $('aside').animate({ left: '-325' }, 500);
  });
});

$(function(){
	$.extend($.fn.disableTextSelect = function() {
		return this.each(function(){
			if($.browser.mozilla){//Firefox
				$(this).css('MozUserSelect','none');
			}else if($.browser.msie){//IE
				$(this).bind('selectstart',function(){return false;});
			}else{//Opera, etc.
				$(this).mousedown(function(){return false;});
			}
		});
	});
	$('.noSelect').disableTextSelect();//No text selection on elements with a class of 'noSelect'
});