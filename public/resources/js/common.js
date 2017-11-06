// JavaScript Document
//为了解决alert在ios版微信中显示url的问题
var isIPhone = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
if (isIPhone) {
  window.alert = function(name) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
  };
}

function orient(){
    if (window.orientation == 0 || window.orientation == 180) {
        $("body").attr("class", "portrait");
        orientation = 'portrait';
        return false;
    }
    else if (window.orientation == 90 || window.orientation == -90) {
        $("body").attr("class", "landscape");
        orientation = 'landscape';
        return false;
    }
}

/* 在用户变化屏幕显示方向的时候调用*/
$(window).bind( 'orientationchange', function(e){
    orient();
	$(window).resize();
});

/* 版权*/
$(window).resize(function(){
	var winH = $(window).height();
	var conH = $(document.body).height();
	var currH = winH>=conH ? winH : conH;

	if(winH>=conH){ //底部有导航
		$(".copyright1").css({'position':'absolute','left':'0','top':currH-90+"px"});
	}else {
		$(".copyright1").css({'position':'static'});
	}
	$(".copyright2").css('top',winH - $(".copyright2").height()+"px"); //底部没有导航
	//alert("winH="+winH + "————" + "conH="+conH + "————" + "currH="+currH)
});


$(function(){
	orient();
	$(window).resize();

	var winH = $(window).height();
	var conH = $(document.body).height();
	var currH = winH>=conH ? winH : conH;

	if(winH>=conH){ //底部有导航
		$(".copyright1").css({'position':'absolute','left':'0','top':currH-90+"px"});
	}else {
		$(".copyright1").css({'position':'static'});
	}
	$(".copyright2").css('top',winH - $(".copyright2").height()+"px"); //底部没有导航

	$(".list2 li img").css('height',$('.list2 li img').width()+"px");

	$(".search_result2").height($(window).height()-160+"px");

	//弹出框
	$(".showPopup").click(function(){
		$(".popup").show();
		$(".popup_bg").show();
	});
	$(".hidePopup").click(function(){
		$(".popup").hide();
		$(".popup_bg").hide();
		$(".addCart").hide();
	});
	$(".popup_bg").click(function(){
		$(".popup").hide();
		$(".popup_bg").hide();
		$(".subNav").hide();
		$(".sortNav").hide();
		$(".addCart").hide();
	});


	//快捷入口
	$(".icon_sub").click(function(){
		$(".subNav").slideDown("fast");
		$('.popup_bg').show();
		$('.fundsNav').hide();
		$('.searchNav').hide();
    });
	$(".icon_sort").click(function(){
		$(".subNav").slideDown("fast");
		$('.popup_bg').show();
    });


	//判断底部菜单的个数
	if($(".foot li").length==1){
		$(".foot li").css("width","100%");
	}else if($(".foot li").length==2){
		$(".foot li").css("width","50%");
	}else if($(".foot li").length==3){
		$(".foot li").css("width","33.333333%");
	}else if($(".foot li").length==4){
		$(".foot li").css("width","25%");
	}else if($(".foot li").length==5){
		$(".foot li").css("width","20%");
	}

	if($(".foot3 li").length==2){
		$(".foot3 li").css("width","49%");
	}else if($(".foot3 li").length==3){
		$(".foot3 li").css("width","32%");
	}

	//师徒关系
	if($(".manage_nav li").length==2){
		$(".manage_nav li").css("width","48%");
	}else if($(".manage_nav li").length==3){
		$(".manage_nav li").css("width","30.666666%");
	}

	//隐藏筛选后li的宽度
	if($(".screening_nav li").length==4){
		$(".screening_nav li").css("width","25%");
	}

	if($(".personState li").length==4){
		$(".personState li").css("width","25%");
	}

	//tab
	$(".tab_nav li").click(function(){
		var index = $(this).index();
		$(this).addClass("sort_cur").siblings().removeClass();
		$(this).addClass("detail_cur").siblings().removeClass();
		$(this).addClass("manage_cur").siblings().removeClass();
		$(".tab_con > div").hide().eq(index).show();

		var winH = $(window).height()-151;
		var currDiv = $(".sort_con > div").hide().eq(index);
		$(currDiv).height(currDiv.height()>=winH ? currDiv.height() : winH);
		$(".sort_nav").height($(".sort_nav").height() > currDiv.height() ? $(".sort_nav").height() : currDiv.height());
		currDiv.show();
    });

	//tab切换（详情页）
	$(".comment_nav1 li").click(function(){
		var index = $(this).index();
		$(this).addClass("comment_cur1").siblings().removeClass();
		$(".comment_con > div").hide().eq(index).show();
    });

	//checkBox/radioBox
	$(".checkStyle").change(function(){
		if($(this).is(":checked")){
			$(this).next("label").addClass("checkSelected");
		}else{
			$(this).next("label").removeClass("checkSelected");
		}
	});
	$(".radioStyle").change(function(){
		if($(this).is(":checked")){
			$(".radioSelected:not(:checked)").removeClass("radioSelected");
			$(this).next("label").addClass("radioSelected");
		}
	});

	//select
	$(".select input").click(function(){
		var index = $(this).index();
		$(this).addClass("selectCur").siblings().removeClass();
    });

	//screening
	$(".screening dd").click(function(){
		var index = $(this).index();
		$(this).addClass("screeningCur").siblings().removeClass();
    });

	//backToTop
	$(function(){
		$(window).scroll(function(){
			if($(window).scrollTop()>100){
				$(".backToTop").fadeIn(100);
			}
			else {
				$(".backToTop").fadeOut(100);
			}
		});
		$(".backToTop").click(function(){
			$('body,html').animate({scrollTop:0},0);
			return false;
		});
	});
});


//select
jQuery.select = function(selectid,inputselectid){
	var inputselect = $(inputselectid);
	for(var i=0; i<10; i++){
		var selectid = i++;
		$(selectid + i +" cite").click(function(){
			var ul = $(selectid+" ul");
			if(ul.css("display")=="none"){
				ul.slideDown("fast");
			}else {
				ul.slideUp("fast");
			}
		});
	}

	$(selectid+" ul li a").click(function(){
		var txt = $(this).text();
		$(selectid+" cite").html(txt);
		var value = $(this).attr("selectid");
		$(".inputselect").val(value);
		$(selectid+" ul").hide();
	});
	$(document).click(function(){
		$(selectid+" ul").hide();
	});
};

jQuery.fn.center = function(loaded) {
	var obj = this;
	body_width = parseInt($(window).width());
	body_height = parseInt($(window).height());
	block_width = parseInt(obj.width());
	block_height = parseInt(obj.height());

	left_position = parseInt((body_width/2) - (block_width/2)  + $(window).scrollLeft());
	if (body_width<block_width) { left_position = 0 + $(window).scrollLeft(); };

	top_position = parseInt((body_height/2) - (block_height/2) + $(window).scrollTop());
	if (body_height<block_height) { top_position = 0 + $(window).scrollTop(); };

	if(!loaded) {
		obj.css({'position': 'absolute'});
		obj.css({ 'top': top_position, 'left': left_position });
		$(window).bind('resize', function() {
			obj.center(!loaded);
		});

		$(window).bind('scroll', function() {
			obj.center(!loaded);
		});
	} else {
		obj.stop();
		obj.css({'position': 'absolute'});
		obj.animate({ 'top': top_position }, 200, 'linear');
	}
}
