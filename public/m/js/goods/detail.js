var template = $("#template").val(),
    loadMoreFlag = true,
    isClick1 = false,
    isClick2 = false,
    sku2 = $('.sku2').length;

$(function() {
  if ($('.foot-tips').hasClass('no-more')) {
    $('.foot-tips').hide();
  }

  // goods search
  $(".search_btn").click(function() {
    var keyword = $(".keyword").val();
    var source = $("#source").val();
    location.href = "/goods/search?keyword=" + keyword + "&source=" + source + "&template=" + template;
  });
});

$(function() {

  //减少加入购物车商品数量
  $('.numReduce').on('touchstart mousedown', function() {
    var numBuy = $('.numBuy').val();
    //购买数量必须是正整数
    var type = /^[0-9]*[1-9][0-9]*$/;
    var re = new RegExp(type);
    if (numBuy.match(re) == null) {
      alert("购买数量必须是大于零的整数!");
      return;
    }
    if (parseInt(numBuy) != 1) {
      $('.numBuy').val(numBuy - 1);
    }
  });

  //增加加入购物车商品数量
  $('.numAdd').on('touchstart mousedown', function() {
    var quantity = $('#quantity').val();
    var numBuy = $('.numBuy').val();

    //购买数量必须是正整数
    var type = /^[0-9]*[1-9][0-9]*$/;
    var re = new RegExp(type);
    if (numBuy.match(re) == null) {
      alert("购买数量必须是大于零的整数!");
      return;
    }

    if (parseInt(quantity) <= parseInt(numBuy)) {
      alert("库存没有这么多呢~!");
      return;
    } else {
      $.post('/cart/cartGoodsCount', {
        goodsId: $('.goods_id').val(),
        skuId: $('.sku_id').val(),
        numBuy: parseInt(numBuy) + 1
      }, function(response) {
        console.log(response);
        if (!response.success) {
          alert(response.message);
          return;
        } else {
          $('.numBuy').val(parseInt(numBuy) + 1);
        }
      });
    }
  });

  // 好评load-more
  $('.load-more span').on('touchstart mousedown', loadMore);

  var sku1Value, sku2Value;
  // sku 切换时返回 shu商品对象
  $(".sku1 li").on('touchstart mousedown', function() {
    isClick1 = true;
    var index = $(this).index();
    sku1Value = $(this).text();
    if (sku2 == 1) {
      if (sku2Value != null) {
        getSkuGoodsBySkuValue(sku1Value, sku2Value);
      }
    } else if (sku2 == 0) {
      getSkuGoodsBySkuValue(sku1Value, null);
    }
    //$(this).addClass("select").siblings().removeClass();
  });
  $(".sku2 li").on('touchstart mousedown', function() {
    isClick2 = true;
    var index = $(this).index();
    sku2Value = $(this).text();
    if (sku1Value != null) {
      getSkuGoodsBySkuValue(sku1Value, sku2Value);
    }
    //$(this).addClass("select").siblings().removeClass();
  });

  // 点击加入购物车
  $("#add-cart-btn").on('touchstart mousedown', function() {
    if (!checkAddCart()) return;

    var goodsId = $('.goods_id').val(),
        numBuy = $('.numBuy').val(),
        skuId = $('.sku_id').val(),
        goodsUrl = $('.picServerUrl1').val(),
        params = {
          goodsId: goodsId,
          numBuy: numBuy,
          skuId: skuId ? skuId : null,
          // activityId: null,
          // activityGrouponId: null,
          // activityGoodsLimitId: null
        };
    console.log(JSON.stringify(params));
    addGoodsToCart(params, goodsUrl, AddGoodsToCartResult2);
    /*var param = packegeCartParam(0);
    $.post('/cart/cartGoodsCount', {
      goodsId: $('.goods_id').val(),
      skuId: $('.sku_id').val(),
      numBuy: parseInt(buyCount)
    }, function(response) {
      console.log(response);
      if (!response.success) {
        alert(response.message);
        return;
      } else {
        $.post('/cart/addGoodsToCart', param, function(response) {
          console.log(response);
          if (response.success) {
            //                      alert("成功加入购物车");
            var picServerUrl1 = $(".picServerUrl1").val();
            var goodsName = $(".goodsName").val();
            $(".cartCount").html("加入数量：" + buyCount);
            $(".addCart .list_cover").html("<img src='" + picServerUrl1 + "'>");
            $(".addCart .list_title").html(goodsName);
            var totalMoney = $('.group_buy_price').val() * buyCount;
            totalMoney = totalMoney.toFixed(2);
            //                      if(totalMoney.indexOf(".")!=-1){
            //                          totalMoney = totalMoney.substring(0,totalMoney.indexOf(".")+3);
            //                      }else{
            //                          totalMoney+=".00";
            //                      }
            $(".totalMoney").html("总计金额：&#xA5;" + totalMoney);
            $(".popup_bg").show();
            $(".addCart").slideDown("fast", function() {
              //window.scrollTo(0, 600);
            });
            $(".backToTop").fadeOut(100);
          } else {
            alert(response.message);
          }
        });
      }
    });*/

  });

  // 点击立即购买
  $("#buy-btn").on('touchstart mousedown', function() {
    //判断是否注册绑定手机号
    if (!isRegister()) return;

    if (!checkAddCart()) return;

    var param = packegeCartParam(1);
    $.post('/cart/addGoodsToCart', param, function(response) {
      console.log(response);
      if (response.success) {
        if (template != null) {
          window.location.href = "/order/buynow?template=" + template + "&source=1";
        } else {
          window.location.href = "/order/buynow?";
        }
      } else {
        alert(response.message);
      }
    });

  });

  // 进入店铺
  $(".detail_go").click(function() {
    if (template != null) {
      window.location.href = "/store/" + $('.store_user_id').val() + "/index?template=" + template;
    } else {
      window.location.href = "/store/" + $('.store_user_id').val() + "/index";
    }
  });

});

// 加入购物车校验
function checkAddCart() {
  var sku1Name = $('#sku1Name').val(),
      sku2Name = $('#sku2Name').val(),
      buyCount = $('.numBuy').val(),
      quantity = $('#quantity').val(),
      issku = $('.sku_id_no').val();

  // 判断是否选择SKU
  if (issku == null) {
    if (sku2 == 0) {
      if (!isClick1) {
        alert("请选择商品属性");
        return false;
      }
    } else {
      if (!(isClick1 && isClick2)) {
        alert("请选择商品属性");
        return false;
      }
    }
  }

  if (parseInt(quantity) < parseInt(buyCount)) {
    alert("库存没有这么多呢~!");
    return false;
  }
  return true;
}

// 加入购物车的参数封装
function packegeCartParam(source) {
  var sku_id_no = $('.sku_id_no').val();
  var sku_id = $('.sku_id').val();
  if (sku_id_no != null) {
    sku_id = sku_id_no;
  }

  var param = {
    "source": source,
    "goods_id": $('.goods_id').val(),
    "goodsType": $('.goodsType').val(),
    "goodsName": $('.goodsName').val(),
    "group_buy_price": $('.group_buy_price').val(),
    "shop_market_price": $('.shop_market_price').val(),
    "ex_factory_price": $('.ex_factory_price').val(),
    "sales_num": $('.sales_num').val(),
    "pic_server_url1": $('.picServerUrl1').val(),
    "store_id": $('.store_id').val(),
    "store_name": $('.store_name').val(),
    "fh_user_id": $('.fh_user_id').val(),
    "store_user_id": $('.store_user_id').val(),
    "userType": $('.userType').val(),
    "sku_id": sku_id,
    "sku1Name": $('.sku1Name').val(),
    "sku1Value": $('.sku1Value').val(),
    "sku2Name": $('.sku2Name').val(),
    "sku2Value": $('.sku2Value').val(),
    "buyCount": $('.numBuy').val(),
    "quantity": $('#quantity').val(),
    'template': template
  };
  return param;
}

// 根据sku的值查询sku商品对象
function getSkuGoodsBySkuValue(sku1Value, sku2Value) {
  var goodsId = $('.goods_id').val();
  $.post('/goods/getSkuGoodsBySkuValue', {
    'goodsId': goodsId,
    'sku1Value': sku1Value,
    'sku2Value': sku2Value,
    'template': template
  }, function(response) {
    //切换SKU时价格变化
    var groupBuyPrice = response.goodsSkuStockPriceDTO.groupBuyPrice.toFixed(2);;
    var shopMarketPrice = response.goodsSkuStockPriceDTO.shopMarketPrice.toFixed(2);;
    //groupBuyPrice
    $('.groupBuyPrice').html("&#xA5;" + groupBuyPrice);
    //shopMarketPrice
    $('.shopMarketPrice').html("市场价：&#xA5;" + shopMarketPrice);
    // 库存：20件
    $('.quantity').html("库存：<span>" + response.goodsSkuStockPriceDTO.quantity + "</span>件");
    // SKU商品ID
    $('.sku_id').val(response.goodsSkuStockPriceDTO.id);
    // 第一组SKU属性名称
    $('.sku1Name').val(response.goodsSkuStockPriceDTO.sku1Name);
    // 第一组SKU属性值
    $('.sku1Value').val(response.goodsSkuStockPriceDTO.sku1Value);
    // 第二组SKU属性名称
    $('.sku2Name').val(response.goodsSkuStockPriceDTO.sku2Name);
    // 第二组SKU属性值
    $('.sku2Value').val(response.goodsSkuStockPriceDTO.sku2Value);
    // 团购价
    $('.group_buy_price').val(response.goodsSkuStockPriceDTO.groupBuyPrice);
    // 市场价
    $('.shop_market_price').val(response.goodsSkuStockPriceDTO.shopMarketPrice);
    // 出厂价
    $('.ex_factory_price').val(response.goodsSkuStockPriceDTO.exFactoryPrice);
    // 销量
    $('.sales_num').val(response.goodsSkuStockPriceDTO.salesNum);
    // 库存
    $('#quantity').val(response.goodsSkuStockPriceDTO.quantity);

    var list = response.activityGoodsLimitViewList;
    var enterpriseComboList = response.enterpriseComboList;
    var html = "";

    if (list.length > 0 || enterpriseComboList.length > 0) {

      for (var h = 0; h < list.length; h++) {
          if (list[h].activityType == 3) {
              html += '<p class="lowest-price-title">*该商品有超值团购，邀请好友一起来拼吧！</p>';
              break;
          }
      }

      html += '<ul class="ovh">';

      for (var i = 0; i < list.length; i++) {
        if (list[i].activityType == 3) {
            html += '<li class="lowest-price-item">';
            html += '<a href="/activity/activityGoodsDetail/' + list[i].id + '?template=' + template + '">';
            html += '<span class="plate">' + list[i].categoryName + '购</span>';
            html += '<div class="group"><span><em class="yuan">&#165;</em>' + list[i].discountPrice.toFixed(2) + '</span>';
            if (list[i].invalidSeconds > 0) {
              html += '<span>距结束 <span class="countDown" data-seconds="' + list[i].invalidSeconds + '">0天 00:00:00</span></span>';
            } else {
              html += '<span>查看名单</span>'
            }
            html += '</div></a></li>';
        } else if (list[i].activityType == 4) {
            html += '<li class="lowest-price-item">';
            html += '<a href="/activity/activityGoodsDetail/' + list[i].id + '?template=' + template + '">';
            html += '<span class="plate">限时秒杀</span>';
            html += '<div class="group"><span><em class="yuan">&#165;</em>' + list[i].discountPrice.toFixed(2) + '</span>';
            html += '<span>距结束 <span class="countDown" data-seconds="' + list[i].invalidSeconds + '">0天 00:00:00</span></span>';
            html += '</div></a></li>';
        } else if (list[i].activityType == 2 && list[i].invalidSeconds > 0) {
            html += '<li class="lowest-price-item">';
            html += '<a href="/activity/activityGoodsDetail/' + list[i].id + '?template=' + template + '">';
            html += '<span class="plate">限时抢购</span>';
            html += '<div class="group"><span><em class="yuan">&#165;</em>' + list[i].discountPrice.toFixed(2) + '</span>';
            html += '<span>距结束 <span class="countDown" data-seconds="' + list[i].invalidSeconds + '">0天 00:00:00</span></span>';
            html += '</div></a></li>';
        }
      }

      for (var j = 0; j < enterpriseComboList.length; j++) {
        html += '<li class="lowest-price-item">';
        html += '<a href="/enterpriseCombo/detail/' + enterpriseComboList[j].id + '?template=' + template + '">';
        html += '<span class="plate">企业通道</span>';
        html += '<div class="group"><span><em class="yuan">&#165;</em>' + enterpriseComboList[j].discountPrice.toFixed(2) + '</span>';
        html += '<span></span></div></a></li>';
      }

      html += '</ul>';
    }

    $("#lowest-price").html(html);

    $('#lowest-price .countDown').countDown(function(s, d) {
      $(this).text(d.day + "天 " + d.hour + ":" + d.minute + ":" + d.second);
      // if (d.total == 0) window.location.reload();
    });
  });
};

//加载更多
function loadMore() {
  if (!loadMoreFlag) return;
  //var rateType = getRateType();
  var goodsId = $('.goods_id').val();
  var page = parseInt($('.load-more .page1').val());
  var pageSize = parseInt($('.load-more .pageSize1').val());
  var total = parseInt($('.load-more .total1').val());
  loadMoreFlag = false;
  $.post('/goods/rateMore', {
    'goodsId': goodsId,
    //'rateType' : rateType,
    'start': page + 1,
    'limit': pageSize,
    'template': template
  }, function(response) {
    loadMoreFlag = true;
    page = page + 1;
    total = response.total;
    var list = response.data;
    var html = '<!-- 第' + page + '页 -->';
    for (var i = 0; i < list.length; i++) {
      html += getHtml(list[i]);
    }
    $('.reviews-list > li:last').after(html);
    if (total - pageSize * page <= 0) {
      $("#noLoadMore").val(1);
      $('.load-more').hide();
      $('.no-more').css("display", "block");
    }

    $('.load-more .page1').val(page);
    $('.load-more .total1').val(total);

    /* 评价图 */
    var imgRateSrc = [],
      imgRateNum = [],
      snum_rate, idx_rate;
    for (var i = 0, l = $(".img-list img").length; i < l; i++) {
      imgRateSrc.push($(".img-list img").eq(i).attr("data-src"));
      $(".img-list img").eq(i).attr("data-num", "R" + i);
      imgRateNum.push("R" + i);
    }

    $(".img-list img").click(function() {
      snum_rate = $(this).attr("data-num");
      idx_rate = imgRateNum.indexOf(snum_rate);
      ImageView(idx_rate, imgRateSrc);
    });
    /* 评价图end */

    //评论超过三行，添加.line-clamp，查看全文
    var reviewsInfo = $('.reviews-list .info');
    for (var i in reviewsInfo) {
      if (reviewsInfo.eq(i).height() > 76) {
        reviewsInfo.eq(i).addClass('line-clamp');
        reviewsInfo.eq(i).parent().children('.see').show();
      }
    }
  });
}

//加载更多的内容
function getHtml(rate) {
  var headimgurl = "<img src='/wechat/img/rate-default-header.png' alt=''>";
  if (rate.headimgurl != null && rate.headimgurl != '') {
    headimgurl = "<img src='" + rate.headimgurl + "' alt=''>";
  }

  var html = "<li class='item clear'> " +
    "<a class='customer-avatar' href=''>" + headimgurl + "</a>" +
    "<section>" +
    "<div class='customer-name clear'><span class='fl-l'>" + rate.user + "：</span> ";
  if (rate.evaluation == 5) {
    for (var i = 0; i < 5; i++) {
      html += "<span class='icon icon-select'></span>";
    }
  } else if (rate.evaluation == 4) {
    for (var i = 0; i < 4; i++) {
      html += "<span class='icon icon-select'></span>";
    }
    html += "<span class='icon '></span>";
  } else if (rate.evaluation == 3) {
    for (var i = 0; i < 3; i++) {
      html += "<span class='icon icon-select'></span>";
    }
    for (var i = 0; i < 2; i++) {
      html += "<span class='icon '></span>";
    }
  } else if (rate.evaluation == 2) {
    for (var i = 0; i < 2; i++) {
      html += "<span class='icon icon-select'></span>";
    }
    for (var i = 0; i < 3; i++) {
      html += "<span class='icon '></span>";
    }
  } else if (rate.evaluation == 1) {
    for (var i = 0; i < 1; i++) {
      html += "<span class='icon icon-select'></span>";
    }
    for (var i = 0; i < 4; i++) {
      html += "<span class='icon '></span>";
    }
  } else if (rate.evaluation == 0) {
    for (var i = 0; i < 5; i++) {
      html += "<span class='icon '></span>";
    }
  }
  html += "<p class='info'>" + rate.content + "<p>";

  if (rate.feel != null && typeof(rate.feel) != "undefined") {
    html += "<p class='info'>" + rate.feel + "<p>";
  }

  html += "<p class=\"see\">查看全文</p>";

  if (rate.type != null && typeof(rate.type) != "undefined" && rate.type == 2) {
    html += "<ul class=\"img-list font0\">";
    if (rate.pic1 != null && typeof(rate.pic1) != "undefined" && rate.pic1 != "") {
      html += "<li><img class=\"lazyload\" src=\"/wechat/img/transparent.png\" data-src=" + rate.pic1 + "></li>";
    }

    if (rate.pic2 != null && typeof(rate.pic2) != "undefined" && rate.pic2 != "") {
      html += "<li><img class=\"lazyload\" src=\"/wechat/img/transparent.png\" data-src=" + rate.pic2 + "></li>";
    }

    if (rate.pic3 != null && typeof(rate.pic3) != "undefined" && rate.pic3 != "") {
      html += "<li><img class=\"lazyload\" src=\"/wechat/img/transparent.png\" data-src=" + rate.pic3 + "></li>";
    }

    if (rate.pic4 != null && typeof(rate.pic4) != "undefined" && rate.pic4 != "") {
      html += "<li><img class=\"lazyload\" src=\"/wechat/img/transparent.png\" data-src=" + rate.pic4 + "></li>";
    }

    if (rate.pic5 != null && typeof(rate.pic5) != "undefined" && rate.pic5 != "") {
      html += "<li><img class=\"lazyload\" src=\"/wechat/img/transparent.png\" data-src=" + rate.pic5 + "></li>";
    }

    html += "</ul>";
  }

  html += "<p class='time'>" + rate.addTime + "<p>";
  if (rate.replyContent != null && rate.replyContent != "") {
    html += "<div class='reply clear'> <span class='fl-l'>小邦回复：</span><p>" + rate.replyContent + "</p></div>";
  }

  html += "</section></li>";
  return html;
}

//滑动页面到底部自动加载更多
/*$(function() {
  var range = 22; //距下边界长度/单位px
  var maxnum = 30; //设置加载最多次数
  var num = 1;
  var totalheight = 0;
  $(window).scroll(function() {
    var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
    //console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
    //console.log("页面的文档高度 ："+$(document).height());
    //console.log('浏览器的高度：'+$(window).height());
    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
    var noLoadMore = $("#noLoadMore").val();
    if ((($(document).height() - range) <= totalheight && num != maxnum) && noLoadMore==0) {
      loadMore();
      num++;
    }
  });
});*/
