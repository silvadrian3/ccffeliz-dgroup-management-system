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

    if($_GET['action'] == "delete"){
        $grouptype_id = $input["gtype_id"];
        
        foreach($grouptype_id as $gtype_id){
            $modified_by = $_GET['user_id'];
            $query = "UPDATE `lkp_group_type` SET modified_by = '".$modified_by."', date_modified = '". $server_time ."', status = 0 WHERE id = '".$gtype_id."'";
            $qresult = mysqli_query($nect, $query);
            
            if(!$qresult){
                _error(mysqli_error($nect));
            } else {
                $out['result'] = true;
            }
        }
    }
    
    array_push($result, $out);
    echo json_encode($result);
}

function _get(){
    //
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    
    if(isset($_GET['group_type_id']) && !empty($_GET['group_type_id'])){
        $group_type_id = mysqli_real_escape_string($nect, $_GET['group_type_id']);
        $query = "SELECT id, name FROM `lkp_group_type` WHERE id = '" . $group_type_id . "' AND status = 1";
    } else {
        $query = "SELECT id, name FROM `lkp_group_type` WHERE status = 1";
    }
    
    $qresult = mysqli_query($nect, $query);

    if($qresult){
        if(mysqli_num_rows($qresult)!=0){
            while($fetchResult = mysqli_fetch_array($qresult)){
                $row_array['group_type_id'] = trim(stripslashes($fetchResult['id']));
                $row_array['group_type_name'] = trim(stripslashes($fetchResult['name']));
                array_push($data, $row_array);
            }
            $out['result'] = true;
            $out['data'] = $data;
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
    
    foreach($input as $each){
        $id = mysqli_real_escape_string($nect, $each["id"]);
        $name = mysqli_real_escape_string($nect, $each["name"]);
        $modified_by = mysqli_real_escape_string($nect, $each["user_id"]);
        
        if($id != ""){ // update
            $query = "UPDATE `lkp_group_type` SET name = '".$name."', modified_by = '".$modified_by."', date_modified = '". $server_time ."' WHERE id = '".$id."'";
            $qresult = mysqli_query($nect, $query);
        } else { // insert
            $query = "INSERT INTO `lkp_group_type` (name, modified_by, status, date_modified) VALUES ('".$name."', '".$modified_by."', 1, '". $server_time ."')";
            $qresult = mysqli_query($nect, $query);
        }
    }
    
    if($qresult){
        $out['result'] = true;
    } else {
        _error(mysqli_error($nect));
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