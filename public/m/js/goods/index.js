/*
 * 商城首页js
 */
var goodsLists = $('.goods-list'),
  template = $("#template").val(),
  oAddCart = $('.addCart');

$(function() {
  //首页列表的更多高度
  if ($('#lists li').length) {
    listMoreHeight();
    window.addEventListener('resize', function() {
      if ($(window).width() <= 640) listMoreHeight();
    }, false);
    window.addEventListener('orientationchange', listMoreHeight, false);
  }

  //商品列表scrollLeft
  $('#lists').on('click', '.goods-list a', indexListscrollLeft);
  if (sessionStorage.indexListscrollLeft) {
    var indexListParam = JSON.parse(sessionStorage.indexListscrollLeft);
    console.log(indexListParam);
    goodsLists.eq(indexListParam.idx).scrollLeft(indexListParam.scrollLeft);
    sessionStorage.removeItem('indexListscrollLeft');
  }

  // goods search
  $(".search-txt").click(function() {
    location.href = '/goods/search/index?type=1&template=' + template;
  });
  $(".search-btn").click(function() {
    location.href = '/goods/search/index?type=1&template=' + template;
  });
});

function listMoreHeight() {
  $('#lists li.more').height($('#lists li:first').height());
}

//存储indexListscrollLeft
function indexListscrollLeft() {
  var param = {};
  param.idx = $(this).parents('.index-list').index();
  param.scrollLeft = $(this).parents('.goods-list').scrollLeft();
  sessionStorage.indexListscrollLeft = JSON.stringify(param);
  console.log(sessionStorage.indexListscrollLeft);
};
