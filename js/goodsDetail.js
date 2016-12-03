

$(function(){

	/**1添加公共样式topbar*/
	$('.topbar-wrapper').load('topbar.html');

	/**2三级导航*/

	/**
		3放大镜效果
	*/
	var imgGlass = {
		sImgWrap: $('.zs-big-pic'),//小图片盒子
		largeImgWrap: $('.zoom-big'),//大图片盒子
		largeImg: $('.zoom-big img'),//大图片
		glass: $('.magicZoomPup'),//放大镜
		images: $('.zs-focus-list li'),//图片列表

		//初始化方法
		init: function(){

			this.imgsWitch();
			this.enter();
			this.mousemove();
			this.leave();
			
		},

		//鼠标进入时间
		enter: function(){
			var that = this;
			this.sImgWrap.mouseenter(function(){
				//放大镜及大图片显示
				that.glass.fadeIn();
				that.largeImgWrap.fadeIn();
			});
		},

		//鼠标移动事件
		mousemove: function(){
			var that = this;
			var wraplLeft = this.sImgWrap.offset().left;
			var wrapTop = this.sImgWrap.offset().top;
			this.sImgWrap.mousemove(function(ev){
				//计算放大镜的left及top值
				var left = ev.pageX - wraplLeft - that.glass.width()/2;
				var t = ev.pageY - wrapTop - that.glass.height()/2 ;
				//处理边界
				t =  t < 0 ? 0 : ( ( t > 200 ) ? 200 : t );
				left = left < 0 ? 0 : ( ( left > 200 ) ? 200 : left );
				//设置放大镜和大图片的left和top
				that.glass.css({
					left: left,
					top: t
				});
				that.largeImg.css({
					left: -2*left,
					top: -2*t
				});
			});
		},

		//鼠标离开时间
		leave:function(){
			var that = this;
			this.sImgWrap.mouseleave(function(){
				//放大镜及大图片消失
				that.glass.fadeOut();
				that.largeImgWrap.fadeOut();
			});
		},

		//图片切换
		imgsWitch:function(){
			var that = this;
			this.images.click(function(){
				//将点击的添加class，其他的删除class
				$(this).addClass('active').siblings().removeClass('active');
				//获取点击的下标
				var index = $(this).index();
				//大图片区域的内容
				var lContent = '<img src="images/goods'+(index+1)+'-pic.jpg"/>';
				//将其放置到相应的区域
				that.sImgWrap.find('.goods-img').html( lContent );
				that.largeImgWrap.html( lContent );
				//大图片
				that.largeImg = $('.zoom-big img')
				//that.init();
			});
		}
	};
	//调用方法
	imgGlass.init();
	


	/**
		4商品数量选择及购买或添加购物车
	*/
	var addGoods = {
		main: $('.zs-wrapper'),//商品最外层盒子
		package: $('.suit-name'),//套餐选择
		packageInfos: $( '.zp-suit-desc p' ),//套餐介绍
		increaseBtn: $('.increase'),//加号
		decreaseBtn: $('.decrease'),//减号
		goodsAmountCont: $('.goods-amount'),//商品数量输入框
		addToCartBtn: $('.zs-store-buy'),//添加至购物车按钮
		amount: 0,//商品数量数字
		data: {},//后台数据
		packageWrapper: $('.suit-name-wrapper'),
		init:function(){
			//this.createPackage();
			this.ChoicePackage();
			this.increase();
			this.decrease();
			this.input();
			this.addToCart();
			
		},
		/*//动态生成套餐
		createPackage: function(){
			var that = this;
			//获取goods-id
				var gid = this.main.attr( 'data-goodsid' );
				gid = parseInt( gid );
			//读取JSON数据
			$.getJSON( 'js/cartdata.json',function( result ){
				//获取数据
				that.data = result;

				var content = '';
				//遍历package
				for( var key in that.data[gid]['goods-package'] ){
					content += '<a href="javascript:;" class="suit-name" data-goodsid="'+gid+'" data-package="'+key+'">'+that.data[gid]['goods-package'][key]+'<i class=""></i></a>' ;
				}
				//
				that.packageWrapper.html(content);
				//给第一个尺寸添加选中状态  children() 子元素
				that.packageWrapper.children().eq(0).addClass('actived').find('i').addClass('actived');
			} );
		},*/
		//套餐选择
		ChoicePackage: function(){
			var that = this;
			this.package.click( function(){
				//获取下标
				var index = $(this).index();
				//当前点击增加class
				$(this).addClass('actived').siblings().removeClass('actived');
				//给下标相同的i增加class
				$(this).find('i').addClass('actived')
						.parent().siblings().find('i').removeClass('actived');
				//让相应套餐的简介显示
				that.packageInfos.eq(index-1).show().siblings().hide();
			});
		},
		//点击数量增加
		increase:function(){
			var that = this;
			this.increaseBtn.click(function(){
				//获取文本框的值
				that.amount = parseInt( $(this).prev().val() );
				//判断边界
				if( that.amount >= 2 ){
					$(this).prev().val(3) ;
					return;
				}
				//处理数据
				that.amount++;
				$(this).prev().val(that.amount);
			});
		},
		//点击数量减少
		decrease: function(){
			var that = this;
			this.decreaseBtn.click(function(){
				//获取文本框的值
				that.amount = parseInt( $(this).next().val() );
				//判断边界
				if( that.amount <= 2 ){
					$(this).next().val(1) ;
					return;
				}
				//处理数据
				that.amount--;
				$(this).next().val(that.amount);
			});
		},
		//直接输入时
		input: function(){
			var that = this;

			this.goodsAmountCont.on( 'input',function(){
				//获取输入的内容
				var amount = $(this).val();
				amount = parseInt( amount );
				//判断是否大于限购数
				if( amount >= 3 ){
					$(this).val( 3 );
					that.amount = 3;
					return;
				}
				//判断输入的是否为非数字或者为0
				if( isNaN(amount) || ( amount == 0 ) ){
					$(this).val( 1 );
				}else{
					$(this).val( amount );
				}
				that.amount = amount;
			} );
		},
		//点击加入购物车
		addToCart: function(){
			var that = this;
			this.addToCartBtn.click(function(){

			});
		}
	}; 
	addGoods.init();

	/*
		详情 评价
	*/
	var tabbar = {
		lis: $('.zs-tabbar li'),
		contents: $('.zs-container .item'),
		init: function(){
			//初始化方法
			this.choice();
		},
		choice: function(){
			var that = this;
			this.lis.click(function(){
				//将点击的li添加class，并去除其他li的class
				$(this).addClass('cur').siblings().removeClass('cur');
				//获取当前的下标
				var index = $(this).index();
				//让与下标相同的内容区显示
				that.contents.eq(index).show().siblings().hide();
			});
		}
	};
	//方法调用
	tabbar.init();

	
});


/*
	//cookie
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

 	//数据库JSON
 	{
	"10001":{
		"shop-name":"瑞意摄影器材",
		"shop-id": 20001,
		"goods-id": 10001,
		"goods-name": "NIKON尼康 DX 18-300mm f/3.5-6.3G ED VR 签约代理产品有保障",
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













