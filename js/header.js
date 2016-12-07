

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






});










