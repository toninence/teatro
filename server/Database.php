<?php
class Database {
    // Agregar las credenciales correspondientes, la base de datos se llama teatro
    private $host = "localhost";
    private $db_name = "teatro";
    private $username = "root";
    private $password = "netmx2013";
    private $conn;

    // Constructor
    public function __construct() {
        $this->connect();
    }

    private function connect() {
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
        $this->conn->set_charset("utf8");
    }


    public function getConnection() {
        return $this->conn;
    }

    // public function __destruct() {
    //     $this->conn->close();
    // }
}
?>
