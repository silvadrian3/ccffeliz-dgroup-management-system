app.controller('settingsCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type');
    
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-settings').addClass('active');
    
    
    angular.element(document).ready(function () {
        
        setTimeout(function () {
            $('#page-wrapper').show();
            loadpage();
        }, 500);
    });
    
}]);

/**
app.controller('manageUsersCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-settings').addClass('active');
    
    angular.element(document).ready(function () {
        
        setTimeout(function () {
            $('#page-wrapper').show();
            loadpage();
        }, 500);
    });
}]);
*/

app.controller('scheduleOfServicesCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        removedservs = [];
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-settings').addClass('active');
    
    angular.element(document).ready(function () {
        $scope.service_list = [];
        $http.get(baselocation + "/api/v1/services.php?m=" + el).success(function (response) {
            
            if (response[0].result) {
                $scope.service_list = response[0].data;
                setTimeout(function () {
	            $('#page-wrapper').show();
	            loadpage();
	        }, 500);
            }
            
            if ($scope.service_list.length === 0) {
                $scope.addRow();
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        
        
    });
    
    $scope.addRow = function () {
        var data = {};
        data.service_name = '';
        $scope.service_list.push(data);
    };
    
    
    $scope.removeRow = function (evt) {
        
        var row_id = evt.target.id,
            getClass = document.getElementById('service_name_' + row_id).className,
            serv_id = getClass.substr(getClass.lastIndexOf("_") + 1);
        
		$scope.service_list.splice(row_id, 1);
        
        if (serv_id !== undefined && serv_id !== "") {
            removedservs.push(serv_id);
        }
        
        if ($scope.service_list.length === 0) {
            $scope.addRow();
        }
        
	};
    
    $scope.saveList = function () {
    
    if(ut != 1){
    	alert("Sorry, your account type don't have permission to save these changes.");
    } else {
        if (!isEmpty(removedservs)) {
            var params_2rmv = {
                service_id: removedservs
            };
            
            $http.post(baselocation + "/api/v1/services.php?m=" + el + "&user_id=" + ui + "&action=delete", params_2rmv).success(function (response) {
            
                if (!response[0].result) {
                    $scope.clientresponse("Unexpected error encountered. " + response, 0);
                }
            }).error(function (msg) {
                $scope.onError(msg);
            });
        }
        
        var params_2add = [],
            arr,
            rowlen = angular.element('.service_list').length - 1,
            x;
        
        for (x = 0; x <= rowlen; x++) {
            var getClass = document.getElementById('service_name_' + x).className,
                service_id = getClass.substr(getClass.lastIndexOf("_") + 1),
                val = angular.element('#service_name_' + x).val();
            
            if(val.trim() != ""){
                arr = {
                    user_id: ui,
                    name: val.trim(),
                    id: service_id.trim()
                };

                params_2add.push(arr);
            }
        }
        
        $http.put(baselocation + "/api/v1/services.php?m=" + el + "&user_id=" + ui, params_2add).success(function (response) {
        
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    module: 'Schedule of Services',
                    activity: 'Update',
                    verb: 'Updated Schedule of Services'
                };
                
                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                    
                    if (response[0].result) {
                        
                        $scope.clientresponse("Schedule of Services successfully saved.", 1);

                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                        
                    } else {
                        $scope.clientresponse("Unexpected error encountered. " + response, 0);
                    }
                }).error(function (msg) {
                    $scope.onError(msg);
                });
            } else {
                $scope.clientresponse("Unexpected error encountered. " + response, 0);
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
    }    
    };
    
}]);

app.controller('glcLevelsCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        removedlvls = [];
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-settings').addClass('active');
    
    
    angular.element(document).ready(function () {
        $scope.glc_level_list = [];
        $http.get(baselocation + "/api/v1/glc_level.php?m=" + el).success(function (response) {
            
            if (response[0].result) {
                $scope.glc_level_list = response[0].data;    
                setTimeout(function () {
	            $('#page-wrapper').show();
	            loadpage();
	        }, 500);
            }
            
            if ($scope.glc_level_list.length === 0) {
                $scope.addRow();
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        
    });
    
    $scope.addRow = function () {
        var data = {};
        data.glc_level_name = '';
        $scope.glc_level_list.push(data);
    };
    
    
    $scope.removeRow = function (evt) {
        
        var row_id = evt.target.id,
            getClass = document.getElementById('glc_level_name_' + row_id).className,
            lvl_id = getClass.substr(getClass.lastIndexOf("_") + 1);
        
		$scope.glc_level_list.splice(row_id, 1);
        
        if (lvl_id !== undefined && lvl_id !== "") {
            removedlvls.push(lvl_id);
        }
        
        if ($scope.glc_level_list.length === 0) {
            $scope.addRow();
        }
	};
    
    $scope.saveList = function () {
    
    if(ut != 1){
    	alert("Sorry, your account type don't have permission to save these changes.");
    } else {
        if (!isEmpty(removedlvls)) {
            var params_2rmv = {
                glclvl_id: removedlvls
            };
            
            $http.post(baselocation + "/api/v1/glc_level.php?m=" + el + "&user_id=" + ui + "&action=delete", params_2rmv).success(function (response) {
            
                if (!response[0].result) {
                    $scope.clientresponse("Unexpected error encountered. " + response, 0);
                }
            }).error(function (msg) {
                $scope.onError(msg);
            });
        }
        
        var params_2add = [],
            arr,
            rowlen = angular.element('.glc_level_list').length - 1,
            x;
        
        for (x = 0; x <= rowlen; x++) {
            var getClass = document.getElementById('glc_level_name_' + x).className,
                glc_lvl_id = getClass.substr(getClass.lastIndexOf("_") + 1),
                val = angular.element('#glc_level_name_' + x).val();
            
            if(val.trim() != ""){
                arr = {
                    user_id: ui,
                    name: val.trim(),
                    id: glc_lvl_id.trim()
                };

                params_2add.push(arr);
            }
        }
        
        
        $http.put(baselocation + "/api/v1/glc_level.php?m=" + el + "&user_id=" + ui, params_2add).success(function (response) {
        
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    module: 'GLC Levels',
                    activity: 'Update',
                    verb: 'Updated GLC Levels'
                };
                
                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                    
                    if (response[0].result) {
                        
                        $scope.clientresponse("GLC Levels successfully saved.", 1);

                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                        
                    } else {
                        $scope.clientresponse("Unexpected error encountered. " + response, 0);
                    }
                }).error(function (msg) {
                    $scope.onError(msg);
                });
            } else {
                $scope.clientresponse("Unexpected error encountered. " + response, 0);
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    }
    };
    
    
    
}]);


app.controller('dgroupTypeCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        removedlvls = [];
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-settings').addClass('active');
    
    
    angular.element(document).ready(function () {
        $scope.group_type_list = [];
        $http.get(baselocation + "/api/v1/dgroup_type.php?m=" + el).success(function (response) {
            
            if (response[0].result) {
                $scope.group_type_list = response[0].data;   
                setTimeout(function () {
	            $('#page-wrapper').show();
	            loadpage();
	        }, 500); 
            }
            
            if ($scope.group_type_list.length === 0) {
                $scope.addRow();
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        
    });
    
    $scope.addRow = function () {
        var data = {};
        data.group_type_name = '';
        $scope.group_type_list.push(data);
    };
    
    
    $scope.removeRow = function (evt) {
        
        var row_id = evt.target.id,
            getClass = document.getElementById('group_type_name_' + row_id).className,
            gtype_id = getClass.substr(getClass.lastIndexOf("_") + 1);
        
		$scope.group_type_list.splice(row_id, 1);
        
        if (gtype_id !== undefined && gtype_id !== "") {
            removedlvls.push(gtype_id);
        }
        
        if ($scope.group_type_list.length === 0) {
            $scope.addRow();
        }
	};
    
    $scope.saveList = function () {
    
    if(ut != 1){
    	alert("Sorry, your account type don't have permission to save these changes.");
    } else {
    
        if (!isEmpty(removedlvls)) {
            var params_2rmv = {
                gtype_id: removedlvls
            };
            
            $http.post(baselocation + "/api/v1/dgroup_type.php?m=" + el + "&user_id=" + ui + "&action=delete", params_2rmv).success(function (response) {
            
                if (!response[0].result) {
                    $scope.clientresponse("Unexpected error encountered. " + response, 0);
                }
            }).error(function (msg) {
                $scope.onError(msg);
            });
        }
        
        
        var params_2add = [],
            arr,
            rowlen = angular.element('.group_type_list').length - 1,
            x;
        
        for (x = 0; x <= rowlen; x++) {
            var getClass = document.getElementById('group_type_name_' + x).className,
                group_type_id = getClass.substr(getClass.lastIndexOf("_") + 1),
                val = angular.element('#group_type_name_' + x).val();
            
            if(val.trim() != ""){
                arr = {
                    user_id: ui,
                    name: val.trim(),
                    id: group_type_id.trim()
                };

                params_2add.push(arr);
            }
        }
        
        $http.put(baselocation + "/api/v1/dgroup_type.php?m=" + el + "&user_id=" + ui, params_2add).success(function (response) {
        
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    module: 'DGroup Type',
                    activity: 'Update',
                    verb: 'Updated DGroup Types'
                };
                
                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                    
                    if (response[0].result) {
                        
                        $scope.clientresponse("DGroup Types successfully saved.", 1);

                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                        
                    } else {
                        $scope.clientresponse("Unexpected error encountered. " + response, 0);
                    }
                }).error(function (msg) {
                    $scope.onError(msg);
                });
            } else {
                $scope.clientresponse("Unexpected error encountered. " + response, 0);
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        }
        
    };
    
    
    
}]);




