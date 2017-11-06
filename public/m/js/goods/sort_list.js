/**
 * 分类列表
 */
// nav
$(function() {

  //sort toggle
  $("nav .col-1").click(function() {
    var template = $("#template").val();
    var keyword = $("#keyword").val();
    var cateId = $("#cateId").val();
    var order = $("#order").val();
    var type = $("#type").val();
    var sortTitle = $("#sortTitle").val();
    var mainPic = $("#mainPic").val();
    if (mainPic == null || typeof(mainPic) == "undefined" || typeof(mainPic) == "null") {
      mainPic = "";
    }
    var index = $(this).index();
    if (index == 0) {
      order = 0;
    } else if (index == 1) {
      if (($(this).attr("class")).indexOf("reverse") != -1) {
        order = 2;
      } else {
        order = 1;
      }
    } else if (index == 2) {
      order = 3;
    } else if (index == 3) {
      order = 5;
    }
    var url = "";
    if (cateId != 0 && keyword == "") {
      url = "/goods/search?mainPic=" + mainPic + "&sortTitle=" + sortTitle + "&keyword=" + keyword + "&order=" + order + "&cateId=" + cateId;
    } else {
      url = "/goods/search?mainPic=" + mainPic + "&sortTitle=" + sortTitle + "&keyword=" + keyword + "&order=" + order + "&type=" + type;
    }
    if (template != null) {
      url += "&template=" + template;
    }
    window.history.replaceState({
      url: url
    }, '', url); //将当前历史记录替换掉
    location.href = url;
  });

});

//加载更多
function loadMore() {
  var template = $("#template").val();
  var keyword = $("#keyword").val();
  var cateId = $("#cateId").val();
  var order = $("#order").val();
  var type = $("#type").val();
  var page = parseInt($('#page').val());
  var pageSize = parseInt($('.load-more .pageSize').val());
  var tips = $('.load-more span');
  tips.text('正在加载…');
  if ($("#page").val() == $("#pages").val()) return;
  $.post('/goods/searchMore', {
    'keyword': keyword,
    'order': order,
    'cateId': cateId,
    'type': type,
    'start': page + 1,
    'limit': pageSize,
    'template': template
  }, function(response) {
    page++;
    $('#page').val(page);
    tips.text('加载更多…');
    total = response.total;
    var list = response.list;
    window.sessionStorage['sortList_' + page] = JSON.stringify(list); //存储sessionStorage
    var html = '';
    for (var i = 0; i < list.length; i++) {
      var groupBuyPrice = list[i].goodsSku.groupBuyPrice.toFixed(2);
      var id = list[i].id;
      var pic_server_url1 = list[i].pic_server_url1;
      var goods_name = list[i].goods_name;
      var sub_title = list[i].sub_title;
      if (sub_title == null || typeof(sub_title) == "undefined" || typeof(sub_title) == "null") {
        sub_title = "";
      }
      var lowestPrice = list[i].goodsSku.lowestPrice;
      if (list[i].goodsSku.lowestPriceType == 4) {
          html += '<li class="item flash-sale-icon">';
      } else {
          html += '<li class="item">';
      }
      html += '<a href="/goods/detail/' + id + '?template=' + template + '">' + '<img src="' + pic_server_url1 + '?imageView2/1/w/348/h/290">' + '<h6 class="ellipsis">' + goods_name + '</h6>' + '</a>' + '<p class="ellipsis">' + sub_title + '</p>';

      if (lowestPrice != null && lowestPrice.toFixed(2) >= 0 && groupBuyPrice > lowestPrice.toFixed(2)) {
        html += '<p class="price"><em class="yuan">&#165;</em><span>' + lowestPrice.toFixed(2) + '</span>' + ' <del>&#xA5;' + groupBuyPrice + '</del></p>';
      } else {
        html += '<p class="price"><em class="yuan">&#165;</em><span>' + groupBuyPrice + '</span></p>';
      }

      html += '<span class="icon i-cart" data_id="' + id + '"></span>' + '</li>';
    }
    $('.goods-list ul').append(html);
    console.log('第' + page + '页:' + $('.goods-list li').length + 'total:' + $('.load-more .total').val());
    if ($("#page").val() == $("#pages").val()) {
      $('.load-more').hide();
      if ($('.goods-list li').length != $('.load-more .total').val()) console.log('数据异常！');
    }

  });
}
