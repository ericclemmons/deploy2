angular
  .module('app', [
    '$strap.directives',
    'app.controllers.home',
    'app.templates'
  ])
  .config(['$locationProvider', '$routeProvider', function($location, $router) {
    $router
      .when('/', {
        redirectTo: '/home'
      })
      .when('/home', {
        controller:   'app.controllers.home',
        templateUrl:  'app/partials/home.html'
      })
    ;
  }])
;
