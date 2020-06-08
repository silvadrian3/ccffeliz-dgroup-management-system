<?php 

if(isset($_GET['m']) && !empty($_GET['m'])){
    $k = '0100101001100101011100110111010101110011';
    $cof = md5($k);
    $fee = $_GET['m'];

    if($cof == $fee) {
        $method = $_SERVER['REQUEST_METHOD'];
        switch ($method) {
            case 'PUT': _put(); break;
            case 'POST': _post(); break;
            case 'GET': _get(); break;
            case 'DELETE': _delete(); break;
            default: _error('default'); break;
        }
    }
}


function _post(){

}

function _get(){
    
    include "../ctrl/con.php";
    
    $result = array();
    $graph = array();
    
    $pending_invitations = array();
    $data = array();
    $current_year = $_GET['year'];
    
    $d12leaders = 0;
    $dgroupleaders = 0;
    $dgroupmembers = 0;
    $ft_signedup = 0;
    $ft_pending = 0;
    $ft_invited = 0;
    $ft_followup = 0;
    $ft_placed = 0;
    
    $bit = true;
            
    for($x = 1; $x <= 12; $x++){
        
        $qGraph = "SELECT (SELECT COUNT(*) FROM `first_timers` as a INNER JOIN `profile` as b ON (a.profile_id = b.id) WHERE MONTH(a.date_registered) = '".$x."' AND b.status = 1 AND YEAR(a.date_registered) = '".$current_year."') as signed_up, (SELECT COUNT(*) FROM `first_timers` as a INNER JOIN `profile` as b ON (a.profile_id = b.id) WHERE a.placed_in_dgroup = 1 AND MONTH(a.date_registered) = '".$x."' AND b.status = 1 AND YEAR(a.date_registered) = '".$current_year."') as placed_id_dgroup";

        $qresult = mysqli_query($nect, $qGraph);

        if($qresult){
            if(mysqli_num_rows($qresult) != 0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    //$graph_array['month'] = $x;
                    $graph_array['signed_up'] = $fetchResult['signed_up'];
                    $graph_array['placed_id_dgroup'] = $fetchResult['placed_id_dgroup'];
                    array_push($graph, $graph_array);
                }
            }

            $result_arr['graph'] = $graph;

        } else {
            $bit = false;
            _error(mysqli_error($nect));
        }
    }
    
    


    $qCntEachLeader = "SELECT b.id as category_id, count(*) as cnt FROM `members` as a INNER JOIN `lkp_category` as b ON (a.category_id = b.id) INNER JOIN `profile` as c ON (a.profile_id = c.id) WHERE c.status = 1 GROUP BY a.category_id";

    $exeqCntEachLeader = mysqli_query($nect, $qCntEachLeader);

    if($exeqCntEachLeader){
        if(mysqli_num_rows($exeqCntEachLeader) != 0){
            while($fetchCntEachLeader = mysqli_fetch_array($exeqCntEachLeader)){

                $category_id = $fetchCntEachLeader["category_id"];

                if($category_id == 1){
                    $d12leaders = $fetchCntEachLeader["cnt"];
                } else if($category_id == 2){
                    $dgroupleaders = $fetchCntEachLeader["cnt"];
                } else if($category_id == 3){
                    $dgroupmembers = $fetchCntEachLeader["cnt"];
                }
            }
        }

    } else {
        $bit = false;
        _error(mysqli_error($nect));
    }
    
    $qCntFirstTimerStatus = "SELECT count(*) as cnt, a.stage_id FROM `first_timers` as a INNER JOIN `profile` as b ON (a.profile_id = b.id) WHERE b.status = 1 GROUP BY a.stage_id";

    $exeqCntFirstTimerStatus = mysqli_query($nect, $qCntFirstTimerStatus);

    if($exeqCntFirstTimerStatus){
        
        if(mysqli_num_rows($exeqCntFirstTimerStatus) != 0){
            
            while($fetchCntFirstTimerStatus = mysqli_fetch_array($exeqCntFirstTimerStatus)){
    
                $stage_id = $fetchCntFirstTimerStatus["stage_id"];

                if($stage_id == 1){
                    $ft_pending = $fetchCntFirstTimerStatus["cnt"];
                } else if($stage_id == 2){
                    $ft_invited = $fetchCntFirstTimerStatus["cnt"];
                } else if($stage_id == 3){
                    $ft_followup = $fetchCntFirstTimerStatus["cnt"];
                } else if($stage_id == 4){
                    $ft_placed = $fetchCntFirstTimerStatus["cnt"];
                }
            }
            
            $ft_signedup = $ft_pending + $ft_invited + $ft_followup + $ft_placed;
        }

    } else {
        $bit = false;
        _error(mysqli_error($nect));
    }


    $result_arr['summary'] = array("d12leaders" => $d12leaders, "dgroupleaders" => $dgroupleaders, "dgroupmembers" => $dgroupmembers, "ft_signedup" => $ft_signedup, "ft_pending" => $ft_pending, "ft_invited" => $ft_invited, "ft_followup" => $ft_followup, "ft_placed" => $ft_placed);

    
    $qPending = "SELECT a.id as profile_id, a.firstname, a.lastname, b.date_registered, a.gender, a.civil_status, a.date_of_birth, a.contact_no, b.preferred_day FROM `first_timers` as b INNER JOIN `profile` as a ON (a.id = b.profile_id) WHERE b.stage_id = 1 AND a.status = 1";

    $qresult = mysqli_query($nect, $qPending);

    if($qresult){
        if(mysqli_num_rows($qresult)!=0){
            while($fetchResult = mysqli_fetch_array($qresult)){
                $_arr['profile_id'] = trim(stripslashes($fetchResult['profile_id']));
                $_arr['firstname'] = trim(stripslashes($fetchResult['firstname']));
                $_arr['lastname']= trim(stripslashes($fetchResult['lastname']));
                $_arr['date_registered'] = $fetchResult['date_registered'];
                $_arr['gender'] = trim(stripslashes($fetchResult['gender']));
                $_arr['civil_status'] = trim(stripslashes($fetchResult['civil_status']));
                $_arr['date_of_birth'] = trim(stripslashes($fetchResult['date_of_birth']));
                $_arr['contact_no'] = trim(stripslashes($fetchResult['contact_no']));
                $_arr['preferred_day'] = trim(stripslashes($fetchResult['preferred_day']));
                array_push($pending_invitations, $_arr);
            }
            $result_arr['pending_invitations'] = $pending_invitations;
        }

    } else {
        $bit = false;
        _error(mysqli_error($nect));
    }

    if($bit){
        array_push($data, $result_arr);
        $out['data'] = $data;
        $out['result'] = true;
    } else {
        $out['result'] = false;
    }
    
    array_push($result, $out);
    echo json_encode($result);
}

function _put(){

}

function _delete(){
    
}

function _error($m){
    $result = array();
    $out['result'] = false;
    $out['error'] = $m;
    
    array_push($result, $out);
    echo json_encode($result);
    die();
}


?>