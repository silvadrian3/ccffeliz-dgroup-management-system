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

    $username = mysqli_real_escape_string($nect, $input["username"]);
    $pass = mysqli_real_escape_string($nect, $input["password"]);

    $query = "SELECT id, type FROM `users` WHERE LOWER(email) = LOWER('".$username."') AND password = md5('".$pass."') AND status = 1";

    $qresult = mysqli_query($nect, $query);

    if($qresult){
        if(mysqli_num_rows($qresult)!=0){
            while($fetchResult = mysqli_fetch_array($qresult)){
                $row_array['user_id'] = trim(stripslashes($fetchResult['id']));
                $row_array['user_type'] = trim(stripslashes($fetchResult['type']));
                array_push($data, $row_array);
            }

            $out['result'] = true;
            $out['data'] = $data;

        } else {
            $out['result'] = false;
        }

        array_push($result, $out);
        echo json_encode($result);
    } else {
        _error(mysqli_error($nect));
    }    
       
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