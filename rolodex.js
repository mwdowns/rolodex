var app = angular.module('rolodex', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    // These are our states. Home, view targets, edit a target, and add a new target.
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

app.factory('rolodexService', function($rootScope, $state, $http){
    
    var service = {};
    
    $rootScope.companies = [
        {
            id: 1,
            companyInfo: {
                companyName: "Blah.co",
                numOfEmployees: 50
            },
            companyStatus: 'researching',
            keyContacts: [
                {
                    contactName: 'Barbara',
                    contactPhone: '555-555-5555',
                    contactEmail: 'barbara@blah.com'
                }
            ],
            financialPerf: 'best'
        },
        {
            id: 2,
            companyInfo: {
                companyName: "SuperLLC",
                employees: 400
            },
            companyStatus: 'pending-approval',
            keyContacts: [
                {
                    contactName: 'Stan',
                    contactPhone: '444-444-4444',
                    contactEmail: 'stan@super.com'
                },
                {
                    contactName: 'Sue',
                    contactPhone: '444-444-1111',
                    contactEmail: 'sue@super.com'
                }
            ],
            financialPerf: 'sup-par'
        },
        {
            id: 3,
            companyInfo: {
                companyName: "OK.inc",
                employees: 9000
            },
            companyStatus: 'declined',
            keyContacts: [
                {
                    contactName: 'Oliver',
                    contactPhone: '222-222-2222',
                    contactEmail: 'oliver@ok.com'
                }
            ],
            financialPerf: 'OK'
        }
    ];
    
    //These are a few functions that I want to be used regardless of what controller we're in, so I've stuck them on the rootScope.
    
    // Go to the view all targets page
    $rootScope.viewTargets = function() {
        $state.go('targets');
    };
    
    // Go to the add target page
    $rootScope.addNewTarget = function() {
        $state.go('addtarget');
    };
    
    // Deletes a target (can be done from the view all page or the edit page)
    $rootScope.deleteTarget = function(id) {
        console.log('gonna delete you! ', id);
        for (i = 0; i < $rootScope.companies.length; i++) {
            if ($rootScope.companies[i].id === parseInt(id)) {
                $rootScope.companies.splice(i, 1);
                $state.go('targets');
            }
        }
    };
    
    // service.addTarget = function(formData) {
    //     var newTarget = {
    //         id: 4,
    //         companyInfo: {
    //             companyName: formData.name,
    //             employees: formData.numOfEmployees,
    //         },
    //         status: formData.companyStatus,
    //         keyContacts: [
    //             {
    //                 name: formData.contactName,
    //                 phone: formData.contactPhone,
    //                 email: formData.contactEmail,
    //             }
    //         ],
    //         financialPerf: formData.financialPerf
    //     };
    //     
    //     return $http({
    //         methhod: 'POST',
    //         url: '/addtarget',
    //         data: newTarget
    //     })
    //     .then(function(response) {
    //         var data = response.data;
    //         console.log('this is the response: ', data);
    //     })
    //     .catch(function(error) {
    //         console.log('got an error: ', error);
    //     });
    // };
    
    return service;
    
});

//Controller for the header of all the pages. Pretends there's login functionality, but there is not.
app.controller('MainController', function($scope, $stateParams, $state, $rootScope) {
    
    console.log('in the controller');
    $scope.loggedIn = true;
    $scope.username = 'Matt';
    
});

//Controller for the main landing page. Just a couple messages.
app.controller('RolodexController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    
    console.log($scope.companies.length);
    
    $scope.newTargetMessage = 'click to add new target';
    $scope.viewTargetsMessage = 'click to see all targets';
    
});

// Controller for viewing all the targets
app.controller('TargetsController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    console.log('looking at all targets: ', $scope.companies);
    
    // Function for when the Edit button is clicked under a particular target
    $scope.editButton = function(id) {
        console.log("this is the id: ", id);
        // Goes to the edit page for the id of the target
        $state.go('edittarget', {target_id: id});
    };
    
});

//Controller for adding a new target
app.controller('AddTargetController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    
    // This little bit of code gets all the IDs, finds the highest one and then adds 1 to that to get the ID for the new entry.
    var IDs = [];
    for (i = 0; i < $rootScope.companies.length; i++) {
        IDs.push($rootScope.companies[i].id);
    }
    var newID = Math.max(...IDs) + 1;
    
    //This is the function that the form uses to make a new target
    $scope.addTarget = function() {
        //Creates a new target object with the info entered into the form
        var newTarget = {
            id: newID,
            companyInfo: {
                companyName: $scope.companyName,
                employees: $scope.numOfEmployees,
            },
            companyStatus: $scope.companyStatus,
            keyContacts: [
                {
                    contactName: $scope.contactName,
                    contactPhone: $scope.contactPhone,
                    contactEmail: $scope.contactEmail,
                }
            ],
            financialPerf: $scope.financialPerf
        };
        console.log('adding new target to rootScope, which looks like this now: ', $rootScope.companies);
        // Pushes this new object into the $rootScope.copanies array
        $rootScope.companies.push(newTarget);
        console.log('new rootScope? ', $rootScope.companies);
        // Goes to the view all targets page where you will see the new target
        $state.go('targets');
    };
    
});

//Controller for the Edit Target page, for editing a single target.
app.controller('EditTargetController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    
    // Get the company ID from the $statePararms
    $scope.targetID = $stateParams.target_id;
    console.log("i'm editing stuff! And this is the id: ", $scope.targetID);
    // This forloop finds the target object with the $statParams ID and uses it's information to populate the input fields.
    for (i = 0; i < $rootScope.companies.length; i++ ) {
        if ($rootScope.companies[i].id === parseInt($scope.targetID)) {
            $scope.target = $rootScope.companies[i];
        }
    }
    console.log('this is the company info: ', $scope.target);
    //This is the the edit function for the edit form submit button. It basically does the forloop again and updates the rootScope array with the info from the edit page, and by updates, I mean it just replaces everything whether it was changed or not.
    $scope.editTarget = function() {
        for (i = 0; i < $rootScope.companies.length; i++ ) {
            if ($rootScope.companies[i].id === parseInt($scope.targetID)) {
                console.log('in if statement for updating');
                $rootScope.companies[i].companyInfo.companyName = $scope.target.companyInfo.companyName;
                $rootScope.companies[i].companyInfo.numOfEmployees = $scope.target.companyInfo.numOfEmployees;
                $rootScope.companies[i].companyStatus = $scope.target.companyStatus;
                $rootScope.companies[i].financialPerf = $scope.target.financialPerf;
                //Once all the info is updated, we go back to the list all targets page
                $state.go('targets');
            }
        }
        //if for whatever reason the IDs don't match at this point, we go back to the list all targets page.
        $state.go('targets');  
    };
    
});


