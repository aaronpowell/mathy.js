REPORTER=spec

TSC=$(BASE)node_modules\typescript\bin\tsc
SRC=$(BASE)src\mathy.ts

RUNNER=$(BASE)node_modules\mocha\bin\mocha

build:
	@echo "Compiling mathy from TypeScript source"
	node $(TSC) $(SRC) --sourcemap
	node $(TSC) --declaration $(SRC)

build-w:
	@echo "Compiling mathy from TypeScript source"
	node $(TSC) $(SRC) --sourcemap -w
	node $(TSC) --declaration $(SRC)

tests: build
	@echo "Running tests"
	node $(RUNNER) .\test --reporter $(REPORTER)

tests-w: build
	@echo "Watching tests"
	node $(RUNNER) .\test --reporter $(REPORTER) --watch --growl

tests-nyan: build
	@echo "Running tests nyan style"
	node $(RUNNER) .\test --reporter nyan