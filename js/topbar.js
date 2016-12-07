

$(function(){

	//读取cookie长度，并赋值给购物车状态
	var readCookieLength = {
		priceWrapper: $('.top-goods-amount'),
		
		init: function(){
			this.readCookie();
		},
		readCookie: function(){
			var that = this;
			setInterval(function(){

				//读取cookie()
				var cart = $.cookie('zol_cart') || '{}';

				//将JSON字符串转化为JSON对象
				cart = JSON.parse( cart );
				//
				var length = 0;
				//获取cookie中商品数量
				for( var key in cart ){
					length++;
				}
				
				//给对应盒子赋值
				that.priceWrapper.html(length);
			},500);
		}
	};
	readCookieLength.init();






});










