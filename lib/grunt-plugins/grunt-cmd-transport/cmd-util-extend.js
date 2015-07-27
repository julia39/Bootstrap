/**
 * 扩展 cmd-tuil
 * Created by wuyaoqian on 14-4-23.
 */

"use strict";

var path = require("path"), CMDUtil = require("cmd-util"), ast = CMDUtil.ast, iduri = CMDUtil.iduri;

var OptUtil = {
    // 目前所需的变量
    properties: {
        "cwd": "",
        "paths": [],
        "alias": [],
        "vars": [],
        "paths-mapping": []
    },
    // 解析 seajs 变量
    parseVars: function (options, id) {
        var vars = options.vars;
        if (vars && id.indexOf("{") > -1) {
            id = id.replace(/{([^{]+)}/g, function (m, key) {
                return typeof vars[key] === "string" ? vars[key] : m;
            });
        }
        return id;
    },
    // 解析 seajs 路径
    parsePaths: function (options, id) {
        var paths = options.paths, m, pathMapping = options["paths-mapping"];
        if (paths && (m = id.match(/^([^/:]+)(\/.+)$/)) && typeof paths[m[1]] === "string") {
            id = paths[m[1]] + m[2];
        }
        if (pathMapping) {
            Object.keys(pathMapping).some(function (key) {
                if (id.indexOf(key) === 0) {
                    id = id.replace(key, pathMapping[key]);
                    return true;
                }
            });
        }
        return id;
    },
    // 解析相对路径
    parseRlativePath: function (id, parentId) {
        return path.join(parentId.replace(/\/[^/]+$/, "/").replace(/^\//, ""), id);
    },
    // 添加一个路径前缀
    addBase: function (options, id) {
        return path.join(options.cwd, id);
    },
    // 还原成真正的路径（是一个经过 cmd-transport 之后的相对路径）
    getRealPath: function (options, id) {
        var alias = OptUtil.parseVars(options, iduri.parseAlias(options, id));

        var file = iduri.appendext(alias);

        if (!/\.(js)$/.test(file)) {
            file = file + ".js";
        }

        return OptUtil.addBase(options, OptUtil.parsePaths(options, file)).replace(/\\/ig, "/");
    }
};

var CMDUtilExtend = {
    /**
     * 根据 opt 及 sourceCode 返回 sourceCode内的直接依赖（即 ast.parseFirst）
     * @param opt {object} seajs的各种配置
     * @param sourceCode {string} 需要解析的源代码
     * @return ["", ...]
     */
    getDirectDependencies: function (opt, sourceCode) {
        var dependencies = [], moduleDesc = ast.parseFirst(sourceCode);
        moduleDesc.dependencies.forEach(function (id) {
            if (id.charAt(0) === ".") {
                dependencies.push(OptUtil.getRealPath(opt, OptUtil.parseRlativePath(id, moduleDesc.id)));
            } else {
                dependencies.push(OptUtil.getRealPath(opt, id));
            }
        });
        //console.log(dependencies);
        return dependencies;
    }
};

module.exports = {
    CMDUtil: CMDUtil,                                                   // cmd-util
    getDirectDependencies: CMDUtilExtend.getDirectDependencies          // function(opt, sourceCode)
};