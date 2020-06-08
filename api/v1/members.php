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
    isset($input["date_of_birth"]) ? $date_of_birth = mysqli_real_escape_string($nect, $input["date_of_birth"]) : $date_of_birth = '';
    isset($input["contact_no"]) ? $contact_no = mysqli_real_escape_string($nect, $input["contact_no"]) : $contact_no = "";
    isset($input["address"]) ? $address = mysqli_real_escape_string($nect, $input["address"]) : $address = "";
    isset($input["occupation"]) ? $occupation = mysqli_real_escape_string($nect, $input["occupation"]) : $occupation = "";
    isset($input["civil_status"]) ? $civil_status = mysqli_real_escape_string($nect, $input["civil_status"]) : $civil_status = "";
    isset($input["gender"]) ? $gender = mysqli_real_escape_string($nect, $input["gender"]) : $gender = "";
    isset($input["modified_by"]) ? $modified_by = mysqli_real_escape_string($nect, $input["modified_by"]) : $modified_by = "";
    isset($input["category_id"]) ? $category_id = mysqli_real_escape_string($nect, $input["category_id"]) : $category_id = 0;
    isset($input["leader_id"]) ? $leader_id = mysqli_real_escape_string($nect, $input["leader_id"]) : $leader_id = 0;
    isset($input["handled_group"]) ? $handled_group_id = mysqli_real_escape_string($nect, $input["handled_group"]) : $handled_group_id = 0;
    isset($input["glc_level_id"]) ? $glc_level_id = mysqli_real_escape_string($nect, $input["glc_level_id"]) : $glc_level_id = 0;
    isset($input["date_joined"]) ? $date_joined = mysqli_real_escape_string($nect, $input["date_joined"]) : $date_joined = '';
    
    $query = "INSERT INTO `profile` (firstname, lastname, middlename, email, date_of_birth, contact_no, address, occupation, civil_status, gender, modified_by, status, date_modified) VALUES ('". $firstname ."', '". $lastname ."', '". $middlename ."', '" . $email . "', NULLIF('" . $date_of_birth . "', ''), '" . $contact_no . "', '" . $address . "', '" . $occupation . "', '" . $civil_status . "', '" . $gender . "', '" . $modified_by . "', 1, '".$server_time."')";

    $qresult = mysqli_query($nect, $query);

    if($qresult){
        $profile_id = mysqli_insert_id($nect);
        
        $query = "INSERT INTO `members` (profile_id, leader_id, category_id, date_joined, glc_level_id, grouptype_id, modified_by, date_modified) VALUES ('". $profile_id ."', '". $leader_id ."', '". $category_id ."', NULLIF('" . $date_joined . "',''), '" . $glc_level_id . "', '" . $handled_group_id . "', '" . $modified_by . "', '". $server_time ."')";
        
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
        if(isset($_GET['member_id'])){
            $member_id = mysqli_real_escape_string($nect, $_GET['member_id']);
        
            $getUsers_query = "SELECT a.id as profile_id, b.id as member_id, a.firstname, a.lastname, a.middlename, a.email, a.date_of_birth, a.age, a.contact_no, a.address, a.occupation, a.civil_status, a.gender, a.avatar_id, b.leader_id, b.category_id, b.date_joined, b.grouptype_id, b.glc_level_id, b.potential_leader, c.name as category_name, d.name as group_type,  e.name as glc_level FROM `profile` as a INNER JOIN `members` as b ON (a.id=b.profile_id) INNER JOIN `lkp_category` as c ON (b.category_id = c.id) LEFT JOIN `lkp_group_type` as d ON (b.grouptype_id = d.id) LEFT JOIN `lkp_glc_levels` as e ON (b.glc_level_id = e.id) WHERE b.id = '" . $member_id . "' AND a.status = 1";
        }

        $qgetUsersResult = mysqli_query($nect, $getUsers_query);
        
    } else if ($mode == 'multiple'){
        if(isset($_GET['member_id']) && !empty($_GET['member_id'])){
            $arr_member_id = explode('-', $_GET['member_id']);
            $memberIds = implode(',', $arr_member_id);
            
            $getUsers_query = "SELECT a.id as profile_id, b.id as member_id, a.firstname, a.lastname, a.middlename, a.email, a.date_of_birth, a.age, a.contact_no, a.address, a.occupation, a.civil_status, a.gender, a.avatar_id, b.leader_id, b.category_id, b.date_joined, b.grouptype_id, b.glc_level_id, b.potential_leader, c.name as category_name, d.name as group_type,  e.name as glc_level FROM `profile` as a INNER JOIN `members` as b ON (a.id=b.profile_id) INNER JOIN `lkp_category` as c ON (b.category_id = c.id) LEFT JOIN `lkp_group_type` as d ON (b.grouptype_id = d.id) LEFT JOIN `lkp_glc_levels` as e ON (b.glc_level_id = e.id) WHERE b.id IN (" . $memberIds . ") AND a.status = 1";
            
            $qgetUsersResult = mysqli_query($nect, $getUsers_query);
        } else {
            $qgetUsersResult = false;
        }
        
    } else if ($mode == 'all'){

        if(isset($_GET['usertype_id']) && !empty($_GET['usertype_id'])){
            $arr_type_id = explode('-', $_GET['usertype_id']);
            $typeIds = implode(',', $arr_type_id);
            
            $getUsers_query = "SELECT a.id as profile_id, b.id as member_id, a.firstname, a.lastname, a.middlename, a.email, a.date_of_birth, a.age, a.contact_no, a.address, a.occupation, a.civil_status, a.gender, a.avatar_id, b.leader_id, b.category_id, b.date_joined, b.grouptype_id, b.glc_level_id, b.potential_leader, c.name as category_name, d.name as group_type,  e.name as glc_level FROM `profile` as a INNER JOIN `members` as b ON (a.id=b.profile_id) INNER JOIN `lkp_category` as c ON (b.category_id = c.id) LEFT JOIN `lkp_group_type` as d ON (b.grouptype_id = d.id) LEFT JOIN `lkp_glc_levels` as e ON (b.glc_level_id = e.id) WHERE c.id IN (" . $typeIds . ") AND a.status = 1";
            
            $qgetUsersResult = mysqli_query($nect, $getUsers_query);
        } else {
            $qgetUsersResult = false;
        }
    } else if ($mode == 'search'){
        $typeFilter = "";
        $genderFilter = "";
        $civilstatusFilter = "";
        
        if(isset($_GET['usertype_id']) && !empty($_GET['usertype_id'])){
            $arr_type_id = explode('-', $_GET['usertype_id']);
            $typeIds = implode(',', $arr_type_id);
            
            $typeFilter = " AND c.id IN (" . $typeIds . ")";
        }
        
        if(isset($_GET['gender']) && !empty($_GET['gender'])){
            $genderFilter = " AND a.gender = '" . $_GET['gender'] . "'";
        }
        
        if(isset($_GET['civilstatus']) && !empty($_GET['civilstatus'])){
            $civilstatusFilter = " AND a.civil_status = '" . $_GET['civilstatus'] . "'";
        }
        
        $getUsers_query = "SELECT a.id as profile_id, b.id as member_id, a.firstname, a.lastname, a.middlename, a.email, a.date_of_birth, a.age, a.contact_no, a.address, a.occupation, a.civil_status, a.gender, a.avatar_id, b.leader_id, b.category_id, b.date_joined, b.grouptype_id, b.glc_level_id, b.potential_leader, c.name as category_name, d.name as group_type, e.name as glc_level FROM `profile` as a INNER JOIN `members` as b ON (a.id=b.profile_id) INNER JOIN `lkp_category` as c ON (b.category_id = c.id) LEFT JOIN `lkp_group_type` as d ON (b.grouptype_id = d.id) LEFT JOIN `lkp_glc_levels` as e ON (b.glc_level_id = e.id) WHERE a.status = 1 " . $typeFilter . $genderFilter . $civilstatusFilter;
            
        
        $qgetUsersResult = mysqli_query($nect, $getUsers_query);

    }
    
    if($qgetUsersResult){
        if(mysqli_num_rows($qgetUsersResult)!=0){
            while($fetchUsersResult = mysqli_fetch_array($qgetUsersResult)){

                $row_array['profile_id'] = trim(stripslashes($fetchUsersResult['profile_id']));
                $row_array['member_id'] = trim(stripslashes($fetchUsersResult['member_id']));
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
                $row_array['date_joined'] = trim(stripslashes($fetchUsersResult['date_joined']));
                $row_array['avatar_id'] = trim(stripslashes($fetchUsersResult['avatar_id']));
                $row_array['leader_id'] = trim(stripslashes($fetchUsersResult['leader_id']));
                $row_array['category_name'] = trim(stripslashes($fetchUsersResult['category_name']));
                $row_array['category_id'] = trim(stripslashes($fetchUsersResult['category_id']));
                $row_array['grouptype_id'] = trim(stripslashes($fetchUsersResult['grouptype_id']));
                $row_array['group_type'] = trim(stripslashes($fetchUsersResult['group_type']));
                $row_array['glc_level_id'] = trim(stripslashes($fetchUsersResult['glc_level_id']));
                $row_array['glc_level'] = trim(stripslashes($fetchUsersResult['glc_level']));
                $row_array['potential_leader'] = trim(stripslashes($fetchUsersResult['potential_leader']));
                
                $getLeader_query = "SELECT a.firstname, a.lastname FROM `profile` as a INNER JOIN `members` as b ON (a.id=b.profile_id) WHERE b.id = '" . $fetchUsersResult['leader_id'] . "'";
                $qgetLeadersResult = mysqli_query($nect, $getLeader_query);

                if($qgetLeadersResult){
                    if(mysqli_num_rows($qgetLeadersResult)!=0){
                        $fetchLeadersResult = mysqli_fetch_array($qgetLeadersResult);
                        $row_array['leader_firstname'] = trim(stripslashes($fetchLeadersResult['firstname']));
                        $row_array['leader_lastname'] = trim(stripslashes($fetchLeadersResult['lastname']));
                    } else {
                        $row_array['leader_firstname'] = "";
                        $row_array['leader_lastname'] = "";
                    }
                } else {
                    _error(mysqli_error($nect));
                }

                array_push($data, $row_array);
            }

            $out['result'] = true;
            $out['data'] = $data;
            $out['query'] = $getLeader_query;

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

        
        $member_id = mysqli_real_escape_string($nect, $_GET['member_id']);
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
            $member_id = mysqli_real_escape_string($nect, $val['member_id']);
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
                
                if(isset($val["category_id"])){
                    
                    $category_id = $val["category_id"];
                    $grouptype_id = $val["grouptype_id"];
                        
                    if($category_id == ""){
                        $category_id = 0;
                        $grouptype_id = 0;
                    }
                    
                    if($grouptype_id == ""){
                        $grouptype_id = 0;
                    }

                    $getset .= "category_id = '" . mysqli_real_escape_string($nect, $category_id) . "', ";
                    $getset .= "grouptype_id = '" . mysqli_real_escape_string($nect, $grouptype_id) . "', ";
                }
                
                if(isset($val["dgleader_id"])){
                    
                    $dgleader_id = $val["dgleader_id"];
                    
                    if($dgleader_id == ""){
                        $dgleader_id = 0;
                    }
                    $getset .= "leader_id = '" . mysqli_real_escape_string($nect, $dgleader_id) . "', ";
                }
                
                if(isset($val["date_joined"])){    
                    $getset .= "date_joined = NULLIF('" . mysqli_real_escape_string($nect, $date_joined) . "',''), ";
                }
                
                if(isset($val["glc_level_id"])){
                    
                    $glc_level_id = $val["glc_level_id"];
                    
                    if($glc_level_id == ""){
                        $glc_level_id = 0;
                    }
                    $getset .= "glc_level_id = '" . mysqli_real_escape_string($nect, $glc_level_id) . "', ";
                }
                
                if(isset($val["potential_leader"])){
                    
                    $potential_leader = $val["potential_leader"];
                    
                    if($potential_leader == ""){
                        $potential_leader = 0;
                    }
                    
                    $getset .= "potential_leader = '" . mysqli_real_escape_string($nect, $potential_leader) . "', ";
                }
                
                $query = "UPDATE `members` SET " . $getset . " modified_by = '" . $modified_by . "', date_modified = '".$server_time."' WHERE id = " . $member_id;
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
    $arr_member_id = explode('-', $_GET['member_id']);
    $whereIn = implode(',', $arr_member_id);
    
    $getProfilesStmt = "SELECT profile_id FROM `members` WHERE id IN (".$whereIn.")";
    
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