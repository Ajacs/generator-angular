'use strict';

/**
 * @ngdoc function
 * @name <%= scriptAppName %>.controller:<%= classedName %>Controller
 * @description
 * # <%= classedName %>Ctrl
 * Controller of the <%= scriptAppName %>
 */

 function <%= classedName %>Controller() {

   var vm = this;
   vm.name = '<%= classedName %>Controller';
   vm.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

   vm.getName = function() {
     return vm.name;
   };
 }


angular.module('<%= scriptAppName %>')
  .controller('<%= classedName %>Controller',  <%= classedName %>Controller);
