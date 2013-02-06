angular
  .module('app.controllers.home', [
    'ngResource'
  ])
  .controller('app.controllers.home', [
    '$scope',
    '$resource',
    function($scope, $resource) {
      var Deployments = $resource('/api/deployments');

      $scope.deployments = Deployments.query();

      $scope.statusClass = function(code) {
        return code ? 'text-error' : 'text-success';
      };
    }
  ])
;
