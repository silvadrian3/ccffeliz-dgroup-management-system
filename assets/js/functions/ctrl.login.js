app.controller('loginCtrl', ['$scope', '$http', '$cookies', '$cookieStore', function ($scope, $http, $cookies, $cookieStore) {
    "use strict";
    
    $scope.login = function () {
		
		var el = '5fea10f9b07309ead88909855cfff695',
            params = {
                username: $scope.username,
                password: $scope.password
            };

        $http.post(baselocation + "/api/v1/login.php?m=" + el, params).success(function (response) {
            console.log(response);
            if (response[0].result) {
                var ui = response[0].data[0].user_id,
                    type = response[0].data[0].user_type,
                    params = {
                        user_id: ui,
                        module: "Log In",
                        activity: "Log In",
                        verb: "Logged In"
                    };
                    
                $cookieStore.put('user_id', ui);
                $cookieStore.put('user_type', type);
                
                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                    
                    if (response[0].result) {
                        $scope.clientresponse("Log in successful. Redirecting...", 1);
                        setTimeout(function () {
                        window.location = "admin/";
                        /**
                            if (parseInt(type) === 1) {
                                window.location = "admin/";
                            } else {
                                window.location = "member/";
                            }
                        */
                        }, 1500);
                    } else {
                        $scope.clientresponse("Unexpected error encountered.", 0);
                    }
                    
                }).error(function (msg) {
                    $scope.onError(msg);
                });
                
            } else {
                $scope.clientresponse("Invalid Log In details. Please try again.", 0);
            }
            
		}).error(function (msg) {
            $scope.onError(msg);
        });
        
	};
    
    $scope.onError = function (msg) {
        $scope.clientresponse("Unexpected error encountered. " + msg, 0);
    };
    
    $scope.clientresponse = function (msg, status) {
        $scope.result_msg = msg;
        $scope.display_result = true;
        $(window).scrollTop(0);
        
        if (status === 1) {
            $scope.success = true;
            $scope.failed = false;
            return true;
        } else {
            $scope.failed = true;
            $scope.success = false;
            return false;
        }
    };
    
    $scope.resetresponse = function () {
        $scope.result_msg = "";
        $scope.display_result = false;
        $scope.success = false;
        $scope.failed = false;
    };
    
}]);
