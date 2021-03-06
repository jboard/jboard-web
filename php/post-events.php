<?php
include_once 'config.php';

// Read and parse our events JSON file into an array of event data arrays.
$json = file_get_contents($_CONFIG['json_events']);
$input_arrays = json_decode($json, true);

$input_arrays = array_filter($input_arrays, function ($v) use ($_POST) {
	return $v['id'] != $_POST['id'];
});

if (! isset($_POST['delete'])){
	array_push($input_arrays, $_POST);
}

$json = json_encode($input_arrays);

file_put_contents($_CONFIG['json_events'],$json);