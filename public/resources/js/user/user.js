var user={};

//请求各种订单
var findOdrder=function(begType,status){
	/*var priceModifyStatus="";
	if(status==99){
		priceModifyStatus=1;
	}*/
	if(null==begType || ''==begType){
		begType=1;
	}
	var template = $("#template").val();
	if(template!=null){
		location.href="/order/findFrontOrders?begType="+begType+"&orderStatus="+status+"&template="+template;
	}else{
		location.href="/order/findFrontOrders?begType="+begType+"&orderStatus="+status;
	}
};

//评价请求列表
//var showRateList=function(xsStoreId){
//	var userId=$("#user_id").val();
//	location.href="/user/comment?userId="+userId+"&xsStoreId="+xsStoreId+"&rateType=1";
//};
//删除游览记录
var removeVisit=function(id){
	var template = $("#template").val();
	$.ajax({
        url: "/user/removeVisit",
        data: {id:id,template:$('#template').val()},
        cache : false, 
        async : true,
        type : "POST",
        success : function (result){
	       	 if(result.success){
	       		if(template!=null){
	       			location.href="/user/center?template="+template;
	       		}else{
	       			location.href="/user/center";
	       		}
	       	 }else{
	       		 alert("code:"+result.code+" message:"+result.message);
	       	 }
        }
     });
};

user.showStore=function(){
	var storeId=$("#store_id").val();
	var template = $("#template").val();
	if(template!=null){
		location.href="/user/manageStore?storeId="+storeId+"&template="+template;
	}else{
		location.href="/user/manageStore?storeId="+storeId;
	}
};

user.saveStore=function(){
	var template = $("#template").val();
	var	storeId=$("#store_id").val();
	var storeName=$("input[name=store_name]").val();
	var storeSeoDescription=$("textarea[name=store_seoDescription]").val();
	var notice=$("input[name=store_notice]").val();
	var isShowExfactoryPrice=$("#checkbox").is(':checked');
	var storeLog=$("#preview").attr("src");
	$.ajax({
        url: "/user/saveStore",
        data: {
        		storeId:storeId,
        		storeName:storeName,
        		storeSeoDescription:storeSeoDescription,
        		notice:notice,
        		isShowExfactoryPrice:isShowExfactoryPrice,
        		storeLog:storeLog,
        		template:template
        	},
        cache : false, 
        async : true,
        type : "POST",
        success : function (result){
	       	 if(result.success){
	       		if(template!=null){
	       			location.href="/user/center?template="+template;
	       		}else{
	       			location.href="/user/center";
	       		}
	       	 }else{
	       		 alert("code:"+result.code+" message:"+result.message);
	       	 }
        }
    });
};
//设置个人资料信息
var setUser=function(){
	var template = $("#template").val();
//	var	mobile=$("input[name=mobiles]").val();
	var contactName=$("input[name=contact_name]").val();
	var companyName=$("input[name=company_name]").val();
	$.ajax({
        url: "/user/setUser",
        data: {
//        		mobile:mobile,
        		contactName:contactName,
        		companyName:companyName,
        		template:template
        },
        cache : false, 
        async : true,
        type : "POST",
        success : function (result){
        	console.log(result);
       	 if(result.success){
       		if(template!=null){
       			location.href="/user/center?template="+template;
       		}else{
       			location.href="/user/center";
       		}
       	 }else{
       		 alert("code:"+result.code+" message:"+result.message);
       	 }
        }
    });
};
var goBindind=function(){
	var template = $("#template").val();
	location.href="/safe/bind_phone?template="+template;
}
