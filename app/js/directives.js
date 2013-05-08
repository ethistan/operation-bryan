'use strict';

/* Directives */

angular.module('operationBryan.directives', []).
	directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}]).
	directive('editFieldTextArea', function () {
		return {
			restrict: 'E',
			transclude: true,
			scope: false,
			controller: function ($scope, $element, $attrs) {
				$scope.editValue = function () {
					$scope.newValue = $scope.field;
					$scope.editing = true;
				};

				$scope.showValue = function () {
					$scope.editing = false;
				};

				$scope.updateValue = function () {
					$scope.concept.fields[this.name] = this.newValue;
					$scope.showValue();
				};
			},
			templateUrl: "partials/editFieldTextArea.html"
		};
	});
