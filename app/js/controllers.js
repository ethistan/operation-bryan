'use strict';

/* Controllers */

angular.module('operationBryan.controllers', []).
	controller('ConceptCtrl', function ($scope, $routeParams, Concept) {
		if(!$routeParams.conceptId) {
			$routeParams.conceptId = "medicine";
		}
		$scope.concept = Concept.get({conceptId: $routeParams.conceptId.toLowerCase()});

		$scope.addField = function() {
			$scope.concept.fields.push({
				name: "newField",
				value: "Some new content for people who are awesome"
			});
		}
	});
