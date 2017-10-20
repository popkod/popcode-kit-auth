module.exports = function(grunt){

    grunt.initConfig({
        webpack: {
            dist: {
                entry: "./index.bower.js",
                output: {
                    path: './dist',
                    filename: 'index.js'
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    './dist/boundle.js': './dist/index.js'
                }
            }
        },
        copy: {
            demo: {
                files: [
                    {'./demo/boundle.js' : './dist/boundle.js'},
                    {'./demo/boundle.js.map' : './dist/boundle.js.map'},
                ]
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('dist', ['webpack:dist', 'babel:dist', 'copy:demo']);
};
