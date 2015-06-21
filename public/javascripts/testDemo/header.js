/**
 * Created by Administrator on 2015/6/21.
 */

define(function(require,exports,module){
    var EventEmitter=require("eventEmitter");

    var header=new EventEmitter();
    var HeaderManager={
        /**
         * 1.初始化
         */
        init:function(){
            //1.切换子菜单
            $(".dropdown").on("click",function(){
                $(this).toggleClass("open");
                $(this).siblings("li").removeClass("open");
            });
        }
    };

    //绑定到header的实例
    header.init=HeaderManager.init();


    return HeaderManager;
});