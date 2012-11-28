REPORTER=spec

TSC=$(BASE)node_modules\typescript\bin\tsc
SRC=$(BASE)src\mathy.ts

RUNNER=$(BASE)node_modules\mocha\bin\mocha

build:
	@echo "Compiling mathy from TypeScript source"
	node $(TSC) --declaration --sourcemap --target ES5 $(SRC)

build-w:
	@echo "Compiling mathy from TypeScript source"
	node $(TSC) --declaration --sourcemap -w --target ES5 $(SRC)
	node $(TSC) $(SRC)

tests: build
	@echo "Running tests"
	node $(RUNNER) .\test --reporter $(REPORTER)

tests-w: build
	@echo "Watching tests"
	node $(RUNNER) .\test --reporter $(REPORTER) --watch --growl

tests-nyan: build
	@echo "Running tests nyan style"
	node $(RUNNER) .\test --reporter nyan

tests-dbg: build
	@echo "Running tests"
	node --debug-brk $(RUNNER) .\test --reporter $(REPORTER)
