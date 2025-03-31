sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: pib.cafelandia",
		defaults: {
			page: "ui5://test-resources/pib/cafelandia/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "pib/cafelandia/",
				never: "test-resources/pib/cafelandia/"
			},
			loader: {
				paths: {
					"pib/cafelandia": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for pib.cafelandia"
			},
			"integration/opaTests": {
				title: "Integration tests for pib.cafelandia"
			}
		}
	};
});
