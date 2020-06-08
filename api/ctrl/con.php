<?php 
date_default_timezone_set('Asia/Manila');
$server_time = date('Y-m-d H:i:s');

$db_name = 'ccfdgroupmanagement';
//$db_host = "35.200.103.165";
//$db_user = "root";
//$db_password = "xmsIENtOc0LuIm6m";
$db_host = '127.0.0.1';
$db_user = 'root';
$db_password = 'mysql';

/**
$nect = mysqli_connect($db_host, $db_user, $db_password, $db_name);
if (!$nect) {
    die('Unable to connect database: ($db_host, $db_user, $db_password) ' . mysql_error());
}
*/

$nect = mysqli_connect($db_host, $db_user, $db_password);
if (!$nect) {
    die('Unable to connect to host: ' .  mysqli_error($nect));
} else {
    $selected_db = mysqli_select_db($nect, $db_name);
    if (!$selected_db) {
        die('Unable to use the selected database: '. mysqli_error($nect));
    }
}


?>