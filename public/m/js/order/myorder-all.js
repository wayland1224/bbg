$(function() {
  //检查订单列表
  if($('.ul-orderlist').length == 0) {
    $('header').addClass('p-abs');
    $('.main').hide();
    $('.myorder-empty').show();
  }

  //当返回到这个页面时，读取缓存数据并加载
  if (sessionStorage.myOrderDetail) getStorage();

  $('.main').on('click', '.goods_list a', function() {
    sessionStorage.myOrderDetail = true;
  }).on('click', '.goPayment', function() {
    sessionStorage.removeItem('fromPayToPersonal');
  });
});


//读取缓存数据并加载
function getStorage() {
  var list = [],
      html = '',
      orderStatus = $("#order_status").val(),
      begType = $("#beg_type").val(),
      goodsNum = 0;

  if (orderStatus != sessionStorage.myOrder_Status) return;

  for (var p = 2; p <= $('#page').val(); p++ ) {
    if (!sessionStorage['myOrder_Status-'+ orderStatus + '_List-' + p]) continue;
    list = JSON.parse(sessionStorage['myOrder_Status-'+ orderStatus + '_List-' + p]);
    console.log('加载缓存第'+p+'页');
    for (var i = 0; i < list.length; i++) {

      html += "<ul class=\"ul-orderlist\">" + "<li>" + "<div class='title'>" + "<a class=\"but_back\">";

      if (null != list[i].salesOutlets && begType != 2) {
        html += list[i].salesOutlets;
      } else {
        html += list[i].orderno;
      }

      html += "</a>" + "<span class='tip'>";

      if (list[i].orderStatus == 1) {
        html += "等待买家付款";
      } else if (list[i].orderStatus == 2 && list[i].priceModifyStatus == 1) {
        html += "等待卖家确认";
      } else if (list[i].orderStatus == 2 && list[i].priceModifyStatus != 1) {
        html += "买家已付款";
      } else if (list[i].orderStatus == 3) {
        html += "卖家已发货";
      } else if (list[i].orderStatus == 4) {
        html += "交易成功";
      } else if (list[i].orderStatus == 5) {
        html += "交易关闭";
      } else if (list[i].orderStatus == 6) {
        html += "卖家已退款";
      } else {
        html += "订单错误";
      }
      html += "</span>" + "</div>" + "<ul>";

      goodsNum = 0;

      for (var j = 0; j < list[i].frontOrderGoodsView.length; j++) {
        html += "<li class='goods_list'>" + "<a href='javascript:goDetail(" + list[i].id + ");'>" + "<div class='goods_detail'>" + "<img class='fl-l' src='" + list[i].frontOrderGoodsView[j].goodsPicurl + "'>" + "<div class='goods_des'>" + "<p class='goods_name line-clamp'>" + "<span>" + list[i].frontOrderGoodsView[j].goodsName + "</span>" + "</p>" + "<p class='sku_des'>";
        if (null != list[i].frontOrderGoodsView[j].skupropertys) {
          html += "<span>" + list[i].frontOrderGoodsView[j].skupropertys + "</span>";
        }
        html += "</p>" + "<p class='sku_price'><em class=\"yuan\">&#165;</em><span>" + list[i].frontOrderGoodsView[j].goodsPrice.toFixed(2) + "</span><span class='count'>×<span>" + list[i].frontOrderGoodsView[j].quantity + "</span></span></p>" + "</div>" + "</div>" + "</a>" + "</li>";
        goodsNum = goodsNum + list[i].frontOrderGoodsView[j].quantity;
      }
      html += "</ul>" + "<p class='order_obj'>共<span>" + goodsNum + "</span>件商品&nbsp;&nbsp;合计：<em class=\"yuan\">&#165;</em><span><strong class='total_price'>" + list[i].totalPrice.toFixed(2) + "</strong>&nbsp;";
      if (list[i].postage != null && list[i].postage > 0) {
        html += "(</span>含运费<em class=\"yuan\">&#165;</em><span>" + list[i].postage.toFixed(2) + "</span>)</p>";
      } else {
        html += "(</span>含运费<em class=\"yuan\">&#165;</em><span>0.00</span>)</p>";
      }

      html += "<p class='but_handle clear'>";
      if (list[i].orderStatus == 1 && begType == 1) {
        html += "<a href='javascript:setOrderStatus(" + list[i].id + ",\"status\",5)'>取消订单</a>" + "<a class='theme-col fl-r' href='javascript:goPayment(\"" + list[i].orderno + "\"," + list[i].realPayment + ")'>去支付</a></p>";
      }
      if (list[i].orderStatus == 3 && begType == 1) {
        html += "<a href='javascript:getLogistics(" + list[i].id + ")'>查看物流</a>" + "<a class='theme-col fl-r confirmReceipt' href='javascript:setOrderStatus(" + list[i].id + ",\"status\",4)'>确认收货</a></p>";
      }
      if (list[i].orderStatus == 4 && begType == 1 && !list[i].israte) {
        html += "<a href='javascript:getLogistics(" + list[i].id + ")'>查看物流</a>" + "<a class='theme-col fl-r goComment' href='javascript:goComment(" + list[i].id + ")'>去评价</a></p>";
      }
      if (list[i].orderStatus == 5 && begType == 1) {
        html += "<a href='javascript:setOrderStatus(" + list[i].id + ",\"isRemove\",1)'>删除订单</a></p>";
      }
      html += "</li>" + "</ul>";
    }
  }
  $('.load-more').before(html);
  if ($("#page").val() == $("#pages").val()) {
    $('.load-more').hide();
    $('.foot-tips').removeClass('no-more');
  }
  sessionStorage.myOrderDetail = false;
}
