<?php
require_once 'config/database.php';
require_once 'controllers/EventController.php';

$request = $_SERVER['REQUEST_URI'];
$basePath = '/';

switch ($request) {
    case $basePath:
        require 'views/home.php';
        break;
    case $basePath . 'event':
        $id = $_GET['id'] ?? null;
        if ($id) {
            require 'views/event-details.php';
        }
        break;
    default:
        http_response_code(404);
        require 'views/404.php';
        break;
}
?>