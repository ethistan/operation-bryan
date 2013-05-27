'use strict';

/* Controllers */

angular.module('operationBryan.controllers', []).
	controller('ConceptCtrl', function ($scope, $routeParams, Concept) {
		var listener;

		$scope.concept = Concept.get({id: $routeParams.id}, loadFunction);

		function loadFunction() {
			$scope.concept.id = $scope.concept._id.$oid;
			delete $scope.concept._id;

			listener = $scope.$watch('concept', saveFunction, true);
		}

		function saveFunction(oldValue, newValue) {
			if (oldValue != newValue) {
				listener();

				$scope.concept.$save(loadFunction);
			}
		};
	})
;
