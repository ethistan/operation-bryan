'use strict';

/* Controllers */

angular.module('operationBryan.controllers', []).
	controller('ConceptCtrl', function ($scope, Concept) {
		$scope.concept = Concept.query();
	});
