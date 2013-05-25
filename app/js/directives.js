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
				field: "=field",
				fields: "=fields"
			},
			controller: function ($scope, $element, $attrs) {
				$scope.type = $attrs.type;
				$scope.name = $attrs.name;
				$scope.showDelete = $attrs.showDelete;

				$scope.formClass = function () {
					if ($scope.type == "textarea") {
						return "edit-form padding";
					}
					return "edit-form";
				}

				$scope.showInput = function (type) {
					return $scope.type == type;
				}

				function delayedFocus() {
					var input = $($element).find("input:visible, textarea:visible");
					input.select();
				};

				$scope.editValue = function () {
					var newValue = unconvertLink($scope.field[$scope.name]);
					newValue = unconvertEnters(newValue);
					$scope.newValue = newValue;
					$scope.editing = true;

					setTimeout(delayedFocus, 0);
				};

				$scope.showValue = function () {
					$scope.editing = false;
				};

				$scope.updateValue = function () {
					var newValue = convertLinks(this.newValue);
					newValue = convertEnters(newValue);

					if (newValue.length) {
						$scope.field[$scope.name] = newValue;
					}
					$scope.showValue();
				};

				$scope.removeField = function() {
					var indexOf = $scope.fields.indexOf($scope.field);
					$scope.fields.splice(indexOf, 1);
				}

				function convertLinks(text) {
					var newValue = [];

					if (text) {
						$(text.split(" ")).each(function (index, element) {
							var startsWithHttp = element.indexOf("http://") == 0;
							var startsWithWWW = element.indexOf("www.") == 0;

							if (startsWithHttp || startsWithWWW) {
								if (startsWithWWW) {
									element = "http://" + element;
								}

								var comp = element.split("|");
								element = "<a target='_blank' href='" + comp[0] + "'>" + comp[1] + "</a>";
							}

							newValue.push(element);
						});
					}


					return newValue.join(" ");
				}

				function unconvertLink(text) {
					var newValue = [];

					var badValues = [
						["target='_blank'", ""],
						["<a", ""],
						["href='", ""],
						["'>", "|"],
						["</a>", ""]
					];

					$(text.split(" ")).each(function (index, element) {
						$(badValues).each(function (i, bad) {
							element = element.replace(bad[0], bad[1]);
						})

						if (element) {
							newValue.push(element);
						}
					});

					return newValue.join(" ");
				}

				function convertEnters(text) {
					return text.replace(/\n/gi, "<br>");
				}

				function unconvertEnters(text) {
					return text.replace(/<br>/gi, "\n");
				}
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
