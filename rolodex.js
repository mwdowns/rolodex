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
    
    $rootScope.home = true;
    
    $rootScope.statusList = ["Researching", "Pending-Approval", "Approved", "Declined"];
    $rootScope.finacialPerfList = ["Best", "OK", "Sub-Par"];
    
    $rootScope.companies = [
        {
            id: 1,
            companyInfo: {
                companyName: "Blah.co",
                numOfEmployees: 50
            },
            companyStatus: "Researching",
            keyContacts: [
                {
                    contactID: 1,
                    contactName: "Barbara",
                    contactPhone: "555-555-5555",
                    contactEmail: "barbara@blah.com"
                }
            ],
            financialPerf: "Best",
            companyComments: "This company is kinda Blah. I'm not really feeling it."
        },
        {
            id: 2,
            companyInfo: {
                companyName: "SuperLLC",
                numOfEmployees: 400
            },
            companyStatus: "Pending-Approval",
            keyContacts: [
                {
                    contactID: 1,
                    contactName: "Stan",
                    contactPhone: "444-444-4444",
                    contactEmail: "stan@super.com"
                },
                {
                    contactID: 2,
                    contactName: "Sue",
                    contactPhone: "444-444-1111",
                    contactEmail: "sue@super.com"
                }
            ],
            financialPerf: "Sub-Par",
            companyComments: "This company is Super. But their perf...not Super."
        },
        {
            id: 3,
            companyInfo: {
                companyName: "OK.inc",
                numOfEmployees: 9000
            },
            companyStatus: "Declined",
            keyContacts: [
                {
                    contactID: 1,
                    contactName: "Oliver",
                    contactPhone: "222-222-2222",
                    contactEmail: "oliver@ok.com"
                }
            ],
            financialPerf: "OK",
            companyComments: "This company was OK, but they did not like my jokes."
        }
    ];
    
    //These are a few functions that I want to be used regardless of what controller we're in, so I've stuck them on the rootScope.
    
    $rootScope.goHome = function() {
        
        $rootScope.moreThanThree = false;
        $rootScope.home = true;
        $state.go('home');
        
    };
    
    // Go to the view all targets page
    $rootScope.viewTargets = function() {
        $rootScope.home = false;
        $state.go('targets');
    };
    
    // Go to the add target page
    $rootScope.addNewTarget = function() {
        $rootScope.moreThanThree = false;
        $rootScope.home = false;
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
    
    return service;
    
});

//Controller for the header of all the pages. Pretends there's login functionality, but there is not.
app.controller('MainController', function($scope, $stateParams, $state, $rootScope) {
    
    console.log('in the controller');
    $scope.loggedIn = true;
    $scope.username = 'Matt';
    
    $scope.logOut = function() {
        $scope.loggedIn = false;
    };
    
    $scope.logIn = function() {
        $scope.loggedIn = true;
    };
    
});

//Controller for the main landing page. Just a couple messages.
app.controller('RolodexController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    
    $scope.newTargetMessage = "I feel like acquiring today!";
    var targetMessages = ["I want to see my list of prescious aquisitions!", "I'm gonna so acquire these companies!", "You want hostile acquisitions? That's how you get hostile aquisitions.", "Eeeny. Meeny. Miney. Acquire!", "Number One. Make the acquisition so!", "Use your acquisitions, Luke."];
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    var random = getRandomInt(0, targetMessages.length);
    console.log(random);
    $scope.viewTargetsMessage = targetMessages[random];
    
});

// Controller for viewing all the targets
app.controller('TargetsController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    console.log('looking at all targets: ', $scope.companies);
    
    // Makes sure that on a hard refresh of this state, the home button shows up
    $rootScope.home = false;
    
    if ($rootScope.companies.length > 3) {
        console.log('more than 3');
        $rootScope.moreThanThree = true;
    } else {
        console.log('three or less');
        $rootScope.moreThanThree = false;
    }
    
    // Function for when the Edit button is clicked under a particular target
    $scope.editButton = function(id) {
        console.log("this is the id: ", id);
        // Goes to the edit page for the id of the target
        $state.go('edittarget', {target_id: id});
    };
    
});

//Controller for adding a new target
app.controller('AddTargetController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    
    // Makes sure that on a hard refresh of this state, the home button shows up
    $rootScope.home = false;
    // This little bit of code gets all the IDs, finds the highest one and then adds 1 to that to get the ID for the new entry.
    var IDs = [];
    for (i = 0; i < $rootScope.companies.length; i++) {
        IDs.push($rootScope.companies[i].id);
    }
    var newID = Math.max(...IDs) + 1;
    
    $scope.numOfContacts = [{
        contactID: 1,
        contactName: '',
        contactPhone: '',
        contactEmail: ''
    }];
    
    // Function for adding a new set of inputs for a new contactEmail
    // Updates the id based on the number of contacts in the arrary
    $scope.addAnotherContact = function() {
        
        var newIndex = $scope.numOfContacts.length + 1;
        var newContact = {
            contactID: newIndex,
            contactName: '',
            contactPhone: '',
            contactEmail: ''
        };
        $scope.numOfContacts.push(newContact);
    };
    
    //This is the function that the form uses to make a new target
    $scope.addTarget = function() {
        
        // This little bit here takes care of the contacts section
        // which can get hairy if you're adding more than one -- it 
        // creates an array of objects for however many contacts you've added
        var contacts = [];
        for (i = 0; i < $scope.numOfContacts.length; i++) {
            var contact = {
                contactID: $scope.numOfContacts[i].contactID,
                contactName: $scope.numOfContacts[i].contactName,
                contactPhone: $scope.numOfContacts[i].contactPhone,
                contactEmail: $scope.numOfContacts[i].contactEmail,
            };
            contacts.push(contact);
        }
        
        //Creates a new target object with the info entered into the form
        if ($scope.companyName === '') {
            $state.go('addtarget');
        } else {
            var newTarget = {
                id: newID,
                companyInfo: {
                    companyName: $scope.companyName,
                    numOfEmployees: $scope.numOfEmployees,
                },
                companyStatus: $scope.statusList,
                keyContacts: contacts,
                financialPerf: $scope.financialPerfList,
                companyComments: $scope.companyComments,
            };
            console.log('adding new target to rootScope, which looks like this now: ', $rootScope.companies);
            // Pushes this new object into the $rootScope.copanies array
            $rootScope.companies.push(newTarget);
            console.log('new rootScope? ', $rootScope.companies);
            // Goes to the view all targets page where you will see the new target
            $state.go('targets');
        }
    };
    
});

//Controller for the Edit Target page, for editing a single target.
app.controller('EditTargetController', function($scope, $rootScope, $state, $stateParams, rolodexService) {
    
    // Makes sure that on a hard refresh of this state, the home button shows up
    $rootScope.home = false;
    
    // Get the company ID from the $statePararms
    $scope.targetID = $stateParams.target_id;
    console.log("i'm editing stuff! And this is the id: ", $scope.targetID);
    // This forloop finds the target object with the $statParams ID and uses it's information to populate the input fields.
    for (i = 0; i < $rootScope.companies.length; i++ ) {
        if ($rootScope.companies[i].id === parseInt($scope.targetID)) {
            $scope.target = $rootScope.companies[i];
            $scope.arrayOfContacts = [];
            for (j = 0; j < $rootScope.companies[i].keyContacts.length; j++) {
                $scope.arrayOfContacts.push($rootScope.companies[i].keyContacts[j]);
            }
        }
    }
    
    //Function for adding a new contact to the edit page
    $scope.addAnotherContact = function() {
        
        var newIndex = $scope.arrayOfContacts.length + 1;
        var newContact = {
            contactID: newIndex,
            contactName: '',
            contactPhone: '',
            contactEmail: ''
        };
        $scope.arrayOfContacts.push(newContact);
        
    };
    //This is the the edit function for the edit form submit button. It basically does the forloop again and updates the rootScope array with the info from the edit page, and by updates, I mean it just replaces everything whether it was changed or not.
    $scope.editTarget = function() {
        for (i = 0; i < $rootScope.companies.length; i++ ) {
            if ($rootScope.companies[i].id === parseInt($scope.targetID)) {
                console.log('in if statement for updating');
                $rootScope.companies[i].companyInfo.companyName = $scope.target.companyInfo.companyName;
                $rootScope.companies[i].companyInfo.numOfEmployees = $scope.target.companyInfo.numOfEmployees;
                $rootScope.companies[i].companyStatus = $scope.target.companyStatus;
                $rootScope.companies[i].financialPerf = $scope.target.financialPerf;
                $rootScope.companies[i].companyComments = $scope.target.companyComments;
                // This will collect all the contacts to be updated and update them similar
                // to the way we added a new list of contacts in the add controller
                var contacts = [];
                for (j = 0; j < $scope.arrayOfContacts.length; j++) {
                    var contact = {
                        contactID: $scope.arrayOfContacts[j].contactID,
                        contactName: $scope.arrayOfContacts[j].contactName,
                        contactPhone: $scope.arrayOfContacts[j].contactPhone,
                        contactEmail: $scope.arrayOfContacts[j].contactEmail,
                    };
                    contacts.push(contact);
                }
                $rootScope.companies[i].keyContacts = contacts;
                //Once all the info is updated, we go back to the list all targets page
                $state.go('targets');
            }
        }
        //if for whatever reason the IDs don't match at this point, we go back to the list all targets page.
        $state.go('targets');  
    };
    
});
