'use strict';

/* Controllers */

angular.module('operationBryan.controllers', []).
	controller('ConceptCtrl', function ($scope, Concept) {
		$scope.concept = Concept.query();

		$scope.addField = function() {
			$scope.concept.fields["newField"] = "Some new content for people who are awesome";
		}
	});
