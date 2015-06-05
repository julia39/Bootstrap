/**
 * Created by Administrator on 2015/5/26.
 */

define(function(require,exports,module){
    "user strick";

    seajs.config({
        //路径配置
        paths:{
            'js':'/javascripts',
            'css':'/stylesheets',
            '3rd-lib':'/javascripts/3rd-lib/'
        },
        //设置别名，方便调用
        alias:{
            'jquery':'/javascripts/3rd-lib/jquery/1.11.2/jquery',
            'angularJs':'/javascripts/3rd-lib/angular-js/1.2.5/angular',
            'angularRoute':'javascripts/3rd-lib/angular-js/1.2.5/angular-route',
            'angularResource':'/javascripts/3rd-lib/angular-js/1.2.5/angular-resource',
            'angularMoke':'/javascripts/3rd-lib/angular-js/1.2.5/angular-mocks',
            'ngGrid':'/javascripts/3rd-lib/ng-grid/2.0.1/ng-grid'
        }
    });


    require('jquery');

});