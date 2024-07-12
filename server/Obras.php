<?php
require_once 'Database.php';

class Obras
{
    private $db;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function obtenerDisponibles()
    {
        $query = "SELECT * FROM obra WHERE disponibles > 0 AND fecha_obra > CURDATE()";
        $result = $this->db->query($query);

        if ($result === false) {
            return [];
        }

        $obras = [];
        while ($row = $result->fetch_assoc()) {
            $obras[] = $row;
        }
        return $obras;
    }

    public function checkAvailability($id_obra, $cantidad)
    {
        $query = "SELECT disponibles FROM obra WHERE cod_obra = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id_obra);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        return $row && $row['disponibles'] >= $cantidad;
    }

    public function buyTickets($id_obra, $cantidad, $comprador)
    {
        // Iniciar transacción
        $this->db->begin_transaction();
        try {
            // Verificar disponibilidad
            $stmt = $this->db->prepare("SELECT disponibles, fecha_obra FROM obra WHERE cod_obra = ?");
            $stmt->bind_param("i", $id_obra);
            $stmt->execute();
            $result = $stmt->get_result();
            $obra = $result->fetch_assoc();

            if ($obra['disponibles'] >= $cantidad) {
                // Actualizar entradas disponibles
                $stmt = $this->db->prepare("UPDATE obra SET disponibles = disponibles - ? WHERE cod_obra = ?");
                $stmt->bind_param("ii", $cantidad, $id_obra);
                $stmt->execute();

                $fecha_compra = date('Y-m-d H:i:s');
                $stmt = $this->db->prepare("INSERT INTO ventas (cod_obra, comprador, fecha_compra, fecha_evento) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("isss", $id_obra, $comprador, $fecha_compra, $obra['fecha_obra']);
                $stmt->execute();

                // Obtener el ID de la venta
                $venta_id = $stmt->insert_id;

                // Confirmar transacción
                $this->db->commit();
                return $venta_id; // Retornar el número de venta
            } else {
                $this->db->rollback();
                return false;
            }
        } catch (Exception $e) {
            $this->db->rollback();
            return false;
        }
    }
}
