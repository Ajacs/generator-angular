'use strict';

/**
* @ngdoc directive
* @name <%= scriptAppName %>.directive:<%= cameledName %>
* @description
* # <%= cameledName %>
*/
(function() {

  angular.module('<%= scriptAppName %>')
  .directive('<%= cameledName %>', <%= cameledName%>);

  function <%= cameledName%>() {
    var directive = {
      restrict: 'E',
      template: '<div></div>',
      link: linkFunction
    };

    return directive;

    function linkFunction(scope, element, attrs) {
      element.text('this is the <%= cameledName %> directive');
    }
  }

})();
