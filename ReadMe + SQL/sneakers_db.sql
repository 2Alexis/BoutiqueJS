-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 17 juin 2024 à 08:59
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sneakers_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`) VALUES
(12, 19, 1),
(15, 18, 4),
(20, 20, 3),
(23, 21, 3),
(26, 18, 1);

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postalCode` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `address`, `city`, `postalCode`, `country`, `createdAt`, `user_id`) VALUES
(2, 'carambar', 'City', '1122313', 'kenoul', '2024-05-29 07:49:08', 0);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `reduction` int(11) NOT NULL,
  `release_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `sex` enum('Homme','Femme','Mixte') NOT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT NULL,
  `image_urls` text DEFAULT NULL,
  `availability` tinyint(1) GENERATED ALWAYS AS (`quantity` > 0) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `reduction`, `release_date`, `description`, `quantity`, `sex`, `colors`, `sizes`, `image_urls`) VALUES
(1, 'Air Jordan 1 Retro High', 470.00, 0, '2021-03-06', 'La Air Jordan 1 Retro High est un classique de la sneaker culture. Elle est dotée d\'une empeigne en cuir de qualité supérieure avec des couleurs sublimant d\'autant plus la paire.', 31, 'Homme', 'Bleu, Blanc, Noir, Violet', 'EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker1_1.png,sneaker1_2.png,sneaker1_3.png,sneaker1_1_purple.png,sneaker1_2_purple.png,sneaker1_3_purple.png'),
(2, 'Air Force 1 Low White Supreme', 190.00, 14, '2020-03-05', 'La Air Force 1 Low White Supreme est une version emblématique de la sneaker classique d\'Nike. Elle est ornée d\'un logo Supreme sur le talon et d\'une tige en cuir blanc.', 0, 'Homme', 'Blanc', 'EU 39, EU 40, EU 41, EU 42', 'sneaker2_1.png,sneaker2_2.png,sneaker2_3.png'),
(3, 'Air Jordan 4', 330.00, 0, '2021-04-28', 'La Air Jordan 4 est une sneaker rétro qui offre un confort exceptionnel et un style distinctif.', 23, 'Homme', 'Bleu, Blanc, Noir', 'EU 41, EU 42, EU 43, EU 40, EU 44, EU 45', 'sneaker3_1.png,sneaker3_2.png,sneaker3_3.png,sneaker3_1_black.png,sneaker3_2_black.png,sneaker3_3_black.png'),
(4, 'Air max Plus', 170.00, 10, '2021-06-01', 'La Air Max Plus est une sneaker au design futuriste avec une unité Air Max confortable. Elle offre un confort et un style inégalés.', 58, 'Homme', 'Noir, Vert, Rouge', 'EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker4_1.png,sneaker4_2.png,sneaker4_3.png,sneaker4_1_green.png,sneaker4_2_green.png,sneaker4_3_green.png,sneaker4_1_red.png,sneaker4_2_red.png,sneaker4_3_red.png'),
(5, 'Nike Air More Uptempo Peace & Love', 160.00, 10, '2021-02-15', 'La Nike Air More Uptempo Peace & Love est une sneaker audacieuse avec un design imprimé coloré. Elle offre un amorti Air-Sol pour un confort toute la journée.', 20, 'Mixte', 'Multicolore, Blanc, Rouge', 'EU 37, EU 38, EU 39, EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker5_1.png,sneaker5_2.png,sneaker5_3.png,sneaker5_1_red.png,sneaker5_2_red.png,sneaker5_3_red.png'),
(6, 'Dunk Low Disrupt ', 210.00, 0, '2021-08-23', 'La Dunk Low Disrupt est une sneaker à la mode avec une silhouette inspirée du basketball. Elle présente une combinaison de couleurs claires et une semelle extérieure épaisse pour un style unique.', 35, 'Femme', 'Blanc, Gris, Beige', 'EU 36, EU 37, EU 38, EU 39, EU 40', 'sneaker6_1.png,sneaker6_2.png,sneaker6_3.png,sneaker6_1_grey.png,sneaker6_2_grey.png,sneaker6_3_grey.png'),
(7, 'SB Dunk Low Pro', 240.00, 15, '2021-12-13', 'La SB Dunk Low Pro est une sneaker de skateboard avec une tige en daim de qualité supérieure et une semelle extérieure en caoutchouc adhérente. Elle offre un style et une performance exceptionnels.', 24, 'Mixte', 'Gris, Noir, Bleu, Vert', 'EU 39, EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker7_1.png,sneaker7_2.png,sneaker7_3.png,sneaker7_1_blue.png,sneaker7_2_blue.png,sneaker7_3_blue.png'),
(8, 'Air Force 1 Low Metallic', 180.00, 0, '2021-02-15', 'La Air Force 1 Low Metallic est une sneaker avec une finition métallique audacieuse. Elle offre un confort et un style intemporel, parfait pour toutes les occasions.', 40, 'Homme', 'Argent, Or', 'EU 41, EU 42, EU 43, EU 44, EU 37, EU 38, EU 39, EU 40, EU 45', 'sneaker8_1.png,sneaker8_2.png,sneaker8_3.png,sneaker8_1_gold.png,sneaker8_2_gold.png,sneaker8_3_gold.png'),
(9, 'Air Force 1 Low 07 LV8 Lakers', 180.00, 5, '2021-10-08', 'La Air Force 1 Low 07 LV8 Lakers est une sneaker avec des accents de couleurs vives inspirés des Los Angeles Lakers. Elle offre un amorti Air-Sole et une traction durable pour un confort et une performance exceptionnels.', 30, 'Homme', 'Jaune, Violet, Bleu', 'EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker9_1.png,sneaker9_2.png,sneaker9_3.png,sneaker9_1_yellow.png,sneaker9_2_yellow.png,sneaker9_3_yellow.png'),
(10, 'Air Jordan 4 Retro Kaws', 2380.00, 12, '2017-03-31', 'La Air Jordan 4 Retro Kaws est une sneaker de collection avec un design collaboratif unique. Elle présente une empeigne en suède de qualité supérieure avec des détails artistiques distinctifs.', 19, 'Mixte', 'Gris, Noir', 'EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker10_1.png,sneaker10_2.png,sneaker10_3.png,sneaker10_1_black.png,sneaker10_2_black.png,sneaker10_3_black.png'),
(11, 'Nike Air Force 1 Luxe', 139.99, 10, '2023-05-01', 'Le charme continue d\'opérer avec la Nike Air Force 1 Luxe. Cette silhouette classique du basketball revisite ses éléments les plus célèbres : les renforts cousus, les couleurs audacieuses et juste ce qu\'il faut d\'éclat pour vous faire briller.', 50, 'Homme', 'Beige, Blanc, Gris', 'EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker11_1.png,sneaker11_2.png,sneaker11_3.png,sneaker11_1_beige.png,sneaker11_2_beige.png,sneaker11_3_beige.png'),
(12, 'Jordan Stadium 90', 139.99, 20, '2023-03-15', 'Le confort est roi, mais pas au détriment du style. S\'inspirant de la AJ1 et de la AJ5, la Stadium 90 est parfaite pour le quotidien. L\'empeigne en cuir et tissus tissés aérés est respirable et résistante. Découvre l\'alliance idéale de la pointe de la AJ1 et les flammes de la AJ5. L\'amorti Nike Air est aussi confortable que stylé.', 30, 'Homme', 'Marron, Beige, Blanc, Bleu', 'EU 39, EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker12_1.png,sneaker12_2.png,sneaker12_3.png,sneaker12_1_blue.png,sneaker12_2_blue.png,sneaker12_3_blue.png'),
(13, 'Nike Air Max Dn', 169.99, 0, '2024-04-20', 'Découvre la technologie Air nouvelle génération. La Air Max Dn intègre l’unité Dynamic Air (composée de quatre cylindres) qui te propulse à chaque pas, pour une sensation de fluidité incroyable. Résultat ? Un look futuriste hyper confortable, à porter de jour comme de nuit. Et des sensations irréelles.', 57, 'Mixte', 'Violet, Blanc, Rose, Bleu, Gris', 'EU 36, EU 37, EU 38, EU 39, EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker13_1.png,sneaker13_2.png,sneaker13_3.png,sneaker13_1_blue.png,sneaker13_2_blue.png,sneaker13_3_blue.png,sneaker13_1_white.png,sneaker13_2_white.png,sneaker13_3_white.png'),
(14, 'Air Jordan 1 Elevate Low', 149.99, 20, '2024-04-20', 'Soyez stylée dans toutes les situations. Cette chaussure revisite le modèle légendaire avec une semelle compensée et une coupe basse. L\'amorti Air vous permet de profiter d\'un rebond incroyable, tandis que le cuir élégant aux couleurs contrastées apporte une touche d\'originalité.', 42, 'Femme', 'Blanc, Vert', 'EU 36, EU 37, EU 38, EU 39, EU 40, EU 41', 'sneaker14_1.png,sneaker14_2.png,sneaker14_3.png,sneaker14_1_green.png,sneaker14_2_green.png,sneaker14_3_green.png'),
(15, 'Air Jordan 1 Brooklyn', 149.99, 10, '2024-04-20', 'Parée au décollage. Originale et robuste, cette chaussure va devenir un must de ta garde-robe. Le cuir pleine fleur haut de gamme et la semelle compensée épaisse boostent ton style perso. Les ergots surdimensionnés de la semelle extérieure et l\'amorti Nike Air accompagnent chacun de tes pas. Et on n\'a pas oublié l\'ADN de la AJ1 : le losange au talon affiche le logo Jumpman, pour un look ancré dans l\'histoire du basket.', 31, 'Femme', 'Blanc, Noir', 'EU 36, EU 37, EU 38, EU 39, EU 40, EU 41', 'sneaker15_1.png,sneaker15_2.png,sneaker15_3.png,sneaker15_1_black.png,sneaker15_2_black.png,sneaker15_3_black.png'),
(16, 'Nike Dunk Low Premium', 129.99, 22, '2024-04-20', 'L\'icône des années 80 revient avec des détails cultes et un style basket rétro. Le style vintage débarque dans ton quotidien. Avec son col rembourré, tu peux la porter partout, dans le plus grand confort.', 19, 'Femme', 'Blanc, Jaune, Violet, Marron, Gris', 'EU 36, EU 37, EU 38, EU 39, EU 40', 'sneaker16_1.png,sneaker16_2.png,sneaker16_3.png,sneaker16_1_grey.png,sneaker16_2_grey.png,sneaker16_3_grey.png'),
(17, 'Nike Metcon 9 Premium', 144.99, 0, '2024-04-20', 'Quelle que soit ta raison de t\'entraîner, la Metcon 9 t\'aide à aller plus loin. Avec sa nouvelle plaque Hyperlift plus large et un renfort en caoutchouc pour monter à la corde, elle est encore meilleure que la Metcon 8. Validée par les plus célèbres athlètes du monde, idéale pour les fans de muscu, de cross-training et les personnes qui visent haut, c\'est la référence absolue pour les performances quotidiennes.', 19, 'Femme', 'Blanc, Beige, Doré, Vert, Jaune', 'EU 36, EU 37, EU 38, EU 39, EU 40, EU 41, EU 42, EU 43, EU 44, EU 45', 'sneaker17_1.png,sneaker17_2.png,sneaker17_3.png,sneaker17_1_grey.png,sneaker17_2_grey.png,sneaker17_3_grey.png'),
(18, 'Nike Motiva', 109.99, 0, '2024-04-20', 'La Nike Motiva est ton alliée idéale pour franchir tous les obstacles sur ton chemin à ton propre rythme. Semelle extérieure dotée d\'un motif unique et silhouette oversize : cette chaussure t\'offre une foulée ultra-souple avec un amorti et un confort exceptionnels. Tu profites donc d\'un confort optimal pour marcher, courir et pratiquer tes activités préférées en toute confiance. Cette chaussure t\'offre un maintien optimal à chaque pas, chaque jour.', 24, 'Femme', 'Blanc, Beige, Doré, Vert, Rose', 'EU 36, EU 37, EU 38, EU 39, EU 40, EU 41', 'sneaker18_1.png,sneaker18_2.png,sneaker18_3.png,sneaker18_1_pink.png,sneaker18_2_pink.png,sneaker18_3_pink.png'),
(19, 'Nike Blazer Mid ‘77', 109.99, 17, '2024-04-20', 'Imaginée dans les années 70. Adoptée par les années 80. Devenue culte dans les années 90. Prête pour la suite. La Blazer Mid \'77 présente un design intemporel et facile à porter. Son empeigne impeccable s\'associe à un logo rétro audacieux et à des détails en daim pour un confort premium. La mousse visible sur la languette et la finition spéciale sur la semelle intermédiaire donnent l\'impression que tu as conservé tes sneakers depuis des décennies. N\'attends plus et entre dans l\'histoire.', 44, 'Femme', 'Beige, Blanc, Rouge, Bleu', 'EU 36, EU 37, EU 38, EU 39, EU 40, EU 41, EU 42, EU 43', 'sneaker19_1.png,sneaker19_2.png,sneaker19_3.png,sneaker19_1_blue.png,sneaker19_2_blue.png,sneaker19_3_blue.png'),
(20, 'Nike Air Max Pulse', 159.99, 20, '2023-03-15', 'Fidèle à elle-même, la Air Max Pulse s\'inspire de la scène musicale londonienne pour apporter une touche underground à l\'emblématique gamme Air Max. Sa semelle intermédiaire enveloppée de tissu et ses détails sous vide lui confèrent un look épuré. Et les couleurs inspirées de la scène musicale londonienne subliment le tout. L\'amorti Air en forme de pointe, inspiré de la Air Max 270 incroyablement confortable, fait mieux rebondir le pied pour te permettre de repousser tes limites.', 30, 'Femme', 'Gris, Blanc, Rose, Jaune', 'EU 36, EU 37, EU 38, EU 39, EU 40, EU 41', 'sneaker20_1.png,sneaker20_2.png,sneaker20_3.png,sneaker20_1_yellow.png,sneaker20_2_yellow.png,sneaker20_3_yellow.png'),
(21, 'Nike Tech Hera', 109.99, 20, '2024-05-01', 'Tu cherches une sneaker imposante ? Opte pour la Tech Hera, une chaussure inspirée du running du début des années 2000. La semelle intermédiaire ondulée surélevée et les détails en daim te font gagner de la hauteur dans un confort absolu. La conception résiste à merveille au quotidien. Et ça tombe bien, car tu voudras certainement porter ce modèle tous les jours.', 50, 'Femme', 'Blanc, Beige, Gris', 'EU 37, EU 38, EU 39, EU 40, EU 41, EU 42, EU 43', 'sneaker21_1.png,sneaker21_2.png,sneaker21_3.png,sneaker21_1_grey.png,sneaker21_2_grey.png,sneaker21_3_grey.png');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(18, 'Alew', 'testuser@example.com', '$2b$10$h7Z/2ULcsQRkHttXd1ww8uQXB/Z7/y4k51.x2DO.kpXCFcVNyW9oG', '2024-05-31 08:53:30'),
(19, 'AAA', 'testuser2@example.com', '$2b$10$.2eaNfz2PoL6k8OyShiLWOFjtq5H.mk96eA.I9V6ugE19x2yvWBAK', '2024-05-31 08:55:13'),
(20, 'Testing', 'testuser@gmail.com', '$2b$10$U2u0si11oBjFnaZROWoXtuAK2Qv23nVlQiHqlKxWjeShnQve5GFI.', '2024-06-13 07:39:39'),
(21, 'Testing1', 'testuser1@gmail.com', '$2b$10$cj26JqB.08WcIh9bQPi2yeMXKKgf2box/7we.lRMjHL8JkJLhxXXW', '2024-06-13 07:51:43');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
