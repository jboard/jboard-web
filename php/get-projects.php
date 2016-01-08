<?php
header( 'Content-Type: application/json' );

// Read and parse our events JSON file into an array of event data arrays.
$json = file_get_contents(dirname(__FILE__) . '/../json/projects.json');
$input_arrays = json_decode($json, true);

// Send JSON to the client.
echo json_encode($input_arrays);