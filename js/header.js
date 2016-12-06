

$(function(){

/**
	搜索框Ajax
*/
var inputWrapper = $('.search-text');
inputWrapper.on('input',function(){
	var value = $(this).val().trim();

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

	if( value.length == 0 ){
		$('.search ul').hide();
	}
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
			console.log(11111);
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



});










