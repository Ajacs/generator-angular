'use strict';
var path = require('path');
var chalk = require('chalk');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
  this.option('uri', {
    desc: 'Allow a custom uri for routing',
    type: String,
    required: false
  });

  var coffee = this.env.options.coffee;
  var typescript = this.env.options.typescript;
  var bower = require(path.join(process.cwd(), 'bower.json'));
  var match = require('fs').readFileSync(path.join(
    this.env.options.appPath,
    'app.' + (coffee ? 'coffee' : typescript ? 'ts': 'js')
  ), 'utf-8').match(/\.when/);

  if (
    bower.dependencies['angular-route'] ||
    bower.devDependencies['angular-route'] ||
    match !== null
  ) {
    this.foundWhenForRoute = true;
  }

  this.hookFor('angular-pr:controller');
  this.hookFor('angular-pr:view');
};

util.inherits(Generator, ScriptBase);

Generator.prototype.rewriteAppJs = function () {
  var coffee = this.env.options.coffee;

  if (!this.foundWhenForRoute) {
    this.on('end', function () {
      this.log(chalk.yellow(
        '\nangular-route is not installed. Skipping adding the route to ' +
        'app.' + (coffee ? 'coffee' : 'js')
      ));
    });
    return;
  }

  var name = this.name.toLowerCase().split('.');
  this.modulePath= name.slice(0, name.length - 1).join('/');
  this.moduleName = path.basename(name[name.length-1]);
  console.log(name);
  console.log(this.modulePath);

  this.uri = this.name;
  if (this.options.uri) {
    this.uri = this.options.uri;
  }

  var typescript = this.env.options.typescript;
  var config = {
    file: path.join(
      this.env.options.appPath,
      'app.' + (coffee ? 'coffee' : typescript ? 'ts': 'js')
    ),
    needle: '.otherwise',
    splicable: [
      "  templateUrl: '"  + this.modulePath + "/"+ this.moduleName.toLowerCase() + ".html'" + (coffee ? "" : "," ),
      "  controller: '" + this.classedName + "Controller'" + (coffee ? "" : ","),
      "  controllerAs: '" + this.cameledName + "'"
    ]
  };

  if (coffee) {
    config.splicable.unshift(".when '/" + this.cameledName  + "',");
  }
  else {
    config.splicable.unshift(".when('/" + this.cameledName  + "', {");
    config.splicable.push("})");
  }

  angularUtils.rewriteFile(config);
};
