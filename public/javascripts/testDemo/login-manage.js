/**
 * Created by Administrator on 2015/6/5.
 */


define(function(require,exports,module){
    require("jquery");
    require("angular")
    require("less");


    var login=require("../testDemo/login");

    $(function(){
        login.loginFormInit;//初始化表单
    })();
});