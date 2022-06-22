<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'dao/BookDao.class.php';
require_once 'dao/AuthorDao.class.php';
require_once '../vendor/autoload.php';

Flight::register('authorDao', 'AuthorDao');
Flight::register('bookDao', 'BookDao');

// CRUD operations for users entity

/**
 * List all books with authors
 */
Flight::route('GET /books_with_author', function () {
    // echo 'books!';
    Flight::json(Flight::bookDao()->get_all_with_author());
});

/**
 * List all books
 */
Flight::route('GET /books', function () {
    Flight::json(Flight::bookDao()->get_all());
});

/**
 * print individual book
 */
Flight::route('GET /books/@id', function ($id) {
    Flight::json(Flight::bookDao()->get_by_id($id));
});

/**
 * print author by book
 */
Flight::route('GET /author_with_books/@id', function ($id) {
    Flight::json(Flight::authorDao()->get_author_with_books($id));
});

/**
 * add book
 */
Flight::route('POST /books', function () {
    Flight::json(Flight::bookDao()->add(Flight::request()->data->getData()));
});

/**
 * update book
 */
Flight::route('PUT /books/@id', function ($id) {
    $data = Flight::request()->data->getData();
    $data['id'] = $id;
    Flight::json(Flight::bookDao()->update($data));
});

/**
 * delete book
 */
Flight::route('DELETE /books/@id', function ($id) {
    Flight::bookDao()->delete($id);
    Flight::json([
        "message" => "deleted"
    ]);
});

Flight::route('/', function () {
    echo 'hello world!';
});

Flight::start();

?>
