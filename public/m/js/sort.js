/**
 * 分类模块
 */
var SortModule = {
  init: function() {
    this.template = $("#template").val();
    this.source = $("#source").val();
    this.order = $("#order").val();
    this.type = $("#type").val();

    if (typeof(this.type) == "undefined" || this.type == null || this.type == "") {
      this.type = 1;
    }

    //    this.pageSize = $(".pageSize").val();
    this.header();
    this.footer();
    this.navSort();
    this.pushHistory();
    this.checkHistory();
  },
  header: function() {
    if ($('.banner').length) $('header').addClass('p-abs');
    else $('header').removeClass('p-abs');
  },
  search: function() {
    location.href = '/goods/search/index?type=' + SortModule.type + '&template=' + SortModule.template;
    //    var keyword = $(".search-txt").val();
    //    if (!keyword) return;
    //    location.href = "/goods/search?sortTitle=" + "小邦帮您搜" + "&keyword=" + keyword + "&source=" + SortModule.source + "&template=" + SortModule.template;
  },
  //nav点击当前选项
  navClick: function(idx) {
    idx.addClass('active').siblings().removeClass('active');
  },
  //价格排序 默认从低到高
  navSort: function() {
    $('nav .col-1').eq(1).click(function() {
      if ($(this).hasClass('active')) $(this).toggleClass('reverse');
    });
    if (this.order == 0) $("nav .col-1").eq(0).addClass("active");
    else if (this.order == 1) $("nav .col-1").eq(1).addClass("active");
    else if (this.order == 2) $("nav .col-1").eq(1).addClass("active").addClass("reverse");
    else if (this.order == 3) $("nav .col-1").eq(2).addClass("active");
    else if (this.order == 5) $("nav .col-1").eq(3).addClass("active");
  },
  footer: function() {
    if ($('#page').val() >= $('#pages').val()) {
      $('.content').addClass('has-foot');
      $('.load-more').hide();
    }
  },
  pushHistory: function() {
    var state = {
      sortTitle: $('#sortTitle').val(),
      url: location.href + '#back_flag'
    };
    if (location.href.indexOf('goods/sort?') > 0) return;
    if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) history.replaceState(state, '', '#back_flag');
  },
  //当返回到这个页面时，先获取窗口的history.state，如果不为空，表示保存的有状态，我们要做的就是恢复到这个状态。
  checkHistory: function() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //通过这个来判断是否返回，已经兼容苹果（苹果返回时会自动刷新，该问题以解决）
      //      if(history.length>sessionStorage.corp_history_len && (location.hash && (location.hash.indexOf('#back_flag')!=-1))){

      //      } else {
      //alert('重新加载页面')
      //        if (sessionStorage['scrollTop_' + encodeURIComponent(location.href.split('#')[0])]) {
      //          alert(0)
      this.getStorage();
      //        }
      return;

      //      }
    } else if (history.state) {
      if (history.state.sortTitle) this.getStorage();
    }
  },
  //读取缓存数据并加载。如果涉及到分页，且是滚动加载的形式，需要将当前页设置为history.state中的页数。
  getStorage: function() {
    var list = [],
      html = '';
    if ($('#page').val() == 1) return;
    if (location.href.indexOf('storeyMoreGoods') < 0) {
      for (var p = 2; p <= $('#page').val(); p++) {
        if (!sessionStorage['sortList_' + p]) continue;
        list = JSON.parse(sessionStorage['sortList_' + p]);

        for (var i = 0; i < list.length; i++) {
          var groupBuyPrice = list[i].goodsSku.groupBuyPrice.toFixed(2);
          var id = list[i].id;
          var pic_server_url1 = list[i].pic_server_url1;
          var goods_name = list[i].goods_name;
          var sub_title = list[i].sub_title;
          if (sub_title == null || typeof(sub_title) == "undefined" || typeof(sub_title) == "null") {
            sub_title = "";
          }
          html += '<li class="item">' + '<a href="/goods/detail/' + id + '?template=' + this.template + '">' + '<img src="' + pic_server_url1 + '?imageView2/1/w/348/h/290">' + '<h6 class="ellipsis">' + goods_name + '</h6>' + '</a>' + '<p class="ellipsis">' + sub_title + '</p>' + '<p class="price"><em class="yuan">&#165;</em><span>' + groupBuyPrice + '</span></p>' + '<span class="icon i-cart" data_id="' + id + '"></span>' + '</li>';
        }
      }
    } else if (location.href.indexOf('storeyMoreGoods') > 0) {
      for (var p = 2; p <= $('#page').val(); p++) {
        list = JSON.parse(sessionStorage['sortList_' + p]);

        for (var i = 0; i < list.length; i++) {
          var groupBuyPrice = list[i].price.toFixed(2);
          var id = list[i].id;
          var pic_server_url1 = list[i].goodsUrl;
          var goods_name = list[i].goodsName;
          var subTitle = list[i].subTitle;
          if (subTitle == null || typeof(subTitle) == "undefined" || typeof(subTitle) == "null") {
            subTitle = "";
          }
          html += '<li class="item">' + '<a href="/goods/detail/' + id + '?template=' + this.template + '">' + '<img src="' + pic_server_url1 + '?imageView2/1/w/348/h/290">' + '<h6 class="ellipsis">' + goods_name + '</h6>' + '</a>' + '<p class="ellipsis">' + subTitle + '</p>' + '<p class="price"><em class="yuan">&#165;</em><span>' + groupBuyPrice + '</span></p>' + '<span class="icon i-cart" data_id="' + id + '"></span>' + '</li>';
        }
      }
    }
    $('.goods-list ul').append(html);
  }
};
var oAddCart = $('.addCart');

$(function() {
  SortModule.init();

  $(".search-btn").click(SortModule.search);
  $(".search-txt").click(SortModule.search);

  $('nav').on('click', '.col-1', function() {
    SortModule.navClick($(this));
  });

  //滑动页面到底部自动加载更多
  //  var range = 8; //距下边界长度/单位px
  //  var totalheight = 0;
  //  $(window).scroll(function () {
  //    var scrollTop = $(window).scrollTop();
  //    if ($("#page").val() == $("#pages").val()) return $('.load-more').hide();
  //    totalheight = $(window).height() + scrollTop;
  //    if (($(document).height() - range) <= totalheight) loadMore();
  //  });

  //点击加载更多
  if ($('.load-more').length) $('.load-more span').click(loadMore);
});
