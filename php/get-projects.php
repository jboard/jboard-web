<?php
header( 'Content-Type: application/json' );

include_once 'config.php';

// Read and parse our events JSON file into an array of event data arrays.
$json = file_get_contents($_CONFIG['json_projects']);
$input_arrays = json_decode($json, true);

// Send JSON to the client.
echo json_encode($input_arrays);