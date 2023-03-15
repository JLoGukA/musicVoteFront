-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: st
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `id` varchar(10) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `file` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES ('21','192.168.3.61','/System Volume Information/WPSettings.dat'),('21','192.168.3.61','/System Volume Information/IndexerVolumeGuid'),('21','192.168.3.61','/001 Imagine Dragons - Believer.mp3'),('21','192.168.3.61','/002 Billie Eilish - bad guy.mp3'),('21','192.168.3.61','/003 System of a Down - Lonely Day.mp3'),('21','192.168.3.61','/004 Op Tokyo Ghoul - Unravel.mp3'),('21','192.168.3.61','/005 Eagles - Hotel California.mp3'),('21','192.168.3.61','/006 ╨ô╨╛╤Ç╨╜ ╨¥╨░ ╨╛╨▒╨╡╨┤.mp3'),('21','192.168.3.61','/MP3/songs.txt'),('21','192.168.3.61','/MP3/0001.mp3'),('21','192.168.3.61','/MP3/0002.mp3'),('21','192.168.3.61','/MP3/0003.mp3'),('21','192.168.3.61','/MP3/0004.mp3'),('21','192.168.3.61','/MP3/0005.mp3'),('21','192.168.3.61','/MP3/0006.mp3'),('15','192.168.8.8','/opo'),('15','192.168.8.8','/File.txt'),('15','192.168.8.8','/win.png');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedul`
--

DROP TABLE IF EXISTS `schedul`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedul` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timebegin` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedul`
--

LOCK TABLES `schedul` WRITE;
/*!40000 ALTER TABLE `schedul` DISABLE KEYS */;
INSERT INTO `schedul` VALUES (1,'10:15:00'),(2,'12:00:00'),(3,'14:25:00'),(4,'16:10:00'),(5,'17:55:00'),(6,'19:35:00');
/*!40000 ALTER TABLE `schedul` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `st`
--

DROP TABLE IF EXISTS `st`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `st` (
  `id` int NOT NULL AUTO_INCREMENT,
  `votes` int DEFAULT NULL,
  `music` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `st`
--

LOCK TABLES `st` WRITE;
/*!40000 ALTER TABLE `st` DISABLE KEYS */;
INSERT INTO `st` VALUES (1,4,'Bones'),(2,1,'Earphones'),(3,1,'Mouse'),(4,0,'A Glass'),(5,0,'Teapot');
/*!40000 ALTER TABLE `st` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `login` varchar(8) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('root','good');
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

-- Dump completed on 2023-03-15 13:20:51
