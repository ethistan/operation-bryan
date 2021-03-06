'use strict';

/* Directives */

angular.module('operationBryan.directives', [])
	.directive('editField',function () {
		return {
			restrict: 'E',
			transclude: true,
			scope: true,
			controller: function ($scope, $element, $attrs) {
				var redactorFieldSelector = ".edit-box .edit";

				var field = $attrs.field;

				$scope.showEditor = function ($event) {
					if (!$scope.editing && !$($event.srcElement).is("a")) {
						var redactorField = $($element).find(redactorFieldSelector);
						redactorField.keydown(checkKeyPress);
						$scope.oldValue = redactorField.html();
						redactorField.redactor({
							focus: true,
							buttonsAdd: ['|', 'saveButton', "cancelButton"],
							buttonsCustom: {
								saveButton: {
									title: 'Save',
									callback: $scope.saveEdit
								},
								cancelButton: {
									title: 'Save',
									callback: $scope.cancelEdit
								}
							}
						});

						$scope.editing = true;
					}
				};

				$scope.saveEdit = function () {
					var newValue = $($element).find(redactorFieldSelector).redactor('get');

					if (newValue.length) {
						$scope.concept[field] = newValue;
					}

					stopEditing();
				};

				$scope.cancelEdit = function () {
					$($element).find(redactorFieldSelector).html($scope.oldValue);
					stopEditing();
				}

				var stopEditing = function () {
					var redactorField = $($element).find(redactorFieldSelector);
					redactorField.redactor('destroy');
					redactorField.unbind("keydown");
					$scope.editing = false;
				};

				var checkKeyPress = function (event) {
					var valid = false,
						functionName;
					if (event.keyCode == 83 && (event.ctrlKey || event.metaKey)) {
						functionName = "saveEdit";
						valid = true;
					}
					else if (event.keyCode == 27) {
						functionName = "cancelEdit";
						valid = true;
					}

					if (valid) {
						event.preventDefault();
						event.stopPropagation();

						$scope[functionName]();
					}
				}
			},
			templateUrl: "partials/editField.html"
		}
			;
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
