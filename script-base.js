'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var angularUtils = require('./util.js');
var chalk = require('chalk');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  var bowerJson = {};

  try {
    bowerJson = require(path.join(process.cwd(), 'bower.json'));
  } catch (e) {}

  if (bowerJson.name) {
    this.appname = bowerJson.name;
  } else {
    this.appname = path.basename(process.cwd());
  }

  this.appname = this._.slugify(this._.humanize(this.appname));

  this.scriptAppName = bowerJson.moduleName || this._.camelize(this.appname) + angularUtils.appName(this);

  this.cameledName = this._.camelize(this.name);
  this.classedName = this._.classify(this.name);

  if (typeof this.env.options.appPath === 'undefined') {
    this.env.options.appPath = this.options.appPath || bowerJson.appPath || 'app';
    this.options.appPath = this.env.options.appPath;
  }

  this.env.options.testPath = this.env.options.testPath || bowerJson.testPath || 'test/spec';

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


// Custom properties 

// modulePath e.g. components/directives/first-time-experience
  this.modulePath = path.normalize(this.name.toLowerCase().split('.').join('/')); // replace all dots with forward slashes
  // moduleName e.g. first-time-experience
  this.moduleName = path.basename(this.modulePath);
  // moduleFullName e.g. ultra.components.directives.firstTimeExperience
  this.moduleFullName = this._.camelize((this.appname + '.' + this.name).split('-').join(' '));
  // className e.g. FirstTimeExperience
  this.className = this._.classify(this.moduleName.split('-').join(' '));
  // class name as a constant FIRST_TIME_EXPERIENCE
  this.classNameConstant = this._.underscored(this.moduleName.split('-').join(' ')).toUpperCase();
  // camelName e.g. firstTimeExperience
  this.camelName = this._.camelize(this.moduleName.split('-').join(' '));
  // pathToApp e.g. ../../..
  // how to reach the app.ts or unit_test.d.ts files at the app root from a generated file
  this.pathToApp = path.relative(
    path.join(this.destinationRoot(), this.env.options.appPath, this.modulePath), // from (where the generated file will be located)
    path.join(this.destinationRoot(), this.env.options.appPath) // to (where the app root is)
  );





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

Generator.prototype.addScriptToIndex = function (script) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'index.html');
    angularUtils.rewriteFile({
      file: fullPath,
      needle: '<!-- endbuild -->',
      splicable: [
        '<script src="scripts/' + script.toLowerCase().replace(/\\/g, '/') + '.js"></script>'
      ]
    });
  } catch (e) {
    this.log.error(chalk.yellow(
      '\nUnable to find ' + fullPath + '. Reference to ' + script + '.js ' + 'not added.\n'
    ));
  }
};

Generator.prototype.generateSourceAndTest = function (appTemplate, testTemplate, componentType) {
}
  // componentType e.g. controller
  this.componentType = componentType.toLowerCase();

  // componentPath e.g. features/courses/outline/outline-controller
  var componentPath = path.join(this.modulePath, this.moduleName + (this.componentType ? '-' + this.componentType : ''));


  this.appTemplate(appTemplate, componentPath);
  this.testTemplate(testTemplate, componentPath);
};
