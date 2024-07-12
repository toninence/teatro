<?php
require_once 'Obras.php';

header('Content-Type: application/json');

$obras = new Obras();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getAvailablePlays':
        $result = $obras->obtenerDisponibles();
        echo json_encode($result);
        break;
    case 'checkAvailability':
        // echo json_encode([$_POST]);
        // return;
        $id_obra = $_POST['id_obra'] ?? 0;
        $cantidad = $_POST['cantidad'] ?? 1;
        if ($id_obra > 0 && $cantidad > 0) {
            $isAvailable = $obras->checkAvailability($id_obra, $cantidad);
            echo json_encode(['isAvailable' => $isAvailable]);
        } else {
            echo json_encode(['error' => 'Datos insuficientes']);
        }
        break;
    case 'buyTickets':
        $id_obra = $_POST['id_obra'] ?? 0;
        $cantidad = $_POST['cantidad'] ?? 1;
        $comprador = $_POST['comprador'] ?? '';

        if ($id_obra > 0 && $comprador) {
            $result = $obras->buyTickets($id_obra, $cantidad, $comprador);
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Compra realizada exitosamente.', 'idVenta' => $result]);
            } else {
                echo json_encode(['success' => false, 'message' => 'No se pudo completar la compra.']);
            }
        } else {
            echo json_encode(['error' => 'Datos insuficientes']);
        }
        break;
    default:
        echo json_encode(['error' => 'Acción no válida']);
}
