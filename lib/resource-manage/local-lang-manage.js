/**
 * 国际化语言管理类
 * Created by wuyaoqian on 14/9/24.
 */

"use strict";

var fs = require("fs");
var langFileBasePath = process.cwd() + "/config/local-lang", langFileRelativedBasePath = "../../config/local-lang";
var localLangs = {};
var supported = {
    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW",
    "en": "en"
}, supportedArray = Object.keys(supported), relatived = {
    "zh": "zh-CN"
}, isJSFile = /\.js$/i;

var LocalLangManage = {
    /**
     * 初始化 国际化语言对象
     */
    init: function () {
        var lang;
        // 加载数据
        fs.readdirSync(langFileBasePath).forEach(function (moduleName) {
            if (fs.lstatSync(langFileBasePath + "/" + moduleName).isDirectory()) {
                fs.readdirSync(langFileBasePath + "/" + moduleName).forEach(function (fileName) {
                    if (isJSFile.test(fileName)) {
                        lang = fileName.replace(".js", "");
                        if (!localLangs[lang]) {
                            localLangs[lang] = {};
                        }
                        localLangs[lang][moduleName] = require(langFileRelativedBasePath + "/" + moduleName + '/' + fileName);
                    }
                });
            }
        });

        // 2. 映射 relatived
        Object.keys(relatived).forEach(function (key) {
            localLangs[key] = localLangs[relatived[key]];
        });
    },
    /**
     * 根据 request 对象 获取语言类型字符串
     * @param request
     */
    getLangByRequest: function (request) {
        // 1. 优先使用 用户个人设置中的语言选择
        var lang = (request.session && request.session.user) ? request.session.user.appConfig.lang : null;
        // 2. 使用 cookies 中的语言选择
        if (!lang) {
            lang = request.cookies["lang"];
        }
        // 3. 使用 浏览器 中的语言选择
        if (!lang) {
            lang = request.locale;
        }
        // 4. 都没有，则使用 supported 中定义的第一个支持的语言
        if (!supported[lang] && !relatived[lang]) {
            lang = supportedArray[0];
        }
        return lang;
    },
    /**
     * 获取语言包
     * @param lang {string} 语言字符串，如 "zh-cn"
     * @param moduleName {string} 模块名称
     */
    getLangObj: function (lang, moduleName) {
        return localLangs[lang] ? localLangs[lang][moduleName] : {};
    }
};

LocalLangManage.init();

module.exports = {
    getLangStr: LocalLangManage.getLangByRequest,                 // 1. function(request) {return string}
    getLangObj: function (request, moduleName) {                  // 2. function(request|lang, moduleName) {return Object}
        var lang = supportedArray[0];
        if (typeof request === "string") {
            lang = request.toLowerCase();
        } else {
            lang = LocalLangManage.getLangByRequest(request);
        }

        return LocalLangManage.getLangObj(lang, moduleName);
    },
    getSupportedLang: function () {                              // 3. function() { return [] }
        return supportedArray;
    },
    getRelativedLangObj: function () {                           // 4. function() { return {} }
        return relatived;
    }
};