/**
 * 公用商品详情页js
 */
$(function () {
  //倒计时
  if ($('.group-info .countDown').length) {
    $('.group-info .countDown').countDown(function(s, d){
      $(this).text(d.hour + ":" + d.minute + ":" + d.second);
      if (d.total == 0) window.location.reload();
    });
  }
  if ($('#lowest-price .countDown').length) {
    $('#lowest-price .countDown').countDown(function(s, d){
      $(this).text(d.day + "天 " + d.hour + ":" + d.minute + ":" + d.second);
      if (d.total == 0) window.location.reload();
    });
  }

  //选择商品规格
  $('.goods-info .spec').on('click','li',function () {
    $(this).addClass('select').siblings().removeClass('select');
  });

  //选择商品数量
  //输入框最小值1，禁止负数、小数
  $('.numBuy').on('input', function() {
    positiveInteger($(this));
  })
  .on('blur',function() {
    var val = parseInt($(this).val()),
        quantity = parseInt($('#quantity').val());
    if (!val || val < 0) {
      $(this).val(1);
      return;
    }
    if (quantity < val) {
      $(this).val(quantity);
      alert("库存没有这么多呢~!");
    } else {
      $(this).val(val);
    }
  });

  //评论为空时
  if (!$('.reviews-list').children('li').length) {
    $('.goods-reviews .empty').show();
  }

  //点击显示客服按钮
  $('.bottom-fix .service').on('click',function () {
    $('.cover').show();
    $('.service-pop').fadeIn(400);
  });

  //点击隐藏客服按钮
  $('.cover').on('click',function () {
    $('.cover').hide();
    $('.service-pop').fadeOut(400);
  });

  //评论超过三行，添加.line-clamp，查看全文
  var reviewsInfo = $('.reviews-list .info');
  for (var i in reviewsInfo) {
    if (reviewsInfo.eq(i).height() > 76) {
      reviewsInfo.eq(i).addClass('line-clamp');
      reviewsInfo.eq(i).parent().children('.see').show();
    }
  }

  //点击查看全文显示当前全文
  $('.reviews-list').on('click', '.see', function() {
    $(this).parent().children('p').removeClass('line-clamp');
    $(this).text('收起').removeClass('see').addClass('saw');
  });

  //点击收起当前评论
  $('.reviews-list').on('click', '.saw', function() {
    $(this).parent().children('p').addClass('line-clamp');
    $(this).text('查看全文').addClass('see').removeClass('saw');
  });
});
