/**
 * Created by Administrator on 2015/6/6.
 */

define(function(require,exports,module){
    require("jquery");
    require("jquery-validate");

    var loginFormInit=function(){
        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        //1.登录校验
        $(".login-form").validate({
            errorElement:'label',//错误信息容器
            errorClass:'help-inline',//错误信息样式
            focusInvalid:false,//没有获得焦距
            rules:{
                name:{
                    required:true
                },
                password:{
                    required:true
                },
                remember:{
                    required:false
                }
            },
            messages:{
                name:{
                    required:"必须要输入账号"
                },
                password:{
                    required:"必须要输入密码"
                }
            },
            invalidHandler:function(event,validator){
                $('.alert-error',$('.login-form')).show();
            },
            highlight:function(element){
                $(element)
                    .closest('.control-group').addClass('error');
            },
            success:function(label){
                label.closest('.control-group').removeClass('error');
                label.remove();
            },
            errorPlacement:function(error,element){
                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
            },
            submitHandler:function(form){
                window.location.href="index.html";
            }
        });

        //2.快捷键登录校验
        $('.login-form input').keypress(function(e){
            if(e.which == 13){
                if($('.login-form').validate().form()){
                    window.location.href="index.html";
                }
                return false;
            }
        });

        //3.记住密码
        $('.checkinputbox').on('click',function(){
            $(this).addClass('checked');
        });

    };

    module.exports={
        loginFormInit:loginFormInit()//初始化登录表单
    };
});