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
    include "../ctrl/con.php";
    $result = array();
    $data = array();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    isset($input["firstname"]) ? $firstname = mysqli_real_escape_string($nect, $input["firstname"]) : $firstname = "";
    isset($input["lastname"]) ? $lastname = mysqli_real_escape_string($nect, $input["lastname"]) : $lastname = "";
    isset($input["middlename"]) ? $middlename = mysqli_real_escape_string($nect, $input["middlename"]) : $middlename = "";
    isset($input["email"]) ? $email = mysqli_real_escape_string($nect, $input["email"]) : $email = "";
    isset($input["date_of_birth"]) ? $date_of_birth = mysqli_real_escape_string($nect, $input["date_of_birth"]) : $date_of_birth = "";
    //isset($input["age"]) ? $age = mysqli_real_escape_string($nect, $input["age"]) : $age = "";
    isset($input["contact_no"]) ? $contact_no = mysqli_real_escape_string($nect, $input["contact_no"]) : $contact_no = "";
    isset($input["address"]) ? $address = mysqli_real_escape_string($nect, $input["address"]) : $address = "";
    isset($input["occupation"]) ? $occupation = mysqli_real_escape_string($nect, $input["occupation"]) : $occupation = "";
    isset($input["civil_status"]) ? $civil_status = mysqli_real_escape_string($nect, $input["civil_status"]) : $civil_status = "";
    isset($input["gender"]) ? $gender = mysqli_real_escape_string($nect, $input["gender"]) : $gender = "";
    isset($input["modified_by"]) ? $modified_by = mysqli_real_escape_string($nect, $input["modified_by"]) : $modified_by = "";
    isset($input["stage_id"]) ? $stage_id = mysqli_real_escape_string($nect, $input["stage_id"]) : $stage_id = 0;
    isset($input["preferred_day"]) ? $preferred_day = mysqli_real_escape_string($nect, $input["preferred_day"]) : $preferred_day = "";
    isset($input["date_registered"]) ? $date_registered = mysqli_real_escape_string($nect, $input["date_registered"]) : $date_registered = "";
    isset($input["service_attended"]) ? $service_attended_id = mysqli_real_escape_string($nect, $input["service_attended"]) : $service_attended_id = 0;
        
    $query = "INSERT INTO `profile` (firstname, lastname, middlename, email, date_of_birth, contact_no, address, occupation, civil_status, gender, modified_by, status, date_modified) VALUES ('". $firstname ."', '". $lastname ."', '". $middlename ."', '" . $email . "', NULLIF('" . $date_of_birth . "',''), '" . $contact_no . "', '" . $address . "', '" . $occupation . "', '" . $civil_status . "', '" . $gender . "', '" . $modified_by . "', 1, '".$server_time."')";

    $qresult = mysqli_query($nect, $query);

    if($qresult){
        $profile_id = mysqli_insert_id($nect);
        
        $query = "INSERT INTO `first_timers` (profile_id, date_registered, service_attended_id, preferred_day, stage_id, modified_by, date_modified) VALUES ('". $profile_id ."', NULLIF('" . $date_registered . "',''), '". $service_attended_id ."', '" . $preferred_day . "', '" . $stage_id . "', '" . $modified_by . "', '".$server_time."')";
        
        $qresult = mysqli_query($nect, $query);
        if($qresult){
            $out['result'] = true;
        } else {
            _error(mysqli_error($nect));
        }
        
    } else {
        _error(mysqli_error($nect));
    }

    array_push($result, $out);
    echo json_encode($result);

}

function _get(){
    //
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    
    $mode = $_GET['mode'];
    
    if($mode == 'single'){
        $firsttimer_id = mysqli_real_escape_string($nect, $_GET['firsttimer_id']);
        
        $getUsers_query = "SELECT a.id as firsttimer_id, b.id as profile_id, a.date_registered, a.preferred_day, a.invitation_sent, a.for_follow_up, a.placed_in_dgroup, a.stage_id, b.firstname, b.lastname, b.middlename, b.email, b.date_of_birth, b.age, b.contact_no, b.address, b.occupation, b.civil_status, b.gender, b.avatar_id, c.name as service_attended FROM `first_timers` as a INNER JOIN `profile` as b ON (a.profile_id = b.id) LEFT JOIN `lkp_services` as c ON (a.service_attended_id = c.id) WHERE a.id = '" . $firsttimer_id . "' AND a.stage_id <> 5 AND b.status = 1";
        
        $qgetUsersResult = mysqli_query($nect, $getUsers_query);
        
    } else if ($mode == 'multiple'){
        
        if(isset($_GET['firsttimer_id']) && !empty($_GET['firsttimer_id'])){
            $arr_firsttimer_id = explode('-', $_GET['firsttimer_id']);
            $firsttimerIds = implode(',', $arr_firsttimer_id);
            
            $getUsers_query = "SELECT a.id as firsttimer_id, b.id as profile_id, a.date_registered, a.preferred_day, a.invitation_sent, a.for_follow_up, a.placed_in_dgroup, a.stage_id, b.firstname, b.lastname, b.middlename, b.email, b.date_of_birth, b.age, b.contact_no, b.address, b.occupation, b.civil_status, b.gender, b.avatar_id, c.name as service_attended FROM `first_timers` as a INNER JOIN `profile` as b ON (a.profile_id = b.id) LEFT JOIN `lkp_services` as c ON (a.service_attended_id = c.id) WHERE a.id IN (" . $firsttimerIds . ") AND a.stage_id <> 5 AND b.status = 1";
            
            $qgetUsersResult = mysqli_query($nect, $getUsers_query);
        } else {
            $qgetUsersResult = false;
        }
        
    } else if ($mode == 'all'){

        if(isset($_GET['stage_id']) && !empty($_GET['stage_id'])){
            $arr_stage_id = explode('-', $_GET['stage_id']);
            $stageIds = implode(',', $arr_stage_id);
            
            $getUsers_query = "SELECT a.id as firsttimer_id, b.id as profile_id, a.date_registered, a.preferred_day, a.invitation_sent, a.for_follow_up, a.placed_in_dgroup, a.stage_id, b.firstname, b.lastname, b.middlename, b.email, b.date_of_birth, b.age, b.contact_no, b.address, b.occupation, b.civil_status, b.gender, b.avatar_id, c.name as service_attended FROM `first_timers` as a INNER JOIN `profile` as b ON (a.profile_id = b.id) LEFT JOIN `lkp_services` as c ON (a.service_attended_id = c.id) WHERE a.stage_id IN (" . $stageIds . ") AND a.stage_id <> 5 AND b.status = 1";
            
            $qgetUsersResult = mysqli_query($nect, $getUsers_query);
        } else {
            $qgetUsersResult = false;
        }
    } else if ($mode == 'search'){
        $stageFilter = "";
        $genderFilter = "";
        $civilstatusFilter = "";
        $preferreddayfilter = "";
        $dateregisteredfilter = "";
        
        if(isset($_GET['stage_id']) && !empty($_GET['stage_id'])){
            $arr_stage_id = explode('-', $_GET['stage_id']);
            $stageIds = implode(',', $arr_stage_id);
            $stageFilter = " AND a.stage_id IN (" . $stageIds . ")";
        }
        
        if(isset($_GET['gender']) && !empty($_GET['gender'])){
            $genderFilter = " AND b.gender = '" . $_GET['gender'] . "'";
        }
        
        if(isset($_GET['civilstatus']) && !empty($_GET['civilstatus'])){
            $civilstatusFilter = " AND b.civil_status = '" . $_GET['civilstatus'] . "'";
        }
        
        if(isset($_GET['preferred_day']) && !empty($_GET['preferred_day'])){
            $preferreddayfilter = " AND a.preferred_day = '" . $_GET['preferred_day'] . "'";
        }
        
        if((isset($_GET['startdateregistered']) && !empty($_GET['startdateregistered'])) && (isset($_GET['enddateregistered']) && !empty($_GET['enddateregistered']))){
            $dateregisteredfilter = " AND a.date_registered BETWEEN '".$_GET['startdateregistered']."' AND '".$_GET['enddateregistered']."'";
        }
        
        $getUsers_query = "SELECT a.id as firsttimer_id, b.id as profile_id, a.date_registered, a.preferred_day, a.invitation_sent, a.for_follow_up, a.placed_in_dgroup, a.stage_id, b.firstname, b.lastname, b.middlename, b.email, b.date_of_birth, b.age, b.contact_no, b.address, b.occupation, b.civil_status, b.gender, b.avatar_id, c.name as service_attended FROM `first_timers` as a INNER JOIN `profile` as b ON (a.profile_id = b.id) LEFT JOIN `lkp_services` as c ON (a.service_attended_id = c.id) WHERE b.status = 1" . $stageFilter . $genderFilter . $civilstatusFilter . $preferreddayfilter . $dateregisteredfilter;
        
        $qgetUsersResult = mysqli_query($nect, $getUsers_query);

    }
    
    if($qgetUsersResult){
        if(mysqli_num_rows($qgetUsersResult)!=0){
            while($fetchUsersResult = mysqli_fetch_array($qgetUsersResult)){
                $row_array['firsttimer_id'] = trim(stripslashes($fetchUsersResult['firsttimer_id']));
                $row_array['profile_id'] = trim(stripslashes($fetchUsersResult['profile_id']));
                $row_array['firstname'] = trim(stripslashes($fetchUsersResult['firstname']));
                $row_array['lastname'] = trim(stripslashes($fetchUsersResult['lastname']));
                $row_array['middlename'] = trim(stripslashes($fetchUsersResult['middlename']));
                $row_array['email'] = trim(stripslashes($fetchUsersResult['email']));
                $row_array['date_of_birth'] = trim(stripslashes($fetchUsersResult['date_of_birth']));
                $row_array['age'] = trim(stripslashes($fetchUsersResult['age']));
                $row_array['contact_no'] = trim(stripslashes($fetchUsersResult['contact_no']));
                $row_array['address'] = trim(stripslashes($fetchUsersResult['address']));
                $row_array['occupation'] = trim(stripslashes($fetchUsersResult['occupation']));
                $row_array['civil_status'] = trim(stripslashes($fetchUsersResult['civil_status']));
                $row_array['gender'] = trim(stripslashes($fetchUsersResult['gender']));
                $row_array['date_registered'] = trim(stripslashes($fetchUsersResult['date_registered']));
                $row_array['service_attended'] = trim(stripslashes($fetchUsersResult['service_attended']));
                $row_array['preferred_day'] = trim(stripslashes($fetchUsersResult['preferred_day']));
                $row_array['avatar_id'] = trim(stripslashes($fetchUsersResult['avatar_id']));
                $row_array['stage_id'] = trim(stripslashes($fetchUsersResult['stage_id']));
                
                if($fetchUsersResult['stage_id'] == 1){
                    $row_array['stage_name'] = 'Pending';
                } else if($fetchUsersResult['stage_id'] == 2){
                    $row_array['stage_name'] = 'Invitation Sent';
                } else if($fetchUsersResult['stage_id'] == 3){
                    $row_array['stage_name'] = 'For Follow-up';
                } else if($fetchUsersResult['stage_id'] == 4){
                    $row_array['stage_name'] = 'Placed in DGroup';
                }
                
                array_push($data, $row_array);
            }

            $out['result'] = true;
            $out['data'] = $data;
            $out['query'] = $getUsers_query;

        } else {
            $out['result'] = false;
        }

    } else {
            _error(mysqli_error($nect));
        }

    array_push($result, $out);
    echo json_encode($result);
}


function _put(){
    include "../ctrl/con.php";
    $result = array();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $mode = $_GET['mode'];
    
    if($mode == "single"){
        /**
        $getset = "";
        if(isset($input["firstname"])){
            $getset .= "firstname = '" . mysqli_real_escape_string($nect, $input["firstname"]) . "', ";
        } 

        if(isset($input["lastname"])){
            $getset .= "lastname = '" . mysqli_real_escape_string($nect, $input["lastname"]) . "', ";    
        }

        $profile_id = mysqli_real_escape_string($nect, $_GET['profile_id']);
        $modified_by = mysqli_real_escape_string($nect, $_GET['user_id']);

        $query = "UPDATE `profile` SET " . $getset . " modified_by = '" . $modified_by . "', date_modified = '".$server_time."' WHERE id = " . $profile_id;
        $qresult = mysqli_query($nect, $query);
        if($qresult){
            $out['result'] = true;
        } else {
            _error(mysqli_error($nect));
        }
        */

    } else if ($mode=="multiple"){

        foreach($input as $val){
            $getset = "";
            $profile_id = mysqli_real_escape_string($nect, $val['profile_id']);
            $firsttimer_id = mysqli_real_escape_string($nect, $val['firsttimer_id']);
            $modified_by = mysqli_real_escape_string($nect, $_GET['user_id']);
            
            if(isset($val["firstname"])){
                $getset .= "firstname = '" . mysqli_real_escape_string($nect, $val["firstname"]) . "', ";
            } 
            if(isset($val["lastname"])){
                $getset .= "lastname = '" . mysqli_real_escape_string($nect, $val["lastname"]) . "', ";    
            }
            if(isset($val["middlename"])){
                $getset .= "middlename = '" . mysqli_real_escape_string($nect, $val["middlename"]) . "', ";
            }

            if(isset($val["gender"])){
                $getset .= "gender = '" . mysqli_real_escape_string($nect, $val["gender"]) . "', ";
            }
            if(isset($val["civilstatus"])){
                $getset .= "civil_status = '" . mysqli_real_escape_string($nect, $val["civilstatus"]) . "', ";
            }
            if(isset($val["occupation"])){
                $getset .= "occupation = '" . mysqli_real_escape_string($nect, $val["occupation"]) . "', ";
            }
            if(isset($val["contactnumber"])){
                $getset .= "contact_no = '" . mysqli_real_escape_string($nect, $val["contactnumber"]) . "', ";
            }
            if(isset($val["email"])){
                $getset .= "email = '" . mysqli_real_escape_string($nect, $val["email"]) . "', ";
            }
            if(isset($val["address"])){
                $getset .= "address = '" . mysqli_real_escape_string($nect, $val["address"]) . "', ";
            }
            
            if(isset($val["date_of_birth"])){
                $getset .= "date_of_birth = NULLIF('" . mysqli_real_escape_string($nect, $date_of_birth) . "',''), ";
            }
            
            $query = "UPDATE `profile` SET " . $getset . " modified_by = '" . $modified_by . "', date_modified = '".$server_time."' WHERE id = " . $profile_id;
            $qresult = mysqli_query($nect, $query);
            
            if($qresult){
                $getset = "";
                
                if(isset($val["service_attended"])){
                    $service_attended =  $val["service_attended"];
                    
                    if($service_attended == ""){
                        $service_attended = 0;
                    }
                    
                    $getset .= "service_attended_id = '" . mysqli_real_escape_string($nect, $service_attended) . "', ";
                    
                }
                
                if(isset($val["preferred_day"])){
                    $getset .= "preferred_day = '" . mysqli_real_escape_string($nect, $val["preferred_day"]) . "', ";
                }
                
                if(isset($val["date_registered"])){
                    $getset .= "date_registered = NULLIF('" . mysqli_real_escape_string($nect, $date_registered) . "',''), ";
                }
                
                if(isset($val["stage_id"])){
                    $getset .= "stage_id = '" . mysqli_real_escape_string($nect, $val["stage_id"]) . "', ";
                    
                    if($val["stage_id"] == 2){
                        $getset .= "invitation_sent = 1, ";
                    } else if($val["stage_id"] == 3){
                        $getset .= "for_follow_up = 1, ";
                    } else if($val["stage_id"] == 4){
                        $getset .= "placed_in_dgroup = 1, ";
                        
                        if(isset($val["dgleader_id"]) && $val["dgleader_id"] != ""){
                            $dgleader_id = mysqli_real_escape_string($nect, $val["dgleader_id"]);
                        } else {
                            $dgleader_id = 0;
                        }
                        
                        if(isset($val["date_joined"]) && $val["date_joined"] != ""){
                            $date_joined = mysqli_real_escape_string($nect, $val["date_joined"]);
                        } else {
                            $date_joined = 'NULL';
                        }
                        
                        $placeInDgroup = "INSERT INTO `members` (profile_id, leader_id, category_id, date_joined, modified_by, date_modified) VALUES ('". $profile_id ."', '". $dgleader_id ."', 3, NULLIF('" . $date_joined . "',''), '". $modified_by ."', '".$server_time."')";
                            
                        if(!mysqli_query($nect, $placeInDgroup)){
                            _error(mysqli_error($nect));
                        }
                    }
                }
                   
                $query = "UPDATE `first_timers` SET " . $getset . " modified_by = '" . $modified_by . "', date_modified = '".$server_time."' WHERE id = " . $firsttimer_id;
                $qresult = mysqli_query($nect, $query);
                
                if($qresult){
                    $out['result'] = true;
                    $out['query'] = $query;
                } else {
                    _error(mysqli_error($nect));
                }
                
                
            } else {
                _error(mysqli_error($nect));
            }
        }
    }
    
    array_push($result, $out);
    echo json_encode($result);

}

function _delete(){
    include "../ctrl/con.php";
    $result = array();
    $bit = true;
    
    $modified_by = $_GET['user_id'];
    $arr_firsttimer_id = explode('-', $_GET['firsttimer_id']);
    $whereIn = implode(',', $arr_firsttimer_id);
    
    $getProfilesStmt = "SELECT profile_id FROM `first_timers` WHERE id IN (".$whereIn.")";
    
    $getProfiles = mysqli_query($nect, $getProfilesStmt);
    
    if($getProfiles && mysqli_num_rows($getProfiles) != 0){
        while($fetchProfiles = mysqli_fetch_array($getProfiles)){
            $profile_id = $fetchProfiles["profile_id"];
            $query = "UPDATE `profile` SET status = '0', modified_by = '". $modified_by ."', date_modified = '".$server_time."' WHERE id = '". $profile_id ."'";
            $qresult = mysqli_query($nect, $query);

            if($qresult){
                $bit = true;
            } else {
                _error(mysqli_error($nect));
            }
        }
    }
    
    if($bit){
        $out['result'] = true;
    }
    
    array_push($result, $out);
    echo json_encode($result);
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