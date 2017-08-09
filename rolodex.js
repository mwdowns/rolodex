var app = angular.module('rolodex', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    .state({
        name: 'home',
        url: '/',
        templateUrl: 'rolodex.html',
        controller: 'RolodexController'
    })
    .state({
        name: 'targets',
        url: '/targets',
        templateUrl: 'targets.html',
        controller: 'TargetsController'
    })
    .state({
        name: 'newtarget',
        url: '/newtarget',
        templateUrl: 'newtarget.html',
        controller: 'NewTargetController'
    });
    
    $urlRouterProvider.otherwise('/');
    
});

app.controller('MainController', function($scope, $stateParams, $state, $rootScope) {
    
    console.log('in the controller');
    $scope.loggedIn = true;
    $scope.username = 'Matt';
    
});

app.controller('RolodexController', function($scope, $stateParams, $state, $rootScope) {
    
    $scope.newTargetMessage = 'click to add new target';
    $scope.viewTargetsMessage = 'click to see all targets';
    
    $scope.addNewTarget = function() {
        console.log('clicked to add new target');
        $state.go('newtarget');
    };
    
    $scope.viewTargets = function() {
        console.log('clicked to view targets');
        $state.go('targets');
    };
    
});

app.controller('NewTargetController', function($scope, $stateParams, $state, $rootScope) {
    console.log('making a new target');
});

app.controller ('TargetsController', function($scope, $stateParams, $state, $rootScope) {
    console.log('looking at all targets');
});


