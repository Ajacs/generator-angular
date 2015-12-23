'use strict';
var util = require('util');
var path = require('path');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createDirectiveFiles = function createDirectiveFiles() {
  this.generateSourceAndTest(
    'directive/directive',
    'spec/directive',
    'directive',
    this.options['skip-add'] || false
  );

  this.template(
    'directive/template.html',
    path.join(
      this.env.options.appPath,
      this.modulePath,
      this.moduleName + '.html'
    )
  );
};
