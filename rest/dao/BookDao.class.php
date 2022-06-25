<?php
require_once __DIR__ . '/BaseDao.class.php';
class BookDao extends BaseDao
{

    private $conn;

    /**
     * constructor of dao class
     */
    public function __construct()
    {
        parent::__construct("books");
    }
    /**
     * Method used to read all book objects with author name from database
     */
    public function get_all_with_author()
    {
        return $this->query_no_param(
            "SELECT b.id, b.name, b.author_id, a.name AS author_name, b.cover, b.source, b.release_date
            FROM books b
            INNER JOIN authors a
            ON a.id=b.author_id"
        );
    }


    /**
     * Method used to get all books of individual author from database
     */
    public function get_books_of_author($id)
    {
        return $this->query("SELECT * FROM books b 
        INNER JOIN authors a ON a.id=b.author_id WHERE a.id = :id", ['id' => $id]);
    }
}

?>