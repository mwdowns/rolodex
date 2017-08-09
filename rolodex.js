var app = angular.module('rolodex', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    .state({
        name: 'home',
        url: '/',
        templateUrl: 'rolodex.html',
        controller: 'MainController'
    });
    
    $urlRouterProvider.otherwise('/');
    
});

app.controller('MainController', function($scope, $stateParams, $state, $rootScope) {
    
    console.log('in the controller');
    $scope.message = 'hello';
    console.log('this is the message: ', $scope.message);
    
});