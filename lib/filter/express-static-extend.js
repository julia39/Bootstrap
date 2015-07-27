/**
 * Created by wuyaoqian on 13-12-25.
 */

"use strict";

/**
 * 扩展 express(connect) 的 static 中间件
 * 在原options上添加一个扩展属性：pathMapping:[["localPath", "virtualPath"], ...]
 * 注：必须以根目录开始；
 * 如：pathMapping:[["/javascript", "/js"], ["/stylesheets", "/css"]]
 *
 * @param root 实际根目录
 * @param options
 * @returns {Function}
 */
module.exports = function (root, options) {
    var pathMapping, expressStatic;
    if (options && options["pathMapping"]) {
        pathMapping = options["pathMapping"];
        delete options["pathMapping"];
    }
    expressStatic = require("express").static(root, options);
    if (!pathMapping) {
        return expressStatic;
    }

    // TODO: 有时间考滤一下，是否需要将地址还原
    return function (req, res, next) {
        if ('GET' != req.method && 'HEAD' != req.method) {
            return next();
        }

        var i, mapping;
        for (i = 0; i < pathMapping.length; i++) {
            mapping = pathMapping[i];
            if (req.url.indexOf(mapping[1]) === 0) {
                //console.debug("express-static-extend(before):", req.url);
                req.url = req.url.replace(mapping[1], mapping[0]);
                //console.debug("express-static-extend(after):", req.url);
                break;
            }
        }

        return expressStatic.apply(this, arguments);
    };
};
