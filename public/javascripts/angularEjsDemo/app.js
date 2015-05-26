//Define an angular module for our app
var sampleApp = angular.module('sampleApp', [
                               'ngRoute',
                               'PracticeController',
                               'ngResource',
                               'ngGrid'
                              ]);
 
//Define Routing for app
//Uri /AddNewOrder -> template add_order.html and Controller AddOrderController
//Uri /ShowOrders -> template show_orders.html and Controller AddOrderController
sampleApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/AddNewOrder', {
        templateUrl: '../../views/angularDemo/templates/add_order.html',
        controller: 'AddOrderController'
    }).
      when('/ShowOrders', {
        templateUrl: '../../views/angularDemo/templates/show_orders.html',
        controller: 'ShowOrdersController'
      }).
      when('/ShowOrder/:orderId', {
        templateUrl: '../../views/angularDemo/templates/show_details.html',
        controller: 'ShowDetailsController'
      }). 
       when('/Calculator', {
        templateUrl: '../../views/angularDemo/templates/calculator.html',
        controller: 'CommonController',
        foodata: 'add order'   //pass custom data based on certain route
      }).
       when('/ng-grid', {
        templateUrl: '../../views/angularDemo/templates/ng-grid.html',
        controller: 'MyCtrl'
      }).       
        when('/NewOrder', {
        templateUrl: '../../views/angularDemo/templates/add_newer.html',
        controller: 'CommonController',
        foodata: 'add order'   //pass custom data based on certain route
      }).        
      when('/Profile',{
        templateUrl:'../../views/angularDemo/templates/profile.html',
        controller:'ProfileCtrl'
      }). 
      when('/Signin',{
        templateUrl:'../../views/angularDemo/templates/signin.html',
        controller:'SignCtrl'
      }).
      when('/Signup',{
        templateUrl:'../../views/angularDemo/templates/signup.html',
        controller:'SignUpCtrl'
      }).        
      otherwise({
        redirectTo: '/'
      });  
        
}]);



