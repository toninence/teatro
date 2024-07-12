-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.3.39-MariaDB-1:10.3.39+maria~ubu2004 - mariadb.org binary distribution
-- SO del servidor:              debian-linux-gnu
-- HeidiSQL Versión:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para teatro
DROP DATABASE IF EXISTS `teatro`;
CREATE DATABASE IF NOT EXISTS `teatro` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `teatro`;

-- Volcando estructura para tabla teatro.obra
DROP TABLE IF EXISTS `obra`;
CREATE TABLE IF NOT EXISTS `obra` (
  `cod_obra` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `fecha_obra` datetime NOT NULL,
  `aforo` int(11) NOT NULL,
  `disponibles` int(11) NOT NULL,
  `sala` varchar(100) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_obra`)
) ENGINE=InnoDB AUTO_INCREMENT=5515 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla teatro.obra: ~4 rows (aproximadamente)
INSERT INTO `obra` (`cod_obra`, `nombre`, `fecha_obra`, `aforo`, `disponibles`, `sala`, `imagen`) VALUES
	(1234, 'Otello', '2024-07-13 22:00:00', 1000, 879, '2', 'otello.jpg'),
	(5512, 'Edipo Rey', '2024-07-14 22:30:00', 1500, 0, '3', 'edipo.jpg'),
	(5513, 'Hamilton', '2024-07-15 20:30:00', 1200, 598, '2', 'hamilton.jpg'),
	(5514, 'Beetlejuice', '2024-07-14 16:00:00', 1500, 248, '3', 'beetlejuice.jpg');

-- Volcando estructura para tabla teatro.ventas
DROP TABLE IF EXISTS `ventas`;
CREATE TABLE IF NOT EXISTS `ventas` (
  `numero_venta` int(11) NOT NULL AUTO_INCREMENT,
  `cod_obra` int(11) DEFAULT NULL,
  `comprador` varchar(255) NOT NULL,
  `fecha_compra` datetime NOT NULL,
  `fecha_evento` datetime DEFAULT NULL,
  PRIMARY KEY (`numero_venta`),
  KEY `cod_obra` (`cod_obra`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`cod_obra`) REFERENCES `OBRA` (`cod_obra`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla teatro.ventas: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
