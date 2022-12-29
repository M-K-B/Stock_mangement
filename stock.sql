CREATE TABLE IF NOT EXISTS `accounts` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `user` varchar(25) NOT NULL,
  `pass` varchar(50) NOT NULL
);

CREATE TABLE `stock` (
  `id`  mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `creator` mediumint UNSIGNED,
  `barcode` bigint UNSIGNED NOT NULL,
  `name` varchar(30),
  `photo` varchar(30),
  `Aisle` mediumint UNSIGNED NOT NULL,
  `Location` mediumint UNSIGNED NOT NULL,
  `retail` mediumint UNSIGNED NOT NULL,
  `quanity` mediumint UNSIGNED NOT NULL,
  `added` datetime
);

ALTER TABLE `stock` ADD FOREIGN KEY (`creator`) REFERENCES `accounts` (`id`);
