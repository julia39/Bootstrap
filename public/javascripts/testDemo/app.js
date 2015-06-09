/**
 * Created by Administrator on 2015/6/8.
 */

var indexApp = angular.module('indexApp', ['ngRoute']);
indexApp.config(function ($routeProvider) {
    $routeProvider.when('/footer', {
        templateUrl: '../../../views/template/testDemo/common/footer.html'
    }).otherwise({redirectTo: '/footer'});
});


