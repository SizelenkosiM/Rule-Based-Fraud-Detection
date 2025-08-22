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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerts`
--

LOCK TABLES `alerts` WRITE;
/*!40000 ALTER TABLE `alerts` DISABLE KEYS */;
INSERT INTO `alerts` VALUES (1,1,'dormant_account_activation','2024-08-01 11:46:33','Sudden activity after 0 days of inactivity with amount $100.00','new'),(2,3,'single_transaction_limit','2024-08-01 11:48:06','Transaction amount $500.00 exceeds the $500 limit','new'),(3,6,'monthly_cumulative_limit','2024-08-01 11:48:48','Monthly transactions total $809.00 exceeds the $1000 limit','new'),(4,7,'dormant_account_activation','2024-08-01 11:51:00','Sudden activity after 0 days of inactivity with amount $450.00','new'),(8,9,'single_transaction_limit','2024-08-01 11:57:56','Transaction amount $500 exceeds the $500 limit','new'),(9,12,'monthly_cumulative_limit','2024-08-01 12:00:26','Monthly transactions total $1170.00 exceeds the $1000 limit','new'),(10,13,'dormant_account_activation','2024-08-01 12:14:33','Sudden activity after 244 days of inactivity with amount $200','new'),(11,15,'single_transaction_limit','2024-08-01 12:15:12','Transaction amount $500 exceeds the $500 limit','new'),(12,19,'monthly_cumulative_limit','2024-08-01 12:16:33','Monthly transactions total $1300.00 exceeds the $1000 limit','new'),(13,20,'dormant_account_activation','2024-08-01 12:20:59','Sudden activity after 168 days of inactivity with amount $300','new'),(14,22,'single_transaction_limit','2024-08-01 12:21:29','Transaction amount $500 exceeds the $500 limit','new'),(15,27,'monthly_cumulative_limit','2024-08-01 12:22:54','Monthly transactions total $1300.00 exceeds the $1000 limit','new'),(16,29,'single_transaction_limit','2024-09-06 12:26:46','Transaction amount $500 exceeds the $500 limit','new'),(17,31,'single_transaction_limit','2024-09-06 12:29:16','Transaction amount $500 exceeds the $500 limit','new'),(18,36,'monthly_cumulative_limit','2024-09-06 12:31:08','Monthly transactions total $1055.00 exceeds the $1000 limit','new'),(19,38,'single_transaction_limit','2024-09-06 12:32:47','Transaction amount $500 exceeds the $500 limit','new'),(20,41,'monthly_cumulative_limit','2024-09-06 12:33:28','Monthly transactions total $1210.00 exceeds the $1000 limit','new'),(21,43,'single_transaction_limit','2024-10-12 12:34:20','Transaction amount $500 exceeds the $500 limit','new'),(22,46,'monthly_cumulative_limit','2024-10-12 12:35:04','Monthly transactions total $1210.00 exceeds the $1000 limit','new'),(23,52,'monthly_cumulative_limit','2024-10-12 12:38:34','Monthly transactions total $1110.00 exceeds the $1000 limit','new'),(24,53,'single_transaction_limit','2024-11-15 12:39:39','Transaction amount $500 exceeds the $500 limit','new'),(25,56,'monthly_cumulative_limit','2024-11-15 12:40:43','Monthly transactions total $1278.00 exceeds the $1000 limit','new'),(26,59,'single_transaction_limit','2024-11-15 12:41:18','Transaction amount $500 exceeds the $500 limit','new'),(27,62,'monthly_cumulative_limit','2024-11-15 12:41:50','Monthly transactions total $1280.00 exceeds the $1000 limit','new'),(28,63,'single_transaction_limit','2024-11-15 12:42:29','Transaction amount $500 exceeds the $500 limit','new'),(29,70,'monthly_cumulative_limit','2024-11-15 12:43:33','Monthly transactions total $1030.00 exceeds the $1000 limit','new'),(30,72,'single_transaction_limit','2024-11-15 12:47:06','Transaction amount $500 exceeds the $500 limit','new'),(31,74,'single_transaction_limit','2024-11-15 12:47:21','Transaction amount $500 exceeds the $500 limit','new'),(32,76,'monthly_cumulative_limit','2024-11-15 12:47:59','Monthly transactions total $1100.00 exceeds the $1000 limit','new'),(33,79,'single_transaction_limit','2024-12-20 12:49:13','Transaction amount $500 exceeds the $500 limit','new'),(34,80,'single_transaction_limit','2024-12-20 12:49:26','Transaction amount $500 exceeds the $500 limit','new'),(35,84,'monthly_cumulative_limit','2024-12-20 12:51:39','Monthly transactions total $1160.00 exceeds the $1000 limit','new'),(36,88,'single_transaction_limit','2024-12-20 12:52:36','Transaction amount $500 exceeds the $500 limit','new'),(37,89,'single_transaction_limit','2024-12-20 12:52:42','Transaction amount $500 exceeds the $500 limit','new'),(38,90,'single_transaction_limit','2024-12-20 12:58:11','Transaction amount $500 exceeds the $500 limit','new'),(39,92,'single_transaction_limit','2024-12-20 12:58:29','Transaction amount $500 exceeds the $500 limit','new'),(40,97,'monthly_cumulative_limit','2024-12-20 12:59:54','Monthly transactions total $1260.00 exceeds the $1000 limit','new'),(41,103,'single_transaction_limit','2024-12-20 13:01:37','Transaction amount $500 exceeds the $500 limit','new'),(42,112,'single_transaction_limit','2025-01-25 00:11:14','Transaction amount $500 exceeds the $500 limit','new'),(43,119,'single_transaction_limit','2025-01-28 16:13:54','Transaction amount $500 exceeds the $500 limit','new'),(44,120,'single_transaction_limit','2025-01-28 16:14:12','Transaction amount $500 exceeds the $500 limit','new'),(45,121,'single_transaction_limit','2025-01-28 16:14:54','Transaction amount $500 exceeds the $500 limit','new'),(46,126,'monthly_cumulative_limit','2025-02-15 15:03:22','Monthly transactions total $1020.00 exceeds the $1000 limit','new'),(47,127,'monthly_cumulative_limit','2025-02-15 15:04:12','Monthly transactions total $1050.00 exceeds the $1000 limit','new'),(48,130,'single_transaction_limit','2025-03-13 12:07:11','Transaction amount $500 exceeds the $500 limit','new'),(49,135,'single_transaction_limit','2025-04-18 12:11:10','Transaction amount $500 exceeds the $500 limit','new');
/*!40000 ALTER TABLE `alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authentication`
--

DROP TABLE IF EXISTS `authentication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authentication` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authentication`
--

LOCK TABLES `authentication` WRITE;
/*!40000 ALTER TABLE `authentication` DISABLE KEYS */;
/*!40000 ALTER TABLE `authentication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fraud_analysts`
--

DROP TABLE IF EXISTS `fraud_analysts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fraud_analysts` (
  `id` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fraud_analysts`
--

LOCK TABLES `fraud_analysts` WRITE;
/*!40000 ALTER TABLE `fraud_analysts` DISABLE KEYS */;
INSERT INTO `fraud_analysts` VALUES ('32385ad3-10e6-474b-9dbc-031dbd135550','sizeh','$2b$12$P0mz7CFniYaWMaEPfRXbN.1ajPpvjGzn6AlXxx65crUJ90Uoy1Nke','Sizelenkosi','2025-05-01 22:11:33','2024-08-01 11:33:02'),('f550ce95-e81f-451c-97c5-108564094902','vedza','$2b$12$evb.6f7A.aq08BIwI53oAOlhe2riCmEoEbIEHkP2v9YAj8N2oXhQ6','Verily','2025-05-01 22:32:54','2024-08-01 11:57:20');
/*!40000 ALTER TABLE `fraud_analysts` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'user123','ABC1234567',100.00,'2024-08-01 11:46:33','flagged','payment'),(2,'user123','ABD1234567',10.00,'2024-08-01 11:47:23','completed','airtime'),(3,'user123','ABD1234567',500.00,'2024-08-01 11:48:06','flagged','bill'),(4,'user123','ABD1234567',499.00,'2024-08-01 11:48:33','completed','bill'),(5,'user123','ABD1234567',300.00,'2024-08-01 11:48:41','completed','bill'),(6,'user123','ABD1234567',450.00,'2024-08-01 11:48:48','flagged','bill'),(7,'user124','ABD1234567',450.00,'2024-08-01 11:51:00','flagged','bill'),(8,'user124','BCA123456',100.00,'2024-08-01 11:56:33','completed','grocery'),(9,'user124','ABG1234567',500.00,'2024-08-01 11:57:56','flagged','laptop'),(10,'user124','BCA123456',300.00,'2024-08-01 11:59:57','completed','funds'),(11,'user124','BCA123456',450.00,'2024-08-01 12:00:12','completed','payment'),(12,'user124','BCA123456',320.00,'2024-08-01 12:00:26','flagged','iphone'),(13,'user125','ABD1234567',200.00,'2024-08-01 12:14:33','flagged','electric bill'),(14,'user125','BCA123456',50.00,'2024-08-01 12:14:56','completed','airtime'),(15,'user125','ABD1234567',500.00,'2024-08-01 12:15:12','flagged','payment'),(16,'user125','BCC234567890',90.00,'2024-08-01 12:15:37','completed','groceries'),(17,'user125','ABD1234567',470.00,'2024-08-01 12:16:01','completed','laptop'),(18,'user125','ABD1234567',290.00,'2024-08-01 12:16:14','completed','bills'),(19,'user125','BCA123456',400.00,'2024-08-01 12:16:32','flagged','electric bill'),(20,'user126','ABG1234567',300.00,'2024-08-01 12:20:59','flagged','payment'),(21,'user126','ABC1234567',30.00,'2024-08-01 12:21:13','completed','payment'),(22,'user126','BCC234567890',500.00,'2024-08-01 12:21:29','flagged','school fees'),(23,'user126','BCC234567890',450.00,'2024-08-01 12:21:39','completed','school fees'),(24,'user126','ABD1234567',10.00,'2024-08-01 12:22:06','completed','airtime'),(25,'user126','ABD1234567',100.00,'2024-08-01 12:22:14','completed','bill'),(26,'user126','BCA123456',300.00,'2024-08-01 12:22:41','completed','grocery'),(27,'user126','BCA123456',410.00,'2024-08-01 12:22:53','flagged','laptop'),(28,'user126','ABC1234567',410.00,'2024-09-06 12:24:15','completed','transfere'),(29,'user126','BCA123456',500.00,'2024-09-06 12:26:45','flagged','funds'),(30,'user123','ABG1234567',50.00,'2024-09-06 12:29:07','completed','funds'),(31,'user123','ABG1234567',500.00,'2024-09-06 12:29:16','flagged','funds'),(32,'user123','BCC234567890',200.00,'2024-09-06 12:29:32','completed','payment'),(33,'user123','ABG1234567',350.00,'2024-09-06 12:30:17','completed','groceries'),(34,'user123','ABG1234567',50.00,'2024-09-06 12:30:34','completed','funding'),(35,'user123','01234567890',5.00,'2024-09-06 12:30:56','completed','airtime'),(36,'user123','01234567890',400.00,'2024-09-06 12:31:08','flagged','bill'),(37,'user124','ABC1234567',400.00,'2024-09-06 12:32:37','completed','bill'),(38,'user124','ABC1234567',500.00,'2024-09-06 12:32:47','flagged','payment'),(39,'user124','BCC234567890',50.00,'2024-09-06 12:32:59','completed','services'),(40,'user124','ABD1234567',300.00,'2024-09-06 12:33:16','completed','electric bill'),(41,'user124','ABD1234567',460.00,'2024-09-06 12:33:28','flagged','transfere'),(42,'user125','BCC234567890',40.00,'2024-10-12 12:34:13','completed','funding'),(43,'user125','BCC234567890',500.00,'2024-10-12 12:34:20','flagged','funding'),(44,'user125','ABD1234567',470.00,'2024-10-12 12:34:38','completed','services'),(45,'user125','BCA123456',300.00,'2024-10-12 12:34:51','completed','services'),(46,'user125','BCA123456',400.00,'2024-10-12 12:35:04','flagged','electric bill'),(47,'user126','BCA123456',10.00,'2024-10-12 12:37:04','completed','airtime'),(48,'user126','BCA123456',70.00,'2024-10-12 12:37:34','completed','airtime'),(49,'user126','BCA123456',450.00,'2024-10-12 12:37:48','completed','school fees'),(50,'user126','ABG1234567',360.00,'2024-10-12 12:38:07','completed','fundraising'),(51,'user126','BCA123456',20.00,'2024-10-12 12:38:24','completed','Transfer to BCA123456'),(52,'user126','ABD1234567',200.00,'2024-10-12 12:38:34','flagged','Transfer to ABD1234567'),(53,'user123','ABD1234567',500.00,'2024-11-15 12:39:39','flagged','Transfer to ABD1234567'),(54,'user123','BCC234567890',489.00,'2024-11-15 12:39:56','completed','bill'),(55,'user123','ABD1234567',489.00,'2024-11-15 12:40:34','completed','bill'),(56,'user123','ABD1234567',300.00,'2024-11-15 12:40:43','flagged','payment'),(57,'user124','BCA123456',30.00,'2024-11-15 12:41:01','completed','payment'),(58,'user124','BCA123456',300.00,'2024-11-15 12:41:08','completed','Transfer to BCA123456'),(59,'user124','ABD1234567',500.00,'2024-11-15 12:41:18','flagged','Transfer to ABD1234567'),(60,'user124','ABD1234567',450.00,'2024-11-15 12:41:26','completed','Transfer to ABD1234567'),(61,'user124','ABC1234567',100.00,'2024-11-15 12:41:42','completed','Transfer to ABC1234567'),(62,'user124','ABC1234567',400.00,'2024-11-15 12:41:50','flagged','Transfer to ABC1234567'),(63,'user125','ABC1234567',500.00,'2024-11-15 12:42:29','flagged','Transfer to ABC1234567'),(64,'user125','ABC1234567',50.00,'2024-11-15 12:42:35','completed','bill'),(65,'user125','ABC1234567',300.00,'2024-11-15 12:42:47','completed','funds'),(66,'user125','ABC1234567',30.00,'2024-11-15 12:42:51','completed','funds'),(67,'user125','ABD1234567',300.00,'2024-11-15 12:43:04','completed','transfere'),(68,'user125','ABD1234567',10.00,'2024-11-15 12:43:15','completed','airtime'),(69,'user125','BCA123456',40.00,'2024-11-15 12:43:27','completed','airtime'),(70,'user125','BCA123456',300.00,'2024-11-15 12:43:33','flagged','airtime'),(71,'user126','BCA123456',300.00,'2024-11-15 12:46:55','completed','airtime'),(72,'user126','BCA123456',500.00,'2024-11-15 12:47:06','flagged','payment'),(73,'user126','ABD1234567',50.00,'2024-11-15 12:47:16','completed','payment'),(74,'user126','ABD1234567',500.00,'2024-11-15 12:47:21','flagged','payment'),(75,'user126','BCA123456',450.00,'2024-11-15 12:47:42','completed','electric bill'),(76,'user126','BCA123456',300.00,'2024-11-15 12:47:59','flagged','bill'),(77,'user123','BCC234567890',30.00,'2024-12-20 12:48:52','completed','bill'),(78,'user123','BCA123456',300.00,'2024-12-20 12:49:06','completed','payment'),(79,'user123','BCA123456',500.00,'2024-12-20 12:49:13','flagged','payment'),(80,'user123','ABG1234567',500.00,'2024-12-20 12:49:26','flagged','services'),(81,'user123','ABG1234567',50.00,'2024-12-20 12:50:51','completed','services'),(82,'user123','BCA123456',80.00,'2024-12-20 12:51:18','completed','bill'),(83,'user123','ABG1234567',300.00,'2024-12-20 12:51:32','completed','funds'),(84,'user123','ABG1234567',400.00,'2024-12-20 12:51:39','flagged','funds'),(85,'user124','BCA123456',30.00,'2024-12-20 12:52:05','completed','funds'),(86,'user124','BCA123456',300.00,'2024-12-20 12:52:09','completed','funds'),(87,'user124','BCC234567890',20.00,'2024-12-20 12:52:22','completed','services'),(88,'user124','ABC1234567',500.00,'2024-12-20 12:52:36','flagged','funds'),(89,'user124','ABC1234567',500.00,'2024-12-20 12:52:42','flagged','funds'),(90,'user125','BCA123456',500.00,'2024-12-20 12:58:11','flagged','Transfer to BCA123456'),(91,'user125','BCC234567890',50.00,'2024-12-20 12:58:20','completed','Transfer to BCC234567890'),(92,'user125','ABD1234567',500.00,'2024-12-20 12:58:29','flagged','Transfer to ABD1234567'),(93,'user125','ABG1234567',300.00,'2024-12-20 12:58:42','completed','Transfer to ABG1234567'),(94,'user125','ABG1234567',100.00,'2024-12-20 12:58:57','completed','services'),(95,'user125','BCA123456',10.00,'2024-12-20 12:59:34','completed','airtime'),(96,'user125','BCA123456',400.00,'2024-12-20 12:59:44','completed','airtime'),(97,'user125','ABG1234567',400.00,'2024-12-20 12:59:54','flagged','bill'),(98,'user126','BCA123456',50.00,'2024-12-20 13:00:48','completed','Transfer to BCA123456'),(99,'user126','BCA123456',50.00,'2024-12-20 13:00:50','completed','Transfer to BCA123456'),(100,'user126','ABD1234567',5.00,'2024-12-20 13:01:04','completed','juice'),(101,'user126','ABD1234567',20.00,'2024-12-20 13:01:10','completed','juice'),(102,'user126','BCA123456',20.00,'2024-12-20 13:01:26','completed','bill'),(103,'user126','BCA123456',500.00,'2024-12-20 13:01:37','flagged','services'),(104,'user126','BCC234567890',60.00,'2024-12-20 13:01:55','completed','zesa'),(105,'user126','BCC234567890',55.00,'2024-12-20 13:02:09','completed','parking'),(106,'user126','01234567890',55.00,'2024-12-20 13:02:14','completed','parking'),(107,'user126','01234567890',64.00,'2024-12-20 13:02:41','completed','Transfer to 01234567890'),(108,'user126','ABD1234567',70.00,'2024-12-20 13:02:50','completed','Transfer to ABD1234567'),(109,'user126','BCA123456',7.00,'2024-12-20 13:03:04','completed','Transfer to BCA123456'),(110,'user126','BCC234567890',400.00,'2024-12-20 13:03:32','completed','electric bill'),(111,'user126','AC122345678',100.00,'2025-01-24 13:06:10','completed','Grocery '),(112,'user123','ABC23456147',500.00,'2025-01-25 00:11:14','flagged','Medical bill'),(113,'user125','AWQ23456178',400.00,'2025-01-25 00:13:08','completed','Levy'),(114,'user126','AWQ23456178',30.00,'2025-01-26 21:08:53','completed','Bill'),(115,'user124','CBW2546178532',250.00,'2025-01-26 21:10:00','completed','Rent'),(116,'user123','AEC2345142561',100.00,'2025-01-26 21:10:42','completed','Bill'),(117,'user123','BWA345142561',100.00,'2025-01-28 16:12:27','completed','Bill'),(118,'user124','ATQ27645142561',300.00,'2025-01-28 16:13:16','completed','Bill'),(119,'user125','WTQ27645142561',500.00,'2025-01-28 16:13:54','flagged','Levy'),(120,'user125','WTQ27645142561',500.00,'2025-01-28 16:14:12','flagged','Levy'),(121,'user126','TYW27645142561',500.00,'2025-01-28 16:14:54','flagged','Levy'),(122,'user124','TYW27645142561',250.00,'2025-01-28 16:16:02','completed','Bill'),(123,'user123','AQW645142561',70.00,'2025-01-30 14:01:13','completed','Medical bill'),(124,'user123','AEW2445142561',50.00,'2025-01-30 14:02:03','completed','Bill'),(125,'user123','AEW2445142561',300.00,'2025-01-30 14:03:11','completed','Levy'),(126,'user123','QWT445142561',400.00,'2025-02-15 15:03:21','flagged','bill'),(127,'user124','QRW4452345561',250.00,'2025-02-15 15:04:12','flagged','rent'),(128,'user125','WEW34522345561',5.00,'2025-02-15 15:05:07','completed','airtime'),(129,'user126','TYR4522345561',20.00,'2025-02-15 15:06:14','completed','bill'),(130,'user123','TTW3222345561',500.00,'2025-03-13 12:07:11','flagged','FEES'),(131,'user124','TKD41222345561',50.00,'2025-03-13 12:07:49','completed','Bill'),(132,'user125','RTW43625345561',300.00,'2025-03-13 12:08:21','completed','Bill'),(133,'user126','VWR24364782373',100.00,'2025-03-13 12:09:56','completed','Bill'),(134,'user123','TYR24364782373',75.00,'2025-04-18 12:10:29','completed','Bill'),(135,'user124','WQR364782373',500.00,'2025-04-18 12:11:10','flagged','Medical bill'),(136,'user125','WRR364782373',200.00,'2025-04-18 12:11:53','completed','bill'),(137,'user126','RWR3452364782373',58.00,'2025-04-18 12:12:32','completed','bill');
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
INSERT INTO `users` VALUES ('user123','Anesu Makombe','2025-04-18 12:10:29',2500.00),('user124','Panashe Chasi','2025-04-18 12:11:10',3000.00),('user125','Donald Gumbo','2025-04-18 12:11:53',1800.00),('user126','Sizelenkosi Mpande','2025-04-18 12:12:32',2200.00);
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

-- Dump completed on 2025-05-02 21:07:28
