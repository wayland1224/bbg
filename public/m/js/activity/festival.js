/**
 * 中秋专题
 * */
var $nav = $('#nav'),
    $content = $('#content'),
    template = $('#template').val(),
    activityId = $('#activityId').val(),
    appId = $('#appId').val(),
    $NavIdx = $('#navIdx'),
    nPageSize = $('#pageSize').length ? $('#pageSize').val() : 15,
    festivalListData = {},
    loadMoreFlag = false;

//init
(function() {
    var existsOrNo = $('#existsOrNo').val();
    var $empty = $('#empty');
    if (existsOrNo == 0 ||existsOrNo == 1 || existsOrNo == 3) {
        $('body').addClass('empty');
        return;
    }

    var $activityDetails = $('#activity-detail').children();
    //过滤富文本编辑器
    for (var i = 0; i < $activityDetails.length; i++) {
        if ($activityDetails.eq(i).find('img').length == 0) $activityDetails.eq(i).remove();
    }
    //table格式
    //$('#activity-detail').find('img').parents('td').addClass('cell').parent('tr').addClass('flex');

    getStorage();
    /*var idx = $NavIdx.length ? $NavIdx.val() : 0,//默认加载0
        $obj = $nav.children('span').eq(idx);
    return;
    //$obj.addClass('current');
    //$('#container' + idx).html(getGoodsList($obj)).addClass('current');

    //当返回到这个页面时，读取缓存数据并加载
    if (sessionStorage.getItem('festivalList') && sessionStorage.getItem('festivalParam')) {
        //getStorage();
    } else {
        getGoodsList($obj);
    }*/
})();

$(function() {
    //点击nav
    $nav.on('click', 'span', function() {
        //获取当前列表数据
        getGoodsList($(this));
        //currentCenter(this, $nav);
        //$(this).addClass('current').siblings().removeClass('current');
    });


    //从列表页跳转详情页前，把已经分页加载的数据，页码，scrollTop存入sessionStorage
    $content.on('click', 'a', setStorage)
    //加载更多
        .on('click', '.load-more .load-text', loadMore);
});

//点击选中居中
function currentCenter(obj, parent) {
    var idx = $(obj).index(),
        scrollLeft = 0,
        _width = mobileTerminal ? screen.width : $('body').width(),
        move = (_width - $(obj).outerWidth()) / 2;

    if (idx) scrollLeft = $(obj)[0].offsetLeft - move;
    parent.animate({
        'scrollLeft': scrollLeft
    });
}

//倒计时
function countDown(item) {
    item.find('.countDown').countDown(function(s, d) {
        $(this).text(d.day + '天' + d.hour + '时' + d.minute + '分' + d.second + '秒');
        if (d.total == 0) {
            $(this).parents('li.hot-item').find('.btn').addClass('sold').html('已抢光');
        }
    });
}

/**
 * 获取当前商品列表数据
 */
function getGoodsList(item, loadMore) {
    var idx = $(item).index(),
        $container = $('#container' + idx),
        goodsCategoryId = $(item).attr('data-id'),
        pageNum = $container.find('.pageNum').length ? $container.find('.pageNum').val() : 1,
        param = {
            'id': activityId,
            'goodsCategoryId': goodsCategoryId,
            'appId': appId,
            'pageNum': pageNum,
            'pageSize': nPageSize
        };
    if (!loadMore) {
        if (festivalListData[idx] || $('#container' + idx).find('.goods-img').length) {
            showGoodsList(item);
            return;
        }
        var load = layer.load(2);
    }
    $.ajax({
        url: '../flashSaleMore',
        type: 'get',
        data: param,
        dataType: 'json',
        success: function(res) {
            layer.close(load);
            console.log(res);
            if (res.code == 0) {
                var data = res.map.flashSaleView;
                if (loadMore) {
                    var oldList = festivalListData[idx].goodsListPage.list;
                    oldList = oldList.concat(data.goodsListPage.list);
                    festivalListData[idx].goodsListPage = data.goodsListPage;
                    festivalListData[idx].goodsListPage.list = oldList;
                    sessionStorage.setItem('festivalList', JSON.stringify(festivalListData));
                    //loadMoreFlag = false;
                } else {
                    if (typeof data.goodsListPage == 'undefined') data.goodsListPage = {'list': []};
                    festivalListData[idx] = data;
                }
                showGoodsList(item, festivalListData[idx]);
                $NavIdx.val(idx);//修改为当前nav
            } else {
                layer.alert(res.message);
            }
        },
        error: function(res) {
            layer.close(load);
            console.log(res.responseText);
        }
    });
}

//加载数据
function showGoodsList(item, data) {
    var idx = item.index();
    if (!data) {
        $('#container' + idx).addClass('current').siblings().removeClass('current');
        currentCenter(item, $nav);
        $(item).addClass('current').siblings().removeClass('current');
        return;
    }
    if (data.existsOrNo == 0) {
        layer.alert('商品不存在');
        console.log('商品不存在');
        item.html(html).addClass('current empty').siblings().removeClass('current');
        return;
    }

    var recommendList = data.recommendList;
    //var goodsListpage = data.goodsListPage ? data.goodsListPage.list : '';
    var goodsListpage = data.goodsListPage.list;
    var html = '', hotList = '', goodsList = '', loadMore = '', obj, oBtn;

    if (goodsListpage.length) {
        for (var j = 0; j < goodsListpage.length; j++) {
            obj = goodsListpage[j];
            if (!obj.picServerUrl1) obj.picServerUrl1 = '/wechat/img/watermark-logo.png';
            if (!obj.goodsName) obj.goodsName = '';
            if (!obj.subTitle) obj.subTitle = '';
            if (!obj.discountPrice) obj.discountPrice = '0.00';
            if (!obj.groupBuyPrice) obj.groupBuyPrice = '0.00';
            goodsList += '<li class="goods-item" data-id="' + obj.id + '">'
                + '<a href="/activity/activityGoodsDetail/' + obj.id + '?template=' + template + '">'
                + '<img class="goods-img lazyload" src="/wechat/img/transparent.png" data-src="' + obj.picServerUrl1 + '?imageView2/1/w/222/h/186">'
                + '<p class="goods-title ellipsis">' + obj.goodsName + '</p>'
                + '<p>'
                + '<span class="price">'
                + '<em class="yuan">&#165;</em><span>' + obj.discountPrice + '</span>'
                + '</span>'
                + '<del><em class="yuan">&#165;</em>' + obj.groupBuyPrice + '</del>'
                + '</p>'
                + '</a>'
                + '</li>';
        }
        if (data.goodsListPage.isLastPage) {
            loadMore = '<div class="load-more dn">';
        } else {
            loadMore = '<div class="load-more">';
        }
        loadMore += '<input class="pageNum" type="hidden" value="' + data.goodsListPage.pageNum + '">'
            + '<input class="pages" type="hidden" value="' + data.goodsListPage.pages + '">'
            + '<input class="total" type="hidden" value="' + data.goodsListPage.total + '">'
            + '<span class="load-text">加载更多…</span>'
            + '</div>';
    } else {
        loadMore = '<div class="load-more dn">'
            + '<input class="pageNum" type="hidden" value="1">'
            + '<input class="pages" type="hidden" value="1">'
            + '<input class="total" type="hidden" value="0">'
            + '<span class="load-text">加载更多…</span>'
            + '</div>';
    }
    if (loadMoreFlag) {
        loadMoreFlag = false;
        $('#container' + idx).find('.goods-list').html(goodsList).next().html(loadMore);
        return;
    }
    if (recommendList.length) {
        for (var i = 0; i < recommendList.length; i++) {
            obj = recommendList[i];
            if (obj.invalidSeconds) {
                oBtn = '<span class="btn">立即抢购</span>';
            } else {
                obj.invalidSeconds = '0';
                oBtn = '<span class="btn sold">已抢光</span>';
            }
            if (!obj.picServerUrl1) obj.picServerUrl1 = '/wechat/img/watermark-logo.png';
            if (!obj.goodsName) obj.goodsName = '';
            if (!obj.subTitle) obj.subTitle = '';
            if (!obj.discountPrice) obj.discountPrice = '0.00';
            if (!obj.groupBuyPrice) obj.groupBuyPrice = '0.00';
            hotList += '<li class="hot-item" data-id="' + obj.id + '">'
                + '<a href="/activity/activityGoodsDetail/' + obj.id + '?template=' + template + '">'
                + '<img class="goods-img lazyload" src="/wechat/img/transparent.png" data-src="' + obj.picServerUrl1 + '?imageView2/1/w/222/h/222">'
                + '<p class="goods-title ellipsis">' + obj.goodsName + '</p>'
                + '<p class="goods-text ellipsis">' + obj.subTitle + '</p>'
                + '<p><span class="countDown" data-seconds="' + obj.invalidSeconds + '">0天0时0分0秒</span>'
                + '</p>'
                + '<div class="bottom">'
                + '<span class="price">'
                + '<em class="yuan">&#165;</em><span>' + obj.discountPrice + '</span>'
                + '</span>'
                + '<del><em class="yuan">&#165;</em>' + obj.groupBuyPrice + '</del>'
                + oBtn
                + '</div>'
                + '</a>'
                + '</li>';
        }
    }
    html = '<ul class="hot-list border-v">'
        + hotList
        + '</ul>'
        + '<ul class="goods-list ovh font0">'
        + goodsList
        + '</ul>'
        + loadMore;
    if (goodsListpage.length == 0 && recommendList.length == 0) {
        $('#container' + idx).addClass('goods-empty');
    }
    $('#container' + idx).html(html).addClass('current').siblings().removeClass('current');
    countDown($('#container' + idx));
    currentCenter(item, $nav);
    $(item).addClass('current').siblings().removeClass('current');
}

/**
 * 从列表页跳转详情页前，把已经分页加载的数据，页码，scrollTop存入sessionStorage
 */
function setStorage() {
    //if (是列表页) {
    var festivalList = JSON.stringify(festivalListData);//把json数据转为string字符串
    var idx = $nav.find('.current').index();
    var festivalParam = {
        pathname: window.location.pathname,
        nav: $nav.find('.current'),  //当前nav
        idx: idx,  //当前nav
        pageNum: $('#container' + idx).find('input.pageNum').length ? $('#container' + idx).find('input.pageNum').val() : 1,
        top: $(window).scrollTop()
    };
    festivalParam = JSON.stringify(festivalParam);
    sessionStorage.setItem('festivalList', festivalList);//sessionStorage只能存储string字符串
    sessionStorage.setItem('festivalParam', festivalParam);
    //}
}

/**
 * 返回列表页时，取存储的sessionStorage数据，有，则取数据渲染页面，并滑到预期位置
 * 删除sessionStorage存储的历史数据
 */
function getStorage() {
    var idx = $NavIdx.length ? $NavIdx.val() : 0,//默认加载0
        $obj = $nav.children('span').eq(idx);

    if (sessionStorage.getItem('festivalList') && sessionStorage.getItem('festivalParam')) {
        var festivalList = JSON.parse(sessionStorage.getItem('festivalList'));
        var festivalParam = JSON.parse(sessionStorage.getItem('festivalParam'));
        if (festivalParam.pathname != window.location.pathname) {
            sessionStorage.removeItem('festivalList');
            sessionStorage.removeItem('festivalParam');
            getGoodsList($obj);
            return;
        }
        if (festivalList != null) {
            //加载列表
            if (idx != festivalParam.idx) console.log('idx--festivalParam.idx:'+festivalParam.idx);
            showGoodsList($obj, festivalList[idx]);
            // 滚动到对应位置，并清除sessionStorage
            document.body.scrollTop = festivalParam.top;
            //sessionStorage.removeItem('festivalList');
            sessionStorage.removeItem('festivalParam');
        } else {
            getGoodsList($obj);
        }
    } else {
        getGoodsList($obj);
    }
}


//普通商品加载更多
function loadMore() {
    if (loadMoreFlag) return;
    var $container = $content.find('.current'),
        pageNum = parseInt($container.find(".pageNum").val()),
        pages = parseInt($container.find(".pages").val()),
        currentNav = $nav.find('.current');

    if (pageNum >= pages) return console.log('pageNum >= pages');
    loadMoreFlag = true;
    pageNum++;
    $container.find('.pageNum').val(pageNum);
    $container.find('.load-more').addClass('loading');
    getGoodsList(currentNav, true);
}

/*

function showGoodsListMore(item, res) {
    var html = '<!--第' + pageNum + '页-->',
        oSpanClass = '',
        oSpan = '',
        oPText = '',
        beginTime = '',
        endTime = '',
        list = res.list;
    for (var i in list) {
        //oSpanClass = '',
        //    oSpan = '',
        //    oPText = '非全场通用',
        //    beginTime = '',
        //    endTime = '';
        //if (list[i].faceValue.toString().length > 4 || list[i].faceValue > 999) oSpanClass = ' class="long"';
        //if (list[i].couponRange == 1) oPText = '全场通用';
        //if (list[i].couponTarget == 2) oSpan = '<span class="tip">新人专享</span>';
        //if (list[i].beginTime != "") {
        //    beginTime = list[i].beginTime.split(" ")[0].split("-")[0] + "." + list[i].beginTime.split(" ")[0].split("-")[1] + "." + list[i].beginTime.split(" ")[0].split("-")[2];
        //}
        //if (list[i].endTime != "") {
        //    endTime = list[i].endTime.split(" ")[0].split("-")[0] + "." + list[i].endTime.split(" ")[0].split("-")[1] + "." + list[i].endTime.split(" ")[0].split("-")[2];
        //}
        html += '<li class=\"goods-item\">'
            + '<a href="' + list[i].faceValue + '">'
            + '<img class="goods-img lazyload" src="/wechat/img/transparent.png" data-src="' + list[i].imgUrl + '">'
            + '<p class="goods-title ellipsis">' + list[i].title + '</p>'
            + '<div>'
            + '<span class="price"><em class="yuan">&#165;</em>' + list[i].price + '<span>'
            + '<del><em class="yuan">&#165;</em>' + list[i].price + '</del>'
            + '</div>'
            + '</a>'
            + '</li>';
    }
    ul.append(html);
    page.val(pageNum);
    //如果最后一页
    if (res.isLastPage) page.parent().hide();

}
*/


