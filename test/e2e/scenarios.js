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

			element(".edit-box:first").click();
			expect(element(".edit-form:first").css("display")).toBe("block");
		});

		it('should hide the input field when clicking on the ok button', function () {
			element(".edit-box:first").click();
			expect(element(".edit-form").css("display")).toMatch("block");

			element(".field button[type='submit']").click();
		});

		it('should hide the input field when clicking on the cancel button', function () {
			element(".edit-box:first").click();
			expect(element(".edit-form:first").css("display")).toMatch("block");

			element(".edit-form:first button[type='button']").click();
		});

		it('should change the value when editing a field and pressing the ok button', function() {
			var sampleInput = "This is a sample input";

			element(".edit-box:first").click();
			input("newValue").enter(sampleInput);
			element(".edit-form:first button[type='submit']").click();

			expect(element(".edit-box:first").text()).toMatch(sampleInput);
		});

		it('should NOT change the value when editing a field and pressing the cancel button', function() {
			var sampleInput = "This is a sample input";

			element(".edit-box:first").click();
			input("newValue").enter(sampleInput);
			element(".edit-form:first button[type='button']").click();

			expect(element(".edit-box:first").text()).not().toMatch(sampleInput);
		});

		it('should not change the value when the text entered is empty', function() {
			
		});
	});
});
