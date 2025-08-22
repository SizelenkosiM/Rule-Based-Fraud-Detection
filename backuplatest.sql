-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: fraud_detection
-- ------------------------------------------------------
-- Server version	9.2.0

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
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerts`
--

LOCK TABLES `alerts` WRITE;
/*!40000 ALTER TABLE `alerts` DISABLE KEYS */;
INSERT INTO `alerts` VALUES (1,1,'single_transaction_limit','2025-04-06 00:00:51','Transaction amount $600 exceeds the $500 limit','new'),(2,4,'dormant_account_activation','2025-04-06 00:10:13','Sudden activity after 100 days of inactivity with amount $150','new'),(3,11,'monthly_cumulative_limit','2025-04-06 18:49:27','Monthly transactions total $1306.00 exceeds the $1000 limit','new'),(7,12,'single_transaction_limit','2025-04-11 10:59:10','Transaction amount $500 exceeds the $500 limit','new'),(8,12,'monthly_cumulative_limit','2025-04-11 10:59:10','Monthly transactions total $1406.00 exceeds the $1000 limit','new'),(10,16,'dormant_account_activation','2025-04-11 12:58:23','Sudden activity after 105 days of inactivity with amount $100','new'),(11,20,'single_transaction_limit','2025-04-11 13:19:21','Transaction amount $500 exceeds the $500 limit','new'),(12,21,'single_transaction_limit','2025-04-11 13:23:41','Transaction amount $500 exceeds the $500 limit','new'),(13,22,'dormant_account_activation','2025-04-11 14:21:25','Sudden activity after 100 days of inactivity with amount $100','new'),(14,23,'dormant_account_activation','2025-04-11 14:22:10','Sudden activity after 100 days of inactivity with amount $100','new'),(15,28,'monthly_cumulative_limit','2025-04-11 14:24:07','Monthly transactions total $1360.00 exceeds the $1000 limit','new'),(16,29,'single_transaction_limit','2025-04-11 17:05:05','Transaction amount $500 exceeds the $500 limit','new'),(17,30,'single_transaction_limit','2025-04-13 18:36:29','Transaction amount $500 exceeds the $500 limit','new'),(18,35,'monthly_cumulative_limit','2025-04-13 18:42:52','Monthly transactions total $1493.00 exceeds the $1000 limit','new'),(19,36,'monthly_cumulative_limit','2025-04-16 00:18:39','Monthly transactions total $1256.00 exceeds the $1000 limit','new'),(20,38,'single_transaction_limit','2025-04-17 01:16:46','Transaction amount $505 exceeds the $500 limit','new'),(21,38,'monthly_cumulative_limit','2025-04-17 01:16:46','Monthly transactions total $1495.00 exceeds the $1000 limit','new'),(22,39,'single_transaction_limit','2025-04-17 01:23:43','Transaction amount $520 exceeds the $500 limit','reviewed'),(23,39,'monthly_cumulative_limit','2025-04-17 01:23:43','Monthly transactions total $1510.00 exceeds the $1000 limit','new'),(24,40,'single_transaction_limit','2025-04-23 17:14:37','Transaction amount $505 exceeds the $500 limit','reviewed'),(25,40,'monthly_cumulative_limit','2025-04-23 17:14:37','Monthly transactions total $1495.00 exceeds the $1000 limit','reviewed'),(26,41,'single_transaction_limit','2025-03-17 08:49:33','Transaction amount $608 exceeds the $500 limit','new'),(27,43,'monthly_cumulative_limit','2025-04-25 01:01:56','Monthly transactions total $1046.00 exceeds the $1000 limit','new'),(28,44,'monthly_cumulative_limit','2025-04-25 01:02:50','Monthly transactions total $1196.00 exceeds the $1000 limit','new'),(29,45,'single_transaction_limit','2025-03-19 11:14:46','Transaction amount $678 exceeds the $500 limit','new'),(30,45,'monthly_cumulative_limit','2025-03-19 11:14:46','Monthly transactions total $1668.00 exceeds the $1000 limit','new'),(31,46,'single_transaction_limit','2025-02-10 07:15:44','Transaction amount $803 exceeds the $500 limit','new'),(32,46,'monthly_cumulative_limit','2025-02-10 07:15:44','Monthly transactions total $1793.00 exceeds the $1000 limit','new'),(33,47,'single_transaction_limit','2025-01-14 23:18:31','Transaction amount $550 exceeds the $500 limit','new'),(34,48,'single_transaction_limit','2025-01-14 23:19:58','Transaction amount $567 exceeds the $500 limit','new'),(35,48,'monthly_cumulative_limit','2025-01-14 23:19:58','Monthly transactions total $1565.00 exceeds the $1000 limit','new'),(36,49,'single_transaction_limit','2024-12-16 04:21:32','Transaction amount $770.44 exceeds the $500 limit','new'),(37,50,'monthly_cumulative_limit','2024-12-16 04:54:17','Monthly transactions total $1198.00 exceeds the $1000 limit','new'),(38,52,'single_transaction_limit','2024-11-15 04:58:38','Transaction amount $500 exceeds the $500 limit','new'),(39,52,'monthly_cumulative_limit','2024-11-15 04:58:38','Monthly transactions total $1490.00 exceeds the $1000 limit','new'),(40,53,'monthly_cumulative_limit','2024-11-15 04:59:22','Monthly transactions total $1040.00 exceeds the $1000 limit','new'),(41,54,'monthly_cumulative_limit','2024-11-15 05:00:40','Monthly transactions total $1048.00 exceeds the $1000 limit','new'),(42,55,'monthly_cumulative_limit','2024-10-18 05:02:06','Monthly transactions total $1048.00 exceeds the $1000 limit','new'),(43,56,'single_transaction_limit','2024-09-22 21:24:44','Transaction amount $660 exceeds the $500 limit','new'),(44,56,'monthly_cumulative_limit','2024-09-22 21:24:44','Monthly transactions total $1616.00 exceeds the $1000 limit','new'),(45,57,'single_transaction_limit','2024-09-22 21:25:31','Transaction amount $660 exceeds the $500 limit','new'),(46,57,'monthly_cumulative_limit','2024-09-22 21:25:31','Monthly transactions total $1616.00 exceeds the $1000 limit','new'),(47,58,'single_transaction_limit','2024-09-22 21:25:35','Transaction amount $660 exceeds the $500 limit','new'),(48,58,'monthly_cumulative_limit','2024-09-22 21:25:35','Monthly transactions total $1616.00 exceeds the $1000 limit','new'),(49,59,'monthly_cumulative_limit','2024-08-19 21:27:03','Monthly transactions total $1276.00 exceeds the $1000 limit','new'),(50,61,'single_transaction_limit','2024-08-05 03:36:29','Transaction amount $500 exceeds the $500 limit','new'),(51,61,'monthly_cumulative_limit','2024-08-05 03:36:29','Monthly transactions total $1270.00 exceeds the $1000 limit','new'),(52,62,'single_transaction_limit','2024-07-07 03:37:02','Transaction amount $500 exceeds the $500 limit','new'),(53,62,'monthly_cumulative_limit','2024-07-07 03:37:02','Monthly transactions total $1270.00 exceeds the $1000 limit','new'),(54,63,'monthly_cumulative_limit','2024-07-07 03:39:10','Monthly transactions total $1190.00 exceeds the $1000 limit','new'),(55,64,'single_transaction_limit','2024-06-07 03:46:00','Transaction amount $750 exceeds the $500 limit','new'),(56,64,'monthly_cumulative_limit','2024-06-07 03:46:00','Monthly transactions total $1740.00 exceeds the $1000 limit','new'),(57,65,'monthly_cumulative_limit','2024-05-04 08:00:23','Monthly transactions total $1255.00 exceeds the $1000 limit','new'),(58,66,'monthly_cumulative_limit','2024-04-26 09:43:09','Monthly transactions total $1156.00 exceeds the $1000 limit','new'),(59,67,'monthly_cumulative_limit','2024-04-06 09:45:48','Monthly transactions total $1198.00 exceeds the $1000 limit','new'),(60,68,'monthly_cumulative_limit','2024-03-01 12:12:32','Monthly transactions total $1190.00 exceeds the $1000 limit','new'),(61,70,'monthly_cumulative_limit','2024-05-05 12:19:21','Monthly transactions total $1215.00 exceeds the $1000 limit','new'),(62,71,'monthly_cumulative_limit','2024-05-05 12:20:21','Monthly transactions total $1090.00 exceeds the $1000 limit','new'),(63,72,'monthly_cumulative_limit','2024-05-05 12:22:21','Monthly transactions total $1040.00 exceeds the $1000 limit','new'),(64,78,'single_transaction_limit','2025-04-26 05:18:22','Transaction amount $650 exceeds the $500 limit','new'),(65,78,'dormant_account_activation','2025-04-26 05:18:22','Sudden activity after 365 days of inactivity with amount $650','new');
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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'user123','BCC234567890',600.00,'2025-04-06 00:00:50','flagged','Transfer to BCC234567890'),(2,'user123','BCA234567890',6.00,'2025-04-06 00:01:45','completed','airtime'),(4,'user123','ABC1234567',150.00,'2025-04-06 00:10:13','flagged','Transfer to ABC1234567'),(8,'user123','BCA123456',100.00,'2025-04-06 18:48:53','completed','Transfer to BCA123456'),(9,'user123','BCA123456',400.00,'2025-04-06 18:49:07','completed','Transfer to BCA123456'),(10,'user123','BCA123456',400.00,'2025-04-06 18:49:21','completed','Transfer to BCA123456'),(11,'user123','BCB123456',400.00,'2025-04-06 18:49:27','flagged','Transfer to BCB123456'),(12,'user123','BCA123456',500.00,'2025-04-11 10:59:10','flagged','payment'),(16,'user124','ABD1234567',100.00,'2025-04-11 12:58:23','flagged','payment'),(17,'user124','ABD1234567',10.00,'2025-04-11 12:59:32','completed','payment'),(20,'user125','BCA123456',500.00,'2025-04-11 13:19:21','flagged','payment'),(21,'user126','BCA123456',500.00,'2025-04-11 13:23:41','flagged','payment'),(22,'user126','ABD1234567',100.00,'2025-04-11 14:21:25','flagged','electric bill'),(23,'user125','ABD1234567',100.00,'2025-04-11 14:22:10','flagged','Transfer to ABD1234567'),(24,'user125','ABD1234567',10.00,'2025-04-11 14:23:16','completed','Transfer to ABD1234567'),(25,'user125','ABG1234567',200.00,'2025-04-11 14:23:28','completed','Transfer to ABG1234567'),(26,'user125','ABG1234567',300.00,'2025-04-11 14:23:45','completed','Transfer to ABG1234567'),(27,'user125','ABG1234567',450.00,'2025-04-11 14:24:01','completed','Transfer to ABG1234567'),(28,'user125','ABG1234567',400.00,'2025-04-11 14:24:07','flagged','Transfer to ABG1234567'),(29,'user126','BCC234567890',500.00,'2025-04-11 17:05:05','flagged','funds'),(30,'user124','BCC234567890',500.00,'2025-04-13 18:36:29','flagged','funds'),(31,'user124','BCC234567890',100.00,'2025-04-13 18:39:29','completed','funds'),(32,'user123','ABC1234567',50.00,'2025-04-13 18:40:44','completed','services'),(33,'user126','ABG1234567',499.00,'2025-04-13 18:41:59','completed','services'),(34,'user126','ABG1234567',499.00,'2025-04-13 18:42:25','completed','payment'),(35,'user126','ABG1234567',495.00,'2025-04-13 18:42:52','flagged','payment'),(36,'user123','ACCD212',300.00,'2025-04-16 00:18:39','flagged','Rent'),(37,'user125','ACCR321',30.00,'2025-04-17 01:15:25','completed','airtime'),(38,'user125','ACCR321',505.00,'2025-04-17 01:16:46','flagged','laptop'),(39,'user125','ACCR321',520.00,'2025-04-17 01:23:43','flagged','grocery'),(40,'user125','BCDDTBB',505.00,'2025-04-23 17:14:37','flagged','LEVY'),(41,'user132','ACCR321',608.00,'2025-03-17 08:49:33','flagged','Fees'),(42,'user131','XXXX-XXXX-1245',366.00,'2025-03-17 08:53:22','completed','laptop'),(43,'user125','ACCHHLTU',56.00,'2025-04-25 01:01:56','flagged','clothes'),(44,'user125','ACCR321',206.00,'2025-04-25 01:02:50','flagged','food'),(45,'user125','ACCHHLTU',678.00,'2025-03-19 11:14:46','flagged','workstation'),(46,'user125','ACCD212',803.00,'2025-02-10 07:15:44','flagged','Fees'),(47,'user124','XXXX-XXXX-1245',550.00,'2025-01-14 23:18:31','flagged','clothes'),(48,'user126','ACCR321',567.00,'2025-01-14 23:19:57','flagged','Fees'),(49,'user124','BCDDTBB',770.44,'2024-12-16 04:21:32','flagged','LEVY'),(50,'user126','ACCD212',200.00,'2024-12-16 04:54:17','flagged','bill'),(51,'user124','ACCHHLTU',200.00,'2024-11-15 04:56:11','completed','bill'),(52,'user125','ACCR321',500.00,'2024-11-15 04:58:38','flagged','Rent'),(53,'user125','ACCR321',50.00,'2024-11-15 04:59:22','flagged','grocery'),(54,'user126','BCDDTBB',50.00,'2024-11-15 05:00:40','flagged','grocery'),(55,'user126','BCDDTBB',50.00,'2024-10-18 05:02:06','flagged','grocery'),(56,'user123','12345897',660.00,'2024-09-22 21:24:44','flagged','workstation'),(57,'user123','12345897',660.00,'2024-09-22 21:25:31','flagged','workstation'),(58,'user123','12345897',660.00,'2024-09-22 21:25:35','flagged','workstation'),(59,'user123','7878784322',320.00,'2024-08-19 21:27:03','flagged','grocery'),(60,'user124','12567868',460.00,'2024-08-19 21:30:15','completed','grocery'),(61,'user124','5795745990',500.00,'2024-08-05 03:36:29','flagged','workstation'),(62,'user124','5795745990',500.00,'2024-07-07 03:37:02','flagged','workstation'),(63,'user125','5795745990',200.00,'2024-07-07 03:39:10','flagged','clothes shoping'),(64,'user125','1256788888',750.00,'2024-06-07 03:46:00','flagged','Fees'),(65,'user124','4567321478',485.00,'2024-05-04 08:00:23','flagged','Shopping'),(66,'user123','235456321478',200.00,'2024-04-26 09:43:09','flagged','laptop'),(67,'user126','678543321478',200.00,'2024-04-06 09:45:48','flagged','laptop'),(68,'user125','55645321478',200.00,'2024-03-01 12:12:32','flagged','Stationary'),(69,'user124','55645321478',20.00,'2024-05-05 12:18:05','completed','Airtime'),(70,'user124','441235321478',425.00,'2024-05-05 12:19:21','flagged','grocery'),(71,'user125','4412345245478',100.00,'2024-05-05 12:20:21','flagged','rent'),(72,'user125','12678953456',50.00,'2024-05-05 12:22:21','flagged','Pocket money'),(73,'user130','ACCD212',100.00,'2025-04-25 22:17:54','completed','grocery'),(74,'user130','ACCHHLTU',30.00,'2025-04-25 22:23:00','completed','Airtime'),(75,'user130','ACCR321',25.00,'2024-04-25 22:23:46','completed','books'),(76,'user130','XXXX-XXXX-1245',345.00,'2024-04-25 22:25:28','completed','laptop'),(77,'user130','BCDDTBB',400.00,'2024-04-25 22:27:12','completed','workstation'),(78,'user130','BCDDTBB',650.00,'2025-04-26 05:18:22','flagged','wedding cake');
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
INSERT INTO `users` VALUES ('user123','John Doe','2024-04-26 09:43:09',0.00),('user124','Test User','2024-05-05 12:19:21',0.00),('user125','Bob Johnson','2024-05-05 12:22:21',0.00),('user126','John Doe','2024-04-06 09:45:48',0.00),('user130','Natasha Romanoff','2025-04-26 05:18:22',0.00),('user131','Steve Rogers','2025-03-17 08:53:22',0.00),('user132','Peter Parker','2025-03-17 08:49:33',0.00);
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

-- Dump completed on 2025-04-30 19:49:34
