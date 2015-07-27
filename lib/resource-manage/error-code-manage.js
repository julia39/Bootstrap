/**
 * 错误代码表管理
 */

"use strict";

var util = require('util');
var path = require('path');
var fs = require('fs');
var errorCodeFileBasePath = process.cwd() + "/config/error-code", errorCodeFileRelativedBasePath = "../../config/error-code";
var localLangManage = require("./local-lang-manage.js"), relativedLangObj = localLangManage.getRelativedLangObj();
var logger = require("log4js-config").get("eageye.webapp." + path.basename(__filename));
var isJSFileRegex = /\.js$/i, isSpecialUseDataRegex = /^-USE-DATA-REPLACE-/i, userDataRegex = /(\{(data\.)([^\}]+)\})/ig;

var errorCodeSource = false, translatedErrorCodeDescription = {};

var ErrorCodeManage = {
    init: function () {
        /**
         * 将 转译好的ErrorCode信息 转成 以ErrorCodeNumber为key的 json 对象
         */
        var generaterTanslatedErrorCodeDescription = function (local, translatedErrorCodes) {
            var i = 0, start = 0, end = 0, range;
            Object.keys(translatedErrorCodes).some(function (msg) {
                for (i = 0, range = translatedErrorCodes[msg]; i < range.length; i++) {
                    if (range[i].length == 2) {
                        for (start = range[i][0], end = range[i][1]; start <= end; start++) {
                            translatedErrorCodeDescription[local][start + ""] = msg;
                        }
                    } else {
                        translatedErrorCodeDescription[local][range[i][0] + ""] = msg;
                    }
                }
            });
        };

        // 读取 转译后后方法
        fs.readdirSync(errorCodeFileBasePath + "/translated").forEach(function (fileName) {
            if (isJSFileRegex.test(fileName)) {
                var local = fileName.replace(".js", "");
                translatedErrorCodeDescription[local] = {};
                generaterTanslatedErrorCodeDescription(local, require(errorCodeFileRelativedBasePath + "/translated/" + fileName));
            }
        });

        // 关联 relatived
        Object.keys(relativedLangObj).forEach(function (key) {
            translatedErrorCodeDescription[key] = translatedErrorCodeDescription[relativedLangObj[key]];
        });
    },
    /**
     * 获取 errorCodeSource：如果为false，则 将 source 目录下的所有 errorCode.json 文件，全转入到 errorCodeSource 变量中 再返回结果
     * @returns {boolean}
     */
    getErrorCodeSource: function () {
        if (!errorCodeSource) {
            fs.readdirSync(errorCodeFileBasePath + "/source").forEach(function (fileName) {
                errorCodeSource = util._extend(errorCodeSource, require(errorCodeFileRelativedBasePath + "/source/" + fileName));
            });
        }
        return errorCodeSource;
    },
    /**
     * 根据 errorCodeNumber 获取相对应的转译好的 错误描述信息
     * @param lang
     * @param errorCodeNumber
     * @param errorObj
     * @returns {*}
     */
    getTranslatedErrorCodeDescription: function (lang, errorCodeNumber, errorObj) {
        var description = translatedErrorCodeDescription[lang];
        var msg = description[errorCodeNumber + ""];
        if (msg) {
            if ("USE-DATA-VALUE" === msg) {
                msg = {
                    data: errorObj.data,
                    code: errorCodeNumber
                };
            } else if (isSpecialUseDataRegex.test(msg)) {
                msg = msg.replace(isSpecialUseDataRegex, "");
                var result, returnMsg = msg;
                while ((result = userDataRegex.exec(msg))) {
                    returnMsg = returnMsg.replace(result[1], errorObj.data[result[3]]);
                }
                msg = returnMsg;
            }
        }
        return msg;
    },
    /**
     * 根据不同的类型，返回不同的消息（error消息）
     * @param errorObj {object | string}
     * @param browerRequest
     * @returns {string}
     */
    getErrorMsg: function (errorObj, browerRequest) {
        var lang = localLangManage.getLangStr(browerRequest);
        var errorCodeNumber = 0, msg, defaultMsg = ErrorCodeManage.getTranslatedErrorCodeDescription(lang, "default-error");
        if (typeof errorObj === "string") {
            msg = ErrorCodeManage.getTranslatedErrorCodeDescription(lang, errorObj);
        } else if (errorObj instanceof Error) {
            msg = ErrorCodeManage.getTranslatedErrorCodeDescription(lang, "rest-error");
        } else if (errorObj && typeof errorObj === "object" && (errorCodeNumber = parseInt(errorObj["error_code"] || errorObj["errorCode"]))) {
            msg = ErrorCodeManage.getTranslatedErrorCodeDescription(lang, errorCodeNumber, errorObj);
            if (!msg) {
                msg = ErrorCodeManage.getTranslatedErrorCodeDescription(lang, "error-code-not-found");
                logger.error("errorCode: \"" + errorCodeNumber + "\", 在webapp端找不到对应的描述，请尽快更新");
            }
        }
        return msg ? msg : defaultMsg;
    },
    /**
     * 记录出错信息
     * @param logger
     * @param url
     * @param type
     * @param errorObj
     * @param browserRequest
     * @param restResponse
     */
    loggerUrlErrorMsg: function (logger, url, type, errorObj, browserRequest, restResponse) {
        logger.error(util.format('用户（%s）在访问URL："%s" 时，%s，\nhttpStatus: %s，\nrawMsg: %s',  //
        (browserRequest.session ? (browserRequest.session.user ? browserRequest.session.user.username : "未知") : "未知"),           // 1. 用户
        (url),                                                                                     // 2. url
        (type == "fail" ? "失败了" : "出错啦"),                                                      // 3. 类型
        (restResponse && restResponse.statusCode ? restResponse.statusCode : "未知"),                                          // 4. 状态
        (restResponse && restResponse.raw && restResponse.raw.toString ? restResponse.raw.toString() : "未知")                          // 5. 原始数据
        ));
    }
};

ErrorCodeManage.init();

module.exports = {
    getErrorMsg: ErrorCodeManage.getErrorMsg,            // function(errorObj | string, browerRequest) {return msg}
    getSourceEC: ErrorCodeManage.getErrorCodeSource,     // function() { return object: {codeNumber: {...}, ...} }
    loggerUrlErrorMsg: ErrorCodeManage.loggerUrlErrorMsg // function(logger, url, type, errorObj, req, res) {}
};