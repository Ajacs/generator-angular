'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var angularUtils = require('./util.js');
var chalk = require('chalk');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  var bowerJson = {};

  
  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));



// Custom properties 

  var name = this.name.toLowerCase().split('.');
  this.modulePath= name.slice(0, name.length - 1).join('/');
  this.moduleName = path.basename(name[name.length-1]);
  // moduleFullName e.g. ultra.components.directives.firstTimeExperience
  this.moduleFullName = this._.camelize((this.appname + '.' + this.name).split('-').join(' '));
  this.className = this._.classify(this.moduleName.split('-').join(' '));
  this.classNameConstant = this._.underscored(this.moduleName.split('-').join(' ')).toUpperCase();
  this.camelName = this._.camelize(this.moduleName.split('-').join(' '));

  this.scriptAppName = bowerJson.moduleName || this._.camelize(this.appname) + angularUtils.appName(this);

  this.cameledName = this._.camelize(this.name);
  this.classedName = this._.classify(this.moduleName);

  if (typeof this.env.options.appPath === 'undefined') {
    this.env.options.appPath = this.options.appPath || bowerJson.appPath || 'app';
    this.options.appPath = this.env.options.appPath;
  }

    if (typeof this.env.options.testPath === 'undefined') {
    try {
      this.env.options.testPath = require(path.join(process.cwd(), 'bower.json')).testPath;
    } catch (e) {}
    this.env.options.testPath = this.env.options.testPath || this.options.appPath;
  }

  this.env.options.typescript = this.options.typescript;
  if (typeof this.env.options.typescript === 'undefined') {
    this.option('typescript');

    // attempt to detect if user is using TS or not
    // if cml arg provided, use that; else look for the existence of ts
    if (!this.options.typescript &&
      this.expandFiles(path.join(this.env.options.appPath, '/scripts/**/*.ts'), {}).length > 0) {
      this.options.typescript = true;
    }

    this.env.options.typescript = this.options.typescript;
  }

  this.env.options.coffee = this.options.coffee;
  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee');

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.env.options.appPath, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  var sourceRoot = '/templates/javascript';
  this.scriptSuffix = '.js';

  if (this.env.options.coffee) {
    sourceRoot = '/templates/coffeescript';
    this.scriptSuffix = '.coffee';
  }

  if (this.env.options.typescript) {
    sourceRoot = '/templates/typescript';
    this.scriptSuffix = '.ts';
  }

  this.sourceRoot(path.join(__dirname, sourceRoot));
};

util.inherits(Generator, yeoman.generators.NamedBase);


Generator.prototype.appTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + this.scriptSuffix,
    path.join(this.env.options.appPath, dest.toLowerCase()) + this.scriptSuffix
  ]);
};

Generator.prototype.testTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + this.scriptSuffix,
    path.join(this.env.options.testPath, dest.toLowerCase()) + '_test'+ this.scriptSuffix
  ]);
};

Generator.prototype.htmlTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src,
    path.join(this.env.options.appPath, dest.toLowerCase())
  ]);
};

Generator.prototype.addScriptToIndex = function (componentPath) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'index.html');
    angularUtils.rewriteFile({
      file: fullPath,
      needle: '<!-- endbuild -->',
      splicable: [
        '<script src="' + componentPath + '.js"></script>'
      ]
    });
  } catch (e) {
    this.log.error(chalk.yellow(
      '\nUnable to find ' + fullPath + '. Reference to ' + script + '.js ' + 'not added.\n'
    ));
  }
};

Generator.prototype.generateSourceAndTest = function (appTemplate, testTemplate, componentType) {
  // componentType e.g. controller
  this.componentType = componentType.toLowerCase();

  // componentPath e.g. features/courses/outline/outline-controller
  var componentPath = path.join(this.modulePath, this.moduleName + (this.componentType ? '-' + this.componentType : ''));


  this.appTemplate(appTemplate, componentPath);
  this.testTemplate(testTemplate, componentPath);
  this.addScriptToIndex(componentPath);

}
