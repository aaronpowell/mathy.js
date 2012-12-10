REPORTER=spec

TSC=$(BASE)node_modules/typescript/bin/tsc
UGLIFYJS=$(BASE)node_modules/uglify-js/bin/uglifyjs
RUNNER=$(BASE)node_modules/mocha/bin/mocha

SRC=$(BASE)src/mathy.ts
OUT=$(BASE)src/mathy.js
MIN=$(BASE)src/mathy.min.js
TESTS=$(BASE)test
build:
	@echo "Compiling mathy from TypeScript source"
	node $(TSC) --declaration --sourcemap --target ES5 $(SRC)
	node $(UGLIFYJS) $(OUT) -o $(MIN) --source-map $(MIN).map -p 5 -c -m

build-w:
	@echo "Compiling mathy from TypeScript source"
	node $(TSC) --declaration --sourcemap -w --target ES5 $(SRC)
	node $(TSC) $(SRC)

tests: build
	@echo "Running tests"
	node $(RUNNER) $(TESTS) --reporter $(REPORTER)

tests-w: build
	@echo "Watching tests"
	node $(RUNNER) $(TESTS) --reporter $(REPORTER) --watch --growl

tests-nyan: build
	@echo "Running tests nyan style"
	node $(RUNNER) $(TESTS) --reporter nyan

tests-dbg: build
	@echo "Running tests"
	node $(RUNNER) $(TESTS) --reporter $(REPORTER) --debug-brk
