app.controller('firstTimersCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-firsttimers').addClass('active');
    
    angular.element(document).ready(function () {
        
        var stage_id = "1-2-3";
            $scope.chkpending = true;
            $scope.chkinvited = true;
            $scope.chkfollowup = true;
        
        $http.get(baselocation + "/api/v1/first_timers.php?m=" + el + "&stage_id="+stage_id+"&mode=all").success(function (response) {
            
            if(response[0].result){
                $scope.first_timers = response[0].data;
                setTimeout(function () {
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [0, -1]}],
                        "aaSorting": [1, 'asc']
                    });

                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
            } else {
                $scope.first_timers = [];
                setTimeout(function () {
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [0, -1]}],
                        "aaSorting": [1, 'asc']
                    });

                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
$scope.getAge = function(dob){

var dateparts = dob.split("-"),
    bday = parseInt(dateparts[2]),
    bmo = parseInt(dateparts[1]),
    byr = parseInt(dateparts[0]),
    byr,
    age,
    now = new Date(),
    tday=parseInt(now.getDate()),
    tmo=parseInt(now.getMonth() + 1),
    tyr=parseInt(now.getFullYear());

    if((tmo > bmo)||(tmo==bmo & tday>=bday)){
	age=byr;
    } else {
	age=byr+1;
    }

return parseInt(tyr)-parseInt(age);

}        
    });
    
    $scope.loadtypeselection = function(){
        prepage();
        $("#tbl_records").dataTable().fnDestroy();
        
        var stagetypefilter = "&stage_id=";
        
        if($scope.chkpending){
            stagetypefilter += "1-";
        }
        
        if($scope.chkinvited){
            stagetypefilter += "2-";
        }
        
        if($scope.chkfollowup){
            stagetypefilter += "3-";
        }
        
        stagetypefilter = stagetypefilter.substring(0, stagetypefilter.length-1);
        
        if(!$scope.chkpending && !$scope.chkinvited && !$scope.chkfollowup){
            $scope.first_timers = [];
            setTimeout(function () {
                $('#tbl_records').dataTable({
                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [0, -1]}],
                    "aaSorting": [1, 'asc']
                });

                $('#page-wrapper').show();
                loadpage();
            }, 500);
        } else {
            
            $http.get(baselocation + "/api/v1/first_timers.php?m=" + el + stagetypefilter + "&mode=all").success(function (response) {
                
                if (response[0].result) {
                    $scope.first_timers = response[0].data;
                    setTimeout(function () {
                        $('#tbl_records').dataTable({
                            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                            "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [0, -1]}],
                            "aaSorting": [1, 'asc']
                        });

                        $('#page-wrapper').show();
                        loadpage();
                    }, 500);
                } else {
                    $scope.first_timers = [];
                    setTimeout(function () {
                        $('#tbl_records').dataTable({
                            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                            "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [0, -1]}],
                            "aaSorting": [1, 'asc']
                        });

                        $('#page-wrapper').show();
                        loadpage();
                    }, 500);
                }
            }).error(function (msg) {
                $scope.onError(msg);
            });
        }
        
        
    };
    
    $scope.single_action = function (cat, id) {
        if (cat === 'r') { //read
            window.location = "#/first-timers/view/" + id;
        } else if (cat === 'u') { //update
            window.location = "#/first-timers/update/?id=" + id;
        } else if (cat === 'd') { //delete
        
            if(ut != 1){
		   alert("Sorry, your account type don't have permission to save these changes.");
	    } else {
	            if (confirm("Are you sure you want to archive this First Timer?")) {
	                
	                $http.delete(baselocation + "/api/v1/first_timers.php?m=" + el + "&user_id=" + ui + "&firsttimer_id=" + id).success(function (response) {
	                    
	                    if (response[0].result) {
	                        var params = {
	                            user_id: ui,
	                            module: 'First Timers',
	                            activity: 'Archive',
	                            verb: 'Archived a First Timer'
	                        };
	
	                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
	                            if (response[0].result) {
	                                $scope.clientresponse("First Timer successfully deleted.", 1);
	
	                                setTimeout(function () {
	                                    location.reload();
	                                }, 3000);
	                            } else {
	                                $scope.clientresponse("Unexpected error encountered.", 0);
	                            }
	                        }).error(function (msg) {
	                            $scope.onError(msg);
	                        });
	                    }
	                }).error(function (msg) {
	                    $scope.onError(msg);
	                });
	            }
            }
        }
    };
    
    $scope.multidelete = function () {
        var arr_firsttimer_id = "",
            chk_itms = angular.element('.check_item');
        
        angular.forEach(chk_itms, function (item) {
            if (item.checked) {
                arr_firsttimer_id = arr_firsttimer_id + item.value + '-';
            }
        });
        
        arr_firsttimer_id = arr_firsttimer_id.slice(0, -1);
        
	if(ut != 1){
		alert("Sorry, your account type don't have permission to save these changes.");
	} else {
	        if (confirm("Are you sure you want to archive selected First Timer(s)?")) {
	            $http.delete(baselocation + "/api/v1/first_timers.php?m=" + el + "&user_id=" + ui + "&firsttimer_id=" + arr_firsttimer_id).success(function (response) {
	                if (response[0].result) {
	                    var params = {
	                        user_id: ui,
	                        module: 'First Timers',
	                        activity: 'Archive',
	                        verb: 'Archived multiple First Timers'
	                    };
	
	                    $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
	                        if (response[0].result) {
	                            $scope.clientresponse("First Timer(s) successfully deleted.", 1);
	
	                            setTimeout(function () {
	                                location.reload();
	                            }, 3000);
	                        } else {
	                            $scope.clientresponse("Unexpected error encountered.", 0);
	                        }
	                    }).error(function (msg) {
	                        $scope.onError(msg);
	                    });
	                }
	            }).error(function (msg) {
	                $scope.onError(msg);
	            });
	        }
        }
    };
    
    
    
    $scope.multiupdate = function () {
        var arr_firsttimer_id = "id=",
            chk_itms = angular.element('.check_item');
        
        angular.forEach(chk_itms, function (item) {
            if (item.checked) {
                arr_firsttimer_id = arr_firsttimer_id + item.value + '-';
            }
        });
        
        arr_firsttimer_id = arr_firsttimer_id.slice(0, -1);
        window.location = "#/first-timers/update/?" + arr_firsttimer_id;
    };
    
}]);

//Add
app.controller('addFirstTimersCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        arr_service_id = [],
        arr_service_name = [],
        x;
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-firsttimers').addClass('active');
    
    angular.element(document).ready(function () {
        //$scope.date_registered = $filter('date')(new Date(), "dd/MM/yyyy");
        //$scope.date_joined = $filter('date')(new Date(), "dd/MM/yyyy");
        
        $http.get(baselocation + "/api/v1/services.php?m=" + el).success(function (response) {
            
            if (response[0].result) {
                $scope.service_list = response[0].data;
            }

        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.checkName = function () {
        
        if (($scope.firstname !== "" && $scope.firstname !== undefined) && ($scope.lastname !== "" && $scope.lastname !== undefined)) {
            
            var params = {
                module: 'firsttimer',
                firstname: $scope.firstname,
                lastname: $scope.lastname
            };

            $http.post(baselocation + "/api/v1/check_exist.php?m=" + el, params).success(function (response) {
                
                if (response[0].result) {

                    if (response[0].data[0].row !== 0) {
                        alert('First Timer Name already exists.');
                        $scope.firstname = "";
                        $scope.lastname = "";
                        angular.element('#firstname').focus();
                    }

                } else {
                    $scope.clientresponse("Unexpected error encountered.", 0);
                }

            }).error(function (msg) {
                $scope.onError(msg);
            });
        }
        
    };
    
    $scope.addMember = function () {
        angular.element('#btn_save').css("pointer-events", "none");
        var date_registered = angular.element("#date_registered").val(),
            date_of_birth = angular.element("#birthday").val();
                  
        if (date_registered !== "" && date_registered !== undefined) {
            date_registered = $filter('date')(new Date(date_registered), "yyyy-MM-dd");
        }
        
        if (date_of_birth !== "" && date_of_birth !== undefined) {
            date_of_birth = $filter('date')(new Date(date_of_birth), "yyyy-MM-dd");
        }

        var params = {
            stage_id: 1,
            firstname: $scope.firstname,
            lastname: $scope.lastname,
            middlename: $scope.middlename,
            email: $scope.email,
            date_of_birth: date_of_birth,
            age: $scope.age,
            contact_no: $scope.contactnumber,
            address: $scope.address,
            occupation: $scope.occupation,
            civil_status: $scope.civilstatus,
            gender: $scope.gender,
            date_registered: date_registered,
            service_attended: $scope.service_attended,
            preferred_day: $scope.preferred_day,
            modified_by: ui
        };
        
        $http.post(baselocation + "/api/v1/first_timers.php?m=" + el, params).success(function (response) {
            console.log(response);
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    module: 'First Timers',
                    activity: 'Add',
                    verb: 'Added a First Timer'
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                    if (response[0].result) {
                        $scope.clientresponse("First Timer successfully added.", 1);
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else {
                        $scope.clientresponse("Unexpected error encountered.", 0);
                    }
                }).error(function (msg) {
                    $scope.onError(msg);
                });

            } else {
                $scope.clientresponse("Unexpected error encountered.", 0);
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    };
    
    $scope.gotoList = function () {
        window.location = "#first-timers";
    };
     
    setTimeout(function () {
        $('#page-wrapper').show();
        loadpage();
    }, 500);
    
}]);

//View
app.controller('viewFirstTimersCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        vi = $routeParams.id,
        na = 'N/A';
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-firsttimers').addClass('active');
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/first_timers.php?m=" + el + "&firsttimer_id=" + vi + "&mode=single").success(function (response) {
            
            if (response[0].result) {
                
                if (response[0].data[0].firstname !== "") {
                    $scope.firstname = response[0].data[0].firstname;
                } else {
                    $scope.firstname = "";
                }

                if (response[0].data[0].lastname !== "") {
                    $scope.lastname = response[0].data[0].lastname;
                } else {
                    $scope.lastname = "";
                }

                if (response[0].data[0].middlename !== "") {
                    $scope.middlename = response[0].data[0].middlename;
                } else {
                    $scope.middlename = "";
                }

                if (response[0].data[0].email !== "") {
                    $scope.email = response[0].data[0].email;
                } else {
                    $scope.email = na;
                }

                if (response[0].data[0].date_of_birth !== "" && response[0].data[0].date_of_birth !== "0000-00-00") {
                    $scope.date_of_birth = $filter('date')(new Date(response[0].data[0].date_of_birth), "MMM dd, yyyy");
                    $scope.age = $scope.getAge(response[0].data[0].date_of_birth);
                } else {
                    $scope.date_of_birth = na;
                    $scope.age = na;
                }
/**
                if (response[0].data[0].age !== "" && response[0].data[0].age !== "0") {
                    $scope.age = response[0].data[0].age;
                } else {
                    $scope.age = na;
                }
*/


                if (response[0].data[0].contact_no !== "") {
                    $scope.contact_no = response[0].data[0].contact_no;
                } else {
                    $scope.contact_no = na;
                }
                
                if (response[0].data[0].address !== "") {
                    $scope.address = response[0].data[0].address;
                } else {
                    $scope.address = na;
                }
                
                if (response[0].data[0].occupation !== "") {
                    $scope.occupation = response[0].data[0].occupation;
                } else {
                    $scope.occupation = na;
                }
                
                if (response[0].data[0].civil_status !== "") {
                    $scope.civil_status = response[0].data[0].civil_status;
                } else {
                    $scope.civil_status = na;
                }
                
                if (response[0].data[0].gender !== "") {
                    $scope.gender = response[0].data[0].gender;
                } else {
                    $scope.gender = na;
                }
                
                if (response[0].data[0].stage_id !== "") {
                    $scope.stage_id = response[0].data[0].stage_id;
                } else {
                    $scope.stage_id = na;
                }
                
                if (response[0].data[0].category_name !== "") {
                    $scope.category_name = response[0].data[0].category_name;
                } else {
                    $scope.category_name = na;
                }
                
                if (response[0].data[0].date_registered !== "" && response[0].data[0].date_registered !== "0000-00-00") {
                    $scope.date_registered = $filter('date')(new Date(response[0].data[0].date_registered), "MMM dd, yyyy");
                } else {
                    $scope.date_registered = na;
                }
                
                if (response[0].data[0].service_attended !== "") {
                    $scope.service_attended = response[0].data[0].service_attended;
                } else {
                    $scope.service_attended = na;
                }
                
                if (response[0].data[0].preferred_day !== "") {
                    $scope.preferred_day = response[0].data[0].preferred_day;
                } else {
                    $scope.preferred_day = na;
                }
            }
        
        }).error(function (msg) {
            $scope.onError(msg);
        });

$scope.getAge = function(dob){

var dateparts = dob.split("-"),
    bday = parseInt(dateparts[2]),
    bmo = parseInt(dateparts[1]),
    byr = parseInt(dateparts[0]),
    byr,
    age,
    now = new Date(),
    tday=parseInt(now.getDate()),
    tmo=parseInt(now.getMonth() + 1),
    tyr=parseInt(now.getFullYear());

    if((tmo > bmo)||(tmo==bmo & tday>=bday)){
	age=byr;
    } else {
	age=byr+1;
    }

return parseInt(tyr)-parseInt(age);

}

    });
    
    $scope.gotoUpdate = function () {
        window.location = "#/first-timers/update/?id=" + vi;
    };
    
    $scope.gotoList = function () {
        window.location = "#first-timers";
    };
    
    setTimeout(function () {
        $('#page-wrapper').show();
        loadpage();
    }, 500);
        
}]);

app.controller('updateFirstTimersCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        vi = $routeParams.id,
        arr_service_id = [],
        arr_service_name = [],
        arr_leader_id = [],
        arr_leader_name = [],
        x;
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-firsttimers').addClass('active');
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/first_timers.php?m=" + el + "&user_id=" + ui + "&firsttimer_id=" + vi + "&mode=multiple").success(function (response) {
            
            if (response[0].result) {
                $scope.listmembers = response[0].data;
                
                setTimeout(function () {
                    $('.date_picker').datetimepicker({timepicker: false, format: 'm/d/Y', scrollMonth: false, scrollInput: false, validateOnBlur: false});
                }, 0);
                
                $http.get(baselocation + "/api/v1/services.php?m=" + el).success(function (response) {
                    
                    if (response[0].result) {
                        $scope.service_list = response[0].data;
                    }

                }).error(function (msg) {
                    $scope.onError(msg);
                });
                
                $http.get(baselocation + "/api/v1/members.php?m=" + el + "&usertype_id=1-2" + "&mode=all").success(function (response) {
                
                    if (response[0].result) {
                        for (x = 0; x < response[0].data.length; x++) {
                            arr_leader_id.push(response[0].data[x].member_id);
                            arr_leader_name.push(response[0].data[x].firstname + ' ' + response[0].data[x].lastname);
                        }
                        $scope.dgleaders = arr_leader_name;
                    }

                }).error(function (msg) {
                    $scope.onError(msg);
                });
               
            }
        }).error(function (msg) {
            console.log(msg);
        });
        
        setTimeout(function () {
            $('#page-wrapper').show();
            loadpage();
        }, 500);
        
    });
    
    
    $scope.updateMultipleMembers = function () {
        var bit = true,
            params = [];
	if(ut != 1){
		alert("Sorry, your account type don't have permission to save these changes.");
	} else {
	        angular.forEach($scope.listmembers, function (item) {
	            var profile_id = item.profile_id,
	                firsttimer_id = item.firsttimer_id,
	                firstname = angular.element("#firstname_" + firsttimer_id).val(),
	                lastname = angular.element("#lastname_" + firsttimer_id).val(),
	                middlename = angular.element("#middlename_" + firsttimer_id).val(),
	                date_of_birth = angular.element("#birthday_" + firsttimer_id).val(),
	                age = angular.element("#age_" + firsttimer_id).val(),
	                gender = angular.element('input:radio[name="gender_' + firsttimer_id + '"]:checked').val(),
	                civilstatus = angular.element("#civilstatus_" + firsttimer_id).val(),
	                occupation = angular.element("#occupation_" + firsttimer_id).val(),
	                contactnumber = angular.element("#contactnumber_" + firsttimer_id).val(),
	                email = angular.element("#email_" + firsttimer_id).val(),
	                address = angular.element("#address_" + firsttimer_id).val(),
	                stage_id = angular.element("#status_" + firsttimer_id).val(),
	                date_registered = angular.element("#date_registered_" + firsttimer_id).val(),
	                service_attended = angular.element("#service_attended_" + firsttimer_id).val(),
	                preferred_day = angular.element("#preferred_day_" + firsttimer_id).val(),
	                date_joined = angular.element("#date_joined_" + firsttimer_id).val(),
	                dgleader = angular.element("#dgleader_" + firsttimer_id).val(),
	                dgleader_id, i;
	            
	            if (date_registered !== "" && date_registered !== undefined) {
	                date_registered = $filter('date')(new Date(date_registered), "yyyy-MM-dd");
	            }
	            
	            if (date_joined !== "" && date_joined !== undefined) {
	                date_joined = $filter('date')(new Date(date_joined), "yyyy-MM-dd");
	            }
	            
	            if (date_of_birth !== "" && date_of_birth !== undefined) {
	                date_of_birth = $filter('date')(new Date(date_of_birth), "yyyy-MM-dd");
	            }
	            
	            for (i = 0; i < arr_leader_name.length; i++) {
	                if (dgleader.trim() === arr_leader_name[i].trim()) {
	                    dgleader_id = arr_leader_id[i];
	                    break;
	                }
	            }
	
	            if (i === arr_leader_name.length) {
	                dgleader_id = 0;
	            }
	
	            var paramloop = {
	                firsttimer_id: firsttimer_id,
	                profile_id: profile_id,
	                firstname: firstname,
	                lastname: lastname,
	                middlename: middlename,
	                date_of_birth: date_of_birth,
	                age: age,
	                gender: gender,
	                civilstatus: civilstatus,
	                occupation: occupation,
	                contactnumber: contactnumber,
	                email: email,
	                address: address,
	                date_registered: date_registered,
	                service_attended: service_attended,
	                preferred_day: preferred_day,
	                date_joined: date_joined,
	                dgleader_id: dgleader_id,
	                stage_id: stage_id
	            };
	
	            params.push(paramloop);
	        });
        
	        $http.put(baselocation + "/api/v1/first_timers.php?m=" + el + "&user_id=" + ui + "&mode=multiple", params).success(function (response) {

	            if (response[0].result) {
	                
	                var params = {
	                    user_id: ui,
	                    module: 'First Timers',
	                    activity: 'Update',
	                    verb: 'Update First Timer Details'
	                };
	                
	                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
	                    
	                    if (response[0].result) {
	                        $scope.clientresponse("First Timer(s) successfully updated.", 1);
	                        setTimeout(function () {
	                            $scope.resetresponse();
	                            //location.reload();
	                            window.location = '#/first-timers';
	                        }, 3000);
	                    } else {
	                        $scope.clientresponse("Unexpected error encountered.", 0);
	                    }
	                }).error(function (msg) {
	                    $scope.onError(msg);
	                });
	                
	
	            } else {
	                $scope.clientresponse("Unexpected error encountered.", 0);
	            }
	            
	        }).error(function (msg){
	            console.log(msg);
	        });
        
        }
        
        
        
    };
    
    
    $scope.gotoList = function () {
        window.location = "#first-timers";
    };
    
}]);


//Import
/**
app.controller('importFirstTimersCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    "use strict";
    prepage();
    
    //console.log($routeParams.id);
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    
    setTimeout(function () {    
            $('#page-wrapper').show();
            loadpage();
    }, 500);
    
    $scope.start_import = function () {
        $("#tbl_records_importpartner").dataTable().fnDestroy();
        $scope.imported_partners = mprt_out;
        //console.log(mprt_out);
        
        setTimeout(function () {
            $('#tbl_records_importpartner').dataTable({
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            });
            
            $("#div_importpartner").show();
        }, 500);
        
        //console.log(mprt_out);
    }

}]);
*/



app.controller('firstTimersReportsCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-reports').addClass('active');
    
    angular.element(document).ready(function () {
        $http.get(baselocation + "/api/v1/first_timers.php?m=" + el + "&stage_id=1-2-3-4" + "&mode=search").success(function (response) {
        
            if (response[0].result) {
                angular.element(".btn_export").show();
                $scope.members = response[0].data;
                setTimeout(function () {
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        //bPaginate: false,
                        //bInfo: false
                    });

                    $('#page-wrapper').show();
                    loadpage();

                }, 500);  
            } else {
                $scope.members = [];
                angular.element(".btn_export").hide();
                setTimeout(function () {
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        //bPaginate: false,
                        //bInfo: false
                    });

                    $('#page-wrapper').show();
                    loadpage();

                }, 500);  
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    $scope.getAge = function(dob){

var dateparts = dob.split("-"),
    bday = parseInt(dateparts[2]),
    bmo = parseInt(dateparts[1]),
    byr = parseInt(dateparts[0]),
    byr,
    age,
    now = new Date(),
    tday=parseInt(now.getDate()),
    tmo=parseInt(now.getMonth() + 1),
    tyr=parseInt(now.getFullYear());

    if((tmo > bmo)||(tmo==bmo & tday>=bday)){
	age=byr;
    } else {
	age=byr+1;
    }

return parseInt(tyr)-parseInt(age);

}    
    });
    
    $scope.search = function () {
        
        prepage();
        $("#tbl_records").dataTable().fnDestroy();
        
        var stagefilter = "", genderfilter = "", civilstatusfilter = "", preferreddayfilter = "", dateregisteredfilter = "",
            gender = angular.element('input:radio[name="gender"]:checked').val(),
            civilstat = angular.element('#civilstatus').val(),
            preferred_day = angular.element('#preferred_day').val(),
            startdateregistered = angular.element("#startdateregistered").val(),
            enddateregistered = angular.element("#enddateregistered").val();
        
            
        if(angular.element("#chkpending").prop('checked') || angular.element("#chkinvited").prop('checked') || angular.element("#chkfollowup").prop('checked') || angular.element("#chkplaced").prop('checked')){
            stagefilter = "&stage_id=";
        
            if(angular.element("#chkpending").prop('checked')){
                stagefilter += "1-";
            }

            if(angular.element("#chkinvited").prop('checked')){
                stagefilter += "2-";
            }

            if(angular.element("#chkfollowup").prop('checked')){
                stagefilter += "3-";
            }
            
            if(angular.element("#chkplaced").prop('checked')){
                stagefilter += "4-";
            }
        
            stagefilter = stagefilter.substring(0, stagefilter.length-1);
        }
        
        if(gender !== "" && gender !== undefined){
            genderfilter = "&gender=" + gender;
        }
        
        if(civilstat !== "" && civilstat !== undefined){
            civilstatusfilter = "&civilstatus=" + civilstat;
        }
        
        if(angular.element("#showAdvanced").prop('checked')){
            if(startdateregistered !== "" && enddateregistered !== ""){
                if (startdateregistered !== "" && startdateregistered !== undefined) {
                    startdateregistered = $filter('date')(new Date(startdateregistered), "yyyy-MM-dd");
                    dateregisteredfilter += "&startdateregistered=" + startdateregistered;
                }

                if (enddateregistered !== "" && enddateregistered !== undefined) {
                    enddateregistered = $filter('date')(new Date(enddateregistered), "yyyy-MM-dd");
                    dateregisteredfilter += "&enddateregistered=" + enddateregistered;
                }
            }
            
            if(preferred_day !== "" && preferred_day !== undefined){
                preferreddayfilter = "&preferred_day=" + preferred_day;
            }
        }
        
        $http.get(baselocation + "/api/v1/first_timers.php?m=" + el + stagefilter + genderfilter + civilstatusfilter + preferreddayfilter + dateregisteredfilter + "&mode=search").success(function (response) {
        
            if (response[0].result) {
                angular.element(".btn_export").show();
                $scope.members = response[0].data;
                setTimeout(function () {
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        //bPaginate: false,
                        //bInfo: false
                    });

                    $('#page-wrapper').show();
                    loadpage();

                }, 500);
            } else {
                $scope.members = [];
                angular.element(".btn_export").hide();
                setTimeout(function () {
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        //bPaginate: false,
                        //bInfo: false
                    });

                    $('#page-wrapper').show();
                    loadpage();

                }, 500);
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
            
        
        /**
        $http.get(baselocation + "/api/v1/deliveries.php?m=" + el + isClient + datefilter).success(function (response) {

            var result_total_amount = 0.00,
                result_total_qty = 0,
                y;
            
            if (response[0].result) {
                angular.element(".btn_export").show();
                $("#tbl_records").dataTable().fnDestroy();
                
                prepage();
                $('#page-wrapper').hide();
                
                $scope.deliveries = response[0].data;
                for(y = 0; y < response[0].data.length; y++){
                    result_total_amount += parseFloat(response[0].data[y].total_amt);
                    result_total_qty += parseInt(response[0].data[y].total_qty);
                }
                
                setTimeout(function () {
                    
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        bPaginate: false,
                        bInfo: false
                    });
                    
                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
            } else {
                prepage();
                $('#page-wrapper').hide();
                $scope.deliveries = [];
                $("#tbl_records").dataTable().fnDestroy();
                
                setTimeout(function () {
                    //alert("No result found. Please try another filter.");
                    
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        bPaginate: false,
                        bInfo: false
                    });
                    
                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
            }
            
            $scope.total_amount_result = parseFloat(result_total_amount);
            $scope.total_qty_result = parseInt(result_total_qty);
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        */
    }
    
}]);