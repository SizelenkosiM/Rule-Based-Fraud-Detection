-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: fraud_detection
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `rule_triggered` varchar(100) NOT NULL,
  `alert_date` datetime NOT NULL,
  `description` text,
  `status` enum('new','reviewed') DEFAULT 'new',
  PRIMARY KEY (`id`),
  KEY `transaction_id` (`transaction_id`),
  CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerts`
--

LOCK TABLES `alerts` WRITE;
/*!40000 ALTER TABLE `alerts` DISABLE KEYS */;
INSERT INTO `alerts` VALUES (1,1,'single_transaction_limit','2025-04-06 00:00:51','Transaction amount $600 exceeds the $500 limit','new'),(2,4,'dormant_account_activation','2025-04-06 00:10:13','Sudden activity after 100 days of inactivity with amount $150','new'),(3,11,'monthly_cumulative_limit','2025-04-06 18:49:27','Monthly transactions total $1306.00 exceeds the $1000 limit','new'),(7,12,'single_transaction_limit','2025-04-11 10:59:10','Transaction amount $500 exceeds the $500 limit','new'),(8,12,'monthly_cumulative_limit','2025-04-11 10:59:10','Monthly transactions total $1406.00 exceeds the $1000 limit','new'),(10,16,'dormant_account_activation','2025-04-11 12:58:23','Sudden activity after 105 days of inactivity with amount $100','new'),(11,20,'single_transaction_limit','2025-04-11 13:19:21','Transaction amount $500 exceeds the $500 limit','new'),(12,21,'single_transaction_limit','2025-04-11 13:23:41','Transaction amount $500 exceeds the $500 limit','new'),(13,22,'dormant_account_activation','2025-04-11 14:21:25','Sudden activity after 100 days of inactivity with amount $100','new'),(14,23,'dormant_account_activation','2025-04-11 14:22:10','Sudden activity after 100 days of inactivity with amount $100','new'),(15,28,'monthly_cumulative_limit','2025-04-11 14:24:07','Monthly transactions total $1360.00 exceeds the $1000 limit','new'),(16,29,'single_transaction_limit','2025-04-11 17:05:05','Transaction amount $500 exceeds the $500 limit','new'),(17,30,'single_transaction_limit','2025-04-13 18:36:29','Transaction amount $500 exceeds the $500 limit','new'),(18,35,'monthly_cumulative_limit','2025-04-13 18:42:52','Monthly transactions total $1493.00 exceeds the $1000 limit','new');
/*!40000 ALTER TABLE `alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` varchar(50) NOT NULL,
  `receiver_id` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_date` datetime NOT NULL,
  `status` enum('pending','completed','flagged') DEFAULT 'pending',
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'user123','BCC234567890',600.00,'2025-04-06 00:00:50','flagged','Transfer to BCC234567890'),(2,'user123','BCA234567890',6.00,'2025-04-06 00:01:45','completed','airtime'),(4,'user123','ABC1234567',150.00,'2025-04-06 00:10:13','flagged','Transfer to ABC1234567'),(8,'user123','BCA123456',100.00,'2025-04-06 18:48:53','completed','Transfer to BCA123456'),(9,'user123','BCA123456',400.00,'2025-04-06 18:49:07','completed','Transfer to BCA123456'),(10,'user123','BCA123456',400.00,'2025-04-06 18:49:21','completed','Transfer to BCA123456'),(11,'user123','BCB123456',400.00,'2025-04-06 18:49:27','flagged','Transfer to BCB123456'),(12,'user123','BCA123456',500.00,'2025-04-11 10:59:10','flagged','payment'),(16,'user124','ABD1234567',100.00,'2025-04-11 12:58:23','flagged','payment'),(17,'user124','ABD1234567',10.00,'2025-04-11 12:59:32','completed','payment'),(20,'user125','BCA123456',500.00,'2025-04-11 13:19:21','flagged','payment'),(21,'user126','BCA123456',500.00,'2025-04-11 13:23:41','flagged','payment'),(22,'user126','ABD1234567',100.00,'2025-04-11 14:21:25','flagged','electric bill'),(23,'user125','ABD1234567',100.00,'2025-04-11 14:22:10','flagged','Transfer to ABD1234567'),(24,'user125','ABD1234567',10.00,'2025-04-11 14:23:16','completed','Transfer to ABD1234567'),(25,'user125','ABG1234567',200.00,'2025-04-11 14:23:28','completed','Transfer to ABG1234567'),(26,'user125','ABG1234567',300.00,'2025-04-11 14:23:45','completed','Transfer to ABG1234567'),(27,'user125','ABG1234567',450.00,'2025-04-11 14:24:01','completed','Transfer to ABG1234567'),(28,'user125','ABG1234567',400.00,'2025-04-11 14:24:07','flagged','Transfer to ABG1234567'),(29,'user126','BCC234567890',500.00,'2025-04-11 17:05:05','flagged','funds'),(30,'user124','BCC234567890',500.00,'2025-04-13 18:36:29','flagged','funds'),(31,'user124','BCC234567890',100.00,'2025-04-13 18:39:29','completed','funds'),(32,'user123','ABC1234567',50.00,'2025-04-13 18:40:44','completed','services'),(33,'user126','ABG1234567',499.00,'2025-04-13 18:41:59','completed','services'),(34,'user126','ABG1234567',499.00,'2025-04-13 18:42:25','completed','payment'),(35,'user126','ABG1234567',495.00,'2025-04-13 18:42:52','flagged','payment');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `last_activity_date` datetime DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('user123','John Doe','2025-04-13 18:40:44',0.00),('user124','Test User','2025-04-13 18:39:29',0.00),('user125','Bob Johnson','2025-04-11 14:24:07',0.00),('user126','John Doe','2025-04-13 18:42:52',0.00);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-15 23:32:46
