'use strict';

/* Directives */

angular.module('operationBryan.directives', [])
	.directive('editField',function () {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				field: "=field"
			},
			controller: function ($scope, $element, $attrs) {
				var redactorFieldSelector = ".edit-box .edit";

				$scope.showInput = function (type) {
					return $scope.type == type;
				}

				$scope.showEditor = function ($event) {
					if (!$scope.editing && !$($event.srcElement).is("a")) {
						var redactorField = $($element).find(redactorFieldSelector);
						$scope.oldValue = redactorField.html();
						redactorField.redactor({focus: true});

						$scope.editing = true;
					}
				};

				$scope.saveEdit = function () {
					var newValue = $($element).find(redactorFieldSelector).getCode();

					if (newValue.length) {
						$scope.field = newValue;
					}

					stopEditing();
				};

				$scope.cancelEdit = function () {
					$($element).find(redactorFieldSelector).html($scope.oldValue);
					stopEditing();
				}

				var stopEditing = function () {
					$($element).find(redactorFieldSelector).destroyEditor();
					$scope.editing = false;
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
				title: '@title',
				cid: '=cid'
			},
			controller: function ($scope, $element, $attrs, $location, Concept) {
				$scope.start = 0;
				$scope.size = 5;
				$scope.horizontalOrientation = !$attrs.orientation || $attrs.orientation == "horizontal";

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

				$scope.buttonIcon = function (modifier) {
					var c = "icon ";

					if (modifier == "previous") {
						c += $scope.horizontalOrientation ? "icon-chevron-left" : "icon-chevron-up";
					}
					else if (modifier == "next") {
						c += $scope.horizontalOrientation ? "icon-chevron-right" : "icon-chevron-down";
					}

					return c;
				};

				$scope.conceptLinkHolderClass = function () {
					var c = "concept-link-holder ";

					if (!$scope.horizontalOrientation) {
						c += "vertical";
					}

					return c;
				};

				$scope.changeConcept = function () {
					$location.url("/concepts/" + this.concept.id);
				};

				$scope.addToList = function () {
					var newConcept = Concept.create({id: $scope.cid, owner: $scope.title}, function () {
						$scope.conceptList.push({
							id: newConcept.id.$oid,
							name: newConcept.name,
							overview: newConcept.overview
						});
					});

				};
			},
			templateUrl: "partials/scrollingWindow.html"
		};
	});
