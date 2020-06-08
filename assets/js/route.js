var app = angular.module("myApp", ["chart.js", "ngRoute", "ngCookies"]);

app.run(function ($rootScope, $templateCache) {
    "use strict";
    $rootScope.$on('$viewContentLoaded', function () {
        $templateCache.removeAll();
    });
});

app.config(function ($routeProvider) {
    "use strict";
    $routeProvider
    
    //Dashboard
        .when("/", {
            templateUrl : "view/dashboard.html",
            cache : false,
            controller : "dashboardCtrl"
        })
    
    //Company Settings
        .when("/settings", {
            templateUrl : "view/settings/schedule_of_services.html",
            cache : false,
            controller : "scheduleOfServicesCtrl"
        })
    
        /**
        .when("/manage-users", {
            templateUrl : "view/settings/manage_users.html",
            cache : false,
            controller : "manageUsersCtrl"
        })
        */
    
        .when("/schedule-of-services", {
            templateUrl : "view/settings/schedule_of_services.html",
            cache : false,
            controller : "scheduleOfServicesCtrl"
        })
        
        .when("/glc-levels", {
            templateUrl : "view/settings/glc_levels.html",
            cache : false,
            controller : "glcLevelsCtrl"
        })
    
        .when("/dgroup-type", {
            templateUrl : "view/settings/dgroup_type.html",
            cache : false,
            controller : "dgroupTypeCtrl"
        })
    
    
    
    //Member
        .when("/members", {
            templateUrl : "view/member/index.html",
            cache : false,
            controller : "membersCtrl"
        })
    
        .when("/members/add", {
            templateUrl : "view/member/add.html",
            cache : false,
            controller : "addMemberCtrl"
        })
    
        .when('/members/view/:id', {
            templateUrl: 'view/member/view.html',
            cache : false,
            controller: 'viewMemberCtrl'
        })

        .when('/members/update', {
            templateUrl: 'view/member/update.html',
            cache : false,
            controller: 'updateMemberCtrl'
        })

        .when("/members/import", {
            templateUrl : "view/member/import.html",
            cache : false,
            controller : "importMemberCtrl"
        })
    
    //First Timers
        .when("/first-timers", {
            templateUrl : "view/first_timers/index.html",
            cache : false,
            controller : "firstTimersCtrl"
        })
    
        .when("/first-timers/add", {
            templateUrl : "view/first_timers/add.html",
            cache : false,
            controller : "addFirstTimersCtrl"
        })
    
        .when('/first-timers/view/:id', {
            templateUrl: 'view/first_timers/view.html',
            cache : false,
            controller: 'viewFirstTimersCtrl'
        })

        .when('/first-timers/update', {
            templateUrl: 'view/first_timers/update.html',
            cache : false,
            controller: 'updateFirstTimersCtrl'
        })

        .when("/first-timers/import", {
            templateUrl : "view/first_timers/import.html",
            cache : false,
            controller : "importFirstTimersCtrl"
        })

    //Reports
        .when("/reports", {
            templateUrl : "view/reports/members.html",
            cache : false,
            controller : "membersReportsCtrl"
        })

        .when("/reports/members", {
            templateUrl : "view/reports/members.html",
            cache : false,
            controller : "membersReportsCtrl"
        })

        .when("/reports/first-timers", {
            templateUrl : "view/reports/first-timers.html",
            cache : false,
            controller : "firstTimersReportsCtrl"
        })

    //Profile    
        .when("/profile", {
            templateUrl : "view/profile.html",
            cache : false,
            controller : "profileCtrl"
        })

        .when("/changepassword", {
            templateUrl : "view/changepassword.html",
            cache : false,
            controller : "changepasswordCtrl"
        });
});