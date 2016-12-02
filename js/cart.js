/*
 	1、读取cookie   readCookie
 	2、设置cookie   setCookie
 	3、将cookie中的数据渲染到页面上   initData
 	4、数量增加
 	5、数量减少
 	6、直接输入
 	7、删除
 	8、选中
 	9、结算信息填充
 	zolCart = {
 		1000101:{
			"goods-id": 10001,
			"goods-package": 1000101,
			"package-price": 3000,
			"amount": 3
 		},
 		1000102:{
			"goods-id": 10001,
			"goods-package": 1000102,
			"package-price": 4000,
			"amount": 3
 		}
		
 	}

 	{
	"10001":{
		"shop-name":"瑞意摄影器材",
		"shop-id": 20001,
		"goods-id": 10001,
		"goods-name": "NIKON尼康 DX 18-300mm f/3.5-6.3G ED VR 签约代理产品有保障",
		"goods-price": "3608.00",
		"goods-color": "黑色",
		"goods-package":{
			"1000101": "官方标配",
			"1000102": "套餐一",
			"1000102": "套餐二",
			"1000102": "套餐三",
			"1000102": "套餐四"
		},
		"stock": 900
	}
}
*/
//手动写入cookie
/*var docCookie = {
	1000101:{
		"goods-id": 10001,
		"goods-package": 1000101,
		"package-price": 3000,
		"amount": 3
		},
		1000102:{
		"goods-id": 10001,
		"goods-package": 1000101,
		"package-price": 4000,
		"amount": 2
		},
		1000103:{
		"goods-id": 10001,
		"goods-package": 1000101,
		"package-price": 5000,
		"amount": 2
		},
		1000104:{
		"goods-id": 10001,
		"goods-package": 1000101,
		"package-price": 6000,
		"amount": 1
		},
		1000105:{
		"goods-id": 10001,
		"goods-package": 1000101,
		"package-price": 7000,
		"amount": 1
		}
};
$.cookie('zol_cart',JSON.stringify( docCookie ),{expires:1,path:'/'});*/





$(function(){
	//添加公共样式topbar
	$('.topbar-wrapper').load('topbar.html');

	var zolCart = {
		storeInfo: $('.my-list-wrapper'),//商品展示区
		data: null,//商品信息
		pay: {},//点击复选按钮，记录总价格
		zolCart: {},//本地cookie
		amount: 0,//收藏数量
		init:function(){
			var that = this;
			//读取本地cookie
			this.readCookie();
			//console.log( this.zolCart  );
			//获取商品信息
			$.getJSON( 'js/cartdata.json',function(data){
				//将获取的数据存储到that.data
				that.data = data;
				//console.log( that.data );
				//遍历本地cookie（k：套餐编号 v:{}(json该编号的相关信息)）
				for( var key in that.zolCart ){
					(function(k){
						//获取商品的goodId
						var goodsId = that.zolCart[k]['goods-id'];
						
						//创建一个元素
						var div = $( '<div class="my-list"></div>' );
						//给div设置自定义属性
						div.attr({
							"data-goodsid":goodsId,
							"data-package":k
						});
						div.load( 'cartStoreInfor.html',function(){
							//信息填充
							//div.parents('.shop-name-info').find('a').html(data[goodsId]['shop-name']);
							div.find('.shop-name-info a').html( data[goodsId]['shop-name'] );
							div.find('.inforbox .tit a').html( data[goodsId]['goods-name'] );
							div.find('.store-item .inforbox .color span').html( data[goodsId]['goods-color'] );
							div.find('.store-item .inforbox .info-con span em').html( data[goodsId]['goods-package'][k] );
							div.find('.s-price em').html( that.zolCart[k]['package-price'] );
							div.find('.goods-amount').val( that.zolCart[k]['amount'] );
							var totalMoney = parseInt(that.zolCart[k]['amount'])*that.zolCart[k]['package-price'];
							div.find('.s-totle').html( totalMoney );

							//放置在商品展示区
							that.storeInfo.append( div );
						} );
					})(key);
				}
			} );
			
			//方法调用
			this.increase();
			this.decrease();
			this.input();
			this.remove();
			this.goodsSelected();
			this.selectAll();
		},
		//点击+，数量增大
		increase:function(){
			var that = this;
			//点击事件绑定
			this.storeInfo.on( 'click','.increase',function(){
				//获取数量
				that.amount = parseInt( $(this).prev().val() );
				//获取
				var goodsId = $(this).parents('.my-list').data('goodsid');
				var stock = that.data[goodsId]['stock'];
				//判断是否大于库存
				if( that.amount >= stock ){
					return;
				}
				that.amount++;
				//放回框中
				$(this).prev().val(that.amount);
				//回写cookie
				that.handleCookie( $(this).prev() );

				//处理支付页面
				that.handlePay($(this));
			} );
			
		},
		//点击-，数量减少
		decrease: function(){
			var that = this;
			//点击事件绑定
			this.storeInfo.on( 'click','.decrease',function(){
				//获取数量
				that.amount = parseInt( $(this).next().val() );
				//判断是否小于1
				if( that.amount <= 1 ){
					return;
				}
				that.amount--;
				//放回框中
				$(this).next().val(that.amount);
				//回写cookie
				that.handleCookie( $(this).next() );

				//处理支付页面
				that.handlePay($(this));
			} );
			
		},
		//直接输入
		input:function(){
			var that = this;
			this.storeInfo.on( 'input','.goods-amount',function(){
				//获取商品套餐
				var goodsId = $(this).parents('.my-list').data('goodsid');
				var package = $(this).parents('.my-list').data('package');
				//获取该库存
				var stock = that.data[goodsId].stock;
				var amount = $(this).val();
				amount = parseInt( amount );
				//判断amount是否符合要求
				if( amount >= stock ){
					$(this).val(stock);
					that.amount = stock;
					//回写cookie
					that.handleCookie( $(this) );
					//处理支付页面
					that.handlePay($(this));
					return;
				}
				if( isNaN( amount ) || amount == 0 ){
					$(this).val(1);
				}else{
					$(this).val(amount);
				}
				
				//重新给cart中的数量赋值
				that.zolCart[package].amount = amount;
				that.setCookie();
				that.amount = amount;
				//回写cookie
				that.handleCookie( $(this) );
				//处理支付页面
				that.handlePay($(this));
			} );
			
		},
		//删除单件
		remove: function(){
			var that = this;
			this.storeInfo.on( 'click','.delete-goods',function(){
				if( confirm('确定删除宝贝吗？') ){
					//从页面消失
					$(this).parents('.my-list').remove();
					//从cookie中消失
					var package = $(this).parents('.my-list').data('package');
					delete that.zolCart[package];
					that.setCookie();
				}
			} );
		},
		goodsSelected: function(){
			var that = this;
			//复选框状态改变时
			this.storeInfo.on( 'change','.goods-selected',function(){
				/*var myList = $(this).parents('.my-list');
				var package = myList.data('package');
				//获取选中商品总价
				var total = myList.find('.s-totle').html();
				//如果已被选中，再点击取消
				if( myList.find('.store-item input[type="checkbox"]').prop('checked') ){
					that.pay[package] = total;
				}else{
					delete that.pay[package];
				}*/
				//判断是否需要选中或者撤销全选按钮的选中状态
				var allCkeckedBox = that.storeInfo.find('input[type="checkbox"]');
				var allChecked = that.storeInfo.find( 'input[type="checkbox"]:checked' );
				if( allCkeckedBox.length == allChecked.length ){
					$('.all').prop('checked',true);
				}else{
					$('.all').prop('checked',false);
				}
				//处理支付页面
				that.handlePay( $(this) );
			} );
		},
		handlePay: function( witchTouch ){
			var goodsAmount = $('.selected-goods-amount');
			var goodsMoney = $('.total-cart-price');
			var totalNum = 0;
			var totalMoney = 0;

			var myList = witchTouch.parents('.my-list');
			var package = myList.data('package');
			//获取选中商品总价
			var total = myList.find('.s-totle').html();
			//如果已被选中，再点击取消
			if( myList.find('.store-item input[type="checkbox"]').prop('checked') ){
				this.pay[package] = total;
			}else{
				delete this.pay[package];
			}
			//遍历pay对象，获取件数和付款总数
			for( var key in this.pay ){
				totalNum++;
				totalMoney += parseFloat( this.pay[key] );
			}
			//给总价和总量重新赋值
			goodsAmount.html( totalNum );
			goodsMoney.html( totalMoney.toFixed(2) );
		},
		selectAll: function(){
			var that = this;
			$('.all').click(function(){
				//获取全选按钮的状态
				var status = $('.all').prop('checked');
				var allCheckedBox = that.storeInfo.find('input[type="checkbox"]');
				//判断
				if(status){
					allCheckedBox.prop('checked',true);
				}else{
					allCheckedBox.prop('checked',false);
				}
				//触发商品前面的复选框
				allCheckedBox.change();
			});
		},
		//回写cookie
		handleCookie:function( input ){
			var myList = input.parents('.my-list');
			var goodsId = myList.data('.goodsid');
			var package = myList.data( 'package' );
			//处理总价
			var price = this.zolCart[package]['package-price'];
			var totalMoneyBox = input.parents('.goods-detail').find('.s-totle');
			var totalMoney = (price*this.amount).toFixed(2);
			console.log( price,totalMoney );
			totalMoneyBox.html(totalMoney);

			//重新给cart中的数量赋值
			this.zolCart[package].amount = parseInt( input.val() );
			this.setCookie();
		},
		//读取本地cookie
		readCookie: function(){
			this.zolCart = $.cookie( 'zol_cart' ) || '{}';
			this.zolCart = JSON.parse( this.zolCart );
		},
		//设置cookie
		setCookie: function(){
			$.cookie( 'zol_cart',JSON.stringify( this.zolCart ),{expires:1,path:'/'} );
		}
	}
	zolCart.init();

});





