/**
 * 权限常量类（这是从数据库内复制出来的，目的是做一个常量，以防数据库内容发生改变的时候，只需修改这里即可）
 * Created by wuyaoqian on 14/9/23.
 */

"use strict";

module.exports = {
    // 1.  普通用户（可创建的主题数为20个（可定义），等其他权限）
    "ROLE_COMMONUSER": "ROLE_COMMONUSER",
    // 2.  VIP用户（可创建的主题数为50个（可定义），等其他权限）
    "ROLE_VIPUSER": "ROLE_VIPUSER",
    // 3.  试用用户（可创建的主题数为5个（可定义），等其他权限）
    "ROLE_PROBATIONUSER": "ROLE_PROBATIONUSER",
    // 4. 不限制用于创建主题数
    "ROLE_TOPIC_UNLIMIT": "ROLE_TOPIC_UNLIMIT",

    // 5.  系统管理（使用用户和权限管理、词典管理、其他管理等后台管理的必须权限）
    "ROLE_SYSTEM_MANAGE": "ROLE_SYSTEM_MANAGE",
    // 6.  用户管理（包括账号的管理权限）
    "ROLE_USER_MANAGE": "ROLE_USER_MANAGE",
    // 7.  权限管理（包括用户组管理等）
    "ROLE_POWER_GROUP_MANAGE": "ROLE_POWER_GROUP_MANAGE",
    // 8.  在线用户管理（包括对在线用户的管理等）
    "ROLE_ONLINE_USER_MANAGE": "ROLE_ONLINE_USER_MANAGE",
    // 9.  日志管理（包括对用户日志信息管理等）
    "ROLE_USER_LOG_MANAGE": "ROLE_USER_LOG_MANAGE",

    // 10. 查看用户登录情况
    "ROLE_VIEW_USER_LOGIN_STATUS": "ROLE_VIEW_USER_LOGIN_STATUS",
    // 11. 查看长期未登录的用户
    "ROLE_VIEW_LONG_TIME_NOT_LOGGED_IN": "ROLE_VIEW_LONG_TIME_NOT_LOGGED_IN",
    // 12. 查看一周内即将到期的用户
    "ROLE_VIEW_DUE_WITHIN_A_WEEK": "ROLE_VIEW_DUE_WITHIN_A_WEEK",

    // 13. 用户是否具有查询境外数据的权限
    "ROLE_QUERYJWDOCUMENT": "ROLE_QUERYJWDOCUMENT",
    // 14. 用户是否具有查询系统全部文档的权限（关键字*:*）
    "ROLE_QUERYALLDOCUMENT": "ROLE_QUERYALLDOCUMENT",

    // 15. 在线代理的权限（有改权限后，则我们的境外数据能直接点击翻墙显示，否则显示原始链接）
    "ROLE_ONLINE_PROXY": "ROLE_ONLINE_PROXY",
    // 16. 是否为客服人员（具有客服反馈权限）
    "ROLE_LIVE_HELP": "ROLE_LIVE_HELP"
};
