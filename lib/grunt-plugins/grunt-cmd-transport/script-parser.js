/*!
 * 与 grunt-cmd-transport 内的 script.js 相比
 * 1. 添加一个方法”：parseVars:function(options, id);
 *    1.1 在方法     function moduleDependencies(id, options) 内的
 *        var alias = iduri.parseAlias(options, id); 修改成
 *        var alias = parseVars(options, iduri.parseAlias(options, id));
 *    1.2 options内添加一个支持变量：vars
 *
 * 2. 添加一个方法”：parsePaths:function(options, id);
 *    2.1 在方法     function moduleDependencies(id, options) 内的
 *        options.paths.some(function(base) {...} 注释掉
 *        并添加新的 代码 代替“paths”变量的使用
 *    2.2 options 内添加一个支持变量：paths-mapping
 *    2.3 options 内的变量 paths 由数组改成 json对象
 *
 * 3. 添加一个方法”：addBase:function(options, id);
 *    3.1 options内添加一个支持变量：cwd
 * 4. 如果发现不是 cmd 模块，将自动在代码的最后 添加上一个 define(...) 方法
 * 5. options 内添加一个支持变量 ignoreDependencyCheckList 并在方法 function moduleDependencies(id, options) 内做检测
 * 6. 添加一个方法：dropConsole, 并支持参数 dropConsoleTypes 传递（是一个数组）;
 */

"use strict";

exports.init = function(grunt) {
  var path = require('path');
  var ast = require('cmd-util').ast;
  var iduri = require('cmd-util').iduri;
  var _ = require("underscore");


  var exports = {};

    var dropConsole = function (data, options) {
        var types = "";
        if (Array.isArray(options.dropConsoleTypes) && options.dropConsoleTypes.length > 0) {
            options.dropConsoleTypes.forEach(function (type) {
                types += type + "|";
            });
            if (types.length > 0) {
                types = types.substr(0, types.length - 1);
            }
        } else {
            types = "log|debug";
        }

        return data.replace(new RegExp("\\s+console\\.(" + types + ")\\(.*?\\)(;|\\s)", "ig"), '');
    };

    var parseVars = function (options, id) {
        var vars = options.vars;
        if (vars && id.indexOf("{") > -1) {
            id = id.replace(/{([^{]+)}/g, function (m, key) {
                return typeof vars[key]  === "string" ? vars[key] : m;
            });
        }
        return id;
    };
    var parsePaths = function (options, id) {
        var paths = options.paths, m, pathMapping = options["paths-mapping"];
        if (paths && (m = id.match(/^([^/:]+)(\/.+)$/)) && typeof paths[m[1]]  === "string") {
            id = paths[m[1]] + m[2];
        }
        if(pathMapping) {
            Object.keys(pathMapping).some(function(key) {
                if(id.indexOf(key) === 0) {
                    id = id.replace(key, pathMapping[key]);
                    return true;
                }
            });
        }
        return id;
    };
    var addBase = function (options, id) {
        return path.join(options.cwd, id);
    };

  exports.jsParser = function(fileObj, options) {
    grunt.log.verbose.writeln('Transport ' + fileObj.src + ' -> ' + fileObj.dest);
    var astCache, data = dropConsole(fileObj.srcData || grunt.file.read(fileObj.src), options);
    try {
      astCache = ast.getAst(data);
    } catch(e) {
      grunt.log.error('js parse error ' + fileObj.src.red);
      grunt.fail.fatal(e.message + ' [ line:' + e.line + ', col:' + e.col + ', pos:' + e.pos + ' ]');
    }

    var meta = ast.parseFirst(astCache);

    if (!meta || (
            meta &&
            /if\s*\(\s*typeof\s+define\s*==[^)]+\s*\&\&\s*define.amd\s*\)\s*\{[^}]+\}/ig.test(data) &&
            !/^\/\* \(none-cmd translated to cmd\) \*\/\ndefine\(function \(\)/ig.test(data)
        )
    ) {
      // grunt.log.warn('found non cmd module "' + fileObj.src + '"');
      // do nothing

      if(meta) {
          grunt.log.ok('Treat amd module: '+fileObj.src.yellow+' as non cmd module ');
      }

      // transport non cmd module
      //grunt.file.write(fileObj.dest, data + "\n;\ndefine('" + unixy(options.idleading + fileObj.name.replace(/\.js$/, '')) + "', [], function () {});");
      //if(/(}\s*\)\([^()]*\)\s*;?\s*$)/ig.test(data)) {
      //    // 这里注释是因为 3rd-lib/ejs/1.0.0/ejs.js 后面有一个 return 语句
      //    grunt.file.write(fileObj.dest, data.replace(/(}\s*\)\([^()]*\)\s*;?\s*$)/ig, "\ndefine('" + unixy(options.idleading + fileObj.name.replace(/\.js$/, '')) + "', [], function () {});\n\n$1"));
      //} else {
          grunt.file.write(fileObj.dest, data + "\n;\ndefine('" + unixy(options.idleading + fileObj.name.replace(/\.js$/, '')) + "', [], function () {});");
      //}
      return;
    }

    if (meta.id) {
      grunt.log.verbose.writeln('id exists in "' + fileObj.src + '"');
    }

    var deps, depsSpecified = false;
    if (meta.dependencyNode) {
      deps = meta.dependencies;
      depsSpecified = true;
      grunt.log.verbose.writeln('dependencies exists in "' + fileObj.src + '"');
    } else {
      deps = parseDependencies(fileObj.src, options);
      grunt.log.verbose.writeln(deps.length ?
        'found dependencies ' + deps : 'found no dependencies');
    }

    // create .js file
    astCache = ast.modify(astCache, {
      id: meta.id ? meta.id : unixy(options.idleading + fileObj.name.replace(/\.js$/, '')),
      dependencies: deps,
      require: function(v) {
        // ignore when deps is specified by developer
        return depsSpecified ? v : iduri.parseAlias(options, v);
      }
    });
    data = astCache.print_to_string(options.uglify);
    grunt.file.write(fileObj.dest, addOuterBoxClass(data, options));


    // create -debug.js file
    if (!options.debug) {
      return;
    }
    var dest = fileObj.dest.replace(/\.js$/, '-debug.js');

    astCache = ast.modify(data, function(v) {
      var ext = path.extname(v);

      if (ext && options.parsers[ext]) {
        return v.replace(new RegExp('\\' + ext + '$'), '-debug' + ext);
      } else {
        return v + '-debug';
      }
    });
    data = astCache.print_to_string(options.uglify);
    grunt.file.write(dest, addOuterBoxClass(data, options));
  };


  // helpers
  // ----------------
  function unixy(uri) {
    return uri.replace(/\\/g, '/');
  }

  function getStyleId(options) {
    return unixy((options || {}).idleading || '')
      .replace(/\/$/, '')
      .replace(/\//g, '-')
      .replace(/\./g, '_');
  }

  function addOuterBoxClass(data, options) {
    // ex. arale/widget/1.0.0/ => arale-widget-1_0_0
    var styleId = getStyleId(options);
    if (options.styleBox && styleId) {
      data = data.replace(/(\}\)[;\n\r ]*$)/, 'module.exports.outerBoxClass="' + styleId + '";$1');
    }
    return data;
  }

  function moduleDependencies(id, options) {
    var alias = parseVars(options, iduri.parseAlias(options, id));

    if (iduri.isAlias(options, id) && alias === id) {
      // usually this is "$"
      return [];
    }

    if (Array.isArray(options.ignoreDependencyCheckList)) {
        var found = false;
        options.ignoreDependencyCheckList.some(function(regex){
            if(regex.test(this)){
                return (found = true);
            }
        }, id.replace(/\.js/i, ""));
        if(found){
            return [];
        }
    }

    // don't resolve text!path/to/some.xx, same as seajs-text
    if (/^text!/.test(id)) {
      return [];
    }

    var file = iduri.appendext(alias);

    if (!/\.js$/.test(file)) {
      return [];
    }

    var fpath;
    var filepath = addBase(options, parsePaths(options, file));
    if (grunt.file.exists(filepath)) {
        grunt.log.verbose.writeln('find module "' + filepath + '"');
        fpath = filepath;
    }
//        options.paths.some(function(base) {
//            var filepath = path.join(options.cwd, base, file);
//            if (grunt.file.exists(filepath)) {
//                grunt.log.verbose.writeln('find module "' + filepath + '"');
//                fpath = filepath;
//                return true;
//            }
//        });

    if (!fpath) {
      grunt.fail.warn("can't find module " + alias);
      return [];
    }
    if (!grunt.file.exists(fpath)) {
      grunt.fail.warn("can't find " + fpath);
      return [];
    }
    var data = grunt.file.read(fpath);
    var parsed = ast.parse(data);
    var deps = [];

    var ids = parsed.map(function(meta) {
      return meta.id;
    });

    parsed.forEach(function(meta) {
      meta.dependencies.forEach(function(dep) {
        dep = iduri.absolute(alias, dep);
        if (!_.contains(deps, dep) && !_.contains(ids, dep) && !_.contains(ids, dep.replace(/\.js$/, ''))) {
          deps.push(dep);
        }
      });
    });

    var newDeps = [];
    deps.forEach(function(dep){
        newDeps = newDeps.concat(moduleDependencies(dep, options));
    });

    return deps.concat(newDeps);
  }

  function parseDependencies(fpath, options) {
    var rootpath = fpath;

    function relativeDependencies(fpath, options, basefile) {
      if (basefile) {
        fpath = path.join(path.dirname(basefile), fpath);
      }
      fpath = iduri.appendext(fpath);

      var deps = [];
      var moduleDeps = {};

      if (!grunt.file.exists(fpath)) {
        if (!/\{\w+\}/.test(fpath)) {
          grunt.log.warn("can't find " + fpath);
        }
        return [];
      }
      var parsed, data = grunt.file.read(fpath);
      try {
        parsed = ast.parseFirst(data);
      } catch(e) {
        grunt.log.error(e.message + ' [ line:' + e.line + ', col:' + e.col + ', pos:' + e.pos + ' ]');
        return [];
      }
      parsed.dependencies.map(function(id) {
        return id.replace(/\.js$/, '');
      }).forEach(function(id) {

        if (id.charAt(0) === '.') {
          // fix nested relative dependencies
          if (basefile) {
            var altId = path.join(path.dirname(fpath), id).replace(/\\/g, '/');
            var dirname = path.dirname(rootpath).replace(/\\/g, '/');
            if ( dirname !== altId ) {
              altId = path.relative(dirname, altId);
            } else {
              // the same name between file and directory
              altId = path.relative(dirname, altId + '.js').replace(/\.js$/, '');
            }
            altId = altId.replace(/\\/g, '/');
            if (altId.charAt(0) !== '.') {
              altId = './' + altId;
            }
            deps.push(altId);
          } else {
            deps.push(id);
          }
          if (/\.js$/.test(iduri.appendext(id))) {
            deps = grunt.util._.union(deps, relativeDependencies(id, options, fpath));
          }
        } else if (!moduleDeps[id]) {
          var alias = iduri.parseAlias(options, id);
          deps.push(alias);

          // don't parse no javascript dependencies
          var ext = path.extname(alias);
          if (ext && ext !== '.js') {return;}

          var mdeps = moduleDependencies(id, options);
          moduleDeps[id] = mdeps;
          deps = grunt.util._.union(deps, mdeps);
        }
      });
      return deps;
    }

    return relativeDependencies(fpath, options);
  }

  return exports;
};
