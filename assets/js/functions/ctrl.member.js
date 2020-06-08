app.controller('membersCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-members').addClass('active');
    
    angular.element(document).ready(function () {
        
        var membertype = "1-2-3";
        if(!isEmpty($routeParams.type)){
            membertype = $routeParams.type;
            
            if(membertype.indexOf(1) > -1){
                $scope.chkd12 = true;
            }
            
            if(membertype.indexOf(2) > -1){
                $scope.chkdl = true;
            }
            
            if(membertype.indexOf(3) > -1){
                $scope.chkdm = true;
            }
        } else {
            $scope.chkd12 = true;
            $scope.chkdl = true;
            $scope.chkdm = true;
        }
        
        $http.get(baselocation + "/api/v1/members.php?m=" + el + "&usertype_id="+membertype+"&mode=all").success(function (response) {
            
            if (response[0].result) {
                $scope.members = response[0].data;
                
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
                $scope.members = [];
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
        
        var membertypefilter = "&usertype_id=";
        
        if($scope.chkd12){
            membertypefilter += "1-";
        }
        
        if($scope.chkdl){
            membertypefilter += "2-";
        }
        
        if($scope.chkdm){
            membertypefilter += "3-";
        }
        
        membertypefilter = membertypefilter.substring(0, membertypefilter.length-1);
        
        if(!$scope.chkd12 && !$scope.chkdl && !$scope.chkdm){
            $scope.members = [];
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
            
            $http.get(baselocation + "/api/v1/members.php?m=" + el + membertypefilter + "&mode=all").success(function (response) {
                if (response[0].result) {
                    $scope.members = response[0].data;
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
                    $scope.members = [];
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
            window.location = "#/members/view/" + id;
        } else if (cat === 'u') { //update
            window.location = "#/members/update/?id=" + id;
        } else if (cat === 'd') { //delete
		if(ut != 1){
			alert("Sorry, your account type don't have permission to save these changes.");
		} else {
			if (confirm("Are you sure you want to archive this Member?")) {
	                $http.delete(baselocation + "/api/v1/members.php?m=" + el + "&user_id=" + ui + "&member_id=" + id).success(function (response) {
	                    
	                    if (response[0].result) {
	                        var params = {
	                            user_id: ui,
	                            module: 'Members',
	                            activity: 'Archive',
	                            verb: 'Archived a Member'
	                        };
	
	                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
	                            if (response[0].result) {
	                                $scope.clientresponse("Member successfully deleted.", 1);
	
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
        var arr_member_id = "",
            chk_itms = angular.element('.check_item');
        
        angular.forEach(chk_itms, function (item) {
            if (item.checked) {
                arr_member_id = arr_member_id + item.value + '-';
            }
        });
        
        arr_member_id = arr_member_id.slice(0, -1);
	if(ut != 1){
		alert("Sorry, your account type don't have permission to save these changes.");
	} else {
	        if (confirm("Are you sure you want to archive selected Member(s)?")) {
	            
	            $http.delete(baselocation + "/api/v1/members.php?m=" + el + "&user_id=" + ui + "&member_id=" + arr_member_id).success(function (response) {
	                if (response[0].result) {
	                    var params = {
	                        user_id: ui,
	                        module: 'Members',
	                        activity: 'Archive',
	                        verb: 'Archived multiple Members'
	                    };
	
	                    $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
	                        if (response[0].result) {
	                            $scope.clientresponse("Member(s) successfully deleted.", 1);
	
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
        var arr_member_id = "id=",
            chk_itms = angular.element('.check_item');
        
        angular.forEach(chk_itms, function (item) {
            if (item.checked) {
                arr_member_id = arr_member_id + item.value + '-';
            }
        });
        
        arr_member_id = arr_member_id.slice(0, -1);
        window.location = "#/members/update/?" + arr_member_id;
    };
    
}]);

//Add
app.controller('addMemberCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        arr_leader_id = [],
        arr_leader_name = [],
        //arr_service_id = [],
        //arr_service_name = [],
        x;
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-members').addClass('active');
    
    angular.element(document).ready(function () {
        //$scope.date_registered = $filter('date')(new Date(), "dd/MM/yyyy");
        //$scope.date_joined = $filter('date')(new Date(), "dd/MM/yyyy");
        
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

        $http.get(baselocation + "/api/v1/glc_level.php?m=" + el).success(function (response) {

            if (response[0].result) {
                $scope.glc_level_list = response[0].data;
            }

        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        $http.get(baselocation + "/api/v1/dgroup_type.php?m=" + el).success(function (response) {

            if (response[0].result) {
                $scope.dgroup_type_list = response[0].data;
            }

        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    });
    

    $scope.checkName = function () {
        
        if (($scope.firstname !== "" && $scope.firstname !== undefined) && ($scope.lastname !== "" && $scope.lastname !== undefined)) {
            
            var params = {
                module: 'member',
                firstname: $scope.firstname,
                lastname: $scope.lastname
            };

            $http.post(baselocation + "/api/v1/check_exist.php?m=" + el, params).success(function (response) {
                
                if (response[0].result) {

                    if (response[0].data[0].row !== 0) {
                        alert('Member Name already exists.');
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
        var dgleader_id,
            category_id = $scope.dgroup_type,
            dgleader_name = $scope.dgleader,
            date_of_birth = angular.element("#birthday").val(),
            date_joined = angular.element("#date_joined").val(),
            handled_group_type = $scope.handled_group,
            i;

        if (date_joined !== "" && date_joined !== undefined) {
            date_joined = $filter('date')(new Date(date_joined), "yyyy-MM-dd");
        }
        
        if (date_of_birth !== "" && date_of_birth !== undefined) {
            date_of_birth = $filter('date')(new Date(date_of_birth), "yyyy-MM-dd");
        }

        if (dgleader_name !== "" && dgleader_name !== undefined) {
            for (i = 0; i < arr_leader_name.length; i++) {
                if (dgleader_name.trim() === arr_leader_name[i].trim()) {
                    dgleader_id = arr_leader_id[i];
                    break;
                }
            }

            if (i === arr_leader_name.length) {
                dgleader_id = 0;
            }
        }
        
        if(category_id != 1 && category_id != 2){
            handled_group_type = 0;
        }
        
        var params = {
            category_id: category_id,
            leader_id: dgleader_id,
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
            date_joined: date_joined,
            handled_group: handled_group_type,
            glc_level_id: $scope.glc_level,
            modified_by: ui
        };
        
        $http.post(baselocation + "/api/v1/members.php?m=" + el, params).success(function (response) {
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    module: 'Members',
                    activity: 'Add',
                    verb: 'Added a Member'
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                    if (response[0].result) {
                        $scope.clientresponse("Member successfully added.", 1);
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
        window.location = "#members";
    };
     
    setTimeout(function () {
        $('#page-wrapper').show();
        loadpage();
    }, 500);
    
}]);

//View
app.controller('viewMemberCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        vi = $routeParams.id,
        na = 'N/A';
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-members').addClass('active');
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/members.php?m=" + el + "&member_id=" + vi + "&mode=single").success(function (response) {

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
                
                if (response[0].data[0].category_id !== "") {
                    $scope.category_id = response[0].data[0].category_id;
                } else {
                    $scope.category_id = na;
                }
                
                if (response[0].data[0].category_name !== "") {
                    $scope.category_name = response[0].data[0].category_name;
                } else {
                    $scope.category_name = na;
                }
                
                if (response[0].data[0].leader_id !== "") {
                    $scope.leader_id = response[0].data[0].leader_id;
                } else {
                    $scope.leader_id = na;
                }
                
                if (response[0].data[0].leader_firstname !== "" && response[0].data[0].leader_lastname !== "") {
                    $scope.leader_name = response[0].data[0].leader_firstname + ' ' + response[0].data[0].leader_lastname;
                } else {
                    $scope.leader_name = na;
                }
                
                
                if (response[0].data[0].date_joined !== "" && response[0].data[0].date_joined !== "0000-00-00") {
                    $scope.date_joined = $filter('date')(new Date(response[0].data[0].date_joined), "MMM dd, yyyy");
                } else {
                    $scope.date_joined = na;
                }
                
                if (response[0].data[0].group_type !== "") {
                    $scope.group_type = response[0].data[0].group_type;
                } else {
                    $scope.group_type = na;
                }
                
                if (response[0].data[0].glc_level !== "") {
                    $scope.glc_level = response[0].data[0].glc_level;
                } else {
                    $scope.glc_level = na;
                }
                
                if (response[0].data[0].potential_leader !== "") {
                    $scope.potential_leader = response[0].data[0].potential_leader;
                } else {
                    $scope.potential_leader = na;
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
        window.location = "#/members/update/?id=" + vi;
    };
    
    $scope.gotoList = function () {
        window.location = "#members";
    };
    
    setTimeout(function () {
        $('#page-wrapper').show();
        loadpage();
    }, 500);
        
}]);



app.controller('updateMemberCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type'),
        vi = $routeParams.id,
        arr_leader_id = [],
        arr_leader_name = [],
        //arr_service_id = [],
        //arr_service_name = [],
        x;
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-members').addClass('active');
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/members.php?m=" + el + "&user_id=" + ui + "&member_id=" + vi + "&mode=multiple").success(function (response) {

            if (response[0].result) {
                $scope.listmembers = response[0].data;
                
                setTimeout(function () {
                    $('.date_picker').datetimepicker({timepicker: false, format: 'm/d/Y', scrollMonth: false, scrollInput: false, validateOnBlur: false});
                }, 0);
                
                $http.get(baselocation + "/api/v1/members.php?m=" + el + "&usertype_id=1-2" + "&mode=all").success(function (response) {
                
                    if (response[0].result) {
                        for (x = 0; x < response[0].data.length; x++) {
                            
                            if(response[0].data[x].member_id != vi){
                                arr_leader_id.push(response[0].data[x].member_id);
                                arr_leader_name.push(response[0].data[x].firstname + ' ' + response[0].data[x].lastname);
                            }
                        }
                        $scope.dgleaders = arr_leader_name;
                    }

                }).error(function (msg) {
                    $scope.onError(msg);
                });
                
                $http.get(baselocation + "/api/v1/glc_level.php?m=" + el).success(function (response) {

                    if (response[0].result) {
                        $scope.glc_level_list = response[0].data;
                    }

                }).error(function (msg) {
                    $scope.onError(msg);
                });

                $http.get(baselocation + "/api/v1/dgroup_type.php?m=" + el).success(function (response) {

                    if (response[0].result) {
                        $scope.dgroup_type_list = response[0].data;
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
	                member_id = item.member_id,
	                firstname = angular.element("#firstname_" + member_id).val(),
	                lastname = angular.element("#lastname_" + member_id).val(),
	                middlename = angular.element("#middlename_" + member_id).val(),
	                date_of_birth = angular.element("#birthday_" + member_id).val(),
	                age = angular.element("#age_" + member_id).val(),
	                gender = angular.element('input:radio[name="gender_' + member_id + '"]:checked').val(),
	                civilstatus = angular.element("#civilstatus_" + member_id).val(),
	                occupation = angular.element("#occupation_" + member_id).val(),
	                contactnumber = angular.element("#contactnumber_" + member_id).val(),
	                email = angular.element("#email_" + member_id).val(),
	                address = angular.element("#address_" + member_id).val(),
	                dgrouptype = angular.element('input:radio[name="dgrouptype_'+member_id+'"]:checked').val(),
	                dgleader = angular.element("#dgleader_" + member_id).val(),
	                date_joined = angular.element("#date_joined_" + member_id).val(),
	                glc_level_id = angular.element("#glc_level_" + member_id).val(),
                    potential_leader = angular.element("#potential_leader_" + member_id).val(),
	                handled_group_type = angular.element("#handled_group_" + member_id).val(),
	                dgleader_id,
	                i;
	            
	            
	            if (date_of_birth !== "" && date_of_birth !== undefined) {
	                date_of_birth = $filter('date')(new Date(date_of_birth), "yyyy-MM-dd");
	            }
	
	            if (date_joined !== "" && date_joined !== undefined) {
	                date_joined = $filter('date')(new Date(date_joined), "yyyy-MM-dd");
	            }
                
                if(potential_leader == "on"){
                    potential_leader = 1;
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
	            
	            if(dgrouptype != 1 && dgrouptype != 2){
	                handled_group_type = 0;
	            }
	
	            var paramloop = {
	                member_id: member_id,
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
	                dgleader_id: dgleader_id,
	                date_joined: date_joined,
	                category_id: dgrouptype,
	                glc_level_id: glc_level_id,
                    potential_leader: potential_leader,
	                grouptype_id: handled_group_type
	            };
	
	            params.push(paramloop);
	        });
        
            console.log(params);
        
        	$http.put(baselocation + "/api/v1/members.php?m=" + el + "&user_id=" + ui + "&mode=multiple", params).success(function (response) {

	            if (response[0].result) {
	                
	                var params = {
	                    user_id: ui,
	                    module: 'Members',
	                    activity: 'Update',
	                    verb: 'Update Member Details'
	                };
	                
	                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
	                    
	                    if (response[0].result) {
	                        $scope.clientresponse("Member(s) successfully updated.", 1);
	                        setTimeout(function () {
	                            $scope.resetresponse();
	                            window.location = '#/members';
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
        window.location = "#members";
    };
    
}]);


//Import
/**
app.controller('importPartnerCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
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

app.controller('membersReportsCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-reports').addClass('active');
    
    angular.element(document).ready(function () {
        /**
        $scope.startdate = getdate();
        $scope.enddate = getdate();
        
        var sdate = $filter('date')(new Date(getdate()), "yyyy-MM-dd"),
            edate = $filter('date')(new Date(getdate()), "yyyy-MM-dd"),
            datefilter = "&startdate=" + sdate + "&enddate=" + edate;
        */
        
        $http.get(baselocation + "/api/v1/members.php?m=" + el + "&usertype_id=1-2-3&mode=all").success(function (response) {
            if (response[0].result) {
                angular.element(".btn_export").show();
                $scope.members = response[0].data;
                setTimeout(function () {
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        //bPaginate: false,
                        //bInfo: false
                    });
                    //angular.element(".btn_export").show();
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
                    //angular.element(".btn_export").show();
                    $('#page-wrapper').show();
                    loadpage();

                }, 500);
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        /**
        $http.get(baselocation + "/api/v1/clients.php?m=" + el).success(function (response) {
            
            if (response[0].result) {

                for (var x = 0; x < response[0].data.length; x++) {
                    arr_partner_id.push(response[0].data[x].client_id);
                    arr_partner_name.push(response[0].data[x].name);
                }

                $scope.partners = arr_partner_name;

            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        */
        
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
        
        var membertypefilter = "", genderfilter = "", civilstatusfilter = "",
            gender = angular.element('input:radio[name="gender"]:checked').val(),
            civilstat = angular.element('#civilstatus').val();
        
        if(angular.element("#chkd12").prop('checked') || angular.element("#chkdl").prop('checked') || angular.element("#chkdm").prop('checked')){
            membertypefilter = "&usertype_id=";
        
            if(angular.element("#chkd12").prop('checked')){
                membertypefilter += "1-";
            }

            if(angular.element("#chkdl").prop('checked')){
                membertypefilter += "2-";
            }

            if(angular.element("#chkdm").prop('checked')){
                membertypefilter += "3-";
            }
        
            membertypefilter = membertypefilter.substring(0, membertypefilter.length-1);
        }
        
        if(gender !== "" && gender !== undefined){
            genderfilter = "&gender=" + gender;
        }
        
        if(civilstat !== "" && civilstat !== undefined){
            civilstatusfilter = "&civilstatus=" + civilstat;
        }
        
        
        $http.get(baselocation + "/api/v1/members.php?m=" + el + membertypefilter + genderfilter + civilstatusfilter + "&mode=search").success(function (response) {
            
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