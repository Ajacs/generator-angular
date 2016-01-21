'use strict';

/**
* @ngdoc service
* @name <%= scriptAppName %>.<%= classedName %>
* @description
* # <%= classedName %>
* Service in the <%= scriptAppName %>.
*/
(function() {

  angular.module('<%= scriptAppName %>')
  .service('<%= cameledName %>Service', <%= cameledName %>Service);

  function <%= cameledName %>Service() {
    // AngularJS will instantiate a singleton by calling "new" on this function
  }

})();
