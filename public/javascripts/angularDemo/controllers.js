var sampleApp = angular.module('PracticeController', ['service']);
 
sampleApp.controller('AddOrderController', function($scope) {
     
    $scope.message = 'This is Add new order screen';
     
});
 
 
sampleApp.controller('ShowOrdersController', function($scope) {
 
    $scope.message = 'This is Show orders screen';
 
});

sampleApp.controller('ProfileCtrl', function($scope) {
 
    $scope.account = 'My Account Here Details';
 
});

sampleApp.controller('SignCtrl', function($scope) {
 
    $scope.message = 'Sign In Page';
 
});

sampleApp.controller('SignUpCtrl', function($scope) {
 
    $scope.message = 'Sign Up Page';
 
});

sampleApp.controller('ShowDetailsController', function($scope, $routeParams) {
 
    $scope.order_id = $routeParams.orderId;
 
});

sampleApp.controller('CommonController', function($scope, $route) {
    //access the foodata property using $route.current
    var foo = $route.current.foodata;   
    $scope.index = foo;
     
});

sampleApp.controller('CalculatorController', function($scope, CalculatorService) {
 
    $scope.doSquare = function() {
        $scope.answer = CalculatorService.square($scope.number);
    };
 
    $scope.doCube = function() {
        $scope.answer = CalculatorService.cube($scope.number);
    };
});


sampleApp.controller('MyCtrl', function($scope) {
    $scope.gridOptions = {
        data: 'myData',
        enablePinning: true,
        columnDefs: [{ field: "name", width: 120, pinned: true },
                    { field: "age", width: 120 },
                    { field: "birthday", width: 120 },
                    { field: "salary", width: 120 }]
    };
    $scope.myData = [{ name: "Moroni", age: 50, birthday: "Oct 28, 1970", salary: "60,000" },
                    { name: "Tiancum", age: 43, birthday: "Feb 12, 1985", salary: "70,000" },
                    { name: "Jacob", age: 27, birthday: "Aug 23, 1983", salary: "50,000" },
                    { name: "Nephi", age: 29, birthday: "May 31, 2010", salary: "40,000" },
                    { name: "Enos", age: 34, birthday: "Aug 3, 2008", salary: "30,000" },
                    { name: "Moroni", age: 50, birthday: "Oct 28, 1970", salary: "60,000" },
                    { name: "Tiancum", age: 43, birthday: "Feb 12, 1985", salary: "70,000" },
                    { name: "Jacob", age: 27, birthday: "Aug 23, 1983", salary: "40,000" },
                    { name: "Nephi", age: 29, birthday: "May 31, 2010", salary: "50,000" },
                    { name: "Enos", age: 34, birthday: "Aug 3, 2008", salary: "30,000" },
                    { name: "Moroni", age: 50, birthday: "Oct 28, 1970", salary: "60,000" },
                    { name: "Tiancum", age: 43, birthday: "Feb 12, 1985", salary: "70,000" },
                    { name: "Jacob", age: 27, birthday: "Aug 23, 1983", salary: "40,000" },
                    { name: "Nephi", age: 29, birthday: "May 31, 2010", salary: "50,000" },
                    { name: "Enos", age: 34, birthday: "Aug 3, 2008", salary: "30,000" }];
});