'use strict';

/**
* @ngdoc function
* @name <%= classedName %>Controller
* @description
* # <%= classedName %>Controller
* Controller of the <%= scriptAppName %>
*/
(function() {

  angular.module('<%= scriptAppName %>')
  .controller('<%= classedName %>Controller', <%= classedName%>Controller);

  function <%= classedName%>Controller() {
    var vm = this;
    vm.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }

})();
