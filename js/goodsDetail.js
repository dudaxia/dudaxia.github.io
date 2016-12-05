

$(function(){

	/**1添加公共样式topbar*/
	$('.topbar-wrapper').load('topbar.html');

	/**
		搜索框Ajax
	*/
	var inputWrapper = $('.search-text');
	inputWrapper.on('input',function(){
		var value = $(this).val();
		$.ajax({
			url: 'http://suggestion.baidu.com/su?',
			data: {
				wd: value
			},
			jsonp: 'cb',
			dataType: 'jsonp', //使用jsonp请求数据
			success: function(data){
				var content = '';
				for( var key in data.s){
					content += '<li class="list-item">'+data.s[key]+'</li>';
				}
				$('.search ul').html( content );
			}
		});
	})

	/**2三级导航*/
	var threeNav = {
		main: $('.category-nav-container'),//1级导航
		ulWrapper: $('.category-menu-nav'),//2级导航盒子
		lis: $('.nav-container li'),//2级导航单项
		contents: $('.category-menu-content'),//3级导航
		//初始化
		init: function(){
			this.hovermain();
			this.hoverlis();
		},
		//2级菜单显示、隐藏
		hovermain: function(){
			//console.log( this.main,this.ul,this.lis );
			var that =this;
			//鼠标移入移出
			this.main.hover(function(){
				that.ulWrapper.stop(true).delay(300).show();
			},function(){
				that.ulWrapper.stop(true).delay(300).hide();
			});
		},
		//3级菜单显示、隐藏
		hoverlis: function(){
			var that = this;
			this.lis.hover(function(){
				var index = $(this).index();
				that.contents.eq(index).show();
			},function(){
				var index = $(this).index();
				that.contents.eq(index).hide();
			});
		}
	};
	threeNav.init();

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
				that.glass.stop(true).delay(500).fadeIn();
				that.largeImgWrap.stop(true).delay(500).fadeIn();
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
				that.glass.stop(true).fadeOut();
				that.largeImgWrap.stop(true).fadeOut();
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
		packagePriceWrapper: $('.zs-price'),//商品单价盒子
		//topbarGoodsAmountWrapper: $('.top-goods-amount'),//topbar商品数量
		init:function(){
			//改变topbar商品数量
			/*var cart = $.cookie('zol_cart') || '{}';
			cart = JSON.parse( cart );
			//获取cart中商品数量
			var length = cart.length;
			console.log(this.topbarGoodsAmountWrapper);
			this.topbarGoodsAmountWrapper.html('3');*/

			this.readJson();
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
		//读取数据
		readJson: function(){
			var that = this;
			//获取goods-id
			var gid = this.main.attr( 'data-goodsid' );
			gid = parseInt( gid );
			//读取JSON数据
			$.getJSON( 'js/cartdata.json',function( result ){
				//获取数据
				that.data = result;
			});
		},
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

				//让相应套餐的价格显示
				//获取goodsid及package
				var gid = $(this).parents('.zs-wrapper').data('goodsid');
				var package = $('.zs-suit > .actived').data( 'package' );
				//获取单价
				var price = that.data[gid]['goods-package'][package]['package-price'];
				price = parseInt( price );
				//给盒子赋值
				that.packagePriceWrapper.html(price.toFixed(2));
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
				//获取goodsid及package
				var gid = $(this).parents('.zs-wrapper').data('goodsid');
				var package = $('.zs-suit > .actived').data( 'package' );
				var amount = parseInt( $('.goods-amount').val() );
				//获取cookie
				var cart = $.cookie('zol_cart') || '{}';
				cart = JSON.parse( cart );
				
				//判断购物车是否已经存在当前商品
				if(!cart[package]){
					cart[package] = {
						"goods-id": gid,
						"goods-package": package,
						"package-price": that.data[gid]['goods-package'][package]['package-price'],
						"amount": amount
					};
				}else{
					cart[package].amount += amount;
				}
				//写入cookie
				$.cookie( 'zol_cart',JSON.stringify(cart),{expires:10,path:'/'} );
				alert( '添加成功！' );
				//console.log( JSON.parse( $.cookie('zol_cart') ) );
				
			});
		}
	}; 
	addGoods.init();

	/*
		5\详情 评价
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
	6\折叠
*/
var fold = {
	item: $('.zp-goods-category dt'),
	//contents: $(  ),
	init: function(){
		this.toggle();
	},
	toggle: function(){
		var that = this;
		this.item.click(function(){
			$(this).next().toggle();
			if( $(this).parent().hasClass('unfold') ){
				$(this).parent().removeClass('unfold').addClass('fold');
			}else{
				$(this).parent().removeClass('fold').addClass('unfold');
			}
		});
	}
};
fold.init();

/*
	main右侧导航栏
*/
var floor = {
 	lis: $('.zs-quick-menu li'),
 	autoShowContent: $('.auto-show-content'),
 	init: function(){
 		this.choiceFloor();
 		this.autoFlow();
 	},

 	//点击选择楼层时
 	choiceFloor: function(){
 		var that = this;
 		this.lis.click(function(){

 			//让被点击添加Class，其他的去除class
 			$(this).addClass('cur').siblings().removeClass('cur');

 			//获取被点击的下标
 			var index = $(this).index();
 			switch( index ){
 				case 0:
 					$('html,body').animate({scrollTop:1103},300);
 					break;
				case 1:
					$('html,body').animate({scrollTop:9693},300);
					break;
				case 2:
					$('html,body').animate({scrollTop:10012},300);
					break;
				case 3:
					$('html,body').animate({scrollTop:10790},300);
					break;
				case 4:
					$('html,body').animate({scrollTop:11422},300);
					break;
				case 5:
					$('html,body').animate({scrollTop:12057},300);
					break;
 			}
 		});
 	},
 	//滚动自动显示
 	autoFlow: function(){
 		var that = this;
 		$(window).scroll(function(){
 			
 			//获取滚动条距离顶部的距离
 			var scrollTop = $(window).scrollTop();
 			//判断
 			if( scrollTop > 1103 ){
 				that.autoShowContent.show();
 			}else{
 				that.autoShowContent.hide();
 			}

 			//判断临界条件2
 			if( scrollTop >= 9693 && scrollTop < 10012 ){
 				that.lis.eq(1).addClass('cur').siblings().removeClass('cur');
 			}else if( scrollTop >= 10012 && scrollTop < 10790 ){
 				that.lis.eq(2).addClass('cur').siblings().removeClass('cur');
 			}else if( scrollTop >= 10790 && scrollTop < 11422 ){
 				that.lis.eq(3).addClass('cur').siblings().removeClass('cur');
 			}else if( scrollTop >= 11422 && scrollTop < 12057 ){
 				that.lis.eq(4).addClass('cur').siblings().removeClass('cur');
 			}else if( scrollTop >= 12057 ){
 				that.lis.eq(5).addClass('cur').siblings().removeClass('cur');
 			}
 		});
 	}

};
floor.init();

/*
	右侧导航栏( 侧边栏 )
*/
var zoolbar = {
	zoolItem: $('.tab-item'),//4个选项
	init:function(){
		//初始化
		this.hover();
	},
	//鼠标移入移出
	hover: function(){
		var that = this;
		this.zoolItem.hover(function(){
			//鼠标经过的子元素content-item显示
			$(this).find('.content-item').stop(true).delay(300).show().animate({
				left: -68
			});
		},function(){
			//鼠标经过的子元素content-item消失
			$(this).find('.content-item').stop(true).animate({
				left: 0
			}).hide();
		});
	}
};
zoolbar.init();

/*
	返回顶部
*/
var backtop = {
	backTopBtn: $('.back-top'),//返货顶部按钮
	showBack: $('.auto-show'),//自动显示的按钮
	init: function(){
		//初始化
		this.move();
		this.autoShow();
	},
	move: function(){
		var that = this;
		this.backTopBtn.click(function(){
			$('html,body').animate({scrollTop:0},300);
		});
	},
	autoShow: function(){
		var that = this;
		$(window).scroll(function(){
		 	var scrollTop = $(this).scrollTop();
		 	//判断自动显示的条件
		 	if( scrollTop>0 ){
		 		that.showBack.fadeIn();
		 	}else{
		 		that.showBack.fadeOut();
		 	}
		 });
	}
};
backtop.init();

/*
	热卖商品图片运动
*/
var hotGoodsMove = {
	lis: $('.zs-modbox-list li'),
	init: function(){
		this.picMove();
	},
	picMove: function(){
		var that = this;
		this.lis.hover(function(){
			$(this).find('img').stop(true).animate({
				width: 160,
				height: 160,
				marginLeft: -80
			});
		},function(){
			$(this).find('img').stop(true).animate({
				width: 150,
				height: 150,
				marginLeft: -75
			});
		});
	}
};
hotGoodsMove.init();





