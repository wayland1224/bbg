/**
 * 加入购物车
 * 首页、分类、搜索 的商品列表封装
 */
// 加入购物车弹窗
var oAddCart = $('#add-cart'),
    addCartLoading = false;

$(function() {
  var template = $('#template').val();

  // 商品列表点击加入购物车
  $('.goods-list').on('click', '.i-cart', function() {
    goodsListAddToCart($(this));
  });

  oAddCart
    .on('click', '.hidePopup', function() { //关闭加入购物车弹窗
      oAddCart.slideUp(300);
    })
    .on('click', '.goBuy', function() { // 点击去结算
      window.location.href = "/cart/index?template=" + template;
    });
});

// 商品列表点击加入购物车
function goodsListAddToCart(obj) {
  var numBuy = 1,
      goodsId = $(obj).attr('data_id'),
      goodsUrl = $(obj).parents('li').children('a').attr('href'),
      params = {
      goodsId: goodsId,
      numBuy: numBuy,
      // skuId: null,
      // activityId: null,
      // activityGrouponId: null,
      // activityGoodsLimitId: null
    };
  console.log(JSON.stringify(params));
  addGoodsToCart(params, goodsUrl, AddGoodsToCartResult);
}

/**
 * 加入购物车(全局)
 * 商品不入库
 */
function addGoodsToCart(params, goodsUrl, callback) {
  if (addCartLoading) return;
  addCartLoading = true;

  $.ajax({
    async: true,
    url: '/cart/addGoodsToCart2',
    type: 'post',
    data: params,
    success: function(res) {
      console.log(res);
      if (res.code == 0) {
        changeGoodsCartNum();
        callback(goodsUrl, res.map);
      } else {
        alert(res.message);
      }
    },
    error: function(res) {
      alert(res.responseText);
    }
  });
}

//商品列表加入购物车回调
function AddGoodsToCartResult(goodsUrl, data) {
  var numBuy = data.numBuy,
      groupBuyPrice = data.groupBuyPrice,
      picServerUrl1 = data.picServerUrl1,
      goodsName = data.goodsName,
      lowestPrice = data.lowestPrice;

  if (groupBuyPrice > lowestPrice) {
    oAddCart.addClass('cheaper');
    oAddCart.find('p.list_title').removeClass('line-clamp').addClass('ellipsis');
    oAddCart.find('.goodsDetail').attr('href', goodsUrl);
  } else {
    oAddCart.removeClass('cheaper');
    oAddCart.find('p.list_title').removeClass('ellipsis').addClass('line-clamp');
  }
  oAddCart.find(".cartCount").html("加入数量：" + numBuy);
  oAddCart.find(".list_cover").html('<img src="' + picServerUrl1 + '?imageView2/1/w/192/h/192">');
  oAddCart.find(".list_title").html(goodsName);
  var totalMoney = groupBuyPrice * numBuy;
  totalMoney = totalMoney.toFixed(2);
  oAddCart.find(".totalMoney").html("总计金额：<em class=\"yuan\">&#165;</em>" + totalMoney);
  oAddCart.slideDown("fast");
  setTimeout(function() {
    addCartLoading = false;
  }, 400);
}

//商品详情页加入购物车回调
function AddGoodsToCartResult2(goodsUrl, data) {
  var numBuy = data.numBuy,
      groupBuyPrice = data.groupBuyPrice,
      picServerUrl1 = data.picServerUrl1,
      goodsName = data.goodsName,
      lowestPrice = data.lowestPrice;

  oAddCart.removeClass('cheaper');
  oAddCart.find('p.list_title').removeClass('ellipsis').addClass('line-clamp');
  oAddCart.find(".cartCount").html("加入数量：" + numBuy);
  oAddCart.find(".list_cover").html('<img src="' + picServerUrl1 + '?imageView2/1/w/192/h/192">');
  oAddCart.find(".list_title").html(goodsName);
  var totalMoney = groupBuyPrice * numBuy;
  totalMoney = totalMoney.toFixed(2);
  oAddCart.find(".totalMoney").html("总计金额：<em class=\"yuan\">&#165;</em>" + totalMoney);
  oAddCart.slideDown("fast");
  setTimeout(function() {
    addCartLoading = false;
  }, 400);
}
