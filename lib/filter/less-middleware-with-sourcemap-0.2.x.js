/**
 * Created by wuyaoqian on 14-3-16.
 */

//var lessMiddleware = require('less-middleware');
//
//var fs = require('fs');
//var path = require('path');
//var url = require('url');
//var SourceMapGenerator = require('source-map').SourceMapGenerator;
//
//module.exports = function (options) {
//    if (!options.sourceMap) {
//        return lessMiddleware(options);
//    }
//    // 这里置为 false 是因为下面的扩展会自动的在 css 文件内加入 “sourceMap” (即不使用原有的生成“sourceMap”的方法)
//    options.sourceMap = false;
//
//    var lessMiddlewareFilter = lessMiddleware(options);
//
//    return function (req, res, next) {
//        if ('GET' != req.method.toUpperCase() && 'HEAD' != req.method.toUpperCase()) {
//            return next();
//        }
//
//        var requestPath = url.parse(req.url).pathname;
//        var pathname = requestPath;
//        if (!/.*\.css$/i.test(pathname)) {
//            return next();
//        }
//
//        if (options.prefix && 0 === pathname.indexOf(options.prefix)) {
//            pathname = pathname.substring(options.prefix.length);
//        }
//
//        var root = options.root;
//        var cssPath = path.join(root, options.dest, pathname.replace(options.dest, ''));
//        var lessPath = path.join(root, options.src, pathname.replace(options.dest, '').replace('.css', '.less'));
//        var mapPath = cssPath + ".map";
//
//        // Ignore ENOENT to fall through as 404
//        var error = function (err) {
//            return next('ENOENT' == err.code ? null : err);
//        };
//
//        // 将本地路径转换至http服务路径
//        var removeRoot = function (filePath) {
//            if (filePath.indexOf(root) === 0) {
//                filePath = filePath.substring(root.length);
//                if (filePath[0] != '/') filePath = '/' + filePath;
//            }
//            return filePath;
//        };
//
//        // Compile css source map file
//        var compileMapFile = function () {
//
//            // 因为在本地调试的时候，才会使用此模块，所以这里就没有必要一行一行的读取，而是将内容全部加载到内存中。
//            fs.readFile(cssPath, 'utf8', function (err, cssContent) {
//                if (err) {
//                    return error(err);
//                }
//
//                var lines = cssContent.split('\n');
//                try {
//                    var smg = new SourceMapGenerator({ file: cssPath });
//                    for (var i = 0; i < lines.length; i++) {
//                        // 解析通过“注释(comments)”的方法记录的行号
//                        var match = lines[i].match(/\/\*\sline\s(\d+), ([^\*]+)\s\*\//);
//                        if (match) {
//                            smg.addMapping({
//                                generated: {line: i + 1, column: 0},
//                                original: {line: parseInt(match[1], 10), column: 0},
//                                source: removeRoot(match[2])
//                            });
//                        }
//                    }
//                    fs.writeFile(cssPath, cssContent + '\n/*@ sourceMappingURL=' + (requestPath + ".map") + ' */', 'utf8', function () {
//                        fs.writeFile(mapPath, smg.toString(), 'utf8', next);
//                    });
//                } catch (err) {
//                    return next(err);
//                }
//            });
//        };
//
//        // 拦截 next 方法（往css文件中添加 “sourceMap”, 并编译 cssMapFile）
//        var customeNextFN = function () {
//            fs.stat(cssPath, function (err, cssStats) {
//                if (err) {
//                    return error(err);
//                }
//                fs.stat(mapPath, function (err, mapStats) {
//                    // MAP has not been compiled, compile it!
//                    if (err) {
//                        if ('ENOENT' == err.code) {
//                            // No MAP file found in css directory
//                            //console.log("file: \"%s\" not found.", mapPath);
//                            return compileMapFile();
//                        } else {
//                            return next(err);
//                        }
//                    } else if (cssStats.mtime.getTime() > mapStats.mtime.getTime()) {
//                        //console.log("css-mtime: %s; %s", cssStats.mtime.getTime(), cssPath);
//                        //console.log("map-mtime: %s; %s", mapStats.mtime.getTime(), mapPath);
//                        return compileMapFile();
//                    } else {
//                        return next();
//                    }
//                });
//            });
//        };
//
//        fs.exists(lessPath, function (exists) {
//            if (!exists) {
//                return next();
//            }
//
//            return lessMiddlewareFilter.call(this, req, res, customeNextFN);
//        });
//    };
//};