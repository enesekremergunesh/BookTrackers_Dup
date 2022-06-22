<?php

class BookDao
{

    private $conn;

    /**
     * constructor of dao class
     */
    public function __construct()
    {
        // $servername = "localhost";
        // $username = "root";
        // $password = "memduh2PRD";
        // $schema = "book_db";
        $servername = "34.89.208.67";
        $username = "memduhekrem99";
        $password = "memduh2PRD";
        $schema = "booktracker_db";
        $this->conn = new PDO("mysql:host=$servername;dbname=$schema", $username, $password);
        // set the PDO error mode to exception
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Check connection
        echo "Connected successfully!\n";
    }

    /**
     * Method used to read all book objects from database
     */
    public function get_all()
    {
        $stmt = $this->conn->prepare("SELECT * FROM books");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Method used to read all book objects with author name from database
     */
    public function get_all_with_author()
    {
        $stmt = $this->conn->prepare(
            "SELECT b.id, b.name, b.author_id, a.name AS author_name, b.cover, b.source, b.release_date
            FROM books b
            INNER JOIN authors a
            ON a.id=b.author_id"
        );
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Method used to read individual book objects from database
     */
    public function get_by_id($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM books WHERE id = :id");
        $stmt->execute([
            'id' => $id
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return @reset($result);
    }


    /**
     * Method used to get all books of individual author from database
     */
    public function get_books_of_author($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM books b
INNER JOIN authors a ON a.id=b.author_id WHERE a.id = :id");
        $stmt->execute([
            'id' => $id
        ]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Method used to add book to the database
     */
    public function add($book)
    {
        $stmt = $this->conn->prepare("INSERT INTO books(name, author_id, language, release_date, cover, source)
      VALUES (:name, :author_id, :language, :release_date, :cover, :source)");
        $stmt->execute($book);
        $book['id'] = $this->conn->lastInsertId();
        return $book;
    }

    /**
     * Delete book record from the database
     */
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM books WHERE id=:id");
        $stmt->bindParam(':id', $id); // SQL injection prevention
        $stmt->execute();
    }

    /**
     * Update book record
     */
    public function update($book)
    {
        $stmt = $this->conn->prepare("UPDATE books SET name=:name, author_id=:author_id, language=:language, cover=:cover, source=:source, release_date=:release_date WHERE id=:id");
        $stmt->execute($book);
        return $book;
    }
}
