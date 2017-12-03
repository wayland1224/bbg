var selectImgFlag = false;

window.onload = init;
function init(){
	$("#file").on("change",function(){
		$("#myform").submit();
		/*setImagePreview(document.getElementById("file"),document.getElementById("preview"));*/
	});
}

function selectImg(){
	var ie = navigator.appName=="Microsoft Internet Explorer" ? true : false; 
	if(ie){ 
		document.getElementById("file").click();
	}else{
		var a = document.createEvent("MouseEvents");//FF的处理 
		a.initEvent("click", true, true);
		document.getElementById("file").dispatchEvent(a);
	}
}

function setImagePreview(docObj,imgObjPreview) {
	//允许上传图片的格式为jpg.gif.png.jpeg
	var img_url = docObj.value;
	var points = img_url.substring(img_url.lastIndexOf("."), img_url.length);
	var point = points.toLowerCase();
	if ((point != ".jpg" )&&(point != ".gif" )&&( point != ".jpeg" )&&( point != ".png" )) {
		top.openPopupTips("请选择jpg或gif或jpeg或png格式的文件!");
		return false;
	}else{
		if(docObj.files && docObj.files[0]){
			//火狐下，直接设img属性
	/*		imgObjPreview.style.display = 'block';
			imgObjPreview.style.width = '195px';
			imgObjPreview.style.height = '110px';                    
	*/		//imgObjPreview.src = docObj.files[0].getAsDataURL();
			//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式  
			//imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
			var image = new Image();
			image.src = window.URL.createObjectURL(docObj.files[0]);
			image.onload = function(){
				imgObjPreview.src = image.src;
				imgObjPreview.style.height = "100px";
				imgObjPreview.style.width = "100px";
				/*if(image.width>200&&image.height>200){
					imgObjPreview.style.paddingTop="0px";
					imgObjPreview.style.width="400px";
					imgObjPreview.style.height="300px";
				}else if(image.width>200&&image.height<=200){
					imgObjPreview.style.paddingTop=(200-image.height)/2+"px";
					imgObjPreview.style.width="400px";
					imgObjPreview.style.height=image.width/200*image.height+"px";
				}else if(image.width<=200&&image.height>200){
					imgObjPreview.style.paddingTop=0+"px";
					imgObjPreview.style.width=image.height/200*image.width+"px";
					imgObjPreview.style.height="200px";
				}else{
					imgObjPreview.style.paddingTop=(200-image.height)/2+"px";
					imgObjPreview.style.width=image.width+"px";
					imgObjPreview.style.height=image.height+"px";
				}*/
				console.log( window.URL.createObjectURL(docObj.files[0]));
				document.getElementById("file").src = window.URL.createObjectURL(docObj.files[0]);
			};
			selectImgFlag = true;
		}else {
			//IE下，使用滤镜
			docObj.select();
			var imgSrc = document.selection.createRange().text;
			//必须设置初始大小
	/*		localImagId.style.width = "195px";
			localImagId.style.height = "110px";
	*/		//图片异常的捕捉，防止用户修改后缀来伪造图片
			try{
				imgObjPreview.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				imgObjPreview.filters.item("DXImageTransform.Microsoft.AlphaImagedLoader").src = imgSrc;
				document.getElementById("headImg").filters.item("DXImageTransform.Microsoft.AlphaImagedLoader").src = imgSrc;
				selectImgFlag = true;
			}catch(e){
				top.openPopupTips("您上传的图片格式不正确，请重新选择!");
				return false;
			}
			document.selection.empty();
		}
	}
	return true;
}
