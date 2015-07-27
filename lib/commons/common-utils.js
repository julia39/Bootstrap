/**
 * 公用的一些工具类方法
 * Created by wuyaoqian on 14-4-17.
 */

"use strict";

var _ = require("underscore");

var HtmlUtil = {
    /**
     * 将 html标签符号 转化为 html转义符号
     * @param content
     * @returns {*}
     */
    escape: function (content, useDefaultValue) {
        return _.isString(content) ? content.replace(/</g, "&lt;").replace(/>/g, "&gt;") : (useDefaultValue ? "" : undefined);
    },
    /**
     * 将 html转义符号 转化为 html标签符号
     * @param content
     * @returns {*}
     */
    unescape: function (content, useDefaultValue) {
        return _.isString(content) ? content.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">") : (useDefaultValue ? "" : undefined);
    }
};

module.exports = {
    html: HtmlUtil
};