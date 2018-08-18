-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `auth_token` varchar(128) NOT NULL,
  PRIMARY KEY (`auth_token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `displayname` varchar(128) NOT NULL,
  `category` varchar(128) NOT NULL,
  `invitation_code` varchar(128) NOT NULL,
  `event_time` datetime NOT NULL,
  `creator` varchar(128) NOT NULL,
  `output-cache` text NOT NULL,
  PRIMARY KEY (`invitation_code`),
  KEY `creator` (`creator`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `client` (`auth_token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `participation`;
CREATE TABLE `participation` (
  `client` varchar(128) NOT NULL,
  `event` varchar(128) NOT NULL,
  `location` varchar(128) NOT NULL,
  `displayname` varchar(128) NOT NULL,
  PRIMARY KEY (`client`,`event`),
  KEY `event` (`event`),
  CONSTRAINT `participation_ibfk_1` FOREIGN KEY (`client`) REFERENCES `client` (`auth_token`),
  CONSTRAINT `participation_ibfk_2` FOREIGN KEY (`event`) REFERENCES `event` (`invitation_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- 2018-08-18 21:31:02
