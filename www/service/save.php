<?php
try {
    $request_body = file_get_contents('php://input');
    file_put_contents('./data.json', $request_body);
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Content-Type: application/json; charset=utf-8');

    echo $request_body;
} catch (\Throwable $th) {
    throw $th;
}
