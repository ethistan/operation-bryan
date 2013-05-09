'use strict';

/* Controllers */

angular.module('operationBryan.controllers', []).
	controller('ConceptCtrl', function ($scope, Concept) {
		$scope.concept = Concept.query();

		$scope.related = {};
		$scope.related.start = 0;
		$scope.related.end = 2;

		$scope.children = {};
		$scope.children.start = 0;
		$scope.children.end = 2;

	});
