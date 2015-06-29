/**
 * Created by Administrator on 2015/6/29.
 */
"use strict"
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            //options: {
            //    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            //},
            //build: {
            //    src: 'src/<%= pkg.name %>.js',
            //    dest: 'build/<%= pkg.name %>.min.js'
            //}
            my_target:{
                files:[{
                    expand:true,
                    cwd:'src',
                    src:'**/*.js',
                    dest:'dest'
                }]
            }
        },
        concat:{//合并js
            options:{
                separator:';',
                banner:'/*<%= pkg.name %> - v<%= pkg.version %> - '+
                '<%= grunt.template.today("yyyy-mm-dd")%>*/'
            },
            dist:{
              src:['src/*.js'],
                dest:'build/built.js'
            },
            mobileLess:{

            }
        },
        less:{
            development:{
                options:{
                    compress:false
                },
                files:[{
                    expand:true,
                    cwd:'./public/stylesheets/less',
                    src:['**/*.less'],
                    dest:'./public/stylesheets/css',
                    ext:'.css'
                }]
            },
            production:{
                options:{
                    compress:true,
                    plugins:[
                        //new require('less-plugin-autoprefix')({browsers:["last 2 versions"]}),
                        //new require('less-plugin-clean-css')(cleanCssOptions)
                    ]
                },
                files:{

                }
            }
        },
        watch:{
            options:{
                livereload:true
            },
            scripts:{
                files:[
                    './public/stylesheets/less/**/*.less',
                    './public/stylesheets/less/*.less'
                ],
                tasks:['less'],
                options:{
                    spawn:false,
                },
            }
        },
        htmlbuild:{
            mobile:{
                src:'views/template/*.html',
                desc:'/',
                options:{
                    beautify:true,
                    relative:true,
                    sections:{
                        layout:{
                            footer:'views/template/common/footer.html'
                        }
                    }
                }
            },
            web:{
                src:'view/template/*.html',
                desc:'./'
            }
        },
        htmls:{
            files:[
                ''
            ],
            tasks:[
                'htmlbuild'
            ],
            options:{
                spawn:false
            }
        },
        jshint:{//校验js
            options:{
                //大括号包裹
                curly:true,
                //对于简单类型，使用===和!===，而不是==和!=
                eqeqeq:true,
                //对于首字母大写的函数（声明的类），强制使用new
                newcap:true,
                //禁用arguments.caller和arguments.callee
                noarg:true,
                //对于属性使用aaa.bbb而不是aaa['bbb']
                sub:true,
                //查找所有未定义变量
                undef:true,
                //查找类似于if(a = 0)这样的代码
                boss:true,
                //指定运行环境为node.js
                node:true
            },
            //具体任务配置
            files:{
                src:['public/javascripts/*.js']
            }

        },
        copy:{//复制文件或目录的插件
            main:{
                files:[
                    {src:['path/*'],dest:'dest/',filter:'isFile'},// 复制path目录下的所有文件
                    {src:['path/*'],dest:'dest/'}// 复制path目录下的所有目录和文件
                ]
            }
        },
        clean:{
            build:{
                src:["path/to/dir/one","path/to/dir/two"]
            }
        },
        imagemin:{//图片图片压缩
            dynamic:{
                files:[{
                    expand:true,
                    cwd:'src/',
                    src:['**/*.{png,jpg,gif}'],
                    dest:'dist/'
                }]
            }
        },
        karma:{//karma单测回归
            unit:{
                configFile:'karma.conf.js'
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    //grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-build');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify','watch','jshint']);
    //grunt.registerTask('default', ['uglify']);

};
