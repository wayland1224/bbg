var template = $('#template').val(),
    orderStatus = $("#order_status").val(),//获取订单状态
    begType = $("#beg_type").val();//请求类型

$(function() {
  //从去评价返回时刷新页面
  if (sessionStorage.getItem('findFrontOrdersReload')) {
    sessionStorage.removeItem('findFrontOrdersReload');
    location.href = "/order/findFrontOrders?orderStatus=" + orderStatus + "&begType=" + begType + "&template=" + template;
  }

  $('header .search').on('blur','input',function () {
      $(this).next().hide();
      $(this).siblings('span').show();
      var conditions=$(".search-txt").val();
    location.href="/order/findFrontOrders?orderStatus="+orderStatus+"&begType="+begType+"&conditions="+conditions+"&template="+template;
    }).on('focus','input',function () {
      $(this).next().show();
      $(this).siblings('span').hide();
    });

  var lis, len;
  //获取li元素
  lis = $(".screening_nav ul li");
  //设置li的样式
  len = lis.length;
  if(len == 4) {
    $(".screening_nav li").css("width", "25%");
  }
  //订单状态切换
  lis.click(function() {
    var index = $(this).index();
    var conditions = $("#orderGoodsName").val();
    location.href = "/order/findFrontOrders?orderStatus=" + index + "&begType=" + begType + "&conditions=" + conditions + "&template=" + template;
  });

  //添加样式
  $(lis[orderStatus]).addClass("screening_cur").siblings().removeClass();
  $("#pay1").click(function() {
    $("#pay_style").val(1);
  });
  $("#pay2").click(function() {
    $("#pay_style").val(2);
  });

  $("#delivery1").click(function() {
    $("#takeType").val(1);
  });
  $("#delivery2").click(function() {
    $("#takeType").val(2);
  });


  //加载更多订单
  var page = parseInt($('.load-more .page').val());
  var pageSize = parseInt($('.load-more .pageSize').val());
  var total = parseInt($('.load-more .total').val());
  $('.load-more span').click(function() {
    //var userType = $("#user_type").val(); //未使用
    var conditions = $("#orderGoodsName").val();
//    var state = history.state;
//    state.nextPage = true;
//    history.replaceState(state, 'title', '');
    sessionStorage.myOrder_Status = orderStatus;
    if(total - pageSize * page <= 0) {
        $('.load-more').hide();
        $('.no-more').removeClass('no-more');
        return;
      };
    $.post('/order/loadMore', {
      'orderStatus': orderStatus,
      'begType': begType,
      'conditions': conditions,
      'start': page + 1,
      'limit': pageSize,
      'template': template
    }, function(response) {
      page = page + 1;
      $('#page').val(page);
      total = response.total;
      var list = response.list;
      console.log('第'+page +'页');
      sessionStorage['myOrder_Status-' + orderStatus + '_List-' + page] = JSON.stringify(list);//存储sessionStorage
      for(var i = 0; i < list.length; i++) {
        var html = "<ul class=\"ul-orderlist\">"
                 + "<li>"
                 + "<div class='title'>"
                 + "<a class=\"but_back\">";

        if(null != list[i].salesOutlets && begType != 2) {
          html += list[i].salesOutlets;
        } else {
          html += list[i].orderno;
        }

        html += "</a>"
              + "<span class='tip'>";
        if(list[i].orderStatus == 1) {
          html += "等待买家付款";
        } else if(list[i].orderStatus == 2 && list[i].priceModifyStatus == 1) {
          html += "等待卖家确认";
        } else if(list[i].orderStatus == 2 && list[i].priceModifyStatus != 1) {
          html += "买家已付款";
        } else if(list[i].orderStatus == 3) {
          html += "卖家已发货";
        } else if(list[i].orderStatus == 4) {
          html += "交易成功";
        } else if(list[i].orderStatus == 5) {
          html += "交易关闭";
        } else if(list[i].orderStatus == 6) {
          html += "卖家已退款";
        } else {
          html += "订单错误";
        }
        html += "</span>"
              + "</div>"
              + "<ul>";

        var goodsNum = 0;
        for(var j = 0; j < list[i].frontOrderGoodsView.length; j++) {
          html += "<li class='goods_list'>"
                + "<a href='javascript:goDetail(" + list[i].id + ");'>"
                + "<div class='goods_detail'>"
                + "<img class='fl-l' src='" + list[i].frontOrderGoodsView[j].goodsPicurl + "'>"
                + "<div class='goods_des'>"
                + "<p class='goods_name line-clamp'>"
                + "<span>" + list[i].frontOrderGoodsView[j].goodsName + "</span>"
                + "</p>"
                + "<p class='sku_des'>";
          if(null != list[i].frontOrderGoodsView[j].skupropertys) {
            html += "<span>" + list[i].frontOrderGoodsView[j].skupropertys + "</span>";
          }
          html += "</p>"
                + "<p class='sku_price'><em class=\"yuan\">&#165;</em><span>" + list[i].frontOrderGoodsView[j].goodsPrice.toFixed(2) + "</span><span class='count'>×<span>" + list[i].frontOrderGoodsView[j].quantity + "</span></span></p>"
                + "</div>"
                + "</div>"
                + "</a>"
                + "</li>";
          goodsNum = goodsNum + list[i].frontOrderGoodsView[j].quantity;
        }
        html += "</ul>"
              + "<p class='order_obj'>共<span>" + goodsNum + "</span>件商品&nbsp;&nbsp;合计：<em class=\"yuan\">&#165;</em><span><strong class='total_price'>" + list[i].totalPrice.toFixed(2) + "</strong>&nbsp;";
        if(list[i].postage != null && list[i].postage > 0) {
          html += "(</span>含运费<em class=\"yuan\">&#165;</em><span>" + list[i].postage.toFixed(2) + "</span>)</p>";
        } else {
          html += "(</span>含运费<em class=\"yuan\">&#165;</em><span>0.00</span>)</p>";
        }

        html += "<p class='but_handle clear'>";
        if(list[i].orderStatus == 1 && begType == 1) {
          html += "<a href='javascript:setOrderStatus(" + list[i].id + ",\"status\",5)'>取消订单</a>"
                + "<a class='theme-col fl-r' href='javascript:goPayment(\"" + list[i].orderno + "\"," + list[i].realPayment + ")'>去支付</a></p>";
        }
        if(list[i].orderStatus == 3 && begType == 1) {
          html += "<a href='javascript:getLogistics(" + list[i].id + ")'>查看物流</a>"
                + "<a class='theme-col fl-r confirmReceipt' href='javascript:setOrderStatus(" + list[i].id + ",\"status\",4)'>确认收货</a></p>";
        }
        if(list[i].orderStatus == 4 && begType == 1 && !list[i].israte) {
          html += "<a href='javascript:getLogistics(" + list[i].id + ")'>查看物流</a>"
                + "<a class='theme-col fl-r goComment' href='javascript:goComment(" + list[i].id + ")'>去评价</a></p>";
        }
        if(list[i].orderStatus == 5 && begType == 1) {
          html += "<a href='javascript:setOrderStatus(" + list[i].id + ",\"isRemove\",1)'>删除订单</a></p>";
        }
        html += "</li>"
              + "</ul>";
        $('.ul-orderlist:last').after(html);
      }
      if(total - pageSize * page <= 0) {
        $('.load-more').hide();
        $('.foot-tips').removeClass('no-more');
      };
    });
  });


  $(".list").each(function(i, div) {
    $(div).find("em").click(function(i, em) {
      var index = $(this).index();
      var score = $(div).find("input[name=goods_score]").val();
      if(score <= index) {
        if(index == 0) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
        }
        if(index == 1) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
          $(emlist[1]).addClass("starCur");
        }
        if(index == 2) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
          $(emlist[1]).addClass("starCur");
          $(emlist[2]).addClass("starCur");
        }
        if(index == 3) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
          $(emlist[1]).addClass("starCur");
          $(emlist[2]).addClass("starCur");
          $(emlist[3]).addClass("starCur");
        }
        if(index == 4) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
          $(emlist[1]).addClass("starCur");
          $(emlist[2]).addClass("starCur");
          $(emlist[3]).addClass("starCur");
          $(emlist[4]).addClass("starCur");
        }
      } else {
        if(index == 3) {
          var emlist = $(div).find("em");
          $(emlist[4]).removeClass("starCur");
        }
        if(index == 2) {
          var emlist = $(div).find("em");
          $(emlist[3]).removeClass("starCur");
          $(emlist[4]).removeClass("starCur");
        }
        if(index == 1) {
          var emlist = $(div).find("em");
          $(emlist[2]).removeClass("starCur");
          $(emlist[3]).removeClass("starCur");
          $(emlist[4]).removeClass("starCur");
        }
        if(index == 0) {
          var emlist = $(div).find("em");
          $(emlist[1]).removeClass("starCur");
          $(emlist[2]).removeClass("starCur");
          $(emlist[3]).removeClass("starCur");
          $(emlist[4]).removeClass("starCur");
        }
      }

      $(div).find("input[name=goods_score]").attr("value", index);
    });
  });

  //数量减
  $('.numReduce').click(function() {
    var index = $(this).attr("index");
    var attr = new Array();
    attr = index.split(':');
    var storeIndex = attr[0];
    var logisticsIndex = attr[1];
    var cartIndex = attr[2];

    var ids = $(this).attr("var");
    attr = new Array();
    attr = ids.split(':');
    var store_user_id = attr[0];
    var store_id = attr[1];
    var goods_id = attr[2];
    var sku_id = attr[3];
    var activity_goods_limit_id = attr[4];

    var buyCount = $(".storeId:eq(" + storeIndex + ") .logisticsList:eq(" + logisticsIndex + ") .numBuy:eq(" + cartIndex + ")").val();

    //购买数量必须是正整数
    var type = /^[0-9]*[1-9][0-9]*$/;
    var re = new RegExp(type);
    if(buyCount.match(re) == null) {
      alert("购买数量必须是大于零的整数!");
      return;
    }

    if(parseInt(buyCount) != 1) {
      $.post('/cart/cartPayGoodsCount', {
        goodsId: goods_id,
        numBuy: (parseInt(buyCount) - 1),
        activityGoodsLimitId: activity_goods_limit_id,
        skuId: sku_id
      }, function(response) { //此处是和购物车中的对比，每次加1
        console.log(response);
        if(!response.success) {
          alert(response.message);
          return;
        } else {
          $(".storeId:eq(" + storeIndex + ") .logisticsList:eq(" + logisticsIndex + ") .numBuy:eq(" + cartIndex + ")").val(buyCount - 1);
          dosubmit("/cart/minusCartGoods", store_user_id, store_id, goods_id, sku_id, $("#source").val());
        }
      });
    }
  });

  //数量加
  $('.numAdd').click(function() {
    var index = $(this).attr("index");
    var attr = new Array();
    attr = index.split(':');
    var storeIndex = attr[0];
    var logisticsIndex = attr[1];
    var cartIndex = attr[2];

    var ids = $(this).attr("var");
    attr = new Array();
    attr = ids.split(':');
    var store_user_id = attr[0];
    var store_id = attr[1];
    var goods_id = attr[2];
    var sku_id = attr[3];
    var activity_goods_limit_id = attr[4];

    var buyCount = $(".storeId:eq(" + storeIndex + ") .logisticsList:eq(" + logisticsIndex + ") .numBuy:eq(" + cartIndex + ")").val();
    var quantity = $(".storeId:eq(" + storeIndex + ") .logisticsList:eq(" + logisticsIndex + ") .quantity:eq(" + cartIndex + ")").val();

    var type = /^[0-9]*[1-9][0-9]*$/;
    var re = new RegExp(type);

    if(buyCount.match(re) == null) {
      alert("购买数量必须是大于零的整数!");
      return;
    }

    if(parseInt(quantity) <= parseInt(buyCount)) {
      alert("库存没有这么多呢~!");
      return;
    }

    $.post('/cart/cartPayGoodsCount', {
      goodsId: goods_id,
      numBuy: (parseInt(buyCount) + 1),
      activityGoodsLimitId: activity_goods_limit_id,
      skuId: sku_id
    }, function(response) { //此处是和购物车中的对比，每次加1
      console.log(response);
      if(!response.success) {
        alert(response.message);
        return;
      } else {
        $(".storeId:eq(" + storeIndex + ") .logisticsList:eq(" + logisticsIndex + ") .numBuy:eq(" + cartIndex + ")").val(parseInt(buyCount) + 1);
        dosubmit("/cart/increaseCartGoods", store_user_id, store_id, goods_id, sku_id, $("#source").val());
      }
    });

  });

  var pageCount = $("#pageCount").val();
  if(pageCount != null && pageCount > 1) {
    for(var i = 0; i < (pageCount - 1); i++) {
      $(".load-more a").click();
    }
  }

  //选择快递
  $('.transport-pop').on('click', '.icon', function() {
    $('.transport-pop .icon').removeClass('select');
    $(this).addClass('select');
  });

  //选择配送方式
  $(".transport").click(function() {
    var index = $(this).attr("index");
    var attr = new Array();
    attr = index.split(':');
    var storeIndex = attr[0];
    var logisticsIndex = attr[1];

    var id = $(this).attr("var");

    var postageLogisticsId = $(".storeId:eq(" + storeIndex + ") .postageLogisticsId:eq(" + logisticsIndex + ")").val();

    $(".storeList dd").removeClass("current");
    $(".storeList:eq(" + storeIndex + ") .transport-pop:eq(" + logisticsIndex + ")").find("dd[name=chk_" + postageLogisticsId + "]").addClass("current");
    $(".storeList span").removeClass("select");
    $(".storeList:eq(" + storeIndex + ") .transport-pop:eq(" + logisticsIndex + ")").find("dd[name=chk_" + postageLogisticsId + "] span:eq(0)").addClass("select");

    $("#hidIndex").val(index);
    $("#hidParams").val(id);
    $(".storeList:eq(" + storeIndex + ")").show();
    $(".storeList:eq(" + storeIndex + ") .transport-pop:eq(" + logisticsIndex + ")").show();
  });

  $(".confirm-btn").click(function() {
    var index = $("#hidIndex").val();
    var attr = new Array();
    attr = index.split(':');
    var storeIndex = attr[0];
    var logisticsIndex = attr[1];

    var template = $("#template").val();
    var source = $("#source").val();
    var postageLogisticsId = $(".storeList:eq(" + storeIndex + ") .transport-pop:eq(" + logisticsIndex + ")").find(".select:eq(0)").attr("var");
    var postageLogisticsName = $(".storeList:eq(" + storeIndex + ") .transport-pop:eq(" + logisticsIndex + ")").find(".select").parent().text();

    var id = $("#hidParams").val();
    var city = $("#receiveCity").val();

    if(source != 1) {
      source = 0;
    }

    $.post("/cart/setPostageLogisticsId", {
      'id': id,
      'postageLogisticsId': postageLogisticsId,
      'postageLogisticsName': postageLogisticsName,
      'city': city,
      'source': source,
      'template': template
    }, function(result) {
      if(result.success) {
        var addressId = $("#addressId").val();
        var html = "/order/buynow?template=" + template + "&source=" + source;

        if(addressId != "") {
          html += "&addressId=" + addressId;
        }

        location.href = html;
      } else {
        alert(result.message);
      }
    });
  });

  //配送选择
  $('.panel_box label').click(function() {
    var radioId = $(this).attr("name");
    $("label").removeAttr("class") && $(this).attr("class", "checked");
    $("input[type='radio']").removeAttr("checked") && $("#" + radioId).prop("checked", true);
  });
});

/**
 * 修改订单状态
 */
var setOrderStatus = function(orderId, temp, code) {
  var template = $('#template').val();
  var orderStatus, begType;
  orderStatus = $("#order_status").val();
  begType = $("#beg_type").val();

  if(temp == 'status' && code == 5) {
    var flag = window.confirm("你确定取消订单吗?");
    if(flag) {
      $.ajax({
        url: "/order/setOrderInfoOrderStatus",
        data: {
          status: code,
          id: orderId,
          template: template
        },
        cache: false,
        async: true,
        type: "POST",
        success: function(result) {
          if(result.success) {
            if(template != null) {
              location.href = "/order/findFrontOrders?orderStatus=" + orderStatus + "&begType=" + begType + "&template=" + template;
            } else {
              location.href = "/order/findFrontOrders?orderStatus=" + orderStatus + "&begType=" + begType;
            }
          } else {
            alert(result.message);
          }
        }
      });
    }
  }
  if(temp == 'status' && code == 4) {
    //var flag=window.confirm( "你确定收货吗?" );
    //if(flag){
    if (confirmReceiptIdx.attr('disabled') == 'disabled') return;
    confirmReceiptIdx.attr('disabled', true);
    $.ajax({
      url: "/order/setOrderInfoOrderStatus",
      data: {
        status: code,
        id: orderId,
        template: template
      },
      cache: false,
      async: true,
      type: "POST",
      success: function(result) {
        if(result.success) {
          if(template != null) {
            $(".pop .fl-l")[0].href = "/order/findFrontOrderInfo?orderId=" + orderId + "&begType=" + begType + "&template=" + template;
            
            if(typeof(result.map.success.tryStatus)!="undefined"&&result.map.success.tryStatus==6){
            	$(".pop .fl-r")[0].href = "/groupon/trialReport?orderId=" + orderId + "&template=" + template;
            	$(".pop .fl-r:eq(0)").html("上传试用报告");
            }else{
            	$(".pop .fl-r")[0].href = "/order/goComment?id=" + orderId + "&isRate=true&template=" + template;
            	$(".pop .fl-r:eq(0)").html("立即评价");
            }
          } else {
            $(".pop .fl-l")[0].href = "/order/findFrontOrderInfo?orderId=" + orderId + "&begType=" + begType;
            
            if(typeof(result.map.success.tryStatus)!="undefined"&&result.map.success.tryStatus==6){
            	$(".pop .fl-r")[0].href = "/groupon/trialReport?orderId=" + orderId;
            	$(".pop .fl-r:eq(0)").html("上传试用报告");
            }else{
            	$(".pop .fl-r")[0].href = "/order/goComment?id=" + orderId + "&isRate=true";
            	$(".pop .fl-r:eq(0)").html("立即评价");
            }
          }
          $('.cover').show();
          $('.pop').show();
        } else {
          alert(result.message);
          confirmReceiptIdx.attr('disabled', false);
        }
      }
    });
    //}
  }

  if(temp == 'isRemove' && code == 1) {
    var flag = window.confirm("你确定删除订单吗?");
    if(flag) {
      $.ajax({
        url: "/order/setOrderInfoOrderStatus",
        data: {
          isRemove: code,
          id: orderId,
          template: template
        },
        cache: false,
        async: true,
        type: "POST",
        success: function(result) {
          if(result.success) {
            //删除后跳回全部列表
            if(orderStatus == 5) {
              orderStatus = 0;
            }
            if(template != null) {
              location.href = "/order/findFrontOrders?orderStatus=" + orderStatus + "&begType=" + begType + "&template=" + template;
            } else {
              location.href = "/order/findFrontOrders?orderStatus=" + orderStatus + "&begType=" + begType;
            }
          } else {
            alert("code:" + result.code + " message:" + result.message);
          }
        }
      });
    }
  }
  if(temp == 'priceModifyStatus' && code == 2) {
    var flag = window.confirm("你确定订单,并同步给上级吗?");
    if(flag) {
      $.ajax({
        url: "/order/setOrderInfoOrderStatus",
        data: {
          priceModifyStatus: code,
          id: orderId,
          template: template
        },
        cache: false,
        async: true,
        type: "POST",
        success: function(result) {
          if(result.success) {
            if(template != null) {
              location.href = "/order/findFrontOrders?orderStatus=" + orderStatus + "&begType=" + begType + "&template=" + template;
            } else {
              location.href = "/order/findFrontOrders?orderStatus=" + orderStatus + "&begType=" + begType;
            }
          } else {
            alert("code:" + result.code + " message:" + result.message);
          }
        }
      });
    }
  }
};
//去支付
function goPayment(orderNo, totalFee) {
  var template = $('#template').val();
  if(template != null) {
    location.href = "/pay/weixin/index?showwxpaytitle=1&body=" + orderNo + "&orderNo=" + orderNo + "&totalFee=" + totalFee + "&template=" + template;
  } else {
    location.href = "/pay/weixin/index?showwxpaytitle=1&body=" + orderNo + "&orderNo=" + orderNo + "&totalFee=" + totalFee;
  }
};

//去评价
var goComment = function(orderId) {
  var template = $('#template').val();
  if(template != null) {
    location.href = "/order/goComment?id=" + orderId + "&isRate=true&template=" + template;
  } else {
    location.href = "/order/goComment?id=" + orderId + "&isRate=true";
  }
};

//上传试用报告
var goTrialReport = function(orderId) {
  var template = $('#template').val();
  if(template != null) {
    location.href = "/groupon/trialReport?orderId=" + orderId + "&template=" + template;
  } else {
    location.href = "/groupon/trialReport?orderId=" + orderId;
  }
};

//查看物流
var getLogistics = function(orderId) {
  var template = $('#template').val();
  if(template != null) {
    location.href = "/order/getLogistics?orderId=" + orderId + "&template=" + template;
  } else {
    location.href = "/order/getLogistics?orderId=" + orderId;
  }
};

//提交评价
var submitComment = function() {

  if($(".foot a:eq(0)").attr("disabled") == "disabled") {
    return;
  }

  $(".foot a:eq(0)").attr("disabled", true);

  var template = $('#template').val();
  var rate = [];
  var flag = true;

  $(".list").each(function(i, div) {
    var goodsId = $(div).find("input[name='goods_id']").val();
    var orderNo = $(div).find("input[name='order_no']").val();
    var rateNum = i + 1;
    var rateType = $(div).find("input[name=rate_type" + rateNum + "]:checked").val();
    var context = $(div).find("textarea[name='context']").val();
    var goods_score = $(div).find("input[name=goods_score]").val();
    if(goods_score == "-1") {
      $(".foot a:eq(0)").attr("disabled", false);
      alert("请给商品打分!");
      flag = false;
      return;
    }
    rate.push({
      "goodsId": goodsId,
      "orderNo": orderNo,
      "rateType": rateType,
      "context": context,
      "goodsScore": parseInt(goods_score) + 1
    });
  });

  var rates = JSON.stringify(rate);
  //所有参数正确进行提交
  if(flag) {
    $.ajax({
      url: "/order/saveRate",
      data: {
        rates: rates,
        template: template
      },
      cache: false,
      dataType: "json",
      async: true,
      type: "POST",
      success: function(result) {
        if(result.success) {
          if(template != null) {
            location.href = "/order/findFrontOrders?orderStatus=" + 4 + "&begType=" + 1 + "&template=" + template;
          } else {
            location.href = "/order/findFrontOrders?orderStatus=" + 4 + "&begType=" + 1;
          }
        } else {
          $(".foot a:eq(0)").attr("disabled", false);
          alert(result.message);
          location.href='/user/center?template=' + template;
        }
      }
    });
  }
};

//弹出发货界面
var goSendGoods = function(orderId, orderno) {
  $("#order_no").html(orderno);
  $("#order_id").val(orderId);
};

//操作订单
function operationOrder(orderId, operation) {
  if(operation == "isremove") {
    $(".pop_info").html('删除?');
  }

  if(operation == "cancel") {
    $(".pop_info").html('');
  }

}

//提交发货信息
var subSendGoods = function() {
  var template = $('#template').val();
  var orderno = $("#order_no").html();
  var orderId = $("#order_id").val();
  var logistics = $("input[name=logistics_company]").val();
  var trackingNumber = $("input[name=tracking_number]").val();
  var postage = $("input[name=postage]").val();
  $.ajax({
    url: "/order/goSendGoods",
    data: {
      orderId: orderId,
      orderNo: orderno,
      logistics: logistics,
      trackingNumber: trackingNumber,
      postage: postage,
      template: template
    },
    cache: false,
    async: true,
    type: "POST",
    success: function(result) {
      if(result.success) {
        if(template != null) {
          location.href = "/order/findFrontOrders?orderStatus=" + 2 + "&begType=" + 1 + "&template=" + template;
        } else {
          location.href = "/order/findFrontOrders?orderStatus=" + 2 + "&begType=" + 1;
        }
      } else {
        alert("code:" + result.code + " message:" + result.message);
      }
    }
  });
};

//购物车加减
function dosubmit(url, store_user_id, store_id, goods_id, sku_id, source) {

  if(source != 1) {
    source = 0;
  }

  $.post(url, {
    'store_user_id': store_user_id,
    'store_id': store_id,
    'goods_id': goods_id,
    'sku_id': sku_id,
    'source': source,
    'template': $('#template').val()
  }, function(response) {
    if(response.code == "0") {
      var template = $("#template").val();
      var source = $("#source").val();
      var addressId = $("#addressId").val();
      var html = "/order/buynow?template=" + template + "&source=" + source;

      if(addressId != "") {
        html += "&addressId=" + addressId;
      }

      location.href = html;
    }
  });
}

function goDetail(orderId) {
  var template = $("#template").val();
  var begType = $("#beg_type").val();
  var page = $(".page").val();

  var url = "/order/findFrontOrderInfo?orderId=" + orderId + "&begType=" + begType + "&template=" + template;

  if(page != null && page != "") {
    url += "&page=" + page;
  }

  location.href = url;
}

function goBack() {

  if(document.referrer == null || document.referrer == "") {
    history.go(-1);
  } else {
    var page = $('#page').val();
    var url = document.referrer.split("?")[0];
    var param = document.referrer.split("?")[1].split("&");

    if(param.length > 0) {
      for(var i = 0; i < param.length; i++) {
        if(param[i].split("=")[0] != "page") {
          if(i == 0) {
            url += "?" + param[i];
          } else {
            url += "&" + param[i];
          }
        }
      }
    }

    if(page != null && page != "") {
      if(param.length == 0) {
        url += "?page=" + page;
      } else {
        url += "&page=" + page;
      }
    }

    location.href = url;
  }
}

/**
 * 计算店铺金额与运费
 */
function calcStorePostage() {

  $(".storeId").each(function() {
    var group_buy_prices = $(this).find('.group_buy_price');
    var numBuys = $(this).find('.numBuy');
    var postageLen = $(this).find('.postage');
    var postageTotalLen = $(this).find('.postageTotal');
    var total = 0;
    var buyCount = 0;
    var postage = 0;
    var postageTotal = 0;

    for(var i = 0; i < group_buy_prices.length; i++) {
      total += (group_buy_prices[i].value) * (numBuys[i].value);
      buyCount += parseInt(numBuys[i].value);
      postage += parseFloat(postageLen[i].value);
      postageTotal += parseFloat(postageTotalLen[i].value);
    }

    $(this).find('.goodsPrice').eq(0).html("<em class=\"yuan\">&#165;</em>" + total.toFixed(2));
    $(this).find('.storeBuyCount').eq(0).text(buyCount);

    var storeTotal = (total + postage).toFixed(2);
    var storeTotalNum = "";
    var storeTotalDot = "";
    if(storeTotal.split(".").length > 1) {
      storeTotalNum = storeTotal.split(".")[0];
      storeTotalDot = "." + storeTotal.split(".")[1];
    } else {
      storeTotalNum = storeTotal;
    }

    $(this).find('.storeTotal').eq(0).html("<em class=\"yuan\">&#165;</em><strong>" + storeTotalNum + "</strong>" + storeTotalDot);
  });

  var index = 0;
  $(".logisticsList").each(function() {

    var postageLen = $(this).find('.postage');
    var postageTotalLen = $(this).find('.postageTotal');
    var postage = 0;
    var postageTotal = 0;

    for(var i = 0; i < postageLen.length; i++) {
      postage += parseFloat(postageLen[i].value);
      postageTotal += parseFloat(postageTotalLen[i].value);
    }

    if(postageTotal > postage) {
    	$('.goodsPostage').eq(index).html("<em class=\"yuan\">&#165;</em>" + postageTotal.toFixed(2) + "<em class=\"yuan\">&#165;</em><span>" + postage.toFixed(2) + "</span>");
    } else {
    	$('.goodsPostage').eq(index).html("<del></del><em class=\"yuan\">&#165;</em><span>" + postage.toFixed(2) + "</span>");
    }

    index++;
  });
}
