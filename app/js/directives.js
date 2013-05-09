'use strict';

/* Directives */

angular.module('operationBryan.directives', []).
	directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}]).
	directive('editFieldTextArea',function () {
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
	}).
	directive('scrollingWindow', function () {
		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			scope: {
				conceptList: '=list',
				title: '@title'
			},
			controller: function ($scope, $element, $attrs) {
				$scope.start = 0;
				$scope.size = 4;

				$scope.$watch('start', function() {
					$scope.end = $scope.start + $scope.size;
				});

				$scope.changeListValue = function (amount) {
					var newStart = $scope.start + amount;
					var newEnd = $scope.start + $scope.size + amount;

					if (newStart < 0 || newEnd > $scope.conceptList.length) {
						newStart -= amount;
					}

					$scope.start = newStart;
				};

				$scope.hasMore = function(point) {
					if($scope.conceptList) {
						if($scope[point] == 0 || $scope[point] >= $scope.conceptList.length) {
							return "disabled";
						}
						return "";
					}
				};

				$scope.addToList = function() {
					$scope.conceptList.push({
						name: "New!",
						overview: "What a deal!"
					})
				};
			},
			templateUrl: "partials/scrollingWindow.html"
		};
	});
