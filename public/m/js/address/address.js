//--------------------------------------异步加载数据----------------------------------------
//加载城市
var loadCity = function() {
    var province = $("#provinces").find("option:selected").text();
    //异步按省份查询城市
    $.post("/address/select", {
        province: province,
        template: $('#template').val()
    }, function(result) {
        //动态将省份遍历到页面
        if (result != '-1') {
            $(".city_list").html(result);
        }
    });
    //var provinecValue=$("#provinces").find("option:selected").val();
    //if(provinecValue==0){
    var obj = document.getElementById('seachcity');
    if (null != obj) {
        obj.options.length = 0;
        obj.options.add(new Option("请选择市", "0"));
    }
    var objs = document.getElementById('seachdistrict');
    if (null != objs) {
        objs.options.length = 0;
        objs.options.add(new Option("请选择区", "0"));
    }


    //}
};
//加载区域
var loadDistrict = function() {
    var city = $("#seachcity").find("option:selected").text();
    //异步按城市查询区域
    $.post("/address/select", {
        city: city,
        template: $('#template').val()
    }, function(result) {
        //动态将省份遍历到页面
        $(".district_list").html(result);
    });

};
//--------------------------------------校验----------------------------------------
//用户名称校验
var checkName = function() {
    var name = $("#name").val();
    if (name.length == 0 || name == null) {
        $("#namediv").html("<font style='color:#f00'>收货人姓名不能为空</font>");
        return false;
    } else {
        $("#namediv").html("");
    }
    reg = /^[a-z\d\u4E00-\u9FA5]+$/i;
    if (reg.test(name) == false) {
        $("#namediv").html("<font style='color:#f00'>收货人姓名不能包含特殊字符</font>");
        return false;
    } else if (name.length > 20) {
        $("#namediv").html("<font style='color:#f00'>收货人姓名长度不能超过20个字符</font>");
        return false;
    } else {
        $("#namediv").html("");
    }
    return true;
};

//手机号校验
var checkMobile = function() {
    var mobile = $("#mobile").val();
    if (mobile.length == 0 || mobile == null) {
        $("#mobilediv").html("<font style='color:#f00'>手机号不能为空</font>");
        return false;
    } else {
        $("#mobilediv").html("");
    }
    reg = /^1[3|4|5|7|8]\d{9}$/; //历史手机号码正则表达式^1[3|4|5|8][0-9]\d{4,8}$
    if (reg.test(mobile) == false) {
        $("#mobilediv").html("<font style='color:#f00'>手机号格式不正确</font>");
        return false;
    } else {
        $("#mobilediv").html("");
    }
    return true;
};

//省市区校验
var checkProvince = function() {
    var provinces = $("#provinces").val();
    if (provinces == 0) {
        $("#addressDiv").html("<font style='color:#f00'>省份不能为空</font>");
        return false;
    } else {
        $("#addressDiv").html("");
    }
    return true;
};
var checkCity = function() {
    var seachcity = $("#seachcity").val();
    if (seachcity == 0) {
        $("#addressDiv").html("<font style='color:#f00'>城市不能为空</font>");
        return false;
    } else {
        $("#addressDiv").html("");
    }
    return true;
};
var checkDistrict = function() {
    var seachdistrict = $("#seachdistrict").val();
    if (seachdistrict == 0) {
        $("#addressDiv").html("<font style='color:#f00'>地区不能为空</font>");
        return false;
    } else {
        $("#addressDiv").html("");
    }
    return true;
};
var addressInfo = function() {
    var address = $("#address").val();
    if (address == 0) {
        $("#addressDetailDiv").html("<font style='color:#f00'>详细地址不能为空</font>");
        return false;
    } else {
        $("#addressDetailDiv").html("");
    }
    return true;
};


//保存地址
function save() {
    //  var flag = true;
    if (!checkName() || !checkMobile() || !checkProvince() || !checkCity() || !checkDistrict() || !addressInfo()) {
        //      flag=false;
    } else {
        var template = $("#template").val();
        var name = $("#name").val();
        var id = $("#address_id").val();
        var mobile = $("#mobile").val();
        var senderzip = $("#senderzip").val();
        var district = $("#seachdistrict").find("option:selected").val();
        if (undefined == district || null == district || '' == district) {
            district = $("#locationInfo_id").val();
        }
        var address = $("#address").val();
        var source = $("#source").val();
        var lotteryWinningId = $("#lotteryWinningId").val();
        if (source == "buynow" || source == 1) {
            //source="buynow";
        } else if (source == "center") {
            source = "center";
        } else if (source == "lottery") {
            //source="lottery";
        } else {
            source = "queryAddress";
        }

        var cardId = $("#cardId").val();

        var url = "";
        //修改地址
        if (null != id && '' != id) {
            $.post('/address/updateAddress', {
                id: id,
                name: name,
                mobile: mobile,
                senderzip: senderzip,
                locationId: district,
                address: address,
                template: $('#template').val()
            }, function(result) {
                if (!result.success) {
                    alert(result.message);
                    return;
                }
                if (template != null) {
                    if (source == "buynow" || source == 1) {
                        url = "/order/buynow?template=" + template + "&source=" + source + "&addressId=" + id;
                    } else if (source == 'lottery') {
                        url = '/address/choseAddress?template=' + template + '&source=lottery&lotteryWinningId=' + $("#lotteryWinningId").val();
                    } else {
                        url = "/address/queryAddress?source=" + source + "&template=" + template;
                    }
                } else {
                    if (source == "buynow" || source == 1) {
                        url = "/order/buynow?source=" + source + "&addressId=" + id;
                    } else if (source == 'lottery') {
                        url = '/address/choseAddress?template=' + template + '&source=lottery&lotteryWinningId=' + $("#lotteryWinningId").val();
                    } else {
                        url = "/address/queryAddress?source=" + source;
                    }

                }


                if (cardId != "") {
                    url += "&cardId=" + cardId;
                }

                window.location.href = url;
            });
        } else {
            //新增地址
            $.post('/address/addAddress', {
                name: name,
                mobile: mobile,
                senderzip: senderzip,
                locationId: district,
                address: address,
                template: $('#template').val()
            }, function(result) {
                if (!result.success) {
                    alert(result.message);
                } else {
                    var newId = result.map['address'].id;
                    if (template != null) {
                        if (source == "buynow" || source == 1) {
                            url = "/order/buynow?template=" + template + "&source=" + source + "&addressId=" + newId;
                        } else if (source == 'lottery') {
                            url = '/address/choseAddress?template=' + template + '&source=lottery&lotteryWinningId=' + $("#lotteryWinningId").val();
                        } else {
                            url = "/address/queryAddress?source=" + source + "&template=" + template;
                        }
                    } else {
                        if (source == "buynow" || source == 1) {
                            url = "/order/buynow?source=" + source + "&addressId=" + newId;
                        } else if (source == 'lottery') {
                            url = '/address/choseAddress?template=' + template + '&source=lottery&lotteryWinningId=' + $("#lotteryWinningId").val();
                        } else {
                            url = "/address/queryAddress?source=" + source;
                        }
                    }
                }

                if (cardId != "") {
                    url += "&cardId=" + cardId;
                }

                window.location.href = url;
            });
        }
        //       flag=true;
    }
    //  return flag;
};
//-------------------------------------------修改------------------------------------------
var city = function() {
    var province = $("#provinces").find("option:selected").text();
    //异步按省份查询城市
    $.post("/address/select", {
        province: province,
        template: $('#template').val()
    }, function(result) {
        //动态将省份遍历到页面
        if (result != '-1') {
            $(".city_list").html(result);
        }
    });
};
//加载区域
var districtByCity = function() {
    var city = $("#seachcity").find("option:selected").text();
    //异步按城市查询区域
    $.post("/address/select", {
        city: city
    }, function(result) {
        //动态将省份遍历到页面
        $(".district_list").html(result);
    });

};
//加载省份
var loadProvinces = function() {
    //异步查询所有省份
    $.post("/address/selectProvinces", function(result) {
        //动态将省份遍历到页面
        if (result != '-1') {
            $(".province_list").html(result);
        }
    });
    var provinecValue = $("#provinces").find("option:selected").val();
    if (provinecValue == 0121) {
        var obj = document.getElementById('seachcity');
        obj.options.length = 0;
        obj.options.add(new Option("请选择", "0"));

        var objs = document.getElementById('seachdistrict');
        objs.options.length = 0;
        objs.options.add(new Option("请选择", "0"));

    }
};

//提交删除地址
var delAddress = function(id) {
    var template = $("#template").val();
    var source = $("#source").val();
    if (source != "buynow") {
        source = "center";
    } else {
        source = "buynow";
    }
    //异步查询所有省份
    $.post("/address/removeAddress", {
            id: id,
            template: template
        },
        function(result) {
            if (!result.success) {
                alert(result.message);
            } else {
                if (template != null) {
                    location.href = "/address/queryAddress?source=" + source + "&template=" + template;
                } else {
                    location.href = "/address/queryAddress?source=" + source;
                }
            }
        });
};

//跳转地址新增界面
var showAddAddress = function() {
    var template = $("#template").val();
    var source = $("#source").val();
    if (source != "buynow") {
        source = "center";
    } else {
        source = "buynow";
    }
    if (template != null) {
        location.href = "/address/showLocation?template=" + template + "&source=" + source;
    } else {
        location.href = "/address/showLocation?&source=" + source;
    }
};
//设为默认收货地址
var setReceiveAddress = function(id) {
    var template = $("#template").val();
    console.log(id);
    var source = $("#source").val();
    if (source != "buynow") {
        source = "center";
    } else {
        source = "buynow";
    }
    $.post('/address/setReceiveAddress', {
        id: id,
        template: $('#template').val()
    }, function(result) {
        if (!result.success) {
            alert(result.message);
        } else {
            if (template != null) {
                location.href = "/address/queryAddress?source=" + source + "&template=" + template;
            } else {
                location.href = "/address/queryAddress?source=" + source;
            }
        }
    });
};
//设为默认收货地址
var setSendAddress = function(id) {
    var template = $("#template").val();
    var source = $("#source").val();
    $.post('/address/setSendAddress', {
        id: id,
        template: $('#template').val()
    }, function(result) {
        if (!result.success) {
            alert(result.message);
        } else {
            if (template != null) {
                location.href = "/address/queryAddress?source=" + source + "&template=" + template;
            } else {
                location.href = "/address/queryAddress?source=" + source;
            }
        }
    });
};
//返回上一步
var goBack = function() {
    var template = $("#template").val();
    var source = $("#source").val();
    var cardId = $("#cardId").val();
    var url = location.href;
    if (source == "buynow") {
        //url="/order/buynow";
        //source=1;
        url = "/address/choseAddress";
    } else if (source == "center") {
        url = "/user/center";
    } else if (source == "queryAddress" && url.indexOf("/address/queryAddress") > -1) {
        url = "/user/center";
    } else if (source == "showLocation" && url.indexOf("/address/queryAddress") > -1) {
        url = "/user/center";
    } else if (source == "1") {
        url = "/address/choseAddress";
    } else {
        url = "/address/queryAddress";
    }
    if (template != null) {
        url += "?template=" + template;
        if (source != "queryAddress") {
            url += "&source=" + source;
        }
        if (cardId != "") {
            url += "&cardId=" + cardId;
        }
    }
    location.href = url;
};

//选择收货地址
var chkLocation = function(id, source, cardId) {
    if (source == 'lottery') {
        savelotteryInfo(id);
        return false;
    }
    var template = $("#template").val();
    $("#li_" + id).addClass('default-setting').siblings().removeClass('default-setting');
    //$("#li_"+id).parents('.item').addClass('default-setting').siblings().removeClass('default-setting');
    var html = "/order/buynow?template=" + template + "&source=" + source + "&addressId=" + id;
    if (cardId != "") {
        html += "&cardId=" + cardId;
    }

    location.href = html;
};

//保存用户中奖信息收货地址
function savelotteryInfo(id) {
    var template = $('#template').val();
    var lotteryWinningId = $('#lotteryWinningId').val();
    var $obj = $('#li_' + id);
    var params = {
        lotteryWinningId: lotteryWinningId,
        linkman: $obj.find('.consignee').html(),
        mobile: $obj.find('.consignee-tel').html(),
        address: $obj.find('.address-info').text().replace('[默认地址]', '').trim()
    };
    $cover.show();
    $.ajax({
        url: '/greenCoinLottery/savelotteryInfo',
        type: 'post',
        data: params,
        dataType: 'json',
        success: function(res) {
            // $cover.hide();
            alert(res.message);
            if (res.code == 0) {
                // setTimeout(function() {
                url = '/greenCoinLottery/lotteryWinningDetail?template=' + template + '&lotteryWinningId=' + lotteryWinningId;
                window.location.href = url;
                // }, 300);
            }
        },
        error: function(res) {
            $cover.hide();
            alert(res.responseText);
        }
    });
}

//onclick="location.href='/address/showLocation?id=${addres.id}&source=<#if source??>${source}<#else>queryAddress</#if>&template=${template?default('esmall')}&cardId=${cardId?default('')}'"
/**
 *编辑地址 .address-edit
 */
$(function() {
    var lotteryWinningId = $("#lotteryWinningId").val();
    var source = $("#source").val();
    var template = $("#template").val();

    $('.address-list').on('touchstart mousedown', '.item .address-edit', function(event) {
        event.stopPropagation();
        var id = $(this).attr("data-id");
        if (source == '') {
            source = 'queryAddress';
        }
        var url = '/address/showLocation?id=' + id + "&source=" + source + "&template=" + template;
        if (lotteryWinningId) {
            url += '&lotteryWinningId=' + lotteryWinningId;
        }
        location.href = url;
        return false;
    }).on('touchstart mousedown', '.item .address-del', function(event) {
        event.stopPropagation();
        //判断是否默认地址
        if ($(this).parents('.item').hasClass('default-setting')) {
            //不删除默认地址
            alert('默认地址不能删除哦');
        } else {
            if (confirm('确定要删除该地址吗？')) {
                delAddress($(this).attr("data-id"));
                $(this).parents('.item').remove();
            }
        }
    });

    //新增地址
    $('#addAddress').on('click', function() {
        var cardId = $("#cardId").val();
        var lotteryWinningId = $("#lotteryWinningId").val();
        var url = "/address/showLocation?cardId=" + cardId + "&source=" + source + "&template=" + template;
        if (source == 'lottery') {
            url += '&lotteryWinningId='+lotteryWinningId;
        }
        window.location.href = url;
    });
});
