/*
 * 确认支付订单
 */
$(function() {
  var wechatServerUrl = $('#wechatServerUrl').val(),
      appId = $("#appId").val(),
      openid = $("#openid").val(),
      totalFee = parseFloat($("#totalFee").val()),
      giftCardPrice = parseFloat($("#giftCardPrice").val()),
      couponPrice = parseFloat($("#couponPrice").val()),
      useGreeniconPrice = parseFloat($("#useGreeniconPrice").val()),
      serialNumber = $("#serialNumber").length ? $("#serialNumber").val() : '',
      orderNo = $("#orderNo").length ? $("#orderNo").val() : '',
      template = $("#template").val(),
      rechargeCardPrice = parseFloat($('#rechargeCardPrice').val()),
      notifyUrl = $("#notifyUrl").val(),
      body = $("#body").val(),
      payBtn = $('#payBtn'),
      orderActivityId = $('#orderActivityId'),
      giftCardNo = $('#giftCardNo').val(),
      rechargeCardNo = $('#rechargeCardNo').val(),
      couponId = $('#couponId').val();

  //微信JSSDK
  $.ajax({
    url: wechatServerUrl + 'pay/jsconfig',
    type: 'GET',
    dataType: 'jsonp',
    data: {
      appId: appId,
      url: window.location.href.split('#')[0]
    },
    success: function(result) {
      jsConfig = result;
      jsConfig.debug = false;
      wx.config(jsConfig);
    },
    error: function() {
      console.log("error");
    }
  });

  //点击微信支付按钮触发
  payBtn.click(function() {window.location.href = "/order/paySuccess?template=" + template;
    //只能点击一次
    if (payBtn.attr("disabled") == "disabled") return;
    payBtn.attr("disabled", true);
    //alert("totalFee="+totalFee+"---rechargeCardNo="+rechargeCardNo+"---rechargeCardPrice="+rechargeCardPrice);
    //流水号不为空，根据流水号支付
    if (!!serialNumber) orderNo = serialNumber;

    if (totalFee == 0 && ((giftCardNo!=null&&giftCardNo!=''&&giftCardPrice >= 0) || (couponId!=null&&couponId!=0&&couponPrice >= 0) || (rechargeCardNo!=null&&rechargeCardNo!=''&&rechargeCardPrice >= 0) || (useGreeniconPrice!=''&&useGreeniconPrice >= 0))) { //使用优惠（礼品卡、优惠券、充值卡）支付，包括零元购
      $.ajax({
        url: '/pay/weixin/otherPay',
        type: 'post',
        dataType: 'json',
        data: {
          appId: appId,
          openid: openid,
          totalFee: totalFee,
          giftCardPrice: giftCardPrice,
          couponPrice: couponPrice,
          rechargeCardPrice: rechargeCardPrice,
          orderNo: orderNo
        },
        success: function(result) {
          if (result.success) {
            if (orderActivityId.length > 0) {
              window.location.href = "/order/success?orderActivityId=" + orderActivityId.val() + "&template=" + template;
            } else {
              window.location.href = "/order/success?template=" + template;
            }
          } else {
            alert(result.message);
            if (result.code == 9903) {
              window.location.href = "/user/center?template=" + template;
            } else {
              //alert("您的订单支付所选礼品卡已发生变动，请返回商城重新挑选商品。");
              window.location.href = "/index?template=" + template;
            }
          }
        }
      });
    } else {
      $.ajax({
        url: '/pay/weixin/verifyOrderStatus',
        type: 'post',
        dataType: 'json',
        data: {
          appId: appId,
          openid: openid,
          orderNo: orderNo
        },
        success: function(result) {
          if (!result.success) {
            alert(result.message);
            if (result.code == 9903) {
              window.location.href = "/user/center?template=" + template;
            }
            return;
          }
        }
      });

      $.ajax({
        url: wechatServerUrl + 'pay/prepay',
        type: 'GET',
        dataType: 'jsonp',
        data: {
          appId: appId,
          openid: openid,
          totalFee: totalFee,
          orderNo: orderNo,
          notifyUrl: notifyUrl,
          body: body
        },
        success: function(result) {
          var url = '/user/center';
          if (template.length) {
            url += '?template=' + template;
          }
          if (result.success == false) {
            window.location.href = url;
          } else {
            payBtn.attr("disabled", true);
            wx.chooseWXPay({
              timestamp: result.timeStamp,
              nonceStr: result.nonceStr,
              package: result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: result.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: result.paySign,
              success: function(res) {
                //页面跳转
                var appId = $("#wechat_appId").val() + "";
                appId = parseInt(appId);

                if (orderActivityId.length > 0) {
                  //window.location.href=$("#grouponLink").val();
                  window.location.href = "/order/success?orderActivityId=" + orderActivityId.val() + "&template=" + template;
                } else {
                  //跳转到支付成功页面
                  window.location.href = "/order/success?template=" + template;
                }

                //chenlu 2016/7/5 注释掉抽奖代码
                /*var userId = $('#userId').val();
                if(appId == 1 || appId == 5 || appId == 9){
                  //页面跳转
                  if(confirm("恭喜，您获得一次抽奖机会,去抽奖？")){
                  window.location.href = "/activity/lottery?user_id="+userId+"&template="+template;
                }else{
                  window.location.href=url;//跳转到首页,此处为test
                };
                }else{*/
                //window.location.href=url;//跳转到首页,此处为test
                //}
              }
            });
          }
        },
        error: function() {
          console.log("error");
        }
      });
    }

  });
});
