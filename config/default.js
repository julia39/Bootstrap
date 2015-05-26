/**
 * 应用配置文件  --基础部分
 * Created by zhutingzhu on 2015/5/19.
 */

var extend=require("node.extend");

//应用配置文件 --可变部分
var defaultVars=require('./default-vars')||{};

var baseResetUrl=defaultVars.system.baseResetUrl;

/**
 * 应用配置文件 =基础部分 + 可变部分
 */
module.export=extend(true,{
    "seaConfig":{
        "base":"/",
        "grunt-opt":{
            "cwd":"public",
            "paths-mapping":{
                "js":"javascripts",
                "css":"stylesheets/css"
            }
        },
        "paths": {
            "3rd-sm": "js/3rd-lib/sea-modules",
            "3rd-jq": "js/3rd-lib/cmd-jq-plugins",
            "3rd-ot": "js/3rd-lib/cmd-others"
        },
        "vars":{
            "bootstrap-js-dir":"boostrap-js"
        }
    }
},defaultVars);