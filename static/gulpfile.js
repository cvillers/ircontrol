var gulp = require("gulp");
var tslint = require("gulp-tslint");
var Config = require("./gulpfile.config");

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

gulp.task("default", function()
{

});