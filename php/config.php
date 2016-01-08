<?php
$_CONFIG = array();
$_CONFIG['json_events'] 	= dirname(__FILE__) . '/../json/demo/events.json';
$_CONFIG['json_projects'] 	= dirname(__FILE__) . '/../json/demo/projects.json';

if (file_exists('config.production.php')) include 'config.production.php';
