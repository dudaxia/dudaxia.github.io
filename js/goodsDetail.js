


	/**1添加公共样式topbar*/
	$('.topbar-wrapper').load('topbar.html');

	/**2三级导航*/

	/**3放大镜效果*/
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
	


	/**4商品数量选择及购买或添加购物车*/
	var addGoods = {
		package: $('.suit-name'),
		increaseBtn: $('.increase'),
		decreaseBtn: $('.decrease'),
		goodsAmount: $('.goods-amount'),
		addToCartBtn: $('.zs-store-buy'),
		init:function(){
			this.ChoicePackage();
			this.increase();
			this.decrease();
			this.addToCart();
		},
		//套餐选择
		ChoicePackage:function(){
			var that = this;
			this.package.click(function(){
				//获取下标
				var index = $(this).index();
				$(this).addClass('selected').siblings().removeClass('selected');
			});
		},
		//点击数量增加
		increase:function(){

		},
		//点击数量减少
		decrease: function(){

		},
		//点击加入购物车
		addToCart: function(){

		}
	}; 
	addGoods.init();







