'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('operationBryan.services', ['ngResource']).
	value('version', '0.1')
	.factory("Concept", function ($resource) {
		return $resource("api/concept/:id", {id: "@id"}, {
			create: {
				method: "CREATE",
				params: {id: "@id"}
			}
		});
	});