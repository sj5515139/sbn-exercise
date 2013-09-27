extend(app,{
			module : angular.module('exercise',
			     ['exerciseServices','ui.router']
			   )
			}
	);

app.module.config(['$stateProvider', function($stateProvider) {
  
  $stateProvider.
      state('login', {url:'/login',templateUrl: '/static/web/partials/login.html',   controller: app.exercise.controllers.LoginCtrl}). 
      state('home', {url:'/home',templateUrl: '/static/web/partials/home.html',   controller: app.exercise.controllers.HomeCtrl}).
      state('home.list', {url:'/list',templateUrl: '/static/web/partials/list.html',   controller: app.exercise.controllers.HomeListCtrl}).
      state('home.update', {url:'/update/:objectId/',templateUrl: '/static/web/partials/update.html',   controller: app.exercise.controllers.HomeUpdateCtrl}).
      // Notice that this is the same template as update
      state('home.new', {url:'/new',templateUrl: '/static/web/partials/update.html',   controller: app.exercise.controllers.HomeNewCtrl});
      
}]);
