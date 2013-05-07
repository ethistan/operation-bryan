'use strict';

/* Controllers */

angular.module('operationBryan.controllers', []).
	controller('ConceptCtrl', function ($scope, Concept) {
		$scope.concept = Concept.query();

		$scope.updateValue = function() {
			$scope.concept.fields[this.name] = this.newValue;
			$scope.showValue();
		};

		$scope.editValue = function() {
			this.editing = true;
			this.newValue = this.field;
		}

		$scope.showValue = function() {
			this.editing = false;
		}
	});
