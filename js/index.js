$(function(){

	/**
		1 添加公共样式topbar
	*/
	$('.topbar-wrapper').load('topbar.html',function(){
		$.getScript('js/topbar.js');
	});

	/**
		2 添加公共样式header
	*/
	$('.header-wrapper').load('header.html',function(){
		$.getScript( 'js/header.js' );
	});

	/**
		3 添加公共样式footer
	*/
	$('.footer-wrapper').load('footer.html');

	/**
		4 main banner 无缝轮播
	*/
	var banner = {
		viewPart: $('.focus-box'),//可视区域
		imgWrap: $('.bx-viewport ul'),//图片外框
		imgs: $('.bx-viewport li'),//图片数量
		width: $('.bx-viewport li').find('img').width(),
		timer: '',
		index: 0,//
		circleWrapper: $('.bx-page'),//小圆圈盒子
		arrowL: $('.arrow-left'),//左箭头
		arrowR: $('.arrow-right'),//右箭头
		flag: false,//运动状态
		init: function(){

			//动态添加第一张图片到最后
			var firstImg = this.imgs.eq(0).clone(true);
			this.imgWrap.append( firstImg );

			//方法调用
			this.createCircle();
			this.autoPlay();
			this.hover();
			this.arrowRClick();
			this.arrowLClick();
			this.circleClick();
		},

		//自动轮播
		autoPlay: function(){
			var that = this;
			if( this.flag ){
				return;
			}
			this.timer = setInterval(function(){
				that.index++;
				that.imgSwitch();
			},1500);
		},

		//鼠标悬停事件
		hover: function(){
			var that = this;
			this.viewPart.hover(function(){
				clearInterval( that.timer );
			},function(){
				that.autoPlay();
			});
		},

		//点击右箭头
		arrowRClick: function(){
			var that = this;
			this.arrowR.click(function(){
				that.index++;
				that.imgSwitch();
			});
		},

		//点击左箭头
		arrowLClick: function(){
			var that = this;
			this.arrowL.click(function(){
				that.index--;
				that.imgSwitch();
			});
		},

		//小圆圈点击
		circleClick: function(){
			var that = this;
			this.circleWrapper.on( 'click','.ba-page-item',function(){

				//圆圈跟随
				$(this).addClass('current').siblings().removeClass('current');

				//切换图片
				that.index = $(this).index();
				that.imgSwitch();
			} );
		},

		//图片自动切换
		imgSwitch: function(){
			var that = this;

			//判断右边界
			if( this.index >= this.imgs.length + 1 ){
				this.index = 1;
				this.imgWrap.css({
					left: 0
				});
			}

			//判断左边界
			if( this.index <= -1 ){
				this.index = this.imgs.length-1 ;
				this.imgWrap.css({
					left: -1*this.width*this.imgs.length
				});
			}

			//小圆圈跟随
			var j = this.index >= this.imgs.length ? 0 : this.index;
			this.circleWrapper.find('.ba-page-item').eq(j)
				.addClass('current').siblings().removeClass('current');

			//图片运动
			this.imgWrap.animate({
				left: -1*this.width*this.index
			},500);
		},

		//动态生成小圆圈
		createCircle: function(){
			var content = '';
			for( var i=0; i<this.imgs.length; i++ ){
				content += '<div class="ba-page-item">'+(i+1)+'</div>';
			}
			this.circleWrapper.html( content );
			this.circleWrapper.find('.ba-page-item').eq(0).addClass('current');
		}

	};
	banner.init();


	/*
		5 main 列表图片运动
	*/
	var mainListImgMove = {
		lis: $('.main-recommend-list li'),//获取
		init: function(){
			//初始化
			this.hover();
		},
		hover: function(){
			var that = this;
			//鼠标移入移出图片运动
			this.lis.hover(function(){
				$(this).find('img').stop(true).animate({
					marginRight: 10
				});
			},function(){
				$(this).find('img').stop(true).animate({
					marginRight: 0
				});
			});
		}
	};
	mainListImgMove.init();

	/*
		6 倒计时 图片时钟
	*/
	var picClock = {
		hour1: $('.hour1'),
		hour2: $('.hour2'),
		minute1: $('.minute1'),
		minute2: $('.minute2'),
		second1: $('.second1'),
		second2: $('.second2'),
		endTime: Date.parse('2016/12/9'),
		init: function(){
			this.createTime();
		},
		createTime:function(){
			var that = this;
			setInterval(function(){
				var nowTime = new Date();
				var diff = that.endTime - nowTime;
				var hours = parseInt(diff/1000/60/60) ;
				var minutes = parseInt(diff/1000/60%60) ;
				var seconds = parseInt(diff/1000%60) ;
				//得出各位数字
				var hour1 = parseInt( hours/10 );
				var hour2 = parseInt( hours%10 );
				var minute1 = parseInt( minutes/10 );
				var minute2 = parseInt( minutes%10 );
				var second1 = parseInt( seconds/10 );
				var second2 = parseInt( seconds%10 );
				that.hour1.attr({
					'src': 'images/number/'+hour1+'.png',
				});
				that.hour2.attr({
					'src': 'images/number/'+hour2+'.png',
				});
				that.minute1.attr({
					'src': 'images/number/'+minute1+'.png',
				});
				that.minute2.attr({
					'src': 'images/number/'+minute2+'.png',
				});
				that.second1.attr({
					'src': 'images/number/'+second1+'.png',
				});
				that.second2.attr({
					'src': 'images/number/'+second2+'.png',
				});
			},300);
		}
	};
	picClock.init();

	/*
		7 ztuan 全国团购 列表运动
	*/
	var zTuanMove = {
		lis: $( '.ztuan-list li' ),
		init: function(){
			this.hover();
		},
		hover: function(){
			this.lis.hover(function(){
				$(this).css({
					'box-shadow': '0 0 10px #ccc'
				}).stop(true).animate({
					top: -2
				});
			},function(){
				$(this).css({
					'box-shadow': '0 0 0 #ccc'
				}).stop(true).animate({
					top: 0
				});
			});
		}
	};
	zTuanMove.init();

	/*
		8 1楼选项卡切换
	*/
	var itemSwitch = {
		tabLis: $('.waretype-tab li'),//tab
		contentLis: $('.waretype-con>li'),//content
		init: function(){
			//初始化
			this.tabSwitch();
		},
		tabSwitch: function(){
			var that = this;
			//鼠标移入时
			this.tabLis.mouseenter(function(){
				//获取当前的下标
				var index = $(this).index();
				//让当前的添加class
				$(this).addClass('cur').siblings().removeClass('cur');
				//让对应区域的内容显示
				that.contentLis.eq(index).addClass('cur').siblings().removeClass('cur');
			});
		}
	};
	itemSwitch.init();

	/*
		9 QQ对话
	*/
	var contactQQ = {
		showBtn: $('.qq-ask'),
		dialog: $('.my-qq-dialog'),//整个对话框
		title: $('.dialog-title'),//拖拽区域
		closeBtn: $('.dialog-close'),//关闭对话框
		dialogShow: $('.dialog-show'),//对话显示区域
		sendArea: $('.dialog-content'),//输入框
		sendBtn:$('.send-message'),//发送按钮
		init: function(){
			//初始化
			this.showDailogContent();
			this.dialogMove();
			this.close();
			this.btnSendMessage();
			this.keySendMessage();
		},

		//点击QQ客服，显示与隐藏对话框
		showDailogContent: function(){
			var that = this;
			this.showBtn.click(function(){

				//对话框显示或者隐藏
				that.dialog.toggle();
			});
		},

		//拖拽对话框
		dialogMove: function(){
			var that = this;

			//title区域鼠标按下
			this.title.mousedown(function(e){

				//获取鼠标按下点距离title的左距离及上距离（offsetY / offsetX）
				var ot = e.offsetY;
				var ol = e.offsetX;

				//鼠标在document中移动时
				$(document).mousemove(function(e){

					//获取鼠标按下点距离浏览器的左距离及上距离（pageY / pageX）
					var pt = e.pageY ;
					var pl = e.pageX;
					//console.log( ot,ol,pt,pl );
					//设置整个对话框的left\top
					var left = pl - ol;
					var t = pt - ot;
					that.dialog.css({
						left: left,
						top: t
					});
				});
			});

			//document区域鼠标抬起时
			$(document).mouseup(function(){
				$(this).off('mousemove');
			});
		},

		//点击发送按钮发送message
		btnSendMessage: function(){
			var that = this;
			this.sendBtn.click(function(){
				//调用发送message功能
				that.sendMessage();
			});
		},

		//按下ctrl+enter发送内容
		keySendMessage: function(){
			var that = this;

			//ctrl+enter发送内容
			$(window).keydown(function(e){

				//判断ctrl+enter是否都被按下
				if( e.ctrlKey && e.keyCode == 13 ){
					//调用发送message功能
					that.sendMessage();
				}
			});
		},
		sendMessage: function(){
			//获取对话框中的值
			var value = this.sendArea.val().trim();

			//判断是否为空
			if( value == '' ){
				return;
			}

			//将获取的值填充到dialogShow区域
			var content = '<div class="my-message">'
						+	'<div class="mine">'
						+		value
						+	'</div>'
						+ '</div>';
			this.dialogShow.append( content );

			//判断获取的值是否在定义范围内
			if( value == "Hello" ){
				var reply = '<div class="com-message">'
						+		'<div class="computer">'
						+			'Hello , I am computer.' 
						+		'</div>'
						+	'</div>';
				this.dialogShow.append( reply );
			}else{
				var reply2 = '<div class="com-message">'
						+		'<div class="computer">'
						+			'I am sorry,I could not understand you!' 
						+		'</div>'
						+	'</div>';
				this.dialogShow.append( reply2 );
			}

			//将对话框的值清为空
			this.sendArea.val('');
		},
		//点击关闭按钮。对话框隐藏
		close: function(){
			var that = this;
			this.closeBtn.click(function(){
				that.dialog.hide();
			});
		}
	};
	contactQQ.init();




});






	