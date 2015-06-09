/**
 * 应用的配置文件  --可变部分（目前的配置为本地开发阶段）
 * Created by zhoutignzhu on 2015/5/19.
 */


//module.exports={
//
//};

define(function(require,exports,module){
    seajs.config({
        //基本路径
        base:"../../../public/javascripts/3rd-lib",
        //别名配置
        alias:{
            "jquery":"jquery/dist/jquery",
            "angular":"angular-js/1.2.5/angular-route",
            "angularResource":"angular-resource/angular-resource",
            "angularRoute":"angular-js/1.2.5/angular-route",
            "less":"less/less.min",
            "jquery-validate":"jquery-plugins/jquery-validate/1.13.1/jquery.validate"
        }
    });
});