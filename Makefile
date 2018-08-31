SRC    := $(wildcard src/*)
DST    := $(patsubst src/%,build/%,$(SRC))
APPS   := $(patsubst src/%,%,$(SRC))

.PHONY: all
all: $(DST) build/index.html build/404.html
	touch $(SRC)

.PHONY: clean
clean:
	rm -rf build

build:
	mkdir $@

build/%: src/% | build
	cp -r $^ build
	cat `bin/list-dependencies $@/main.js` > $@/script.js

build/index.html: | build
	bin/build-index $(APPS) > $@

build/404.html: shared/404.html | build
	cp $^ $@
