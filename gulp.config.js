module.exports = function() {
    var root = './';
    var buildDest = './build/';
    var imgSrcFolder = './img/';
    var imgDestFolder = buildDest + 'img/';
    
    var config = {
        
        allJS: [
            './js/**/*.js'
        ],

        allCSS: [
            './css/**/*.css'
        ],

        customJSFileFilter: [
            './js/*.js'
        ],

        customCSSFileFilter: [
            './css/*.css'
        ],

        index: root + 'index.html',

        jsFolder: "src",
        cssFolder: "css",

        buildDest: buildDest,
        jsBuildDest: buildDest + 'js',
        cssBuildDest: buildDest + 'css',

        imgSrcFolder: imgSrcFolder,
        imgFilter: imgSrcFolder + '*',
        imgDestFolder: imgDestFolder,

        bower: {
            json: require('./bower.json'),
            directory: './lib/',
            ignorePath: '../..'
        }
    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    return config;
};
