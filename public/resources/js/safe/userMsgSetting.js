$(function() {
	var template = $("#template").val();
	$('.switch').click(function() {
		$(this).toggleClass("switchOn");
		var code = $(this).attr("id");
		var type = 0;
		if ($(this).attr("class").indexOf('switchOn') > -1) {
			type = 1;// 加
		} else {
			type = 0// 减
		}
		$.post('/safe/userMsgSettingUpdate', {
			'code' : code,
			'type' : type,
			'template' : template
		}, function(response) {
//			console.log(response.success);
		});
	});
});
