$(function() {
  // 输入框的值变化时去除对应的错误提示
  $("input[name='password']").bind('input propertychange', function() {
    $(".error_password").html("");
  });
  $("input[name='pass_confirm']").bind('input propertychange', function() {
    $(".error_pass_confirm").html("");
  });
  $("input[name='password_old']").bind('input propertychange', function() {
    $(".error_password_old").html("");
  });
  $("input[name='validateMobile']").bind('input propertychange', function() {
    $(".error_validateMobile").html("");
  });
  $("input[name='code']").bind('input propertychange', function() {
    $(".error_code").html("");
  });
});

//设置提现密码
function safeSet(flag) {
  var inValid = true;
  var template = $("#template").val();
  var password = $("input[name='password']").val();
  var pass_confirm = $("input[name='pass_confirm']").val();
  //设置提现密码
  if (flag == 0) {
    if (password == null || password == "") {
      $('.error_password').html("请输入提现密码!");
      inValid = false;
      return;
    } else {
      $('.error_password').html("");
    }
    if (password.length < 6 || password.length > 20) {
      $('.error_password').html("密码只允许输入6-20字符!");
      inValid = false;
      return;
    } else {
      $('.error_password').html("");
    }
    if (pass_confirm == null || pass_confirm == "") {
      $('.error_pass_confirm').html("请再次输入提现密码!");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
    if (pass_confirm.length < 6 || pass_confirm.length > 20) {
      $('.error_pass_confirm').html("密码只允许输入6-20字符!");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
    if (password != pass_confirm) {
      $('.error_pass_confirm').html("两次输入密码不一致！");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
  } else if (flag == 1) { //修改提现密码
    var password_old = $("input[name='password_old']").val();
    var extractPassword = $("#extractPassword").val();
    if ($.md5(password_old) != extractPassword) {
      $('.error_password_old').html("旧密码输入不正确!");
      inValid = false;
      return;
    } else {
      $('.error_password_old').html("");
    }
    if (password == null || password == "") {
      $('.error_password').html("请输入新的提现密码!");
      inValid = false;
      return;
    } else {
      $('.error_password').html("");
    }
    if (password.length < 6 || password.length > 20) {
      $('.error_password').html("密码只允许输入6-20字符!");
      inValid = false;
      return;
    } else {
      $('.error_password').html("");
    }
    if (pass_confirm == null || pass_confirm == "") {
      $('.error_pass_confirm').html("请再次输入新的提现密码!");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
    if (pass_confirm.length < 6 || pass_confirm.length > 20) {
      $('.error_pass_confirm').html("密码只允许输入6-20字符!");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
    if (password != pass_confirm) {
      $('.error_pass_confirm').html("两次输入密码不一致！");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
  } else if (flag == 2) { //忘记密码
    var code = $("input[name='code']").val();
    var validateMobile = $("input[name='validateMobile']").val();
    if (validateMobile == null || validateMobile == "") {
      $('.error_validateMobile').html("请输入手机号码！");
      inValid = false;
      return;
    } else {
      $('.error_validateMobile').html("");
    }
    var telReg = !!validateMobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    //如果手机号码不能通过验证
    if (telReg == false) {
      $('.error_validateMobile').html("手机号码输入不正确！");
      inValid = false;
      return;
    } else {
      $('.error_validateMobile').html("");
    }
    if (code == null || code == "") {
      $('.error_code').html("请输入手机验证码!");
      inValid = false;
      return;
    } else {
      $('.error_code').html("");
    }
    if (password == null || password == "") {
      $('.error_password').html("请输入新的提现密码!");
      inValid = false;
      return;
    } else {
      $('.error_password').html("");
    }
    if (password.length < 6 || password.length > 20) {
      $('.error_password').html("密码只允许输入6-20字符!");
      inValid = false;
      return;
    } else {
      $('.error_password').html("");
    }
    if (pass_confirm == null || pass_confirm == "") {
      $('.error_pass_confirm').html("请再次输入新的提现密码!");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
    if (pass_confirm.length < 6 || pass_confirm.length > 20) {
      $('.error_pass_confirm').html("密码只允许输入6-20字符!");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
    if (password != pass_confirm) {
      $('.error_pass_confirm').html("两次输入密码不一致！");
      inValid = false;
      return;
    } else {
      $('.error_pass_confirm').html("");
    }
  } else if (flag == 3) { //校验原手机号
    var code = $("input[name='code']").val();
    var password = "";
    var validateMobile = $("input[name='validateMobile']").val();
    if (validateMobile == null || validateMobile == "") {
      $('.error_validateMobile').html("请输入手机号码！");
      inValid = false;
      return;
    } else {
      $('.error_validateMobile').html("");
    }
    var telReg = !!validateMobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    //如果手机号码不能通过验证
    if (telReg == false) {
      $('.error_validateMobile').html("手机号码输入不正确！");
      inValid = false;
      return;
    } else {
      $('.error_validateMobile').html("");
    }
    if (code == null || code == "") {
      $('.error_code').html("请输入手机验证码!");
      inValid = false;
      return;
    } else {
      $('.error_code').html("");
    }
  } else if (flag == 4) { //绑定新的手机号
    var code = $("input[name='code_new']").val();
    var password = "";
    var validateMobile = $("input[name='validateMobile_new']").val();
    if (validateMobile == null || validateMobile == "") {
      $('.error_validateMobile').html("请输入手机号码！");
      inValid = false;
      return;
    } else {
      $('.error_validateMobile').html("");
    }
    var telReg = !!validateMobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    //如果手机号码不能通过验证
    if (telReg == false) {
      $('.error_validateMobile').html("手机号码输入不正确！");
      inValid = false;
      return;
    } else {
      $('.error_validateMobile').html("");
    }
    if (code == null || code == "") {
      $('.error_code').html("请输入手机验证码!");
      inValid = false;
      return;
    } else {
      $('.error_code').html("");
    }
  }
  if (inValid) {
    $.ajax({
      type: "post",
      url: "/safe/safeSet",
      data: {
        flag: flag,
        validateMobile: validateMobile,
        code: code,
        extractPassword: password,
        template: template
      },
      success: function(data) {
        $(".popup_tips").html(data.message);
        $(".popup").show();
        $(".popup_bg").show();
        if (data.success) {
          if (flag == 3) {
            showView();
          } else {
            setTimeout(function() {
              location.href = "/safe/safe?template=" + template;
            }, 3000);
          }
        }
      }
    });
  }
}
var send = false; //是否发送
var wait = 60; //时间
function time(action) { //o为按钮的对象，p为可选，这里是60秒过后，提示文字的改变
  var validateMobile = $("#validateMobile").val();
  var phone = $("input[name='validateMobile']").val();
  if (action == 'new_phone_binding') {
    phone = $("input[name='validateMobile_new']").val();
  }
  if (phone == null || phone == "") {
    $('.error_validateMobile').html("请输入手机号码！");
    return;
  } else {
    $('.error_validateMobile').html("");
  }
  var telReg = !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
  //如果手机号码不能通过验证
  if (telReg == false) {
    $('.error_validateMobile').html("手机号码输入不正确！");
    return;
  } else {
    $('.error_validateMobile').html("");
  }
  if (action != 'new_phone_binding') {
    if (validateMobile != null) {
      if (validateMobile != phone) {
        $(".popup_tips").html("您还没有绑定该手机号，请先去绑定。");
        $(".popup").show();
        $(".popup_bg").show();
        setTimeout(function() {
          location.href = "/safe/bind_phone?template=" + $("#template").val();
        }, 1000);
        return;
      } else {
        $('.error_validateMobile').html("");
      }
    }
  }
  //	else{
  //		phone = $("input[name='validateMobile_new']").val()
  //	}
  if (!send) {
    $.ajax({
      url: "/sms/sendSms",
      type: 'post',
      data: {
        "phone": phone,
        "action": action,
        "template": $('#template').val()
      },
      success: function(data) {
        send = true;
        if (!data.success) {
          $(".popup_tips").html("网络延迟，请稍后重试~");
          $(".popup").show();
          $(".popup_bg").show();
        } else {
          $(".popup_tips").html("验证码发送成功，请及时检查您的手机。");
          $(".popup").show();
          $(".popup_bg").show();
        }
      },
      error: function(data) {
        alert(data.responseText);
      }
    });
    send = true;
  }
  var o = $("input[name='getCode']");
  var p = $(".error_code");
  if (wait == 0) {
    o.removeAttr("disabled");
    o.val("点击发送验证码"); //改变按钮中value的值
    wait = 60;
    send = false;
  } else {
    p.html("如果您在1分钟内没有收到验证码，请检查您填写的手机号码是否正确或重新发送");
    o.attr("disabled", true); //倒计时过程中禁止点击按钮
    o.val(wait + "秒后重新获取验证码"); //改变按钮中value的值
    wait--;
    setTimeout(function() {
        time(action); //循环调用
      },
      1000);
  }
}
//更换手机号
function showBtn() {
  $("#step_img1").show();
  $("#step_img2").hide();
  $("#li_mobile_0").show();
  $("#li_mobile_1").hide();
  $(".updateMobile").hide();
  $(".checkMobile").show();
  //	$(".updateMobile_submit").show();
  $("#li_code_1").show();
  //	$("#li_remark_1").show();
  //	$("#li_code_2").show();
  //	$("#li_remark_2").show();
  $(".head_c").html("验证原手机号");
  //	$(".head_c").html("更改手机号");
}

//隐藏值显示
function showView() {
  $("#step_img1").hide();
  $("#step_img2").show();
  wait = 0;
  $("#li_mobile_0").hide();
  $("#li_mobile_1").hide();
  $(".updateMobile").hide();
  $(".checkMobile").hide();
  $("#li_code_1").hide();
  $("#li_remark_1").hide();

  $("#li_mobile_2").show();
  $("#li_code_2").show();
  $("#li_remark_2").show();
  $(".updateMobile_submit").show();
  $(".head_c").html("绑定新手机号");
}
