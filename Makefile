REPORTER = dot

TSC=$(BASE)node_modules\typescript\bin\tsc
SRC=$(BASE)src\mathy.ts

RUNNER=$(BASE)node_modules\jasmine-node\bin\jasmine-node

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
	node $(RUNNER) .\test

tests-w: build
	@echo "Watching tests"
	node $(RUNNER) .\test --autotest

.PHONY: tests build