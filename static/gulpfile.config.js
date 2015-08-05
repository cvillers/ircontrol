'use strict';
var GulpConfig = (function () {
    function GulpConfig() {
        this.source = '.';
        this.sourceApp = this.source + "/js";

        //this.tsOutputPath = this.source + '/js';
        //this.allJavaScript = [this.source + '/js/**/*.js'];
        this.allTypeScript = this.sourceApp + '/**/*.ts';

        //this.typings = './tools/typings/';
        //this.libraryTypeScriptDefinitions = './tools/typings/**/*.ts';
        //this.appTypeScriptReferences = this.typings + 'typescriptApp.d.ts';
    }
    return GulpConfig;
})();
module.exports = GulpConfig;