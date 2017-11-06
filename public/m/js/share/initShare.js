/**
 * 配置微信，获取签名等
 * 页面完全加载完成后调用，预防DOM加载完成但src未加载完成时分享页面异常
 */
/**
 * 分析成功回调奖励绿币
 */
function rewardGreen(){
	var appId = $("#appId").val();
	var pathname = window.location.pathname;
	var params = {"appId":appId,"pathname":pathname};
	var pathUrl = window.location.origin;
	$.post(pathUrl+"/greencoin/reward",params,function(res){
		//alert(res.message);
		console.log(res.message);
	});
}

$(window).load(function() {
  var wechatServerUrl = $('#wechatServerUrl').val();
  $.ajax({
    url: wechatServerUrl + 'pay/jsconfig',
    type: 'GET',
    dataType: 'jsonp',
    data: {
      appId: $("#appId").val(), //$("#appId").val()
      url: location.href.split('#')[0]
    },
    success: function(result) {
      jsConfig = result;
      jsConfig.debug = false;
      wx.config(jsConfig);
      var title = $("#title").val();
      var desc = "";
      var link = $("#link").val();
      var imgUrl = $("#imgUrl").val();
      wx.ready(function() {
        shareProduct(title, desc, link, imgUrl);
      });
    },
    error: function() {
      console.log("error");
    }
  });
  //rewardGreen();
});

/**
 * 
 * @param title 分享标题
 * @param desc 分享描述
 * @param link 分享链接
 * @param imgUrl 分享图标
 */
function shareProduct(title, desc, link, imgUrl) {
  desc = "邦邦购，安心食品生活平台";
  //alert("请点击微信自带分享");
  //发送给朋友
  wx.onMenuShareAppMessage({
    title: title,
    desc: desc,
    link: link,
    imgUrl: imgUrl,
    trigger: function(res) {
      //          alert('用户点击发送给朋友');
    },
    success: function(res) {
      rewardGreen();
      $(".share-icon").hide();
      //alert('已分享');
    },
    cancel: function(res) {
      $(".share-icon").hide();
      //alert('已取消');
    },
    fail: function(res) {
      alert(JSON.stringify(res));
    }
  });

  //分享到朋友圈
  wx.onMenuShareTimeline({
    title: title,
    link: link,
    imgUrl: imgUrl,
    trigger: function(res) {
      //          alert('用户点击分享到朋友圈');
    },
    success: function(res) {
      rewardGreen();
      $(".share-icon").hide();
      //alert('已分享');
    },
    cancel: function(res) {
      $(".share-icon").hide();
      //alert('已取消');
    },
    fail: function(res) {
      alert(JSON.stringify(res));
    }
  });
  //分享到手机QQ
  wx.onMenuShareQQ({
    title: title,
    desc: desc,
    link: link,
    imgUrl: imgUrl,
    success: function() {
      rewardGreen();
      $(".share-icon").hide();
      // 用户确认分享后执行的回调函数
    },
    cancel: function() {
      $(".share-icon").hide();
      // 用户取消分享后执行的回调函数
    }
  });
}

