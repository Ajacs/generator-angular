'use strict';
var util = require('util');
var path = require('path');
var ScriptBase = require('../script-base.js');

var componentType = 'controller';

var buildRelativePath = function(name) {
  name = name.toLowerCase().split('.');
  var modulePath= name.slice(0, name.length - 1).join('/');
  var moduleName = path.basename(name[name.length-1]);
  console.log('modulePath: ' + modulePath);
  return path.join(modulePath, moduleName + (componentType ? '-' + componentType : ''));
}


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  // if the controller name is suffixed with ctrl, remove the suffix
  // if the controller name is just "ctrl," don't append/remove "ctrl"
  if (this.name && this.name.toLowerCase() !== 'ctrl' && this.name.substr(-4).toLowerCase() === 'ctrl') {
    this.name = this.name.slice(0, -4);
  }
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createControllerFiles = function createControllerFiles() {

 this.generateSourceAndTest(
    'controller',
    'spec/controller',
    componentType,
    this.options['skip-add'] || false
  );
  this.addScriptToIndex(buildRelativePath(this.name));
};
