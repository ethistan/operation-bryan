'use strict';


// Declare app level module which depends on filters, and services
angular.module('operationBryan',
		[
			'operationBryan.filters',
			'operationBryan.services',
			'operationBryan.directives',
			'operationBryan.controllers'
		]).
	config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/concepts/:id', {templateUrl: 'partials/concept.html', controller: 'ConceptCtrl'});
		$routeProvider.otherwise({redirectTo: '/concepts/root'});
	}]);
