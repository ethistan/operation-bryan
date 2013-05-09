'use strict';

/* Filters */

angular.module('operationBryan.filters', []).
	filter('window',function () {
		return function (fields, start, size) {
			var newFields = [];

			if(fields) {
				for(var i = 0; i < size; i++) {
					newFields[i] = fields[start + i];
				}
			}
			return newFields;
		};
	}).
	filter('interpolate', ['version', function (version) {
		return function (text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}]);
