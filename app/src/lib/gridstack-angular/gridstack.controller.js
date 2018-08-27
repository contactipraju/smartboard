(function() {
'use strict';

angular.module('gridstack-angular', []);

var gridApp = angular.module('gridstack-angular');

gridApp.controller('GridstackController', ['$scope', function($scope) {

  var gridstack = null;

  this.init = function(element, options) {
    gridstack = element.gridstack(options).data('gridstack');
    //gridstack.enableMove(false, true);
    //gridstack.enableResize(false, true);
    return gridstack;
  };

  this.removeItem = function(element) {
    if(gridstack) {
      return gridstack.removeWidget(element, false);
    }
    return null;
  };

  this.addItem = function(element) {
    if(gridstack) {
      gridstack.makeWidget(element);
      return element;
    }
    return null;
  };

}]);
})();