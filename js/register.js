
var registerInput = $('.wrapper .register-wrap .register-form-wrap .register-module .register-phone-number .register-form input');

registerInput.focus(function(){
	$(this).css({
		'border': '1px solid #c00'
	});
});
registerInput.blur(function(){
	$(this).css({
		'border': '1px solid #ccc'
	});
});

var register = {
	phoneNum: $('.phone-number'),//输入手机号
	inputCaptcha: $('.input-captcha'),//验证码输入框
	captcha: $('.captcha'),//验证码
	vCaptcha: '',//产生的验证码
	change: $('.change'),//更换验证码按钮
	phoneCapture: $('.input-phone-captcha'),//手机验证码输入框
	phoneCaptureBtn: $('.phone-captcha'),//获取手机验证码按钮
	phoneCode: '',//手机验证码
	passWord: $('.pass-word'),//密码输入框
	confirmPassword: $('.confirm-password'),//
	wrongTips: $('.wrong-tips'),//正确消息框
	rightTips: $('.right-tips'),//错误消息框
	vPsw: '',//输入密码的值
	registerBtn: $('.register-btn'),
	init: function(){

		//手机号验证
		this.checkPhoneNum();

		//随机产生验证码
		this.randomCapture();

		//点击更换验证码
		this.changeCaptcha();

		//验证输入的验证码
		this.judgeInputCaptcha();

		//判断手机验证码
		this.judgePhoneCode();

		//判断密码和确认密码
		this.checkPassWord();

		//注册按钮点击时
		this.registerMember();
	},
	//验证手机号
	checkPhoneNum: function(){
		var that = this;

		//手机号判断正则表达式
		var CPNum = /^1[3|4|5|7|8]\d{9}$/;

		//失焦判断
		this.phoneNum.blur(function(){
			var vPhoneNum = that.phoneNum.val().trim();
			that.judgeTips( $(this),vPhoneNum );
			if( !CPNum.test( vPhoneNum ) ){
				$(this).parent().find('.wrong-tips').html('手机号格式不正确').show();
				$(this).parent().find('.right-tips').hide();
				return;
			}
			//给input输入框自定义属性phoneNumber
			$(this).attr( 'data-phoneNumberId',vPhoneNum );
		});
	},

	//验证输入的验证码
	judgeInputCaptcha: function(){
		var that = this;

		//失焦判断
		this.inputCaptcha.blur(function(){
			var vInputCaptcha = that.inputCaptcha.val().trim();
			that.judgeTips( $(this),vInputCaptcha );
			if( vInputCaptcha != that.vCaptcha ){
				$(this).parent().find('.wrong-tips').html('验证码不正确').show();
				$(this).parent().find('.right-tips').hide();
				return;
			}
		});
	},

	//验证输入的手机验证码
	judgePhoneCode: function(){
		var that = this;

		//点击获取验证码按钮
		this.phoneCaptureBtn.click(function(){
			that.randomPhoneCode();
		});

		//失焦判断
		this.phoneCapture.blur(function(){
			var vPCode = that.phoneCapture.val().trim();
			that.judgeTips( $(this),vPCode );
			if( vPCode != that.phoneCode ){
				$(this).parent().find('.wrong-tips').html('手机验证码输入不正确').show();
				$(this).parent().find('.right-tips').hide();
				return;
			}
		});
	},

	//验证密码及确认密码
	checkPassWord: function(){
		var that = this;

		//密码输入框
		var CPsw = /^[0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]{6,16}$/;
		this.passWord.blur(function(){
			that.vPsw = that.passWord.val().trim();
			that.judgeTips( $(this),that.vPsw );
			if( !CPsw.test( that.vPsw ) ){
				$(this).parent().find('.wrong-tips').html('密码格式不正确').show();
				$(this).parent().find('.right-tips').hide();
				return;
			}
			//给密码输入框自定义属性password
			$(this).attr( 'data-passWordAttr', that.vPsw);
		});

		//确认密码框
		this.confirmPassword.blur(function(){
			var vConfirmPsw = that.confirmPassword.val().trim();
			 that.judgeTips( $(this),vConfirmPsw );
			if( vConfirmPsw != that.vPsw ){
				$(this).parent().find('.wrong-tips').html('密码输入不一致').show();
				$(this).parent().find('.right-tips').hide();
				return;
			}
		});
	},

	//点击注册按钮时
	registerMember: function(){
		var that = this;
		//注册按钮被点击时
		this.registerBtn.click(function(){
			//data() 获取以data-开的自定义属性的值
			var PhoneNumber = that.phoneNum.data('phonenumberid');
			//passWord
			var PassWord = that.passWord.data('passwordattr');
			//读取cookie()
			console.log( PhoneNumber,PassWord );
			var registerInfo = $.cookie('zol_register') || '{}';
			//将JSON字符串转化为JSON对象
			registerInfo = JSON.parse( registerInfo );
			
			//判断手机号是否存在
			if( !registerInfo[PhoneNumber] ){
				registerInfo[PhoneNumber]={
					'phoneNumberId':PhoneNumber,
					'passWordAttr':PassWord
				};
			}else{
				$('.phone-number').parent().find('.wrong-tips').html('手机号已存在！');
				return;
			}
			console.log( registerInfo );
			//写到cookie中
			$.cookie('zol_register',JSON.stringify(registerInfo),{expires:10,path: '/'});

			alert('添加成功');

			console.log( JSON.parse( $.cookie('zol_register')) );
		});
	},

	//随机产生5位数验证码
	randomCapture:function(){
		var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var result = '';
		for(var i=0; i<5; i++){
			var index = parseInt( Math.random()*62 );
			result += str[index];
		}
		this.captcha.html( result );
		this.vCaptcha = result;
	},

	//随机产生6位数字短信验证码
	randomPhoneCode: function(){
		var arrNum = [0,1,2,3,4,5,6,7,8,9];
		var code = '';
		arrNum.sort(function(){
			return Math.random() - 0.5;
		});
		arrNum.length = 6;
		code = arrNum.join('');
		console.log( code );
		this.phoneCode = code;
	},

	//点击更换验证码
	changeCaptcha:function(){
		var that = this;
		this.change.click(function(){
			that.randomCapture();
		});
	},

	//判断后的提示信息
	judgeTips: function( selector,value ){
		if( value == '' ){
			selector.parent().find('.wrong-tips').show();
			selector.parent().find('.right-tips').hide();
			return;
		}
		selector.parent().find('.wrong-tips').html('').hide();
		selector.parent().find('.right-tips').show();
	}
}

//调用方法
register.init();







