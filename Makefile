REPORTER = spec
MOCHA_OPTS = --ui tdd --ignore-leaks --recursive --require should


test-all: export REPORTER=dot
test-all: test test-enfspatch test-enfsmkdirp test-enfsfind test-enfslist test-enfsensure test-enfscopy test-enfsmove

test:
	@echo Starting test *********************************************************
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	test/empty.js
	@echo Ending test

test-enfspatch:
	@echo Testing enfspatch
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	node_modules/enfspatch/test/*.js
	@echo Ending test enfspatch

test-enfsmkdirp:
	@echo Testing enfsmkdirp
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	node_modules/enfsmkdirp/test/*.js
	@echo Ending test enfsmkdirp

test-enfsfind:
	@echo Testing enfsfind
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	node_modules/enfsfind/test/*.js
	@echo Ending test enfsfind

test-enfslist:
	@echo Testing enfslist
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	node_modules/enfslist/test/*.js
	@echo Ending test enfslist

test-enfsensure:
	@echo Testing enfsensure
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	node_modules/enfsensure/test/*.js
	@echo Ending test enfsensure

test-enfscopy:
	@echo Testing enfscopy
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	node_modules/enfscopy/test/*.js
	@echo Ending test enfscopy

test-enfsmove:
	@echo Testing enfsmove
	@node ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	node_modules/enfsmove/test/*.js
	@echo Ending test enfsmove

.PHONY: test test-all test-enfspatch test-enfsmkdirp test-enfsfind test-enfslist test-enfsensure test-enfscopy test-enfsmove
