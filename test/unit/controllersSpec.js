'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
	beforeEach(function () {
		module('operationBryan.controllers')
		module('operationBryan.services')

		this.addMatchers({
			toEqualData: function (expected) {
				return angular.equals(this.actual, expected);
			}
		});
	});

	describe("ConceptCtrl", function () {
		var scope, $httpBackend, ctrl, routeParams;

		var rootMedicineConcept = function () {
			return {
				"_id": {
					"$oid": "1234"
				},
				"name": "Medicine",
				"overview": "short overview of the thing",
				fields: {
					"description": "This is the field of medicine",
					"something else": "thing1",
					"really?": "thing2",
					"ok, I spose": "thing3"
				},
				children: [
					"Haematology",
					"Neurology",
					"Cardiology",
					"Rheumatology"
				],
				parents: []
			}
		};

		var modifiedRootConcept = function() {
			return {
				"id": "1234",
				"name": "Medicine",
				"overview": "short overview of the thing",
				fields: {
					"description": "This is the field of medicine",
					"something else": "thing1",
					"really?": "thing2",
					"ok, I spose": "thing3"
				},
				children: [
					"Haematology",
					"Neurology",
					"Cardiology",
					"Rheumatology"
				],
				parents: []
			}

		};

		beforeEach(inject(function (_$httpBackend_, $rootScope, $routeParams, $controller) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('api/concept/1234').respond(rootMedicineConcept());

			routeParams = $routeParams;
			routeParams.id = "1234";

			scope = $rootScope.$new();
			ctrl = $controller("ConceptCtrl", {$scope: scope});
		}));

		it('should fetch the root medical node', inject(function () {
			expect(scope.concept).toEqualData({});
			$httpBackend.flush();

			expect(scope.concept).toEqualData(modifiedRootConcept());
		}));
	});
});
