'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Operation Bryan', function () {
	beforeEach(function () {
		browser().navigateTo('/');
	});

	it('should automatically redirect to /home when location hash/fragment is empty', function () {
		expect(browser().location().url()).toBe("/concepts/root");
	});

	describe('home page', function () {
		var firstEditBox = ".edit-box:first",
			firstForm = ".edit-form:first"


		beforeEach(function () {
			browser().navigateTo('#/home');
		});

		it('should render the root concept when user navigates to /home', function () {
			expect(element('[ng-view] h2').text()).toMatch(/Medicine/);
		});

		it('should make the input fields visible when clicked on', function () {
			expect(element("form").css("display")).toBe("none")

			element(firstEditBox).click();
			expect(element(firstForm).css("display")).toBe("block");
		});

		it('should hide the input field when clicking on the ok button', function () {
			element(firstEditBox).click();
			expect(element(".edit-form").css("display")).toMatch("block");

			element(".field button[type='submit']").click();
		});

		it('should hide the input field when clicking on the cancel button', function () {
			element(firstEditBox).click();
			expect(element(firstForm).css("display")).toMatch("block");

			element(firstForm + " button[type='button']").click();
		});

		it('should change the value when editing a field and pressing the ok button', function() {
			var sampleInput = "This is a sample input";

			element(firstEditBox).click();
			input("newValue").enter(sampleInput);
			element(firstForm + " button[type='submit']").click();

			expect(element(firstEditBox).text()).toMatch(sampleInput);
		});

		it('should NOT change the value when editing a field and pressing the cancel button', function() {
			var sampleInput = "This is a sample input";

			element(firstEditBox).click();
			input("newValue").enter(sampleInput);
			element(firstForm + " button[type='button']").click();

			expect(element(firstEditBox).text()).not().toMatch(sampleInput);
		});

		it('should not change the value when the text entered is empty', function() {
			element(firstEditBox).click();
			input("newValue").enter("");
			element(firstForm + " button[type='submit']").click();

			expect(element(firstEditBox).text()).not().toBe("");
		});

		it('should convert a web link into an <a></a> when saving the field', function() {
			element(firstEditBox).click();
			input("newValue").enter("www.google.com|Google");
			element(firstForm + " button[type='submit']").click();

			expect(element(firstEditBox).html()).toMatch("&lt;a target='_blank' href='http://www.google.com'&gt;Google&lt;/a&gt;");
		});

		it('should convert a web link back into the pipe format when editing a field', function() {
			element(firstEditBox).click();
			input("newValue").enter("www.google.com|Google");
			element(firstForm + " button[type='submit']").click();

			expect(element(firstEditBox).html()).toMatch("&lt;a target='_blank' href='http://www.google.com'&gt;Google&lt;/a&gt;");

			element(firstEditBox).click();

			expect(element(firstForm + " input").val()).toMatch("http://www.google.com|Google");


		});
	});
});
