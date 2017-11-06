// follow
$(function() {
  $.post('/getUserInfo', function(response) {
    var userId = response.backupfield.userId;
    var template = $("#template").val();
    if (userId != null && template != null) {
      if (response.success) {//显示
        if (location.href.indexOf("/myProPage/") == -1) insertBeforeBody(response.backupfield);
      }
    }
  }, 'json');
});

function insertBeforeBody(user) {
  var divObj = document.createElement("div"),
      template = document.getElementById('template').value,
      userId = user.userId,
      nickname = user.nickname,
      headimgurl = user.headimgurl,
      enterprisesElephant = user.enterprisesElephant,
      supportSticky = CSS.supports('(position: -webkit-sticky) or (position: sticky)'),
      url = '#',
      html = '';
  if (nickname == null || nickname == "" ) {
    nickname = "商城";
  }
  if (headimgurl == null || headimgurl == "" ) {
    if (enterprisesElephant == null || enterprisesElephant == "" ) {
      enterprisesElephant = "/wechat/img/logo-circle.png";
    }
  } else {
    enterprisesElephant = headimgurl;
  }
  if (userId != null && template != null) {
    url = "/myProPage/" + userId + "?user_id=" + userId + "&template=" + template;
  }

  if (supportsCSS && supportSticky) {
    html = '<span class="icon follow-remove"></span>'
         + '<img class="follow-img" src="' + enterprisesElephant + '">'
         + '<span class="db follow-text">'
         + '<p>来自 <span class="ellipsis">' + nickname + ' </span>的推荐</p>'
         + '<p>关注公众号，享专属服务</p>'
         + '</span>'
         + '<a class="p-abs follow-btn" href="'+ url +'">立即关注</a>';
    divObj.className = "follow flex";
  } else {
    html = '<div class="follow flex">'
         + '<span class="icon follow-remove"></span>'
         + '<img class="follow-img" src="' + enterprisesElephant + '">'
         + '<span class="db follow-text">'
         + '<p>来自 <span class="ellipsis">' + nickname + ' </span>的推荐</p>'
         + '<p>关注公众号，享专属服务</p>'
         + '</span>'
         + '<a class="p-abs follow-btn" href="'+ url +'">立即关注</a>'
         + '</div>';
    divObj.style.height = '49px';
  }

  divObj.innerHTML = html;
  var first = document.body.firstChild;//得到页面的第一个元素
  document.body.insertBefore(divObj,first);//在得到的第一个元素之前插入
  $('.follow').on('touchstart mousedown', '.follow-remove', function() {
    if (supportsCSS && supportSticky) {
      $('.follow').slideUp(300);
    } else {
      $('.follow').parent().slideUp(300);
    }
  });
}
