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
    //
}

function _get(){
    /**
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    
    if(isset($_GET['service_id']) && !empty($_GET['service_id'])){
        $service_id = mysqli_real_escape_string($nect, $_GET['service_id']);
        $query = "SELECT id, name FROM `lkp_services` WHERE id = '" . $service_id . "'";
    } else {
        $query = "SELECT id, name FROM `lkp_services`";
    }
    
    $qresult = mysqli_query($nect, $query);

    if($qresult){
        if(mysqli_num_rows($qresult)!=0){
            while($fetchResult = mysqli_fetch_array($qresult)){
                $row_array['service_id'] = trim(stripslashes($fetchResult['id']));
                $row_array['service_name'] = trim(stripslashes($fetchResult['name']));
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
    */
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