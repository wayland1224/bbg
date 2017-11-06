var template = $('#template').val();
//获取订单团购状态
var grouponStatus = $("#groupon_status").val();
//请求类型
var begType = 1;
//订单的index
var confirmReceiptIdx;

$(function() {
  //检查订单列表是否为空
  if ($('.ul-orderlist').length == 0) {
    $('.myorder-empty').show();
    $('.main').hide();
  }

  if (history.state) {
    if (history.state.grouponStatus = grouponStatus) getStorage();
  }

  $('nav').on('click', 'li', function() {
    $(this).addClass('current').siblings().removeClass('current');
    var index = $(this).index();
    location.href = "/groupon/mygroupon?grouponStatus=" + index + "&begType=" + begType + "&template=" + template;
  });
  //添加样式
  $("nav li").eq(grouponStatus).addClass("current").siblings().removeClass('current');

  $('.main').on('click', '.ul-orderlist a', function() {
    var state = {},
      idx = $(this).parents('.ul-orderlist').index();
    state.url = '#listIdx=' + idx;
    state.grouponStatus = grouponStatus;
    history.replaceState(state, '', state.url);
  })
  .on('click', '.confirm', function () {
    confirmReceiptIdx = $(this);
  });

  //订单查询
  $(".search_btn").click(function() {
    var conditions = $("#orderGoodsName").val();
    location.href = "/groupon/mygroupon?grouponStatus=" + grouponStatus + "&begType=" + begType + "&conditions=" + conditions + "&template=" + template;
  });

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


  //load-more 
  $('.load-more span').click(loadMore);

  $(".list").each(function(i, div) {
    $(div).find("em").click(function(i, em) {
      var index = $(this).index();
      var score = $(div).find("input[name=goods_score]").val();
      if (score <= index) {
        if (index == 0) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
        }
        if (index == 1) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
          $(emlist[1]).addClass("starCur");
        }
        if (index == 2) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
          $(emlist[1]).addClass("starCur");
          $(emlist[2]).addClass("starCur");
        }
        if (index == 3) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
          $(emlist[1]).addClass("starCur");
          $(emlist[2]).addClass("starCur");
          $(emlist[3]).addClass("starCur");
        }
        if (index == 4) {
          var emlist = $(div).find("em");
          $(emlist[0]).addClass("starCur");
          $(emlist[1]).addClass("starCur");
          $(emlist[2]).addClass("starCur");
          $(emlist[3]).addClass("starCur");
          $(emlist[4]).addClass("starCur");
        }
      } else {
        if (index == 3) {
          var emlist = $(div).find("em");
          $(emlist[4]).removeClass("starCur");
        }
        if (index == 2) {
          var emlist = $(div).find("em");
          $(emlist[3]).removeClass("starCur");
          $(emlist[4]).removeClass("starCur");
        }
        if (index == 1) {
          var emlist = $(div).find("em");
          $(emlist[2]).removeClass("starCur");
          $(emlist[3]).removeClass("starCur");
          $(emlist[4]).removeClass("starCur");
        }
        if (index == 0) {
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
});

/**
 * 修改订单状态
 */
var setOrderStatus = function(orderId, temp, code) {

  if (temp == 'status' && code == 4) {
    if (confirmReceiptIdx.attr('disabled') == 'disabled') return;
    confirmReceiptIdx.attr('disabled', true);
//    var flag = confirm("你确定收货吗?");
//    if (flag) {
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
          if (result.success) {
            if (template != null) {
              location.href = "/groupon/mygroupon?grouponStatus=" + grouponStatus + "&begType=" + begType + "&template=" + template;
            } else {
              location.href = "/groupon/mygroupon?grouponStatus=" + grouponStatus + "&begType=" + begType;
            }
          } else {
            alert("code:" + result.code + " message:" + result.message);
          }
        }
      });
    }
//  }
};

//去评价
var goComment = function(orderId) {
  if (template != null) {
    location.href = "/order/goComment?id=" + orderId + "&isRate=true&template=" + template;
  } else {
    location.href = "/order/goComment?id=" + orderId + "&isRate=true";
  }
};
//查看物流
var getLogistics = function(orderId) {
  if (template != null) {
    location.href = "/order/getLogistics?orderId=" + orderId + "&template=" + template;
  } else {
    location.href = "/order/getLogistics?orderId=" + orderId;
  }
};
//提交评价
var submitComment = function() {
  var rate = [];
  var flag = true;
  $(".list").each(function(i, div) {
    var goodsId = $(div).find("input[name='goods_id']").val();
    var orderNo = $(div).find("input[name='order_no']").val();
    var rateNum = i + 1;
    var rateType = $(div).find("input[name=rate_type" + rateNum + "]:checked").val();
    var context = $(div).find("textarea[name='context']").val();
    var goods_score = $(div).find("input[name=goods_score]").val();
    if (goods_score == "-1") {
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
  if (flag) {
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
        if (result.success) {
          if (template != null) {
            location.href = "/groupon/mygroupon?grouponStatus=" + 2 + "&begType=" + 1 + "&template=" + template;
          } else {
            location.href = "/groupon/mygroupon?grouponStatus=" + 2 + "&begType=" + 1;
          }
        } else {
          alert("code:" + result.code + " message:" + result.message);
        }
      }
    });
  }
};

function loadMore() {
  var page = parseInt($('#page').val());
  var pages = parseInt($('#pages').val());
  var pageSize = parseInt($('#pageSize').val());
  var conditions = $("#orderGoodsName").val();
  $.post('/groupon/loadMore', {
    'grouponStatus': grouponStatus,
    'begType': begType,
    'conditions': conditions,
    'start': page + 1,
    'limit': pageSize,
    'template': template
  }, function(response) {
    page++;
    $('#page').val(page);
    total = response.total;
    var list = response.list;
    console.log('第' + page + '页');
    sessionStorage['grouponList_' + page] = JSON.stringify(list); //存储sessionStorage
    var html = '';
    for (var i = 0; i < list.length; i++) {
      html += "<ul class='ul-orderlist'><li><div class='title clear'><a src='/store/" + list[i].store_userId + "/index?template=" + template + "' class='but_back'>";
      if (null != list[i].salesOutlets && begType != 2) {
        html += list[i].salesOutlets;
      } else {
        html += list[i].orderno;
      }

      html += "<span class='icon_select'></span></a>";

      if (list[i].grouponStatus == 1) {
        html += "<span class='tip'>进行中";
      } else if (list[i].grouponStatus == 2) {
        html += "<span class='icon success'>";
      } else if (list[i].grouponStatus == 3) {
        html += "<span class='icon fail'>";
      } else {
        html += "订单错误";
      }
      html += "</span></div>";
      var goodsNum = 0;
      for (var j = 0; j < list[i].frontOrderGoodsView.length; j++) {
        html += "<ul><li class='goods_list'><a href='/activity/groupon/" + list[i].grouponId + "/" + list[i].activityGoodsLimitId + "?template=" + template + "'>";
        html += "<div class='goods_detail clear'><div class='fl-l'> <img src='" + list[i].frontOrderGoodsView[j].goodsPicurl + "'></div>";
        html += "<div class='goods_des'><p class='goods_name line-clamp'><span>" + list[i].frontOrderGoodsView[j].goodsName + "</span></p>";
        if (null != list[i].frontOrderGoodsView[j].skupropertys) {
          html += "<p class='sku_des'><span>" + list[i].frontOrderGoodsView[j].skupropertys + "</span></p>";
        }
        html += "<p class='sku_price'><em class=\"yuan\">&#165;</em><span>" + list[i].frontOrderGoodsView[j].goodsPrice + "</span><span class='count'>×<span>" + list[i].frontOrderGoodsView[j].quantity + "</span></span></p></div></div></a></li></ul>";
        goodsNum = goodsNum + list[i].frontOrderGoodsView[j].quantity;
      }
      html += "<p class='order_obj'>共<span>" + goodsNum + "</span>件商品&nbsp;&nbsp;合计：<em class=\"yuan\">&#165;</em><span><strong class='total_price'>" + list[i].totalPrice + "</strong>&nbsp;";
      if (list[i].postage != null && list[i].postage > 0) {
        html += "(</span>含运费<em class=\"yuan\">&#165;</em><span>" + list[i].postage + "</span>)</p>";
      } else {
        html += "(</span>含运费<em class=\"yuan\">&#165;</em><span>0.00</span>)</p>";
      }

      if (list[i].orderStatus == 3 && begType == 1) {
        html += "<p class='but_handle clear'>";
        html += "<a href='javascript:getLogistics(" + list[i].id + ")'>查看物流</a>";
        html += "<a class='gopay fl-r confirm' href='javascript:setOrderStatus(" + list[i].id + ",\"status\",4)'>确认收货</a></p>";
      }
      if (list[i].orderStatus == 4 && begType == 1 && !list[i].israte) {
        html += "<p class='but_handle clear'>";
        html += "<a href='javascript:getLogistics(" + list[i].id + ")'>查看物流</a>";
        html += "<a class='gopay fl-r' href='javascript:goComment(" + list[i].id + ")'>去评价</a></p>";
      }

      html += "</li></ul>";
    }
    $('.load-more').before(html);
    if (pages == page) {
      $('.load-more').hide();
      $('.foot-tips').removeClass('no-more');
      return;
    }
  });
}

function getStorage() {
  var list = [];
  var html = '';
  for (var p = 2; p <= $('#page').val(); p++) {
    list = JSON.parse(sessionStorage['grouponList_' + p]);
    console.log('加载缓存第' + p + '页');
    for (var i = 0; i < list.length; i++) {
      html += "<ul class='ul-orderlist'><li><div class='title clear'><a src='/store/" + list[i].store_userId + "/index?template=" + template + "' class='but_back'>";
      if (null != list[i].salesOutlets && begType != 2) {
        html += list[i].salesOutlets;
      } else {
        html += list[i].orderno;
      }

      html += "<span class='icon_select'></span></a>";

      if (list[i].grouponStatus == 1) {
        html += "<span class='tip'>进行中";
      } else if (list[i].grouponStatus == 2) {
        html += "<span class='icon success'>";
      } else if (list[i].grouponStatus == 3) {
        html += "<span class='icon fail'>";
      } else {
        html += "订单错误";
      }
      html += "</span></div>";
      var goodsNum = 0;
      for (var j = 0; j < list[i].frontOrderGoodsView.length; j++) {
        html += "<ul><li class='goods_list'><a href='/activity/groupon/" + list[i].grouponId + "/" + list[i].activityGoodsLimitId + "?template=" + template + "'>";
        html += "<div class='goods_detail clear'><div class='fl-l'> <img src='" + list[i].frontOrderGoodsView[j].goodsPicurl + "'></div>";
        html += "<div class='goods_des'><p class='goods_name line-clamp'><span>" + list[i].frontOrderGoodsView[j].goodsName + "</span></p>";
        if (null != list[i].frontOrderGoodsView[j].skupropertys) {
          html += "<p class='sku_des'><span>" + list[i].frontOrderGoodsView[j].skupropertys + "</span></p>";
        }
        html += "<p class='sku_price'><em class=\"yuan\">&#165;</em><span>" + list[i].frontOrderGoodsView[j].goodsPrice + "</span><span class='count'>×<span>" + list[i].frontOrderGoodsView[j].quantity + "</span></span></p></div></div></a></li></ul>";
        goodsNum = goodsNum + list[i].frontOrderGoodsView[j].quantity;
      }
      html += "<p class='order_obj'>共<span>" + goodsNum + "</span>件商品&nbsp;&nbsp;合计：<em class=\"yuan\">&#165;</em><span><strong class='total_price'>" + list[i].totalPrice + "</strong>&nbsp;";
      if (list[i].postage != null && list[i].postage > 0) {
        html += "(</span>含运费<em class=\"yuan\">&#165;</em><span>" + list[i].postage + "</span>)</p>";
      } else {
        html += "(</span>含运费<em class=\"yuan\">&#165;</em><span>0.00</span>)</p>";
      }

      if (list[i].orderStatus == 3 && begType == 1) {
        html += "<p class='but_handle clear'>";
        html += "<a href='javascript:getLogistics(" + list[i].id + ")'>查看物流</a>";
        html += "<a class='gopay fl-r confirm' href='javascript:setOrderStatus(" + list[i].id + ",\"status\",4)'>确认收货</a></p>";
      }
      if (list[i].orderStatus == 4 && begType == 1 && !list[i].israte) {
        html += "<p class='but_handle clear'>";
        html += "<a href='javascript:getLogistics(" + list[i].id + ")'>查看物流</a>";
        html += "<a class='gopay fl-r' href='javascript:goComment(" + list[i].id + ")'>去评价</a></p>";
      }

      html += "</li></ul>";
    }
  }
  $('.load-more').before(html);
  if ($("#page").val() == $("#pages").val()) {
    $('.load-more').hide();
    $('.foot-tips').removeClass('no-more');
  }
}
