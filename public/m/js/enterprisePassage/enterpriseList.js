/*
 * 企业列表
 */
var template = $('#template').val(),
    enterpriseName = $('#enterpriseName').val(),
    appId = $('#appId').val(),
    status = $('#status').val(),
    search = $("header input"),
    enterpriseList = $('.enterprise-list'),
    pageNum = $('#pageNum'),
    pages = $('#pages').val(),
    pageSize = $('#pageSize').val(),
    load = $('#load-more');

$(function() {
  //根据企业名称搜索
  $("#searchBut").click(function() {
    var val = search.val();
    if (val) {
      window.location.href = '../enterprisePassage/list?status=1&template=' + template + '&enterpriseName=' + val;
    }/*  else {
      window.location.href = '../enterprisePassage/list?template=' + template;
    } */
  });

  //点击加载更多
  load.click(loadMore);

  //当返回到这个页面时，读取缓存数据并加载
  if (sessionStorage.enterprisePassageList) getStorage();
});

$(function() {
  //点击跳转商品详情页
  //判断该套餐非会员是否可以进来 (为1可以、0不可以)
  enterpriseList.on('click', 'section', function() {
    var enterpriseId = $(this).attr('data-id');
    $.post('/enterprisePassage/weatherIn', {
      enterpriseId: enterpriseId
    }, function(response) {
      if (!response.code) {
        var isWeatherIn = response.obj.isWeatherIn;
        if (isWeatherIn == 1) {
          sessionStorage.enterprisePassageList = true;//flag
          window.location.href = "/enterpriseCombo/list/" + enterpriseId + '?template=' + template;
        } else {
          alert("非该企业会员不可进入哦");
        }
      } else {
        alert(response.message);
      }
    });
  });
});

//企业列表加载更多
function loadMore() {
  var page = parseInt(pageNum.val());

  if (page >= pages) return;
  load.addClass('loading').html('&nbsp;');
  page = page + 1;
  $.post('/enterprisePassage/listAjax', {
    'enterpriseName': enterpriseName,
    'status': status,
    'appId': appId,
    'pageNum': page,
    'pageSize': pageSize,
  }, function(res) {
    //error
    if (res.code) return console.log(res.message);

    var list = res.obj.list,
        html = '<!--加载更多-->';
    console.log('第' + page + '页');
    //存储sessionStorage
    sessionStorage['enterPriseList-' + page] = JSON.stringify(list);
    //DOM操作
    html = enterpriseListHTML(list, html, page);
    enterpriseList.append(html);
    pageNum.val(page);
    load.removeClass('loading').html('<span>加载更多</span>');
    //如果最后一页
    if (res.obj.isLastPage) load.hide();
  });
}

//读取缓存数据并加载
function getStorage() {
  var list = [],
      html = '';

  if (pageNum.val() == 1) return;
  for (var p = 2; p <= pageNum.val(); p++ ) {
    if (!sessionStorage['enterPriseList-' + p]) continue;
    list = JSON.parse(sessionStorage['enterPriseList-' + p]);
    html = '<!--加载缓存-->';
    console.log('加载缓存第' + p + '页');
    html += enterpriseListHTML(list, html, p);
  }
  enterpriseList.append(html);
  //如果最后一页
  if (pageNum.val() == pages) load.hide();
  sessionStorage.enterprisePassageList = false;
}

//企业列表 html字符串拼接
function enterpriseListHTML(list, str, idx) {
  var html = str ? str : '';
  if (idx) html += '<!--第' + idx + '页-->';
  for (var i in list) {
    html += '<section data-id="' + list[i].id + '">'
          // + '<a href="/enterpriseCombo/list/' + list[i].id + '?template=' + template + '">'
          + '<div class="flex">'
          + '<img class="lazyload" src="/wechat/img/transparent.png" data-src="' + list[i].logo + '">'
          + '</div>'
          + '<p class="ellipsis border-top">' + list[i].enterpriseName + '</p>'
          // + '</a>'
          + '</section>';
  }
  return html;
}
