/*
Navicat MySQL Data Transfer

Source Server         : database
Source Server Version : 50519
Source Host           : localhost:3306
Source Database       : threepigs

Target Server Type    : MYSQL
Target Server Version : 50519
File Encoding         : 65001

Date: 2014-09-12 10:32:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `tbl_comment`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_comment`;
CREATE TABLE `tbl_comment` (
  `commId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `commDate` date NOT NULL COMMENT '评论时间',
  `commContent` text NOT NULL COMMENT '评论内容',
  `peopId` int(10) unsigned NOT NULL COMMENT '评论人ID',
  `fileId` int(10) unsigned NOT NULL COMMENT '文件ID',
  PRIMARY KEY (`commId`),
  KEY `peopId` (`peopId`),
  KEY `fileId` (`fileId`),
  CONSTRAINT `tbl_comment_ibfk_2` FOREIGN KEY (`fileId`) REFERENCES `tbl_file` (`fileId`),
  CONSTRAINT `tbl_comment_ibfk_1` FOREIGN KEY (`peopId`) REFERENCES `tbl_people` (`peopId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_comment
-- ----------------------------
INSERT INTO `tbl_comment` VALUES ('1', '2014-09-02', '再也不用担心高数挂科了', '3', '1');
INSERT INTO `tbl_comment` VALUES ('2', '2014-09-01', '再也不用担心数据结构挂科了', '3', '2');
INSERT INTO `tbl_comment` VALUES ('3', '2014-09-02', '再也不用担心高数挂科了', '3', '1');
INSERT INTO `tbl_comment` VALUES ('4', '2014-09-01', '再也不用担心数据结构挂科了', '3', '2');
INSERT INTO `tbl_comment` VALUES ('5', '2014-09-02', '再也不用担心高数挂科了', '3', '1');
INSERT INTO `tbl_comment` VALUES ('6', '2014-09-01', '再也不用担心数据结构挂科了', '3', '2');
INSERT INTO `tbl_comment` VALUES ('7', '2014-09-02', '再也不用担心高数挂科了', '3', '1');
INSERT INTO `tbl_comment` VALUES ('8', '2014-09-01', '再也不用担心数据结构挂科了', '3', '2');
INSERT INTO `tbl_comment` VALUES ('9', '2014-09-02', '再也不用担心高数挂科了', '3', '1');
INSERT INTO `tbl_comment` VALUES ('10', '2014-09-01', '再也不用担心数据结构挂科了', '3', '2');

-- ----------------------------
-- Table structure for `tbl_file`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_file`;
CREATE TABLE `tbl_file` (
  `fileId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '资料ID',
  `fileName` varchar(100) NOT NULL COMMENT '资料名',
  `fileType` varchar(100) NOT NULL COMMENT '资料类型',
  `fileUploadDate` date NOT NULL COMMENT '上传时间',
  `fileDescription` text NOT NULL COMMENT '资料描述',
  `fileLoaction` varchar(200) NOT NULL COMMENT '资料地址',
  `fileTimes` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '下载次数',
  `peopId` int(10) unsigned NOT NULL COMMENT '上传者ID',
  PRIMARY KEY (`fileId`),
  KEY `peopId` (`peopId`),
  CONSTRAINT `tbl_file_ibfk_1` FOREIGN KEY (`peopId`) REFERENCES `tbl_people` (`peopId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_file
-- ----------------------------
INSERT INTO `tbl_file` VALUES ('1', '高数下', '高数', '2014-09-02', '高数课本', '?', '0', '1');
INSERT INTO `tbl_file` VALUES ('2', '数据结构资料', '软件', '2014-08-31', '数据结构2015考题', '?', '0', '2');
INSERT INTO `tbl_file` VALUES ('3', '高数下', '高数', '2014-09-02', '高数课本', '?', '0', '1');
INSERT INTO `tbl_file` VALUES ('4', '数据结构资料', '软件', '2014-08-31', '数据结构2015考题', '?', '0', '2');
INSERT INTO `tbl_file` VALUES ('5', '高数下', '高数', '2014-09-02', '高数课本', '?', '0', '1');
INSERT INTO `tbl_file` VALUES ('6', '数据结构资料', '软件', '2014-08-31', '数据结构2015考题', '?', '0', '2');
INSERT INTO `tbl_file` VALUES ('7', '高数下', '高数', '2014-09-02', '高数课本', '?', '0', '1');
INSERT INTO `tbl_file` VALUES ('8', '数据结构资料', '软件', '2014-08-31', '数据结构2015考题', '?', '0', '2');
INSERT INTO `tbl_file` VALUES ('9', '高数下', '高数', '2014-09-02', '高数课本', '?', '0', '1');
INSERT INTO `tbl_file` VALUES ('10', '数据结构资料', '软件', '2014-08-31', '数据结构2015考题', '?', '0', '2');

-- ----------------------------
-- Table structure for `tbl_people`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_people`;
CREATE TABLE `tbl_people` (
  `peopId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `peopName` varchar(100) DEFAULT NULL COMMENT '姓名',
  `peopAge` int(10) unsigned DEFAULT NULL COMMENT '年龄',
  `peopSex` varchar(100) DEFAULT NULL COMMENT '性别',
  `peopEmail` varchar(100) DEFAULT NULL COMMENT '邮件',
  `peopTel` varchar(100) DEFAULT NULL COMMENT '联系方式',
  `peopQq` varchar(100) DEFAULT NULL COMMENT 'QQ',
  `peopBirthday` date DEFAULT NULL COMMENT '生日',
  PRIMARY KEY (`peopId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_people
-- ----------------------------
INSERT INTO `tbl_people` VALUES ('1', '陈毅', '20', '男', '495176533@qq.com', '13000000000', '495176533', '2014-09-01');
INSERT INTO `tbl_people` VALUES ('2', '谢明添', '20', '男', '1234567890@qq.com', '12000000000', '1234567890', '2014-08-31');
INSERT INTO `tbl_people` VALUES ('3', '聂佳俊', '20', '男', '0987654321@qq,com', '11000000000', '0987654321', '2014-08-06');
INSERT INTO `tbl_people` VALUES ('4', '代慧敏', '20', '女', '1029384756@sina.com', '10000000000', '1029384756', '2014-08-04');
INSERT INTO `tbl_people` VALUES ('5', '陈毅', '20', '男', '495176533@qq.com', '13000000000', '495176533', '2014-09-01');
INSERT INTO `tbl_people` VALUES ('6', '谢明添', '20', '男', '1234567890@qq.com', '12000000000', '1234567890', '2014-08-31');
INSERT INTO `tbl_people` VALUES ('7', '聂佳俊', '20', '男', '0987654321@qq,com', '11000000000', '0987654321', '2014-08-06');
INSERT INTO `tbl_people` VALUES ('8', '代慧敏', '20', '女', '1029384756@sina.com', '10000000000', '1029384756', '2014-08-04');

-- ----------------------------
-- Table structure for `tbl_peopleroom`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_peopleroom`;
CREATE TABLE `tbl_peopleroom` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '人员房间ID',
  `peopId` int(10) unsigned NOT NULL COMMENT '人员ID',
  `roomId` int(10) unsigned NOT NULL COMMENT '房间ID',
  PRIMARY KEY (`id`),
  KEY `peopId` (`peopId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `tbl_peopleroom_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `tbl_room` (`roomId`),
  CONSTRAINT `tbl_peopleroom_ibfk_1` FOREIGN KEY (`peopId`) REFERENCES `tbl_people` (`peopId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_peopleroom
-- ----------------------------
INSERT INTO `tbl_peopleroom` VALUES ('1', '3', '1');
INSERT INTO `tbl_peopleroom` VALUES ('2', '4', '1');
INSERT INTO `tbl_peopleroom` VALUES ('3', '3', '1');
INSERT INTO `tbl_peopleroom` VALUES ('4', '4', '1');
INSERT INTO `tbl_peopleroom` VALUES ('5', '3', '1');
INSERT INTO `tbl_peopleroom` VALUES ('6', '4', '1');
INSERT INTO `tbl_peopleroom` VALUES ('7', '3', '1');
INSERT INTO `tbl_peopleroom` VALUES ('8', '4', '1');
INSERT INTO `tbl_peopleroom` VALUES ('9', '3', '1');
INSERT INTO `tbl_peopleroom` VALUES ('10', '4', '1');


-- ----------------------------
-- Table structure for `tbl_prompt`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_prompt`;
CREATE TABLE `tbl_prompt` (
  `promId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '通知',
  `promContent` text COMMENT '通知信息',
  `peopleId` int(10) unsigned NOT NULL COMMENT '发送人ID',
  `toPeopleId` int(10) unsigned NOT NULL COMMENT '收到通知人ID',
  `statId` int(10) unsigned NOT NULL COMMENT '通知状态ID',
  PRIMARY KEY (`promId`),
  KEY `peopleId` (`peopleId`),
  KEY `toPeopleId` (`toPeopleId`),
  KEY `statId` (`statId`),
  CONSTRAINT `tbl_prompt_ibfk_3` FOREIGN KEY (`statId`) REFERENCES `tbl_status` (`statId`),
  CONSTRAINT `tbl_prompt_ibfk_1` FOREIGN KEY (`peopleId`) REFERENCES `tbl_people` (`peopId`),
  CONSTRAINT `tbl_prompt_ibfk_2` FOREIGN KEY (`toPeopleId`) REFERENCES `tbl_people` (`peopId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_prompt
-- ----------------------------
INSERT INTO `tbl_prompt` VALUES ('1', '快来陪我学高数', '3', '4', '1');
INSERT INTO `tbl_prompt` VALUES ('2', '快来陪我学高数', '3', '4', '1');

INSERT INTO `tbl_prompt` VALUES ('3', '快来陪我学高数', '3', '4', '1');

INSERT INTO `tbl_prompt` VALUES ('4', '快来陪我学高数', '3', '4', '1');

INSERT INTO `tbl_prompt` VALUES ('5', '快来陪我学高数', '3', '4', '1');

INSERT INTO `tbl_prompt` VALUES ('6', '快来陪我学高数', '3', '4', '1');

INSERT INTO `tbl_prompt` VALUES ('7', '快来陪我学高数', '3', '4', '1');

INSERT INTO `tbl_prompt` VALUES ('8', '快来陪我学高数', '3', '4', '1');

INSERT INTO `tbl_prompt` VALUES ('9', '快来陪我学高数', '3', '4', '1');


-- ----------------------------
-- Table structure for `tbl_room`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_room`;
CREATE TABLE `tbl_room` (
  `roomId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `roomName` varchar(100) NOT NULL COMMENT '房间名',
  `roomDescription` varchar(200) DEFAULT NULL COMMENT '房间描述',
  `roomDate` datetime NOT NULL COMMENT '房间创建时间',
  PRIMARY KEY (`roomId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_room
-- ----------------------------
INSERT INTO `tbl_room` VALUES ('1', '高数复习专用', '代导在这里悄悄的交聂神高数', '2014-09-02 10:24:57');
INSERT INTO `tbl_room` VALUES ('2', '高大上知识学习专用', null, '2014-09-01 10:25:20');
INSERT INTO `tbl_room` VALUES ('3', '高数复习专用', '代导在这里悄悄的交聂神高数', '2014-09-02 10:24:57');
INSERT INTO `tbl_room` VALUES ('4', '高大上知识学习专用', null, '2014-09-01 10:25:20');
INSERT INTO `tbl_room` VALUES ('5', '高数复习专用', '代导在这里悄悄的交聂神高数', '2014-09-02 10:24:57');
INSERT INTO `tbl_room` VALUES ('6', '高大上知识学习专用', null, '2014-09-01 10:25:20');
INSERT INTO `tbl_room` VALUES ('7', '高数复习专用', '代导在这里悄悄的交聂神高数', '2014-09-02 10:24:57');
INSERT INTO `tbl_room` VALUES ('8', '高大上知识学习专用', null, '2014-09-01 10:25:20');
INSERT INTO `tbl_room` VALUES ('9', '高数复习专用', '代导在这里悄悄的交聂神高数', '2014-09-02 10:24:57');
INSERT INTO `tbl_room` VALUES ('10', '高大上知识学习专用', null, '2014-09-01 10:25:20');

-- ----------------------------
-- Table structure for `tbl_status`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_status`;
CREATE TABLE `tbl_status` (
  `statId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '状态ID',
  `statDescription` varchar(100) NOT NULL COMMENT '通知状态',
  PRIMARY KEY (`statId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_status
-- ----------------------------
INSERT INTO `tbl_status` VALUES ('1', '未读');
INSERT INTO `tbl_status` VALUES ('2', '已读');
INSERT INTO `tbl_status` VALUES ('3', '删除');
INSERT INTO `tbl_status` VALUES ('4', '超时');

-- ----------------------------
-- Table structure for `tbl_user`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE `tbl_user` (
  `userId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '帐号信息',
  `userAccount` varchar(100) NOT NULL COMMENT '登录帐号',
  `userPass` varchar(100) NOT NULL COMMENT '登录密码',
  `peopId` int(10) unsigned NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`userId`),
  KEY `peopId` (`peopId`),
  CONSTRAINT `tbl_user_ibfk_1` FOREIGN KEY (`peopId`) REFERENCES `tbl_people` (`peopId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_user
-- ----------------------------
INSERT INTO `tbl_user` VALUES ('1', 'root', 'root', '1');
INSERT INTO `tbl_user` VALUES ('2', 'admin', 'admin', '2');
INSERT INTO `tbl_user` VALUES ('3', '123', '123', '3');
INSERT INTO `tbl_user` VALUES ('4', 'aa', '123', '4');
