'use strict';
var GulpConfig = (function () {
    function GulpConfig() {
        this.release = false;

        this.source = '.';
        this.sourceApp = this.source + "/js";
        this.sourceStyles = this.source + "/css";

        if(this.release)
            this.outputRoot = this.source + '/release';
        else
            this.outputRoot = this.source + "/debug";

        this.jsOutputDir = this.outputRoot + "/js";
        this.cssOutputDir = this.outputRoot + "/css";
        //this.allJavaScript = [this.source + '/js/**/*.js'];
        this.allTypeScript = this.sourceApp + '/**/*.ts';
        this.allCSS = this.sourceStyles + "/**/*.css";

        //this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = this.sourceApp + '/**/*.d.ts';
        //this.appTypeScriptReferences = this.typings + 'typescriptApp.d.ts';

        //this.vendorOutputPath = this.outputRoot + "/js/vendor.js";
        //this.appOutputPath = this.outputRoot + "/js/app.js";

        this.vendorRoot = this.source + "/node_modules";
        this.vendorJS = [
            this.vendorRoot + "/angular/angular.min.js",
            this.vendorRoot + "/angular-animate/angular-animate.min.js",
            this.vendorRoot + "/angular-aria/angular-aria.min.js",
            this.vendorRoot + "/angular-route/angular-route.min.js",

            this.vendorRoot + "/angular-material/angular-material.min.js"
        ];
        this.vendorCSS = [
            this.vendorRoot + "/angular-material/angular-material.min.css"
        ]

    }
    return GulpConfig;
})();
module.exports = GulpConfig;