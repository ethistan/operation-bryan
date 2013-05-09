'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Operation Bryan', function () {
	beforeEach(function () {
		browser().navigateTo('../../app/index.html');
	});

	it('should automatically redirect to /home when location hash/fragment is empty', function () {
		expect(browser().location().url()).toBe("/home");
	});

	describe('home page', function () {
		beforeEach(function () {
			browser().navigateTo('#/home');
		});

		it('should render the root concept when user navigates to /home', function () {
			expect(element('[ng-view] h2').text()).toMatch(/Medicine/);
		});

		it('should make the input fields visible when clicked on', function () {
			expect(element("form").css("display")).toBe("none")

			element(".field p").click();
			expect(element("form").css("display")).toBe("block");
		});

		it('should hide the input field when clicking on the ok button', function () {
			element(".field p").click();
			expect(element("form").css("display")).toMatch("block");

			element(".field button[type='submit']").click();
		});

		it('should hide the input field when clicking on the cancel button', function () {
			element(".field p").click();
			expect(element("form").css("display")).toMatch("block");

			element(".field button[type='button']").click();
		});

		it('should change the value when editing a field and pressing the ok button', function() {
			var sampleInput = "This is a sample input";

			element(".field:first p").click();
			input("newValue").enter(sampleInput);
			element(".field:first button[type='submit']").click();

			expect(element(".field:first p").text()).toBe(sampleInput);
		});

		it('should NOT change the value when editing a field and pressing the cancel button', function() {
			var sampleInput = "This is a sample input";

			element(".field:first p").click();
			input("newValue").enter(sampleInput);
			element(".field:first button[type='button']").click();

			expect(element(".field:first p").text()).not().toBe(sampleInput);
		});
	});
});
