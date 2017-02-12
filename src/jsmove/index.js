//设置成为等高布局，背景显示效果比较好
(function(){
	$("[name='viewport']").attr("content","width=device-width,initial-scale="+1/window.devicePixelRatio+",user-scalable=no");
	// 可布局的宽度 =  物理分辨率/window.devicePixelRatio/initial-scale
})() 
 
//swiper插件的运动效果
$(function(){
			var swipediv = new Swiper('.swiper-container',{
				loop:true,
				direction:'vertical',
				onInit:function(swiper){
					swiperAnimateCache(swiper);
					swiperAnimate(swiper);
				},
				 onSlideChangeEnd: function(swiper){ 
            		swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        		} 
			});
			//音乐的暂停和播放
			var isOk = true;
			$('.audioPlay').click(function(){
				if(isOk){
					$(this).css({animationPlayState:"paused"});
				}else{
					$(this).css({animationPlayState:"running"});
				}
				isOk = !isOk;
			});
		var scaleH = document.documentElement.clientHeight/1004 *20 +"px";
		document.documentElement.style.fontSize = scaleH;
		window.onresize = function(){
			document.documentElement.style.fontSize = document.documentElement.clientHeight/1004 *20 +"px";
			
		}
})

