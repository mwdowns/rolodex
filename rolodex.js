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
        name: 'edittarget',
        url: '/edit/{target_id}',
        templateUrl: 'edit.html',
        controller: 'EditTargetController'
    })
    .state({
        name: 'addtarget',
        url: '/addtarget',
        templateUrl: 'addtarget.html',
        controller: 'AddTargetController'
    });
    
    $urlRouterProvider.otherwise('/');
    
});

app.factory('rolodexService', function($rootScope, $state){
    
    var service = {};
    
    $rootScope.companies = [
        {
            id: 1,
            companyInfo: {
                name: "Blah.co",
                employees: 50
            },
            status: 'researching',
            keyContacts: [
                {
                    name: 'Barbara',
                    phone: '555-555-5555',
                    email: 'barbara@blah.com'
                }
            ],
            financialPerf: 'best'
        },
        {
            id: 2,
            companyInfo: {
                name: "SuperLLC",
                employees: 400
            },
            status: 'pending-approval',
            keyContacts: [
                {
                    name: 'Stan',
                    phone: '444-444-4444',
                    email: 'stan@super.com'
                },
                {
                    name: 'Sue',
                    phone: '444-444-1111',
                    email: 'sue@super.com'
                }
            ],
            financialPerf: 'sup-par'
        },
        {
            id: 3,
            companyInfo: {
                name: "OK.inc",
                employees: 9000
            },
            status: 'declined',
            keyContacts: [
                {
                    name: 'Oliver',
                    phone: '222-222-2222',
                    email: 'oliver@ok.com'
                }
            ],
            financialPerf: 'OK'
        }
    ];
    
    return service;
    
});

app.controller('MainController', function($scope, $stateParams, $state, $rootScope) {
    
    console.log('in the controller');
    $scope.loggedIn = true;
    $scope.username = 'Matt';
    
});

app.controller('RolodexController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    
    console.log($scope.companies.length);
    
    $scope.newTargetMessage = 'click to add new target';
    $scope.viewTargetsMessage = 'click to see all targets';
    
    $scope.addNewTarget = function() {
        console.log('clicked to add new target');
        $state.go('addtarget');
    };
    
    $scope.viewTargets = function() {
        console.log('clicked to view targets');
        $state.go('targets');
    };
    
});

app.controller('AddTargetController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    console.log('making a new target');
    
    $scope.addTarget = function() {
        console.log('will add stuff here');
    };
    
});

app.controller('TargetsController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    console.log('looking at all targets: ', $scope.companies);
    
    $scope.edit = function(id) {
        console.log("this is the id: ", id);
        $state.go('edittarget', {target_id: id});
    };
});

app.controller('EditTargetController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    
    $scope.targetID = $stateParams.target_id;
    console.log("i'm editing stuff! And this is the id: ", $scope.targetID);
    
});


