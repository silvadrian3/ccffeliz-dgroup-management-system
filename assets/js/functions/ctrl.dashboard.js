app.config(['ChartJsProvider', function (ChartJsProvider) {
    "use strict";
    ChartJsProvider.setOptions({
        chartColors: [
            'rgba(220,220,220,1)',
            'rgba(151,187,205,1)',
            'rgba(148,159,177,1)',
            'rgba(247,70,74,1)',
            'rgba(70,191,189,1)',
            'rgba(253,180,92,1)'
        ]
    });
    
    
}]);


app.controller('dashboardCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter',  function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    $scope.today = new Date();
    prepage();


    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-dashboard').addClass('active');
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ut = $cookieStore.get('user_type');
    
    $scope.yearly_report = function() {
    	var arr_invoice_date = [],
            arr_total_sales = [],
            date = new Date(),
            first = (date.getDate()) - date.getDay(),
            last = first + 6,
            sdate = $filter('date')(new Date(date.setDate(first)), "yyyy-MM-dd"),
            edate = $filter('date')(new Date(date.setDate(last)), "yyyy-MM-dd"),
            current_year = $scope.current_year,
            datefilter = "&startdate=" + sdate + "&enddate=" + edate;
$('#tbl_records').dataTable().fnDestroy();
            $http.get(baselocation + "/api/v1/dashboard.php?m=" + el + "&year=" + current_year).success(function (response) {
                
                
                
                $scope.d12leaders = response[0].data[0].summary.d12leaders;
                $scope.dgroupleaders = response[0].data[0].summary.dgroupleaders;
                $scope.dgroupmembers = response[0].data[0].summary.dgroupmembers;
                
                $scope.ft_signedup = response[0].data[0].summary.ft_signedup;
                $scope.ft_pending = response[0].data[0].summary.ft_pending;
                $scope.ft_invited = response[0].data[0].summary.ft_invited;
                $scope.ft_followup = response[0].data[0].summary.ft_followup;
                $scope.ft_placed = response[0].data[0].summary.ft_placed;
                
                $scope.pending_invitations = response[0].data[0].pending_invitations;

//console.log(getAge('2015-04-23'));

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


                $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                $scope.series = ['Signed Up', 'Placed in DGroup'];
                
                var arr_graph = [],
                    arr_signed_up = [],
                    arr_placed = [],
                    x;
                for(x = 0; x < response[0].data[0].graph.length; x++){
                    
                    arr_signed_up.push(response[0].data[0].graph[x].signed_up);
                    arr_placed.push(response[0].data[0].graph[x].placed_id_dgroup);
                }
                
                arr_graph.push(arr_signed_up);
                arr_graph.push(arr_placed);
                
                $scope.data = arr_graph;
                
            }).error(function (msg) {
                $scope.onError(msg);
            });
            
        
        setTimeout(function () {
            $('#tbl_records').dataTable({
                "lengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
                "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [-1]}],
                //aaSorting: [[0, 'desc']]
            });
            
            $('#page-wrapper').show();
            loadpage();
            
        }, 500);
    }
    
    angular.element(document).ready(function () {
        
        $scope.current_year = new Date().getFullYear().toString();
        $scope.year = ['2017', '2018'];
        $scope.yearly_report();
    });
    
    
    
    $scope.redirect = function (page) {
        window.location = page;
    };
    
    $scope.single_action = function (cat, id) {
        if (cat === 'r') { //read
            window.location = "#/members/view/" + id;
        }
    };
    
    
    
    
}]);