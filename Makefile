LIBS = lib/base.js lib/tokenizer.js lib/interpreter.js repl.js

all: concat uglify

concat:
	cat $(LIBS) > dtape.js

uglify: dtape.js
	uglifyjs dtape.js -o dtape.min.js

# test: