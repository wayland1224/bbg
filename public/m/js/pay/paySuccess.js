/*
 * 支付成功
 */
$(function () {
  $('body').css('opacity', 1);

  // 阻止返回按钮事件
  pushHistory();

  $('.mes .fl').click(function() {
    sessionStorage.removeItem('fromPaySuccessToPersonal');
  });
  $('.mes .fr').click(function() {
    sessionStorage.fromPaySuccessToPersonal = 1;
  });
});

//阻止返回按钮事件
$(window).load(function(){
  var bool = false;
  setTimeout(function () {
    bool = true;
  }, 1500);
  window.addEventListener("popstate", function (e) {
    if (bool) {
      sessionStorage.fromPaySuccessToPersonal = 1;
      location.href = $('.mes .fr')[0].href;
    }
    pushHistory();
  }, false);
});

function pushHistory() {
  var state = {
    title: 'title',
    url: '#'
  };
  window.history.pushState(state, 'title', '#');
}