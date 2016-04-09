REPORTER = spec
MOCHA_OPTS = --ui tdd --ignore-leaks --recursive --require should


test:
	@echo Starting test *********************************************************
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	test/*.js
	@echo Ending test

.PHONY: test
