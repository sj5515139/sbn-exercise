

var exerciseServices = angular.module('exerciseServices', [],function($provide) {

	//see app.js for make_services() and the place to add new services
	$provide.factory('Help', app.database.services.make_services('Help',{}));

});
