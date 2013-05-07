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
			expect(element('[ng-view] h2').text()).
				toMatch(/Medicine/);
		});

		it('should make the input fields visible when clicked on', function () {
			expect(element("form").css("display")).toBe("none")

			element(".field p").click();
			expect(element("form").css("display")).toBe("block");
		});

		it('should hide the input field when clicking on the ok button', function () {
			element(".field p").click();
			expect(element("form").css("display")).toBe("block");

			element(".field button[type='submit']").click();
		});
	});
});
