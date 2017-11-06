$(function(){/*
var tabNav=$(".comment_nav li");
	
	var rateType=$("#rate_type").val();
	var xsStoreId=$("#xs_store_id").val();
	//tab
	tabNav.click(function(){
		var index = $(this).index();
		var userId=$("#user_id").val();
		if(null==xsStoreId){
			xsStoreId="";
		}
		if(index==0){
			index=1;
		}else if(index==1){
			index=2;		
		}
		else if(index==2){
			index=3;
		}
		location.href="/user/comment?userId="+userId+"&xsStoreId="+xsStoreId+"&rateType="+index;
		
		$(this).addClass("detail_cur").siblings().removeClass(); //详情
		$(this).addClass("productSort_cur").siblings().removeClass(); //商城
		$(this).addClass("storeManage_cur").siblings().removeClass();
		$(this).addClass("personTab_cur").siblings().removeClass(); //用户中心
		$(".tab_con > div").hide().eq(index).show();
    });
	
	
	//切换中心
	$(".icon_back").click(function(){
		console.log(xsStoreId);
		if(null!=xsStoreId && ''!= xsStoreId && undefined!=xsStoreId){
			location.href="/user/center";
		}else{
			location.href="/user/user";
		}
	});
*/});	
