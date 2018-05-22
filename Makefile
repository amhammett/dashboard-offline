.PHONEY = help install run test

help: ## this help text
	@echo 'Available targets'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# env
install: ## install requirements
	yarn install

# run
run: ## do the things
	node --require 'dotenv/config' src/index.js

clean_dist: ## clean dist
	rm dist/*

# test
test: | clean_dist eslint mocha

eslint:
	./node_modules/.bin/eslint --ext .json --ext .js data src test

mocha:
	./node_modules/.bin/mocha --require 'dotenv/config' test
