<?php

class AuthorDao
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
     * Method used to read all author objects from database
     */
    public function get_all()
    {
        $stmt = $this->conn->prepare("SELECT * FROM authors");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Method used to read individual author objects from database
     */
    public function get_by_id($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM authors WHERE id = :id");
        $stmt->execute([
            'id' => $id
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return @reset($result);
    }


    /**
     * Method used to get all authors of individual author from database
     */
    public function get_author_with_books($id)
    {
        $stmt = $this->conn->prepare("SELECT a.id, a.name, a.bio, a.cover, b.id AS book_id, b.name AS book_name, b.cover AS book_cover, b.source AS book_source, b.release_date AS book_release_date FROM books b
INNER JOIN authors a ON a.id=b.author_id WHERE a.id = :id");
        $stmt->execute([
            'id' => $id
        ]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Method used to add author to the database
     */
    public function add($author)
    {
        $stmt = $this->conn->prepare("INSERT INTO authors(name, bio, cover)
      VALUES (:name, :bio, :cover)");
        $stmt->execute($author);
        $author['id'] = $this->conn->lastInsertId();
        return $author;
    }

    /**
     * Delete author record from the database
     */
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM authors WHERE author_id=:id");
        $stmt->bindParam(':id', $id); // SQL injection prevention
        $stmt->execute();
    }

    /**
     * Update author record
     */
    public function update($author)
    {
        $stmt = $this->conn->prepare("UPDATE authors SET name=:name, bio=:bio, cover=:cover 
        WHERE author_id=:id");
        $stmt->execute($author);
        return $author;
    }
}
