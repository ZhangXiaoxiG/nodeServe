/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80025
 Source Host           : 127.0.0.1:3306
 Source Schema         : baby

 Target Server Type    : MySQL
 Target Server Version : 80025
 File Encoding         : 65001

 Date: 12/03/2022 11:06:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for role_tbl
-- ----------------------------
DROP TABLE IF EXISTS `role_tbl`;
CREATE TABLE `role_tbl` (
                            `ID` int NOT NULL AUTO_INCREMENT COMMENT '主键id',
                            `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            `role_name` varchar(100) NOT NULL COMMENT '角色名',
                            `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户id',
                            PRIMARY KEY (`ID`),
                            KEY `bind_user_id` (`user_id`),
                            CONSTRAINT `bind_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_tbl` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of role_tbl
-- ----------------------------
BEGIN;
INSERT INTO `role_tbl` VALUES (2, '2022-03-11 16:20:00', '2022-03-11 16:20:00', '超级管理员', 'b4826f6e-6cdf-41e6-b35c-b1bce28f71df');
COMMIT;

-- ----------------------------
-- Table structure for user_relevance_role
-- ----------------------------
DROP TABLE IF EXISTS `user_relevance_role`;
CREATE TABLE `user_relevance_role` (
                                       `ID` int NOT NULL AUTO_INCREMENT COMMENT '主键id',
                                       `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                       `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                       `user_id` varchar(100) NOT NULL COMMENT '用户id',
                                       `role_id` int NOT NULL COMMENT '角色id',
                                       `parent_id` varchar(100) DEFAULT NULL,
                                       PRIMARY KEY (`ID`),
                                       KEY `user_relevance` (`user_id`),
                                       KEY `role_relevance` (`role_id`),
                                       CONSTRAINT `role_relevance` FOREIGN KEY (`role_id`) REFERENCES `role_tbl` (`ID`),
                                       CONSTRAINT `user_relevance` FOREIGN KEY (`user_id`) REFERENCES `user_tbl` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_relevance_role
-- ----------------------------
BEGIN;
INSERT INTO `user_relevance_role` VALUES (3, '2022-03-11 16:21:29', '2022-03-11 16:21:29', 'b4826f6e-6cdf-41e6-b35c-b1bce28f71df', 2, NULL);
COMMIT;

-- ----------------------------
-- Table structure for user_tbl
-- ----------------------------
DROP TABLE IF EXISTS `user_tbl`;
CREATE TABLE `user_tbl` (
                            `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
                            `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
                            `ID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ID',
                            `account` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '账号',
                            `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            `parent_id` varchar(100) DEFAULT NULL,
                            PRIMARY KEY (`account`) USING BTREE,
                            KEY `ID` (`ID`),
                            KEY `username` (`username`,`ID`),
                            KEY `ID_2` (`ID`,`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_tbl
-- ----------------------------
BEGIN;
INSERT INTO `user_tbl` VALUES ('张小溪', 'e10adc3949ba59abbe56e057f20f883e', 'b4826f6e-6cdf-41e6-b35c-b1bce28f71df', '15313278953', '2022-03-11 14:16:40', '2022-03-11 14:20:03', NULL);
INSERT INTO `user_tbl` VALUES ('张小溪', 'e10adc3949ba59abbe56e057f20f883e', 'a056f9b0-3bf2-445b-8b6a-befaf5b0038d', '18313278917', '2022-03-11 15:37:53', '2022-03-11 15:37:53', 'b4826f6e-6cdf-41e6-b35c-b1bce28f71df');
INSERT INTO `user_tbl` VALUES ('张小溪', 'e10adc3949ba59abbe56e057f20f883e', 'f0b4dbf5-fc4a-473c-8ad3-5bdf64c975ca', '18313278933', '2022-03-11 16:23:13', '2022-03-11 16:23:13', 'b4826f6e-6cdf-41e6-b35c-b1bce28f71df');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
