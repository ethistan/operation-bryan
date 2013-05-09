'use strict';

/* jasmine specs for filters go here */

describe('filter', function () {
	beforeEach(module('operationBryan.filters'));

	describe('interpolate', function () {
		beforeEach(module(function ($provide) {
			$provide.value('version', 'TEST_VER');
		}));

		it('should replace VERSION', inject(function (interpolateFilter) {
			expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
		}));
	});

	describe('windowFilter', function () {
		var children;

		beforeEach(function() {
			children = [1, 2, 3, 4, 5, 6, 7, 8];
		});

		it('should return the first 4 elements of the list instead of all of them', inject(function (windowFilter)  {
			expect(windowFilter(children, 0, 4)).toMatch([1, 2, 3, 4]);
		}));

		it('should return the 4 elements with a start point greater than 0', inject(function(windowFilter) {
			expect(windowFilter(children, 3, 4)).toMatch([4, 5, 6, 7]);
		}));

		it('should return a full size array if the given array is too small', inject(function(windowFilter) {
			expect(windowFilter(children, 6, 4)).toMatch([7, 8, undefined, undefined]);
		}));
	});
});
