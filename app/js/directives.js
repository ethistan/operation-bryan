'use strict';

/* Directives */

angular.module('operationBryan.directives', []).
	directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}]).
	directive('editField',function () {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				field: "=field"
			},
			controller: function ($scope, $element, $attrs) {
				$scope.type = $attrs.type;
				$scope.name = $attrs.name;

				var editingName = $scope.field == $scope.name;

				$scope.formClass = function () {
					if ($scope.type == "textarea") {
						return "edit-form padding";
					}
					return "edit-form";
				}

				$scope.showInput = function (type) {
					return $scope.type == type;
				}

				$scope.editValue = function () {
					$scope.newValue = $scope.field[$scope.name];
					$scope.editing = true;
				};

				$scope.showValue = function () {
					$scope.editing = false;
				};

				$scope.updateValue = function () {
					console.log("Field:", $scope.field);
					console.log("Value:", $scope.name);

					var newValue = this.newValue;

					if (newValue.length) {
						$scope.field[$scope.name] = this.newValue;
					}
					$scope.showValue();
				};
			},
			templateUrl: "partials/editField.html"
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

				$scope.$watch('start', function () {
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

				$scope.hasMore = function (point) {
					if ($scope.conceptList) {
						if ($scope[point] == 0 || $scope[point] >= $scope.conceptList.length) {
							return "disabled";
						}
						return "";
					}
				};

				$scope.addToList = function () {
					$scope.conceptList.push({
						name: "New!",
						overview: "What a deal!"
					})
				};
			},
			templateUrl: "partials/scrollingWindow.html"
		};
	});
