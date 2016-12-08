
$(function(){

	//判断用户名
	var login = {
		item: $('.item'),//输入框
		loginBtn: $('.login-btn'),//登录按钮
		phoneNumInput: $('.user-name'),//用户名输入框
		passWord: $('.pass-word'),//密码输入框
		registerInfo: '',//cookie
		phoneNum: '',//输入的手机号
		registeredWrapper: $('.registered'),//cookie中已注册手机号显示盒子
		autoLogin: $('.auto-login'),
		init: function(){
			//初始化
			this.checkboxState();
			this.phoneNumEvent();
			this.passWordEvent();
			this.clickBtn();

		},
		//点击登录按钮
		clickBtn: function(){
			var that = this;

			//点击
			this.loginBtn.click(function(){

				//判断自动登录是否被选中
				if( !that.autoLogin.prop( 'checked' ) ){
					//获取输入的密码
					var password = that.passWord.val().trim();

					//判断是否与cookie中的密码相同
					cPsw = that.registerInfo[that.phoneNum]['passWordAttr'];
					if( password != cPsw ){
						alert( '密码输入有误，请重新输入！' );
						return;
					}

					alert('登录成功！');
					return;
				}
				alert('登录成功！');
			});
		},

		//手机号输入框事件
		phoneNumEvent: function(){
			var that = this;

			//输入框获焦
			this.phoneNumInput.focus(function(){
				
				//添加样式
				$(this).css({
					'border': '1px solid #c00'
				});

				//判断自动登录是否被选中
				if( that.autoLogin.prop( 'checked' ) ){

					//已注册手机号显示
					that.registeredWrapper.show();

					//调用选择点击事件
					that.choicePhoneNum();

					return;
				}
			});

			//输入框失焦
			this.phoneNumInput.blur(function(){

				//让手机号显示框消失
				//$(this).parents('.phone-num').find('.registered').hide();

				//设置样式
				$(this).css({
					'border': '1px solid #ccc'
				});

				//获取输入的手机号
				var PhoneNumber = $(this).val().trim();

				//读取cookie()
				var registerInfo = $.cookie('zol_register') || '{}';

				//将JSON字符串转化为JSON对象
				that.registerInfo = JSON.parse( registerInfo );
				
				//判断手机号是否为空
				if( PhoneNumber.length == 0 ){
					//不存在
					//alert( '请输入手机号！' );
					return;
				}

				//判断手机号是否存在
				if( !that.registerInfo[PhoneNumber] ){
					//不存在
					//alert( '手机号未注册！请注册！' );
					return;
				}

				that.phoneNum = PhoneNumber;
			});
		},

		//已注册手机号事件
		choicePhoneNum: function(){
			var that = this;

			//自动获取cookie并填充框
			//读取cookie()
			var registerInfo = $.cookie('zol_register') || '{}';

			//将JSON字符串转化为JSON对象
			that.registerInfo = JSON.parse( registerInfo );
			
			var content = '';

			//遍历
			for( var key in that.registerInfo ){
				content += '<li>'+key+'</li>';
			}

			//填充到registeredWrapper中
			that.registeredWrapper.html( content );

			//给显示出来的已注册手机号添加点击事件
			that.registeredWrapper.on( 'click','li',function(){

				//获取选择的手机号
				var phone = parseInt( $(this).html() );
				
				//填充到手机号输入框中
				that.phoneNumInput.val( phone );

				//让显示框消失
				$(this).parents('.phone-num').find('.registered').hide();

				//从cookie中获取相应的密码
				var password = that.registerInfo[phone]['passWordAttr'];
				
				//将获取的密码填入密码输入框
				that.passWord.val( password );
				
			} );

		},

		//密码框事件
		passWordEvent: function(){

			//输入框获焦
			this.passWord.focus(function(){

				//添加样式
				$(this).css({
					'border': '1px solid #c00'
				});
			});

			//输入框失焦
			this.passWord.blur(function(){

				//去除样式
				$(this).css({
					'border': '1px solid #ccc'
				});
			});

		},

		//实时监测记住密码复选框状态
		checkboxState: function(){
			var that = this;

			//
			setInterval(function(){
				if( !that.autoLogin.prop( 'checked' ) ){
					that.phoneNumInput.parents('.phone-num').find('.registered').hide();
				}
			},500);
		}
	};
	login.init();




});