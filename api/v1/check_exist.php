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
    $input = json_decode(file_get_contents('php://input'), true);
    $data = array();
    
    isset($input["module"]) ? $module = mysqli_real_escape_string($nect, $input["module"]) : $module = "";
    isset($input["variable"]) ? $variable = mysqli_real_escape_string($nect, $input["variable"]) : $variable = "";
    //isset($input["partner_id"]) ? $partner_id = mysqli_real_escape_string($nect, $input["partner_id"]) : $partner_id = "";
    
    if($module == 'product') {
        /**
        $query = "SELECT a.id FROM `products` as a INNER JOIN `client_products` as b ON (a.id=b.product_id) WHERE LOWER(name) = LOWER('". $variable ."') AND b.partner_id = '".$partner_id."' AND partner_id = 1";
        
        $qresult = mysqli_query($nect, $query);
        
        $row_array['row'] = mysqli_num_rows($qresult);
        array_push($data, $row_array);
        */
            
    } else if($module == 'member') {
        
        isset($input["firstname"]) ? $firstname = mysqli_real_escape_string($nect, $input["firstname"]) : $firstname = "";
        isset($input["lastname"]) ? $lastname = mysqli_real_escape_string($nect, $input["lastname"]) : $lastname = "";
        
        $query = "SELECT b.id as member_id FROM `profile` as a INNER JOIN `members` as b ON (a.id=b.profile_id) WHERE LOWER(firstname) = LOWER('" . $firstname . "') AND LOWER(lastname) = LOWER('" . $lastname . "') AND a.status = 1";
        
        $qresult = mysqli_query($nect, $query);
        
        $row_array['row'] = mysqli_num_rows($qresult);
        array_push($data, $row_array);
            
    } else if($module == 'firsttimer') {
        
        isset($input["firstname"]) ? $firstname = mysqli_real_escape_string($nect, $input["firstname"]) : $firstname = "";
        isset($input["lastname"]) ? $lastname = mysqli_real_escape_string($nect, $input["lastname"]) : $lastname = "";
        
        $query = "SELECT a.firstname, a.lastname, b.id as member_id FROM `profile` as a INNER JOIN `first_timers` as b ON (a.id=b.profile_id) WHERE LOWER(firstname) = LOWER('". $firstname ."') AND LOWER(lastname) = LOWER('" . $lastname . "') AND a.status = 1";
        
        $qresult = mysqli_query($nect, $query);
        
        $row_array['row'] = mysqli_num_rows($qresult);
        array_push($data, $row_array);
            
    } else if($module == 'user') {
        $query = "SELECT id FROM `users` WHERE LOWER(email) = LOWER('". $variable ."') AND status = 1";
        
        $qresult = mysqli_query($nect, $query);
        
        if(mysqli_num_rows($qresult) != 0){
            $fetch_id = mysqli_fetch_array($qresult);
            $row_array['id'] = $fetch_id['id'];
        } else {
            $row_array['id'] = '';
        }
        
        array_push($data, $row_array);
    }

    if($qresult){
        $out['result'] = true;        
        $out['data'] = $data;
        
    } else {
        _error(mysqli_error($nect));
        }

    array_push($result, $out);
    echo json_encode($result);
}

function _get(){
    // 
}

function _put(){
    //
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