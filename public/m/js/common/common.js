/**
 * 通用js
 */
var mobileTerminal = /Android|Windows Phone|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
    isIPhone = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent),
    supportsCSS = !!((window.CSS && window.CSS.supports) || window.supportsCSS || false),
    goodsCartCount;

//移动端隐藏滚动条
if (mobileTerminal) loadStyleString("::-webkit-scrollbar{display: none;}");

//为了解决alert在ios版微信中显示url的问题
if (isIPhone) {
  window.alert = function(name) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
  };
}

$(function() {
  /*  //监听左上角返回关闭按钮
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState == 'hidden') {
        console.log(location.href);
      }
    });*/

  //购物车图标显示
  goodsCartCount = $('#goods-cart-count');
  changeGoodsCartNum();

  //点击进入购物车结算页、个人中心前判断当前用户是否注册
  $('.bottom-tab').on('click', 'a', function() {
    var idx = $(this).index();
    if (idx == 4) {
      if (!isRegister()) return false;
    }
  });
});

//返回顶部 2.5倍屏幕出现
$(function() {
  if (!$(".backToTop").length) return;
  var clientHeight = document.documentElement.clientHeight * 2;
  $(window).scroll(function() {
    if ($(window).scrollTop() > clientHeight) {
      $(".backToTop").fadeIn(100);
    } else {
      $(".backToTop").fadeOut(100);
    }
  });
  $(".backToTop").click(function() {
    $('body,html').animate({
      scrollTop: 0
    }, 0);
    return false;
  });

});

/**
 * banner自动轮播
 * 第一张图片不能lazyload
 */
$(function() {
  // 判断是否引用Swiper
  if (typeof(Swiper) == "undefined") return;

  //如果只有一张图，关闭自动轮播
  if ($('.scroll-banner .swiper-slide').length <= 1) return;

  var scrollBanner = new Swiper('.scroll-banner', {
    observer: true,
    observeParents: true,
    autoplay: 3000,
    preloadImages: false,
    //lazyLoading: true,
    autoplayDisableOnInteraction: false,
    direction: "horizontal",
    loop: true,
    pagination: ".swiper-pagination",
    effect: "coverflow",
    coverflow: {
      rotate: 30,
      stretch: 10,
      depth: 60,
      modifier: 2,
      slideshadows: true
    }
  });
});

//动态嵌入CSS样式
function loadStyleString(css) {
  var style = document.createElement("style");
  //style.type = "text/css";
  try {
    style.appendChild(document.createTextNode(css));
  } catch (ex) {
    style.styleSheet.cssText = css;
  }
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
}

//正整数
function positiveInteger(item) {
  var val = parseInt(item.val());
  if (val) {
    val = Math.abs(val);
  } else {
    val = '';
  }
  item.val(val);
}

//ajax请求购物车数量
function changeGoodsCartNum() {
  if (!goodsCartCount.length) return console.log('no-cart-icon');
  $.ajax({
    url: '/cart/getGoodsCartCount',
    type: 'POST',
    dataType: 'json',
    success: function(res) {
      if (res.code == 0) {
        var num = res.map.buyCount;
        console.log('getGoodsCartCount:' + num);
        if (!num) return;
        if (num > 999) {
          num = '1...';
          goodsCartCount.addClass('more');
        }else{
          goodsCartCount.removeClass('more');
        }
        goodsCartCount.html(num);
        goodsCartCount.show();
      }
    },
    error: function(res) {
      console.log('getGoodsCartCount error');
    }
  });
}

// 判断当前用户是否注册（新用户）
function isRegister() {
  if (sessionStorage.getItem('isRegister') == 'true') return true;
  var flag;
  $.ajax({
    type: 'GET',
    url: '/user/isRegister',
    async: false,
    success: function(res) {
      console.log(res);
      if (res.map.isRegister == 1) {
        //检测是否绑定手机号码（老用户）
        flag = isBindMobile();
      } else {
        //去注册
        sessionStorage.setItem('currentUnlistedURL', window.location.href);
        window.location.href = '/user/toRegister';
        flag = false;
      }
    },
    error: function(res) {
      console.log(res);
    },
    dataType: 'json'
  });
  return flag;
}

// 判断当前用户是否绑定手机号码（老用户）
function isBindMobile() {
  var flag;
  $.ajax({
    type: 'GET',
    url: '/user/isBindMobile',
    async: false,
    success: function(res) {
      console.log(res);
      if (res.map.isBindMobile == 1) {
        sessionStorage.setItem('isRegister', 'true');
        flag = true;
      } else {
        //去登录
        sessionStorage.setItem('currentUnlistedURL', window.location.href);
        window.location.href = '/user/toLogin';
        flag = false;
      }
    },
    error: function(res) {
      console.log(res);
    },
    dataType: 'json'
  });
  return flag;
}
