var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require("gulp-uglify"),
    wrapper = require("gulp-wrapper"),
    Config = require('./gulpfile.config');


var config = new Config();

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function ()
{
    var src = gulp.src(config.allTypeScript);
    var tpipe = src.pipe(tslint());
    var ppipe = tpipe.pipe(tslint.report('prose'));
    return ppipe;
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function ()
{
    var sourceTsFiles = [config.allTypeScript,                //path to typescript files
                         config.libraryTypeScriptDefinitions, //reference to library .d.ts files
                         /*config.appTypeScriptReferences*/];     //reference to app.d.ts files

    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(sourcemaps.init())
                       .pipe(tsc({
                           target: 'ES5',
                           declarationFiles: false,
                           noExternalResolve: true
                       }));

    if(config.release)
    {
      return tsResult
         //.pipe(concat('lib/js-library.js')) // You can use other plugins that also support gulp-sourcemaps
         .pipe(concat("app.js"))
         .pipe(wrapper({
             header: "(function(angular){",
             footer: "})(angular);"
         }))
         .pipe(uglify({mangle: true}))
         .pipe(sourcemaps.write(".")) // Write source maps to the same directory
         .pipe(gulp.dest(config.jsOutputDir));
    }
    else
    {
        // In non-release mode, generate all files
        tsResult.dts.pipe(gulp.dest(config.jsOutputDir));
        return tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.jsOutputDir));
    }
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
  var typeScriptGenFiles = [config.jsOutputDir,            // path to generated JS files
                            //config.sourceApp +'**/*.js',    // path to all JS files auto gen'd by editor
                            //config.sourceApp +'**/*.js.map' // path to all sourcemap files auto gen'd by editor
                           ];

  // delete the files
  del(typeScriptGenFiles, cb);
});

/**
 * Compiles local app CSS.
 */
gulp.task("compile-css", function()
{
    var css = gulp.src([config.allCSS]);

    if(config.release)
    {
        return css
            .pipe(concat("app.css"))
            .pipe(gulp.dest(config.cssOutputDir));
    }
    else
    {
        // In non-release mode, just copy files
        return css
            .pipe(gulp.dest(config.cssOutputDir));
    }
});

/**
 * Creates vendor JS bundles.
 */
gulp.task("vendor-bundle-js", function()
{
    if(config.release)
    {
        var sourceVendorFiles = gulp.src(config.vendorJS);
        return sourceVendorFiles
            .pipe(concat("vendor.js"))
            .pipe(gulp.dest(config.jsOutputDir));
    }
    else
    {
        // For non-release mode, just copy over the original vendor JS
        var js = config.vendorJS.map(function(f) { return f.replace(/\.min\.js$/i, ".js"); });
        return gulp.src(js)
            .pipe(gulp.dest(config.jsOutputDir));
    }
});

/**
 * Creates vendor CSS bundles.
 */
gulp.task("vendor-bundle-css", function()
{
    if(config.release)
    {
        var sourceVendorFiles = gulp.src(config.vendorCSS);
        return sourceVendorFiles
            .pipe(concat("vendor.css"))
            .pipe(gulp.dest(config.cssOutputDir));
    }
    else
    {
        // For non-release mode, just copy over the original vendor CSS
        var css = config.vendorCSS.map(function(f) { return f.replace(/\.min\.css$/i, ".css"); });
        return gulp.src(css)
            .pipe(gulp.dest(config.cssOutputDir));
    }
});

gulp.task('watch', function() {
    gulp.watch([config.allTypeScript], ['ts-lint', 'compile-ts', "compile-css", "vendor-bundle-js", "vendor-bundle-css"]);
});

gulp.task('default', ['ts-lint', 'compile-ts', "compile-css", "vendor-bundle-js", "vendor-bundle-css", 'watch']);