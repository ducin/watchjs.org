'use strict';

global.myApp.filter('speaker', function () {
  return function (input) {
    return angular.isArray(input) ? _.map(input, function(el){ return el.name; }).join(', ') : input.name;
  };
});
