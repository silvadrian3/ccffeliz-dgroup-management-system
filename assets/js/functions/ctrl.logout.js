app.controller('logoutCtrl', ['$scope', '$http', '$cookies', '$cookieStore', function ($scope, $http, $cookies, $cookieStore) {
    "use strict";
    
    angular.element(document).ready(function () {
        
        var el = '5fea10f9b07309ead88909855cfff695',
            ui = $cookieStore.get('user_id'),
            ci = $cookieStore.get('client_id'),
            params = {
                user_id: ui,
                client_id: ci,
                activity: "Log Out",
                module: "Log Out",
                verb: "Logged Out"
            };
        
        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
            if (response[0].result) {
                $cookieStore.remove('user_id');
                $cookieStore.remove('client_id');
                $cookieStore.remove('user_type');

                setTimeout(function () {
                    $scope.resetresponse();
                    window.location = "#login";
                }, 1000);
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    });
    
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
